import { Injectable } from '@nestjs/common';
import {
  OtpCode,
  OtpCodeCreateDTO,
  OtpProcess as OtpProcess,
  OtpProcessCreateDTO,
  OtpProcessStatusEnum,
  OtpStatusCodeType,
  OtpStatusProcessType,
} from '../models/otp.interface';
import { MongoService } from '@src/database/mongo/mongo.service';
import { CollectionName } from '@src/database/mongo/mongo.interface';
import { ObjectId } from 'mongodb';

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

  async findActiveCode(filter: OtpStatusCodeType) {
    const result = await this.codes.findOne({
      processType: filter.processType,
      userId: filter.userId,
      revokedAt: null,
    });
    return result;
  }

  async findActiveProcess(filter: OtpStatusProcessType) {
    const result = await this.process.findOne({
      processType: filter.processType,
      userId: filter.userId,
      codeId: filter.codeId,
    });
    return result;
  }

  async setActiveProcessStatus(
    processId: ObjectId,
    status: OtpProcessStatusEnum,
  ) {
    const result = await this.process.updateOne(
      { _id: processId },
      { $set: { status } },
    );
    return result;
  }

  async revokeCode(id: ObjectId) {
    const result = await this.codes.updateOne(
      { _id: id },
      { $set: { revokedAt: new Date() } },
    );
    return result;
  }

  async findVerifiedProcess(filter: OtpStatusCodeType) {
    const result = await this.process.findOne(
      {
        userId: filter.userId,
        processType: filter.processType,
        status: OtpProcessStatusEnum.VERIFIED,
      },
      {
        sort: { exp: -1 },
      },
    );
    return result;
  }
}
