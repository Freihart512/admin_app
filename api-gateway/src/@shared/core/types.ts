import { UserSummary } from '../../domain/user/value-objects/user-summary.value-object';

export enum BusinessRole {
  OWNER = 'OWNER',
  TENANT = 'TENANT',
  ACCOUNTANT = 'ACCOUNTANT',
}

export enum AccountStatus {
  ACTIVE = 'active', // Keep as string literals for consistency with domain
  INACTIVE = 'inactive',
}

export interface AuditFields {
  createdAt: Date | null;
  createdBy: UserSummary | null;
  updatedAt: Date | null;
  updatedBy: UserSummary | null;
  deletedAt: Date | null;
  deletedBy: UserSummary | null;
}
