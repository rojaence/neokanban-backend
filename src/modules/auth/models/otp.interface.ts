import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

export const OtpRevokeReason = {
  USED: 'used',
} as const;

export interface OtpCode {
  _id?: ObjectId;
  userId: string;
  code: string;
  revokedAt: Date | null;
  exp: Date;
  reason?: string;
}

export class OtpVerifyCodeDTO {
  @IsString()
  @IsNotEmpty()
  @Length(6)
  code: string;
}

export type OtpCodeCreateDTO = Omit<OtpCode, '_id'>;
export type OtpVerifyCodeType = {
  userId: string;
  code: string;
};
