import { RepositoryError } from './';

export class ConcurrencyConflictError extends RepositoryError {
  name = 'ConcurrencyConflictError';
}
