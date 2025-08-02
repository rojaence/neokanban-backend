export const CollectionName = {
  SEC_JWT_BLACKLIST: 'sec_jwt_blacklist',
} as const;

export type CollectionNameType =
  (typeof CollectionName)[keyof typeof CollectionName];
