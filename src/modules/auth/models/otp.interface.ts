import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

export const OtpRevokeReason = {
  USED: 'used',
} as const;

export enum OtpProcessEnum {
  CHANGE_PASSWORD = 'change_password',
}

export enum OtpProcessStatusEnum {
  PENDING = 'pending',
  FINISHED = 'finished',
}

export interface OtpCode {
  _id?: ObjectId;
  userId: string;
  code: string;
  revokedAt: Date | null;
  exp: Date;
  reason?: string;
}

export interface OtpProcess {
  _id?: ObjectId;
  userId: string;
  status: OtpProcessStatusEnum;
  processType: OtpProcessEnum;
  exp: Date;
}

export class OtpVerifyCodeDTO {
  @IsString()
  @IsNotEmpty()
  @Length(6)
  code: string;
  @IsNotEmpty()
  @IsEnum(OtpProcessEnum)
  processType: OtpProcessEnum;
}

export class OtpGenerateCodeDTO {
  @IsNotEmpty()
  @IsEnum(OtpProcessEnum)
  processType: OtpProcessEnum;
}

export class OtpStatusCodeDTO {
  @IsNotEmpty()
  @IsEnum(OtpProcessEnum)
  processType: OtpProcessEnum;
}

export type OtpCodeCreateDTO = Omit<OtpCode, '_id'>;
export type OtpProcessCreateDTO = Omit<OtpProcess, '_id'>;
export type OtpVerifyCodeType = {
  userId: string;
  code: string;
  processType: OtpProcessEnum;
};

export type OtpStatusCodeType = {
  userId: string;
  processType: OtpProcessEnum;
};
