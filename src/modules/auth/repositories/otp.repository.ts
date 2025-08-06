import { Injectable } from '@nestjs/common';
import {
  OtpCode,
  OtpCodeCreateDTO,
  OtpProcess as OtpProcess,
  OtpProcessCreateDTO,
  OtpVerifyCodeType,
} from '../models/otp.interface';
import { MongoService } from '@src/database/mongo/mongo.service';
import { CollectionName } from '@src/database/mongo/mongo.interface';

@Injectable()
export class OtpRepository {
  constructor(private readonly db: MongoService) {}

  private get codes() {
    return this.db.collection<OtpCode>(CollectionName.SEC_OTP_CODES);
  }

  private get process() {
    return this.db.collection<OtpProcess>(CollectionName.SEC_OTP_PROCESS);
  }

  async saveCode(payload: OtpCodeCreateDTO): Promise<OtpCode> {
    const result = await this.codes.insertOne(payload);
    return {
      _id: result.insertedId,
      ...payload,
    };
  }

  async saveProcess(payload: OtpProcessCreateDTO): Promise<OtpProcess> {
    const result = await this.process.insertOne(payload);
    return {
      _id: result.insertedId,
      ...payload,
    };
  }

  async findActive(userId: string) {
    const result = await this.codes.findOne({
      userId,
      revokedAt: null,
    });
    return result;
  }

  async revoke(filter: OtpVerifyCodeType) {
    const result = await this.codes.updateOne(
      { ...filter },
      { $set: { revokedAt: new Date() } },
    );
    return result;
  }
}
