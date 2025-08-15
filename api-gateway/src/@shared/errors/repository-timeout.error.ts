import { RepositoryError } from './';

export class RepositoryTimeoutError extends RepositoryError {
  name = 'RepositoryTimeoutError';

  constructor(message?: string) {
    super(message || 'Repository operation timed out.');
  }
}
