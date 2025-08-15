import { describe, it, expect } from 'vitest';
import { InvalidPasswordFormatError } from '../invalid-password-format.error';
import { InvalidPasswordFormatReasons } from '..';

describe('InvalidPasswordFormatError', () => {
  it('should create an instance with correct properties', () => {
    const value = 'short';
    const reason = InvalidPasswordFormatReasons.TooShort;
    const error = new InvalidPasswordFormatError(value, reason);

    expect(error).toBeInstanceOf(InvalidPasswordFormatError);
    expect(error.name).toBe('InvalidPasswordError');
    expect(error.value).toBe(value);
    expect(error.reason).toBe(reason);
    expect(error.message).toBe(`Invalid password format (${reason}): ${value}`);
  });
});
