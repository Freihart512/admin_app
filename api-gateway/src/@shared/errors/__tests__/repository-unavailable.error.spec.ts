import { describe, it, expect } from 'vitest';
import { RepositoryUnavailableError } from '../repository-unavailable.error';
import { RepositoryError } from '../repository.error'; // Assuming RepositoryError is in repository.error.ts

describe('RepositoryUnavailableError', () => {
  it('should be an instance of Error and RepositoryError', () => {
    const error = new RepositoryUnavailableError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(RepositoryError);
    expect(error).toBeInstanceOf(RepositoryUnavailableError);
  });

  it('should have the correct name', () => {
    const error = new RepositoryUnavailableError();
    expect(error.name).toBe('RepositoryUnavailableError');
  });

  it('should use the default message if no message is provided', () => {
    const error = new RepositoryUnavailableError();
    expect(error.message).toBe('Repository is currently unavailable.');
  });

  it('should use the custom message when provided', () => {
    const customMessage = 'The database is down.';
    const error = new RepositoryUnavailableError(customMessage);
    expect(error.message).toBe(customMessage);
  });
});