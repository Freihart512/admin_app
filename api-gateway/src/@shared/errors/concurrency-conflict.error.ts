import { RepositoryError } from './repository.error';

export class ConcurrencyConflictError extends RepositoryError {
  name = 'ConcurrencyConflictError';
}