export const CollectionName = {
  SEC_JWT_BLACKLIST: 'sec_jwt_blacklist',
  SEC_OTP_CODES: 'sec_otp_codes',
  SEC_OTP_PROCESS: 'sec_otp_process',
  SEC_JWT_WHITELIST: 'sec_jwt_whitelist',
} as const;

export type CollectionNameType =
  (typeof CollectionName)[keyof typeof CollectionName];
