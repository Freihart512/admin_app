import { RepositoryError } from './';

export class UniqueViolationError extends RepositoryError {
  name = 'UniqueViolationError';
  constructor(
    public field: string,
    public value?: string,
  ) {
    super(
      `Unique violation on ${field}` + (value ? ` with value "${value}"` : ''),
    );
  }
}
