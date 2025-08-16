import { ObjectId } from 'mongodb';

export interface JwtWhitelist {
  _id?: ObjectId;
  userId: string;
  jti: string;
  exp: Date;
  pairTokenJti: string;
  revokedAt: Date | null;
  reason?: string;
}

export type JwtWhitelistCreateDTO = Omit<JwtWhitelist, '_id'>;
