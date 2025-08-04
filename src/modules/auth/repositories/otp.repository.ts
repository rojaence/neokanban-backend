import { Injectable } from '@nestjs/common';
import {
  OtpCode,
  OtpCodeCreateDTO,
  OtpVerifyCodeType,
} from '../models/otp.interface';
import { MongoService } from '@src/database/mongo/mongo.service';
import { CollectionName } from '@src/database/mongo/mongo.interface';

@Injectable()
export class OtpRepository {
  constructor(private readonly db: MongoService) {}

  private get collection() {
    return this.db.collection<OtpCode>(CollectionName.SEC_OTP_CODES);
  }

  async create(payload: OtpCodeCreateDTO): Promise<OtpCode> {
    const result = await this.collection.insertOne(payload);
    return {
      _id: result.insertedId,
      ...payload,
    };
  }

  async findActive(userId: string) {
    const result = await this.collection.findOne({
      userId,
      revokedAt: null,
    });
    return result;
  }

  async revoke(filter: OtpVerifyCodeType) {
    const result = await this.collection.updateOne(
      { ...filter },
      { $set: { revokedAt: new Date() } },
    );
    return result;
  }
}
