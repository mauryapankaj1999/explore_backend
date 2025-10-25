export const ROLES = {
  ADMIN: "ADMIN",
  SUBADMIN: "SUBADMIN",
};
export type ROLES_TYPES = keyof typeof ROLES;

export const DESTINATION = {
  DOMESTIC: "DOMESTIC",
  INTERNATIONAL: "INTERNATIONAL",
} as const;
export type DESTINATION_TYPES = keyof typeof DESTINATION;

export const PLACE = {
  DOMESTIC: "DOMESTIC",
  INTERNATIONAL: "INTERNATIONAL",
} as const;
export type PLACE_TYPES = keyof typeof PLACE;

export const PACKAGE = {
  GROUP: "GROUP",
  COUPLE: "COUPLE",
  SINGLE: "SINGLE",
} as const;
export type PACKAGE_TYPES = keyof typeof PACKAGE;

export const PACKAGE_DESTINATION = {
  DOMESTIC: "DOMESTIC",
  INTERNATIONAL: "INTERNATIONAL",
} as const;
export type PACKAGE_DESTINATION_TYPES = keyof typeof PACKAGE_DESTINATION;

export const ACTIVITY = {
  TRANSFER: "TRANSFER",
  STAY: "STAY",
  FOOD: "FOOD",
  VISIT: "VISIT",
} as const;
export type ACTIVITY_TYPES = keyof typeof ACTIVITY;

export const BANNER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};
export type BANNER_STATUS_TYPES = keyof typeof BANNER_STATUS;
