import { generateRandomPassword } from '../password-generator.service';

describe('generateRandomPassword', () => {
  it('should generate a password of at least 8 characters', () => {
    const password = generateRandomPassword();
    expect(password.length).toBeGreaterThanOrEqual(8);
  });

  it('should generate a password containing at least one number', () => {
    const password = generateRandomPassword();
    expect(/[0-9]/.test(password)).toBe(true);
  });

  it('should generate a password containing at least one letter (case-insensitive)', () => {
    const password = generateRandomPassword();
    expect(/[a-zA-Z]/.test(password)).toBe(true);
  });

  it('should generate a password containing at least one special character', () => {
    const password = generateRandomPassword();
    expect(/[!@#$%^&*(),.?":{}|<>]/.test(password)).toBe(true);
  });
});