import { describe, it, expect } from 'vitest';
import { PasswordHasherNotRegisteredError } from '../password-hasher-not-registered.error';

describe('PasswordHasherNotRegisteredError', () => {
  it('should be an instance of Error', () => {
    const error = new PasswordHasherNotRegisteredError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name', () => {
    const error = new PasswordHasherNotRegisteredError();
    expect(error.name).toBe('PasswordHasherNotRegisteredError');
  });

  it('should use the default message when no message is provided', () => {
    const error = new PasswordHasherNotRegisteredError();
    expect(error.message).toBe('Password hasher not registered');
  });

  it('should use the custom message when provided', () => {
    const customMessage = 'No hashing service found.';
    const error = new PasswordHasherNotRegisteredError(customMessage);
    expect(error.message).toBe(customMessage);
  });
});
