import { BadRequestException, Injectable } from '@nestjs/common';
import { OtpRepository } from '@auth/repositories/otp.repository';
import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';
import { randomInt } from 'crypto';
import { DateService } from '@src/common/services/date/date.service';
import { TranslationService } from '@src/common/helpers/i18n-translation';
import {
  OtpCode,
  OtpProcess,
  OtpProcessEnum,
  OtpProcessStatusEnum,
  OtpStatusCodeType,
  OtpVerifyCodeType,
} from '@auth/models/otp.interface';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly bcryptService: BcryptService,
    private readonly dateService: DateService,
    private readonly translation: TranslationService,
  ) {}
  async generateCode(userId: string, processType: OtpProcessEnum) {
    const exists = await this.otpRepository.findActiveCode({
      userId,
      processType,
    });
    if (exists) {
      throw new BadRequestException(this.translation.t('auth.otp.alreadySent'));
    }
    const otp = randomInt(999999).toString().padStart(6, '0');
    const code = await this.bcryptService.genPasswordHash(otp);
    const exp = this.dateService.addMinutes(new Date(), 3);
    const payload: OtpCode = {
      userId,
      code,
      processType,
      revokedAt: null,
      exp,
    };
    const otpDoc = await this.otpRepository.saveCode(payload);
    const process: OtpProcess = {
      userId,
      status: OtpProcessStatusEnum.PENDING,
      processType,
      codeId: otpDoc._id!,
      exp: this.dateService.addMinutes(new Date(), 5),
    };
    await this.otpRepository.saveProcess(process);
    return otp;
  }

  async verifyCode(payload: OtpVerifyCodeType) {
    const exists = await this.otpRepository.findActiveCode(payload);
    if (!exists) {
      throw new BadRequestException(this.translation.t('auth.otp.invalid'));
    }
    const verify = await this.bcryptService.chechPasswordHash(
      payload.code,
      exists.code,
    );
    if (!verify)
      throw new BadRequestException(this.translation.t('auth.otp.invalid'));
    const process = await this.otpRepository.findActiveProcess({
      codeId: exists._id,
      processType: exists.processType,
      userId: exists.userId,
    });
    await this.otpRepository.setActiveProcessStatus(
      process!._id,
      OtpProcessStatusEnum.VERIFIED,
    );
    await this.otpRepository.revokeCode(exists._id);
    return true;
  }

  async statusActiveProcess(payload: OtpStatusCodeType) {
    const exists = await this.otpRepository.findVerifiedProcess(payload);
    if (!exists)
      throw new BadRequestException(
        this.translation.t('auth.otp.invalidProcess'),
      );
    const valid = this.dateService.isBefore(new Date(), exists.exp);
    if (!valid)
      throw new BadRequestException(
        this.translation.t('auth.otp.invalidProcess'),
      );
    return valid;
  }
}
