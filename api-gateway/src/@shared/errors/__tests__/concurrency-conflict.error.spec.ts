import { describe, it, expect } from 'vitest';
import { ConcurrencyConflictError } from '../concurrency-conflict.error'; // Adjust the import path as necessary
import { RepositoryError } from '../repository.error'; // Adjust the import path as necessary

describe('ConcurrencyConflictError', () => {
  it('should be an instance of Error and RepositoryError', () => {
    const error = new ConcurrencyConflictError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(RepositoryError);
  });

  it('should have the correct name', () => {
    const error = new ConcurrencyConflictError();
    expect(error.name).toBe('ConcurrencyConflictError');
  });

  it('should use the default message when no message is provided', () => {
    const error = new ConcurrencyConflictError();
    // Assuming the base RepositoryError has a default message or uses the Error default
    // If RepositoryError has a specific default, this test might need adjustment.
    // Based on the original snippet, RepositoryError doesn't have a constructor
    // that sets a custom default message, so Error's default might be used initially,
    // but the name is set. Let's test the message is set by the base Error.
    // If you add a constructor with a default message to ConcurrencyConflictError,
    // update this test.
    expect(error.message).toBe(''); // Default Error message is typically empty or undefined
  });

  it('should use a custom message when provided', () => {
    const customMessage = 'Optimistic locking failed.';
    const error = new ConcurrencyConflictError(customMessage);
    expect(error.message).toBe(customMessage);
  });
});
