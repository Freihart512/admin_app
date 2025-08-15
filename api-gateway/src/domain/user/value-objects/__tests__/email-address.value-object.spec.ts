import { describe, it, expect } from 'vitest';
import { EmailAddress } from '../email-address.value-object';
import { InvalidEmailAddressError } from '../../errors/invalid-email-address.error';
import { InvalidEmailReasons } from '../../errors';

describe('EmailAddress', () => {
  it('should create a valid EmailAddress', () => {
    const email = EmailAddress.create('TEST@Example.com');
    expect(email.getValue()).toBe('test@example.com'); // verifica que lo convierte a minúsculas
  });

  it('should throw for empty string', () => {
    try {
      EmailAddress.create('');
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidEmailAddressError);
      // Empty input is treated as an invalid format
      expect(err.reason).toBe(InvalidEmailReasons.InvalidFormat);
    }
  });

  it('should throw for invalid format (missing @)', () => {
    try {
      EmailAddress.create('invalid-email.com');
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidEmailAddressError);
      expect(err.reason).toBe(InvalidEmailReasons.InvalidFormat);
    }
  });

  it('should throw for invalid format (missing domain)', () => {
    expect(() => EmailAddress.create('user@')).toThrowError(
      InvalidEmailAddressError,
    );
  });

  it('should throw for invalid format (missing user)', () => {
    expect(() => EmailAddress.create('@example.com')).toThrowError(
      InvalidEmailAddressError,
    );
  });

  it('should throw if email is too long', () => {
    // Create an email exceeding 254 characters.  The local part can be
    // up to 64 characters; the remainder ensures the total length
    // exceeds the specification.  When too long the reason should be
    // TooLong.
    const local = 'a'.repeat(64);
    const domain = 'b'.repeat(189);
    const longEmail = `${local}@${domain}.com`;

    expect(longEmail.length).toBeGreaterThan(254);
    try {
      EmailAddress.create(longEmail);
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidEmailAddressError);
      expect(err.reason).toBe(InvalidEmailReasons.TooLong);
    }
  });

  it('should return primitive value in toJSON and toString', () => {
    const email = EmailAddress.create('someone@example.com');
    expect(email.toJSON()).toBe('someone@example.com');
    expect(email.toString()).toBe('someone@example.com');
  });

  it('should be equal for same email content', () => {
    const a = EmailAddress.create('user@domain.com');
    const b = EmailAddress.create('USER@DOMAIN.COM');

    expect(a.equals(b)).toBe(true);
  });

  it('should not be equal for different emails', () => {
    const a = EmailAddress.create('a@domain.com');
    const b = EmailAddress.create('b@domain.com');

    expect(a.equals(b)).toBe(false);
  });
});
