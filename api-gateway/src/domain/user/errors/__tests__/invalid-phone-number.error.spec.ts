import { describe, it, expect } from 'vitest';
import { InvalidPhoneNumberError } from '../invalid-phone-number.error';
import { InvalidPhoneNumberReasons } from '..';

describe('InvalidPhoneNumberError', () => {
  it('should set correct name and message', () => {
    const input = 'abc123';
    const reason = InvalidPhoneNumberReasons.InvalidFormat;
    const error = new InvalidPhoneNumberError(input, reason);

    expect(error.name).toBe('InvalidPhoneNumberError');
    expect(error.message).toBe(`Invalid phone number (${reason}): "${input}"`);
    expect(error.value).toBe(input);
    expect(error.reason).toBe(reason);
  });

  it('should handle missing reason', () => {
    const input = '123';
    const error = new InvalidPhoneNumberError(input);

    expect(error.message).toBe(`Invalid phone number (undefined): "${input}"`);
    expect(error.reason).toBeUndefined();
  });
});
