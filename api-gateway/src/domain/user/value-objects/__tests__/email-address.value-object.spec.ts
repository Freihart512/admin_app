import { describe, it, expect } from 'vitest';
import { EmailAddress } from '../email-address.value-object';
import { InvalidEmailAddress, InvalidEmailReasons } from '../../errors/invalid-email-address.error';

describe('EmailAddress', () => {
  it('should create a valid EmailAddress', () => {
    const email = EmailAddress.create('TEST@Example.com');
    expect(email.getValue()).toBe('test@example.com'); // verifica que lo convierte a minúsculas
  });

  it('should throw for empty string', () => {
    expect(() => EmailAddress.create('')).toThrowError(InvalidEmailAddress);
    expect(() => EmailAddress.create('')).toThrowError(/invalid_format/i);
  });

  it('should throw for invalid format (missing @)', () => {
    expect(() => EmailAddress.create('invalid-email.com')).toThrowError(InvalidEmailAddress);
    expect(() => EmailAddress.create('invalid-email.com')).toThrowError(/invalid_format/i);
  });

  it('should throw for invalid format (missing domain)', () => {
    expect(() => EmailAddress.create('user@')).toThrowError(InvalidEmailAddress);
  });

  it('should throw for invalid format (missing user)', () => {
    expect(() => EmailAddress.create('@example.com')).toThrowError(InvalidEmailAddress);
  });

  it('should throw if email is too long', () => {
    const local = 'a'.repeat(64); // max local part is 64 chars
    const domain = 'b'.repeat(189); // 254 - 64 - 1 ('@')
    const longEmail = `${local}@${domain}.com`;

    expect(longEmail.length).toBeGreaterThan(254);
    expect(() => EmailAddress.create(longEmail)).toThrowError(InvalidEmailAddress);
    expect(() => EmailAddress.create(longEmail)).toThrowError(/too_long/i);
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
