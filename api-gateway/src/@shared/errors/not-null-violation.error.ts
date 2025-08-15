import { RepositoryError } from './';

export class NotNullViolationError extends RepositoryError {
  name = 'NotNullViolationError';
  constructor(public field: string) {
    super(`Not null violation on ${field}`);
  }
}
