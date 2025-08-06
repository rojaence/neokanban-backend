import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const exists = await this.otpRepository.findActive(userId);
    if (exists) {
      throw new BadRequestException(this.translation.t('auth.otp.alreadySent'));
    }
    const otp = randomInt(999999).toString().padStart(6, '0');
    const code = await this.bcryptService.genPasswordHash(otp);
    const exp = this.dateService.addMinutes(new Date(), 3);
    const payload: OtpCode = {
      userId,
      code,
      revokedAt: null,
      exp,
    };
    const process: OtpProcess = {
      userId,
      status: OtpProcessStatusEnum.PENDING,
      processType,
      exp: this.dateService.addMinutes(new Date(), 5),
    };
    await this.otpRepository.saveCode(payload);
    await this.otpRepository.saveProcess(process);
    return otp;
  }

  async verifyCode(payload: OtpVerifyCodeType) {
    const exists = await this.otpRepository.findActive(payload.userId);
    if (!exists)
      throw new NotFoundException(this.translation.t('auth.otp.notFound'));
    const verify = await this.bcryptService.chechPasswordHash(
      payload.code,
      exists.code,
    );
    if (!verify)
      throw new BadRequestException(this.translation.t('auth.otp.notFound'));
    await this.otpRepository.revoke(payload);
    return true;
  }

  async getActiveCode(payload: OtpVerifyCodeType) {
    const exists = await this.otpRepository.findActive(payload.userId);
    if (!exists)
      throw new NotFoundException(this.translation.t('auth.otp.notFound'));
    return exists;
  }
}
