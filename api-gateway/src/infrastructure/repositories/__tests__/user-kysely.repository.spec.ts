import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KyselyUserRepository } from '../user-kysely.repository';
import { db } from '../../database/kysely.db';
import { AuditFields, Iam } from '@shared/core/types';
import {
  UUID,
  UuidValidatorPort,
  RFC,
  RFCValidatorPort,
} from '@domain/@shared';
import {
  Password,
  EmailAddress,
  UserSummary,
  User,
  AccountStatus,
  BusinessRole,
} from '@domain/user';
import { PhoneNumber } from '@domain/user/value-objects/phone-number.value-object';
import { AlreadyValueExistError } from '@domain/user/errors/already-value-exist.error';
import { DataAccessError } from '@infrastructure/database/errors/data-access.error';
import type { HashingService } from '@domain/@shared/ports/hashing.service.port';

// Mock the Kysely database instance
const mockKyselyDb = {
  selectFrom: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  executeTakeFirst: vi.fn(),
  insertInto: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  execute: vi.fn(),
} as unknown as typeof db;

describe('KyselyUserRepository', () => {
  let userRepository: KyselyUserRepository;
  let mockIam: Iam;
  let mockUser: User;

  const mockUuidValidator: UuidValidatorPort = {
    validate: vi.fn().mockReturnValue(true),
  };
  const mockRfcValidator: RFCValidatorPort = {
    validate: vi.fn().mockReturnValue(true),
  };

  beforeEach(() => {
    UUID.registerValidator(mockUuidValidator);
    RFC.registerValidator(mockRfcValidator);
    userRepository = new KyselyUserRepository(mockKyselyDb);

    mockIam = {
      id: UUID.create('user-id'),
      email: EmailAddress.create('test@example.com'),
      rol: BusinessRole.TENANT,
      jti: UUID.create('jti-id'),
    };

    // Register a dummy hashing service for Password.fromHash used in mockUser
    const dummyHasher: HashingService = {
      hash: vi.fn(),
      compare: vi.fn(),
      validateHash: vi.fn(() => true),
    };
    Password.registerHasher(dummyHasher);

    mockUser = new User({
      id: UUID.create('user-id'),
      email: EmailAddress.create('test@example.com'),
      password: Password.fromHash('hashedpassword'),
      isAdmin: false,
      roles: [BusinessRole.TENANT],
      name: 'Test',
      lastName: 'User',
      phoneNumber: PhoneNumber.create('1234567890'),
      address: '123 Main St',
      rfc: RFC.create('ABC123XYZ'),
      status: AccountStatus.ACTIVE,
      audit: {
        createdAt: new Date(),
        createdBy: mockIam,
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
      },
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset the Password hasher to avoid test leakage
    Password.resetForTests();
  });

  describe('create', () => {
    it('should insert a new user successfully', async () => {
      vi.mocked(mockKyselyDb.execute).mockResolvedValueOnce(undefined as any);

      await userRepository.create(mockUser);

      expect(mockKyselyDb.insertInto).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.values).toHaveBeenCalledWith({
        id: mockUser.getId().getValue(),
        email: mockUser.getEmail().getValue(),
        password_hash: mockUser.getPassword().getHashedValue(),
        is_admin: mockUser.getIsAdmin(),
        roles: JSON.stringify(mockUser.getRoles()),
        name: mockUser.getName(),
        last_name: mockUser.getLastName(),
        phone_number: mockUser.getPhoneNumber()?.getValue(),
        address: mockUser.getAddress(),
        rfc: mockUser.getRfc()?.getValue(),
        status: mockUser.getStatus(),
        created_at: mockUser.getAudit()?.createdAt,
        created_by: mockUser.getAudit()?.createdBy?.id,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
      });
      expect(mockKyselyDb.execute).toHaveBeenCalled();
    });

    it('should throw AlreadyValueExistError for duplicate email', async () => {
      const uniqueError = { code: '23505', constraint: 'users_email_unique' };
      vi.mocked(mockKyselyDb.execute).mockRejectedValueOnce(uniqueError);

      await expect(userRepository.create(mockUser)).rejects.toThrow(
        new AlreadyValueExistError('test@example.com', 'email'),
      );
    });

    it('should throw AlreadyValueExistError for duplicate phone number', async () => {
      const uniqueError = {
        code: '23505',
        constraint: 'users_phone_number_unique',
      };
      vi.mocked(mockKyselyDb.execute).mockRejectedValueOnce(uniqueError);

      await expect(userRepository.create(mockUser)).rejects.toThrow(
        new AlreadyValueExistError('1234567890', 'phoneNumber'),
      );
    });

    it('should throw AlreadyValueExistError for duplicate rfc', async () => {
      const uniqueError = { code: '23505', constraint: 'users_rfc_unique' };
      vi.mocked(mockKyselyDb.execute).mockRejectedValueOnce(uniqueError);

      await expect(userRepository.create(mockUser)).rejects.toThrow(
        new AlreadyValueExistError('ABC123XYZ', 'rfc'),
      );
    });

    it('should throw a generic AlreadyValueExistError if constraint is unknown', async () => {
      const uniqueError = { code: '23505', constraint: 'unknown_constraint' };
      vi.mocked(mockKyselyDb.execute).mockRejectedValueOnce(uniqueError);

      await expect(userRepository.create(mockUser)).rejects.toThrow(
        new AlreadyValueExistError('', ''),
      );
    });

    it('should throw DataAccessError for other database errors', async () => {
      const otherError = new Error('Some other DB error');
      vi.mocked(mockKyselyDb.execute).mockRejectedValueOnce(otherError);

      await expect(userRepository.create(mockUser)).rejects.toThrow(
        new DataAccessError('Error inserting user into database'),
      );
    });
  });

  describe('isEmailUnique', () => {
    it('should return true if email is unique', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(undefined);
      const isUnique = await userRepository.isEmailUnique(
        EmailAddress.create('unique@example.com'),
      );
      expect(isUnique).toBe(true);
    });

    it('should return false if email is not unique', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce({
        email: 'not-unique@example.com',
      });
      const isUnique = await userRepository.isEmailUnique(
        EmailAddress.create('not-unique@example.com'),
      );
      expect(isUnique).toBe(false);
    });

    it('should throw DataAccessError on database error', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockRejectedValueOnce(
        new Error('DB error'),
      );
      await expect(
        userRepository.isEmailUnique(EmailAddress.create('test@example.com')),
      ).rejects.toThrow(DataAccessError);
    });
  });

  describe('isPhoneNumberUnique', () => {
    it('should return true if phone number is unique', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(undefined);
      const isUnique = await userRepository.isPhoneNumberUnique(
        PhoneNumber.create('1234567890'),
      );
      expect(isUnique).toBe(true);
    });

    it('should return false if phone number is not unique', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce({
        phone_number: '0987654321',
      });
      const isUnique = await userRepository.isPhoneNumberUnique(
        PhoneNumber.create('0987654321'),
      );
      expect(isUnique).toBe(false);
    });
  });

  describe('isRfcUnique', () => {
    it('should return true if RFC is unique', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(undefined);
      const isUnique = await userRepository.isRfcUnique(
        RFC.create('UNIQ123456'),
      );
      expect(isUnique).toBe(true);
    });

    it('should return false if RFC is not unique', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce({
        rfc: 'DUPL123456',
      });
      const isUnique = await userRepository.isRfcUnique(
        RFC.create('DUPL123456'),
      );
      expect(isUnique).toBe(false);
    });
  });
});
