import { UserSummaryType } from '@domain/user/user.types';

export interface AuditFields {
  createdAt: Date | null;
  createdBy: UserSummaryType | null;
  updatedAt: Date | null;
  updatedBy: UserSummaryType | null;
  deletedAt: Date | null;
  deletedBy: UserSummaryType | null;
}

export type PaginationOptions = {
  limit: number;
  offset: number;
};

export type PaginatedResult<T> = {
  elements: T[];
  totalCount: number;
  hasNextPage: boolean;
};

export type FindPaginatedParams<T> = {
  filters: T;
  paginationOptions: PaginationOptions;
};

export const AppErrorCodes = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  TIMEOUT: 'TIMEOUT',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  VALIDATION: 'VALIDATION',
  UNKNOWN: 'UNKNOWN',
} as const;

export type AppErrorCode = (typeof AppErrorCodes)[keyof typeof AppErrorCodes];
