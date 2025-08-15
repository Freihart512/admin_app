import { describe, it, expect } from 'vitest';
import { RepositoryTimeoutError } from '../repository-timeout.error';
import { RepositoryError } from '../repository.error';

describe('RepositoryTimeoutError', () => {
  it('should be an instance of Error', () => {
    const error = new RepositoryTimeoutError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should be an instance of RepositoryError', () => {
    const error = new RepositoryTimeoutError();
    expect(error).toBeInstanceOf(RepositoryError);
  });

  it('should have the correct name', () => {
    const error = new RepositoryTimeoutError();
    expect(error.name).toBe('RepositoryTimeoutError');
  });

  it('should use the default message when no message is provided', () => {
    const error = new RepositoryTimeoutError();
    expect(error.message).toBe('Repository operation timed out.');
  });

  it('should use a custom message when provided', () => {
    const customMessage =
      'The repository operation timed out after 30 seconds.';
    const error = new RepositoryTimeoutError(customMessage);
    expect(error.message).toBe(customMessage);
  });
});
