import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Password } from '../password.value-object';
import { HashingService } from '../../../@shared/ports/hashing.service.port';

let mockHasher: HashingService;

beforeEach(() => {
  mockHasher = {
    hash: vi.fn(async (input: string) => `hashed-${input}`),
    compare: vi.fn(async (raw, hashed) => hashed === `hashed-${raw}`),
  };
});

describe('Password', () => {
  describe('create', () => {
    it('should create a Password with a valid hash', async () => {
      const password = await Password.create('Valid1@pass', mockHasher);
      expect(password.getHashedValue()).toBe('hashed-Valid1@pass');
    });

    it('should throw if password is too short', async () => {
      await expect(() =>
        Password.create('short1!', mockHasher)
      ).rejects.toThrow('Password must be at least 8 characters long.');
    });

    it('should throw if password lacks number', async () => {
      await expect(() =>
        Password.create('NoNumbers!', mockHasher)
      ).rejects.toThrow('Password must contain a number, letter, and special character.');
    });

    it('should throw if password lacks letter', async () => {
      await expect(() =>
        Password.create('1234567!', mockHasher)
      ).rejects.toThrow('Password must contain a number, letter, and special character.');
    });

    it('should throw if password lacks special character', async () => {
      await expect(() =>
        Password.create('Valid123', mockHasher)
      ).rejects.toThrow('Password must contain a number, letter, and special character.');
    });
  });

  describe('fromHash', () => {
    it('should create a Password from hash', () => {
      const password = Password.fromHash('existing-hash');
      expect(password.getHashedValue()).toBe('existing-hash');
    });

    it('should throw if hash is empty', () => {
      expect(() => Password.fromHash('')).toThrow('Cannot create Password from empty hash');
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const password = await Password.create('Valid1@pass', mockHasher);
      const result = await password.compare('Valid1@pass', mockHasher);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = await Password.create('Valid1@pass', mockHasher);
      const result = await password.compare('WrongPass1!', mockHasher);
      expect(result).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for passwords with the same hash', () => {
      const p1 = Password.fromHash('hash123');
      const p2 = Password.fromHash('hash123');
      expect(p1.equals(p2)).toBe(true);
    });

    it('should return false for passwords with different hashes', () => {
      const p1 = Password.fromHash('hash123');
      const p2 = Password.fromHash('hash456');
      expect(p1.equals(p2)).toBe(false);
    });
  });
});
