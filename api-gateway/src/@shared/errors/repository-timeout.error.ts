import { RepositoryError } from './repository.error';

export class RepositoryTimeoutError extends RepositoryError {
  name = 'RepositoryTimeoutError';

  constructor(message?: string) {
    super(message || 'Repository operation timed out.');
  }
}