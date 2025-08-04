export const CollectionName = {
  SEC_JWT_BLACKLIST: 'sec_jwt_blacklist',
  SEC_OTP_CODES: 'sec_otp_codes',
  SEC_OTP_PROCESS: 'sec_otp_process',
} as const;

export type CollectionNameType =
  (typeof CollectionName)[keyof typeof CollectionName];
