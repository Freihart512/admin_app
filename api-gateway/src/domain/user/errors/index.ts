export { AddressRequiredForOwnerError } from './address-required-for-owner.error';
export { AdminCannotHaveBusinessRolesError } from './admin-cannot-have-business-roles.error';
export { AlreadyValueExistError } from './already-value-exist.error';
export { InvalidEmailAddressError } from './invalid-email-address.error';
export { InvalidPhoneNumberError } from './invalid-phone-number.error';
export { InvalidUserSummaryError } from './invalid-user-summary.error';
export { NonAdminMustHaveRolesError } from './non-admin-must-have-roles.error';
export { FieldRequiredForRoleError } from './field-required-for-role.error';
export { RoleUserCannotBeAdminError } from './role-user-cannot-be-admin.error';

export const InvalidEmailReasons = {
    InvalidFormat: 'invalid_format',
    TooLong: 'too_long',
  } as const;
  