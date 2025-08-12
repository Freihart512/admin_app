// api-gateway/src/@shared/errors/repository.error.ts
export class RepositoryError extends Error { name = 'RepositoryError'; }
// @shared/errors/repository.errors.ts
export class RepositoryError extends Error { name = 'RepositoryError'; }
export class RepositoryUnavailableError extends RepositoryError { name = 'RepositoryUnavailableError'; }
export class RepositoryTimeoutError extends RepositoryError { name = 'RepositoryTimeoutError'; }
export class UniqueViolationError extends RepositoryError {
    name = 'UniqueViolationError';
    constructor(public field: string, public value?: string) { super(`Unique violation on ${field}`); }
}
export class NotNullViolationError extends RepositoryError {
    name = 'NotNullViolationError';
    constructor(public field: string) { super(`Not null violation on ${field}`); }
}
export class ForeignKeyViolationError extends RepositoryError {
    name = 'ForeignKeyViolationError';
    constructor(public field: string) { super(`Foreign key violation on ${field}`); }
}
export class ConcurrencyConflictError extends RepositoryError { name = 'ConcurrencyConflictError'; }
