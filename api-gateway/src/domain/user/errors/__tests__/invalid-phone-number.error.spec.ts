// tests/unit/errors/InvalidPhoneNumberError.spec.ts
import { describe, it, expect } from 'vitest';
import { InvalidPhoneNumberError } from '../invalid-phone-number.error';

describe('InvalidPhoneNumberError', () => {
  it('should set correct name and message', () => {
    const input = 'abc123';
    const error = new InvalidPhoneNumberError(input);

    expect(error.name).toBe('InvalidPhoneNumberError');
    expect(error.message).toBe(`Invalid phone number format: "${input}"`);
    expect(error.value).toBe(input);
  });
});
