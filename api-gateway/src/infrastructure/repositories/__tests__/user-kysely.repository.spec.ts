import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KyselyUserRepository } from '../user-kysely.repository';
import { db, Database } from '../../database/kysely.db';
import { User } from '../../../domain/user/entity/user.entity';
import { UserSummary } from '../../../domain/user/value-objects/user-summary.value-object';
import { BusinessRole, AccountStatus, AuditFields } from '../../../@shared/core/types';

// Mock the Kysely database instance
const mockKyselyDb = {
  selectFrom: vi.fn().mockReturnThis(),
  selectAll: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  executeTakeFirst: vi.fn(),
  insertInto: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  onConflict: vi.fn().mockReturnThis(),
  column: vi.fn().mockReturnThis(),
  doUpdateSet: vi.fn().mockReturnThis(),
  execute: vi.fn(),
  updateTable: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  fn: {
    count: vi.fn().mockReturnThis(),
  },
} as unknown as typeof db; // Cast to the correct type

describe('KyselyUserRepository', () => {
  let userRepository: KyselyUserRepository;

  beforeEach(() => {
    userRepository = new KyselyUserRepository(mockKyselyDb);
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  const mockUserSummary: UserSummary = new UserSummary({
    id: 'auditor-id',
    name: 'Auditor',
    lastName: 'User',
    email: 'auditor@example.com',
    status: AccountStatus.ACTIVE,
  });

  const mockAuditFields: AuditFields = {
    createdAt: new Date(),
    createdBy: mockUserSummary,
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  const mockUser = new User({
    id: 'user-id',
    email: 'test@example.com',
    passwordHash: 'hashedpassword',
    isAdmin: false,
    roles: [BusinessRole.TENANT],
    name: 'Test',
    lastName: 'User',
    phoneNumber: '1234567890',
    address: '123 Main St',
    rfc: 'ABC123XYZ',
    status: AccountStatus.ACTIVE,
    audit: mockAuditFields,
  });

  const mockUserRow = {
    id: 'user-id',
    email: 'test@example.com',
    password_hash: 'hashedpassword',
    is_admin: false,
    roles: JSON.stringify([BusinessRole.TENANT]),
    name: 'Test',
    last_name: 'User',
    phone_number: '1234567890',
    address: '123 Main St',
    rfc: 'ABC123XYZ',
    status: 'active',
    created_at: mockAuditFields.createdAt,
    created_by: mockAuditFields.createdBy?.id,
    updated_at: null,
    updated_by: null,
    deleted_at: null,
    deleted_by: null,
  };

  describe('save', () => {
    it('should insert a new user if not exists', async () => {
      // Mock executeTakeFirst to return undefined, simulating no existing user
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(undefined);

      await userRepository.save(mockUser);

      expect(mockKyselyDb.insertInto).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.values).toHaveBeenCalledWith(expect.objectContaining({
        id: mockUser.id,
        email: mockUser.email,
        password_hash: mockUser.passwordHash,
        is_admin: mockUser.isAdmin,
        roles: JSON.stringify(mockUser.roles),
        name: mockUser.name,
        last_name: mockUser.lastName,
        phone_number: mockUser.phoneNumber,
        address: mockUser.address,
        rfc: mockUser.rfc,
        status: mockUser.status,
        created_at: mockUser.audit.createdAt,
        created_by: mockUser.audit.createdBy?.id,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
      }));
      expect(mockKyselyDb.onConflict).toHaveBeenCalled();
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalled();
    });

    it('should update an existing user', async () => {
      const updatedUser = new User({
        ...mockUser,
        name: 'Updated Name',
        audit: {
          ...mockUser.audit,
          updatedAt: new Date(),
          updatedBy: mockUserSummary,
        },
      });
      const updatedUserRow = {
        ...mockUserRow,
        name: 'Updated Name',
        updated_at: updatedUser.audit.updatedAt,
        updated_by: updatedUser.audit.updatedBy?.id,
      };

      // Mock executeTakeFirst to simulate upsert finishing
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce({}); // Simulate upsert

      await userRepository.save(updatedUser);

      expect(mockKyselyDb.insertInto).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.values).toHaveBeenCalledWith(expect.objectContaining({
        id: updatedUser.id,
        name: updatedUser.name,
        updated_at: updatedUser.audit.updatedAt,
        updated_by: updatedUser.audit.updatedBy?.id,
      }));
      expect(mockKyselyDb.onConflict).toHaveBeenCalled();
      expect(mockKyselyDb.doUpdateSet).toHaveBeenCalledWith(expect.objectContaining({
        id: updatedUser.id,
        name: updatedUser.name,
        updated_at: updatedUser.audit.updatedAt,
        updated_by: updatedUser.audit.updatedBy?.id,
      }));
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalledTimes(1);
    });

    it('should handle unique constraint error for email', async () => {
      const uniqueError = new Error('Unique violation') as any;
      uniqueError.code = '23505';
      uniqueError.constraint = 'users_email_unique';

      vi.mocked(mockKyselyDb.executeTakeFirst).mockRejectedValueOnce(uniqueError);

      await expect(userRepository.save(mockUser)).rejects.toThrow('Email already exists.');
      expect(mockKyselyDb.insertInto).toHaveBeenCalled();
    });

    it('should handle unique constraint error for phone number', async () => {
      const uniqueError = new Error('Unique violation') as any;
      uniqueError.code = '23505';
      uniqueError.constraint = 'users_phone_number_unique';

      vi.mocked(mockKyselyDb.executeTakeFirst).mockRejectedValueOnce(uniqueError);

      await expect(userRepository.save(mockUser)).rejects.toThrow('Phone number already exists.');
      expect(mockKyselyDb.insertInto).toHaveBeenCalled();
    });

    it('should handle unique constraint error for rfc', async () => {
      const uniqueError = new Error('Unique violation') as any;
      uniqueError.code = '23505';
      uniqueError.constraint = 'users_rfc_unique';

      vi.mocked(mockKyselyDb.executeTakeFirst).mockRejectedValueOnce(uniqueError);

      await expect(userRepository.save(mockUser)).rejects.toThrow('RFC already exists.');
      expect(mockKyselyDb.insertInto).toHaveBeenCalled();
    });

    it('should re-throw other database errors', async () => {
      const otherError = new Error('Some other DB error');
      vi.mocked(mockKyselyDb.executeTakeFirst).mockRejectedValueOnce(otherError);

      await expect(userRepository.save(mockUser)).rejects.toThrow('Some other DB error');
      expect(mockKyselyDb.insertInto).toHaveBeenCalled();
    });

    it('should update deleted_by if set on the domain entity', async () => {
      const userToDelete = new User({
        ...mockUser,
        audit: {
          ...mockUser.audit,
          deletedAt: new Date(),
          deletedBy: mockUserSummary,
        },
        status: AccountStatus.INACTIVE,
      });

      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce({}); // Simulate upsert success
      vi.mocked(mockKyselyDb.execute).mockResolvedValueOnce({}); // Simulate update success for deleted_by

      await userRepository.save(userToDelete);

      expect(mockKyselyDb.updateTable).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.set).toHaveBeenCalledWith({ deleted_by: userToDelete.audit.deletedBy?.id });
      expect(mockKyselyDb.where).toHaveBeenCalledWith('id', '=', userToDelete.id);
      expect(mockKyselyDb.execute).toHaveBeenCalledTimes(1); // For the deleted_by update
    });
  });

  describe('findById', () => {
    it('should return a User if found', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(mockUserRow);

      const user = await userRepository.findById('user-id');

      expect(mockKyselyDb.selectFrom).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('id', '=', 'user-id');
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalled();
      expect(user).toBeInstanceOf(User);
      expect(user?.id).toBe('user-id');
      expect(user?.email).toBe('test@example.com');
      expect(user?.audit.createdBy?.id).toBe(mockUserSummary.id); // Check UserSummary creation
    });

    it('should return null if user not found', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(undefined);

      const user = await userRepository.findById('non-existent-id');

      expect(mockKyselyDb.selectFrom).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('id', '=', 'non-existent-id');
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalled();
      expect(user).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return an active User if found', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(mockUserRow);

      const user = await userRepository.findByEmail('test@example.com');

      expect(mockKyselyDb.selectFrom).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('email', '=', 'test@example.com');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('status', '=', 'active');
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalled();
      expect(user).toBeInstanceOf(User);
      expect(user?.email).toBe('test@example.com');
    });

    it('should return null if user not found by email', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(undefined);

      const user = await userRepository.findByEmail('nonexistent@example.com');

      expect(mockKyselyDb.selectFrom).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('email', '=', 'nonexistent@example.com');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('status', '=', 'active');
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalled();
      expect(user).toBeNull();
    });

    it('should return null if user found by email is not active', async () => {
      const inactiveUserRow = { ...mockUserRow, status: 'inactive' };
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(undefined); // Query specifically asks for active, so inactive won't be returned by this mock setup

      const user = await userRepository.findByEmail('test@example.com');

      expect(mockKyselyDb.selectFrom).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('email', '=', 'test@example.com');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('status', '=', 'active');
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalled();
      expect(user).toBeNull();
    });
  });

  describe('delete', () => {
    it('should soft delete a user', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce({});

      await userRepository.delete('user-id');

      expect(mockKyselyDb.updateTable).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.set).toHaveBeenCalledWith(expect.objectContaining({ status: 'inactive' }));
      expect(mockKyselyDb.set).toHaveBeenCalledWith(expect.objectContaining({ deleted_at: expect.any(Date) }));
      expect(mockKyselyDb.where).toHaveBeenCalledWith('id', '=', 'user-id');
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalled();
    });
  });

  describe('listUsers', () => {
    it('should list users with default pagination', async () => {
      const mockUserRows = [mockUserRow];
      vi.mocked(mockKyselyDb.fn.count).mockReturnThis();
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce({ count: '1' }); // For total count
      vi.mocked(mockKyselyDb.execute).mockResolvedValueOnce(mockUserRows); // For user list

      const result = await userRepository.listUsers({});

      expect(mockKyselyDb.selectFrom).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.limit).toHaveBeenCalledWith(undefined); // No limit applied by default
      expect(mockKyselyDb.offset).toHaveBeenCalledWith(undefined); // No offset applied by default
      expect(mockKyselyDb.execute).toHaveBeenCalled();
      expect(mockKyselyDb.fn.count).toHaveBeenCalledWith('id');
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalledTimes(1); // For count query
      expect(result.users).toHaveLength(1);
      expect(result.users[0]).toBeInstanceOf(User);
      expect(result.totalCount).toBe(1);
      expect(result.hasNextPage).toBe(false);
    });

    it('should list users with specified pagination and filters', async () => {
      const mockUserRows = [mockUserRow];
      vi.mocked(mockKyselyDb.fn.count).mockReturnThis();
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce({ count: '2' }); // For total count
      vi.mocked(mockKyselyDb.execute).mockResolvedValueOnce(mockUserRows); // For user list

      const options = {
        status: AccountStatus.ACTIVE,
        role: BusinessRole.OWNER,
        isAdmin: false,
        limit: 5,
        offset: 0,
      };
      const result = await userRepository.listUsers(options);

      expect(mockKyselyDb.selectFrom).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('status', '=', AccountStatus.ACTIVE);
      expect(mockKyselyDb.where).toHaveBeenCalledWith('roles', 'like', `%"${BusinessRole.OWNER}"%`);
      expect(mockKyselyDb.where).toHaveBeenCalledWith('is_admin', '=', false);
      expect(mockKyselyDb.limit).toHaveBeenCalledWith(5);
      expect(mockKyselyDb.offset).toHaveBeenCalledWith(0);
      expect(mockKyselyDb.execute).toHaveBeenCalled();
      expect(mockKyselyDb.fn.count).toHaveBeenCalledWith('id');
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalledTimes(1); // For count query
      expect(result.users).toHaveLength(1);
      expect(result.totalCount).toBe(2);
      expect(result.hasNextPage).toBe(true); // Because limit (5) + fetched (1) < total (2)
    });
  });

  describe('findByPhoneNumber', () => {
    it('should return an active User if found by phone number', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(mockUserRow);

      const user = await userRepository.findByPhoneNumber('1234567890');

      expect(mockKyselyDb.selectFrom).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('phone_number', '=', '1234567890');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('status', '=', 'active');
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalled();
      expect(user).toBeInstanceOf(User);
      expect(user?.phoneNumber).toBe('1234567890');
    });

    it('should return null if user not found by phone number', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(undefined);

      const user = await userRepository.findByPhoneNumber('9876543210');

      expect(mockKyselyDb.selectFrom).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('phone_number', '=', '9876543210');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('status', '=', 'active');
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalled();
      expect(user).toBeNull();
    });
  });

  describe('findByRfc', () => {
    it('should return an active User if found by RFC', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(mockUserRow);

      const user = await userRepository.findByRfc('ABC123XYZ');

      expect(mockKyselyDb.selectFrom).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('rfc', '=', 'ABC123XYZ');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('status', '=', 'active');
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalled();
      expect(user).toBeInstanceOf(User);
      expect(user?.rfc).toBe('ABC123XYZ');
    });

    it('should return null if user not found by RFC', async () => {
      vi.mocked(mockKyselyDb.executeTakeFirst).mockResolvedValueOnce(undefined);

      const user = await userRepository.findByRfc('ZYX321CBA');

      expect(mockKyselyDb.selectFrom).toHaveBeenCalledWith('users');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('rfc', '=', 'ZYX321CBA');
      expect(mockKyselyDb.where).toHaveBeenCalledWith('status', '=', 'active');
      expect(mockKyselyDb.executeTakeFirst).toHaveBeenCalled();
      expect(user).toBeNull();
    });
  });
});