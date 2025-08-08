// tests/unit/value-objects/PhoneNumber.spec.ts
import { describe, it, expect } from 'vitest';
import { PhoneNumber } from '../phone-number.value-object';
import { InvalidPhoneNumberError } from '../../errors/invalid-phone-number.error';

describe('PhoneNumber', () => {
  it('should create a valid phone number', () => {
    const phone = PhoneNumber.create('+521234567890');
    expect(phone.getValue()).toBe('+521234567890');
  });

  it('should allow phone number without "+"', () => {
    const phone = PhoneNumber.create('1234567890');
    expect(phone.getValue()).toBe('1234567890');
  });

  it('should throw if value is empty', () => {
    expect(() => PhoneNumber.create('')).toThrow(InvalidPhoneNumberError);
  });

  it('should throw if value is not a string', () => {
    expect(() => PhoneNumber.create(null as unknown as string)).toThrow(InvalidPhoneNumberError);
    expect(() => PhoneNumber.create(undefined as unknown as string)).toThrow(InvalidPhoneNumberError);
  });

  it('should throw if format is invalid', () => {
    const invalidPhones = ['abcd', '+12', '123', '++1234567890', '+12345678901234567'];
    for (const invalid of invalidPhones) {
      expect(() => PhoneNumber.create(invalid)).toThrow(InvalidPhoneNumberError);
    }
  });

  it('should consider two phone numbers equal if values match', () => {
    const phone1 = PhoneNumber.create('+521234567890');
    const phone2 = PhoneNumber.create('+521234567890');
    expect(phone1.equals(phone2)).toBe(true);
  });

  it('should consider two phone numbers different if values do not match', () => {
    const phone1 = PhoneNumber.create('+521234567890');
    const phone2 = PhoneNumber.create('1234567890');
    expect(phone1.equals(phone2)).toBe(false);
  });
});
