import { RepositoryError } from './';

export class ForeignKeyViolationError extends RepositoryError {
  name = 'ForeignKeyViolationError';
  constructor(public field: string) {
    super(`Foreign key violation on ${field}`);
  }
}
