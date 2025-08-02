import { ObjectId } from 'mongodb';

export const JwtRevokeReason = {
  LOGOUT: 'logout',
} as const;

export interface JwtBlacklist {
  _id?: ObjectId;
  userId: string;
  jti: string;
  revokedAt: Date;
  exp: Date;
  reason?: string;
}

export type JwtBlacklistCreateDTO = Omit<JwtBlacklist, '_id'>;
