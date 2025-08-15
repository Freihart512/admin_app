import {
  EmailAddress,
  Password,
  PhoneNumber,
  UserSummary,
} from '@domain/user/value-objects';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { User } from '@domain/user/entity';
import { AuditFields } from '@shared/core/types';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import {
  InvalidEmailReasons,
  InvalidPhoneNumberReasons,
  InvalidPasswordFormatReasons,
} from './errors';

export type UserEntityType = User;
export interface UserSummaryProps {
  id: UUID;
  name: string;
  lastName: string;
  email: EmailAddress;
  status: AccountStatusType;
}

export type UserSummaryType = UserSummary;

export const BusinessRoles = {
  OWNER: 'OWNER',
  TENANT: 'TENANT',
  ACCOUNTANT: 'ACCOUNTANT',
} as const;

export const AccountStatuses = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type UserFilters = {
  status?: AccountStatusType;
  role?: BusinessRoleType;
  isAdmin?: boolean;
};

export type UserInitialProps = {
  id: UUID;
  email: EmailAddress;
  password: Password;
  isAdmin: boolean;
  name: string;
  lastName: string;
  roles: BusinessRoleType[];
  phoneNumber?: PhoneNumber;
  address?: string;
  rfc?: RFC;
  status?: AccountStatusType;
  audit?: AuditFields;
};

export type InvalidEmailReasonsType =
  (typeof InvalidEmailReasons)[keyof typeof InvalidEmailReasons];
export type InvalidPhoneNumberReasonsType =
  (typeof InvalidPhoneNumberReasons)[keyof typeof InvalidPhoneNumberReasons];
export type InvalidPasswordFormatReasonsType =
  (typeof InvalidPasswordFormatReasons)[keyof typeof InvalidPasswordFormatReasons];
export type BusinessRoleType =
  (typeof BusinessRoles)[keyof typeof BusinessRoles];
export type AccountStatusType =
  (typeof AccountStatuses)[keyof typeof AccountStatuses];
