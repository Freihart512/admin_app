export { InvalidPasswordHashError } from './invalid-password-hash.error';
export { PasswordHasherNotRegisteredError } from './password-hasher-not-registered.error';
export { InvalidPasswordFormatError } from './invalid-password-format.error';

export { AddressRequiredForOwnerError } from './address-required-for-owner.error';
export { AdminCannotHaveBusinessRolesError } from './admin-cannot-have-business-roles.error';
export { AlreadyValueExistError } from './already-value-exist.error';
export { InvalidEmailAddressError } from './invalid-email-address.error';
export { InvalidPhoneNumberError } from './invalid-phone-number.error';
// export { InvalidUserSummaryError } from './invalid-user-summary.error';
export { NonAdminMustHaveRolesError } from './non-admin-must-have-roles.error';
export { FieldRequiredForRoleError } from './field-required-for-role.error';
export { RoleUserCannotBeAdminError } from './role-user-cannot-be-admin.error';

export const InvalidEmailReasons = {
  InvalidFormat: 'invalid_format',
  TooLong: 'too_long',
} as const;

export const InvalidPhoneNumberReasons = {
  InvalidFormat: 'invalid_format',
  MissingValue: 'missing_value',
} as const;

export const InvalidPasswordFormatReasons = {
  TooShort: 'too_short',
  NotNumber: 'not_number',
  NotLetter: 'not_letter',
  NotSpecial: 'not_special',
  MissingValue: 'missing_value',
} as const;
