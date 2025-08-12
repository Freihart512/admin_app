import { describe, it, expect } from 'vitest';
import { RepositoryError } from '../repository.error';

describe('RepositoryError', () => {
  it('should be an instance of Error', () => {
    const error = new RepositoryError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name', () => {
    const error = new RepositoryError();
    expect(error.name).toBe('RepositoryError');
  });

  it('should use the default message when no message is provided', () => {
    const error = new RepositoryError();
    // The base Error constructor might set the message to an empty string or undefined
    // if no message is provided. Let's check for that or a specific default if defined.
    // Based on the original code, it inherits Error, so it likely has no explicit default message.
    expect(error.message).toBe('');
  });

  it('should use the custom message when provided', () => {
    const customMessage = 'Something went wrong with the repository.';
    const error = new RepositoryError(customMessage);
    expect(error.message).toBe(customMessage);
  });
});