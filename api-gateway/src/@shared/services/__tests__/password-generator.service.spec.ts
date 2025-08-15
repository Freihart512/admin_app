import { describe, it, expect } from 'vitest';
import { PasswordGeneratorService } from '../password-generator.service';

/**
 * Tests for the {@link PasswordGeneratorService} class.  This suite
 * verifies that generated passwords respect the documented policy: at
 * least eight characters long, contain at least one digit, one
 * alphabetic character and one special character, and honour the
 * requested length when it is above the minimum.  It also checks
 * that consecutive invocations yield different values to guard
 * against trivial determinism in the implementation.
 */
describe('PasswordGeneratorService', () => {
  const service = new PasswordGeneratorService();

  it('returns at least the minimum length when a shorter length is requested', () => {
    // Requesting fewer than the minimum should still yield a password of
    // length eight.  The generator clamps values below eight to the
    // minimum internally.
    const pwd = service.getRandomPassword(5);
    expect(pwd.length).toBeGreaterThanOrEqual(8);
  });

  it('returns a password of the requested length when above the minimum', () => {
    const length = 16;
    const pwd = service.getRandomPassword(length);
    expect(pwd.length).toBe(length);
  });

  it('includes at least one number, one letter and one special character', () => {
    const pwd = service.getRandomPassword();
    expect(/[0-9]/.test(pwd)).toBe(true);
    expect(/[a-zA-Z]/.test(pwd)).toBe(true);
    expect(/[!@#$%^&*(),.?":{}|<>]/.test(pwd)).toBe(true);
  });

  it('produces different values on subsequent calls', () => {
    const pwd1 = service.getRandomPassword();
    const pwd2 = service.getRandomPassword();
    // While there is a vanishingly small chance of collision, in practice
    // two independently generated passwords should differ.  This guards
    // against an implementation that returns a constant.
    expect(pwd1).not.toBe(pwd2);
  });
});
