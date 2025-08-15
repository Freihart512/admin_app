import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Password } from '../password.value-object';
import type { HashingService } from '../../../@shared/ports/hashing.service.port';
import {
  InvalidPasswordFormatError,
  InvalidPasswordHashError,
  PasswordHasherNotRegisteredError,
} from '../../errors';
import { InvalidPasswordFormatReasons } from '../../errors';
import { InvalidFormatError, ServiceUnavailableError } from '@shared/errors';

/**
 * Unit tests for the {@link Password} value object.  These tests cover
 * creation, validation, hashing behaviour and comparison semantics.  A
 * custom hashing service is registered for each test to isolate
 * behaviour; the service simply prefixes "hashed-" to the raw
 * password and resolves comparisons by matching this pattern.
 */
describe('Password value object', () => {
  let mockHasher: HashingService;

  beforeEach(() => {
    mockHasher = {
      hash: vi.fn(async (input: string) => `hashed-${input}`),
      compare: vi.fn(
        async (raw: string, hashed: string) => hashed === `hashed-${raw}`,
      ),
      validateHash: vi.fn(() => true),
    };
    Password.registerHasher(mockHasher);
  });

  afterEach(() => {
    Password.resetForTests();
  });

  describe('create', () => {
    it('creates a Password with a valid hash', async () => {
      const pwd = await Password.create('Valid1@pass');
      // The hasher prefixes "hashed-" to the raw password.
      expect(pwd.getHashedValue()).toBe('hashed-Valid1@pass');
      // Ensure our hashing service was invoked
      expect(mockHasher.hash).toHaveBeenCalledWith('Valid1@pass');
    });

    it('throws when no hasher is registered', async () => {
      Password.resetForTests();
      await expect(Password.create('Valid1@pass')).rejects.toBeInstanceOf(
        PasswordHasherNotRegisteredError,
      );
    });

    it('validates minimum length rule', async () => {
      await expect(Password.create('Abc1@')).rejects.toBeInstanceOf(
        InvalidPasswordFormatError,
      );
      try {
        await Password.create('Abc1@');
      } catch (err) {
        // Too short should map to TooShort reason
        expect((err as InvalidPasswordFormatError).reason).toBe(
          InvalidPasswordFormatReasons.TooShort,
        );
      }
    });

    it('validates presence of a number', async () => {
      await expect(Password.create('NoNumbers!')).rejects.toBeInstanceOf(
        InvalidPasswordFormatError,
      );
      try {
        await Password.create('NoNumbers!');
      } catch (err) {
        expect((err as InvalidPasswordFormatError).reason).toBe(
          InvalidPasswordFormatReasons.NotNumber,
        );
      }
    });

    it('validates presence of a letter', async () => {
      await expect(Password.create('1234567!')).rejects.toBeInstanceOf(
        InvalidPasswordFormatError,
      );
      try {
        await Password.create('1234567!');
      } catch (err) {
        expect((err as InvalidPasswordFormatError).reason).toBe(
          InvalidPasswordFormatReasons.NotLetter,
        );
      }
    });

    it('validates presence of a special character', async () => {
      await expect(Password.create('Valid123')).rejects.toBeInstanceOf(
        InvalidPasswordFormatError,
      );
      try {
        await Password.create('Valid123');
      } catch (err) {
        expect((err as InvalidPasswordFormatError).reason).toBe(
          InvalidPasswordFormatReasons.NotSpecial,
        );
      }
    });
  });

  describe('fromHash', () => {
    it('creates a Password from an existing hash', () => {
      const pwd = Password.fromHash('existing-hash');
      expect(pwd.getHashedValue()).toBe('existing-hash');
    });

    it('throws when no hasher is registered', () => {
      Password.resetForTests();
      expect(() => Password.fromHash('hash')).toThrow(
        PasswordHasherNotRegisteredError,
      );
    });

    it('throws when the hash is empty or non-string', () => {
      expect(() => Password.fromHash('')).toThrow(InvalidPasswordHashError);
      // @ts-expect-error intentional misuse for testing
      expect(() => Password.fromHash(null)).toThrow(InvalidPasswordHashError);
    });

    it('invokes validateHash when provided', () => {
      Password.fromHash('existing-hash');
      expect(mockHasher.validateHash).toHaveBeenCalledWith('existing-hash');
    });

    it('maps InvalidFormatError from validateHash to InvalidPasswordHashError', () => {
      mockHasher.validateHash = vi.fn(() => {
        throw new InvalidFormatError('bad format');
      });
      expect(() => Password.fromHash('bad-hash')).toThrow(
        InvalidPasswordHashError,
      );
    });

    it('propagates ServiceUnavailableError from validateHash', () => {
      mockHasher.validateHash = vi.fn(() => {
        throw new ServiceUnavailableError('service down');
      });
      expect(() => Password.fromHash('some-hash')).toThrow(
        ServiceUnavailableError,
      );
    });

    it('maps unknown errors from validateHash to ServiceUnavailableError', () => {
      mockHasher.validateHash = vi.fn(() => {
        throw new Error('unexpected');
      });
      expect(() => Password.fromHash('some-hash')).toThrow(
        ServiceUnavailableError,
      );
    });
  });

  describe('compare', () => {
    it('returns true for matching password', async () => {
      const pwd = await Password.create('Valid1@pass');
      const result = await pwd.compare('Valid1@pass');
      expect(result).toBe(true);
      expect(mockHasher.compare).toHaveBeenCalledWith(
        'Valid1@pass',
        pwd.getHashedValue(),
      );
    });

    it('returns false for non-matching password', async () => {
      const pwd = await Password.create('Valid1@pass');
      const result = await pwd.compare('WrongPass!1');
      expect(result).toBe(false);
    });

    it('throws when no hasher is registered', async () => {
      const pwd = await Password.create('Valid1@pass');
      Password.resetForTests();
      await expect(pwd.compare('Valid1@pass')).rejects.toBeInstanceOf(
        PasswordHasherNotRegisteredError,
      );
    });
  });

  describe('equals & toJSON', () => {
    it('returns true for equal hashed values and false otherwise', () => {
      const a = Password.fromHash('hash123');
      const b = Password.fromHash('hash123');
      const c = Password.fromHash('hash456');
      expect(a.equals(b)).toBe(true);
      expect(a.equals(c)).toBe(false);
    });

    it('toJSON hides the underlying hash', async () => {
      const pwd = await Password.create('Valid1@pass');
      expect(pwd.toJSON()).toBe('[REDACTED_PASSWORD_HASH]');
    });
  });
});
