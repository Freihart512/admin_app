import { describe, it, expect } from 'vitest';
import { InvalidPasswordHashError } from '../invalid-password-hash.error';

describe('InvalidPasswordHashError', () => {
  it('should be an instance of Error', () => {
    const error = new InvalidPasswordHashError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name', () => {
    const error = new InvalidPasswordHashError();
    expect(error.name).toBe('InvalidPasswordHashError');
  });

  it('should use the default message when no message is provided', () => {
    const error = new InvalidPasswordHashError();
    expect(error.message).toBe('Invalid password hash');
  });

  it('should use the custom message when provided', () => {
    const customMessage = 'Password hash is malformed.';
    const error = new InvalidPasswordHashError(customMessage);
    expect(error.message).toBe(customMessage);
  });
});
