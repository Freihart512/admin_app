import { RepositoryError } from './repository.error';

export class RepositoryUnavailableError extends RepositoryError {
  name = 'RepositoryUnavailableError';
  constructor(message?: string) {
    super(message ?? 'Repository is currently unavailable.');
  }
}