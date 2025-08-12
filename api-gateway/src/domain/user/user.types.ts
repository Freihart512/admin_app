import { EmailAddress, Password, PhoneNumber, UserSummary } from '@domain/user/value-objects';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { User } from '@domain/user/entity';
import { AuditFields } from '@shared/core/types';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { InvalidEmailReasons } from './errors';

export type UserEntityType = User;
export interface UserSummaryProps {
  id: UUID;
  name: string;
  lastName: string;
  email: EmailAddress;
  status: AccountStatus;
}

export type UserSummaryType = UserSummary;
export enum BusinessRole {
  OWNER = 'OWNER',
  TENANT = 'TENANT',
  ACCOUNTANT = 'ACCOUNTANT',
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
export type UserFilters = {
  status?: AccountStatus;
  role?: BusinessRole;
  isAdmin?: boolean;
}

export type UserInitialProps = {
  id: UUID;
  email: EmailAddress;
  password: Password;
  isAdmin: boolean; 
  name: string;
  lastName: string;
  roles: BusinessRole[];
  phoneNumber?: PhoneNumber;
  address?: string;
  rfc?: RFC;
  status?: AccountStatus;
  audit?: AuditFields;
}


export type InvalidEmailReason = (typeof InvalidEmailReasons)[keyof typeof InvalidEmailReasons];