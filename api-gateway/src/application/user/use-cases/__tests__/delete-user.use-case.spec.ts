import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteUserUseCase } from '../delete-user.use-case';
import { UserRepository } from '../../../../domain/user/ports/user.repository.port';
import { User } from '../../../../domain/user/entity/user.entity';
import { UserSummary } from '../../../../domain/user/value-objects/user-summary.value-object';
import { NotFoundException } from '@nestjs/common';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let mockUserRepository: UserRepository;
  let mockUser: User;
  let mockCurrentUserSummary: UserSummary;

  beforeEach(() => {
    mockUserRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      delete: vi.fn(), // Mocking delete, although soft delete is used internally
      listUsers: vi.fn(),
      findByPhoneNumber: vi.fn(),
      findByRfc: vi.fn(),
    };

    mockUser = {
      id: 'user-id-1',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      isAdmin: false,
      roles: [],
      name: 'Test',
      lastName: 'User',
      phoneNumber: '1234567890',
      address: '123 Main St',
      rfc: 'ABC123XYZ',
      status: 'active',
      audit: {
        createdAt: new Date(),
        createdBy: {} as UserSummary, // Placeholder
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
      },
      validateRoleConsistency: vi.fn(),
      hasRole: vi.fn().mockReturnValue(false),
      isActive: vi.fn().mockReturnValue(true),
      markAsDeleted: vi.fn(),
      updateRoles: vi.fn(),
      validateRequiredFields: vi.fn(),
    };

    mockCurrentUserSummary = new UserSummary({
      id: 'admin-user-id',
      name: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      status: 'active',
    });

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository);
  });

  it('should successfully soft delete a user', async () => {
    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(mockUser);

    const result = await deleteUserUseCase.execute(mockUser.id, mockCurrentUserSummary);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(mockUser.markAsDeleted).toHaveBeenCalledWith(mockCurrentUserSummary);
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    expect(result).toBe(mockUser);
  });

  it('should throw NotFoundException if user is not found', async () => {
    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(null);

    await expect(deleteUserUseCase.execute('non-existent-id', mockCurrentUserSummary)).rejects.toThrow(NotFoundException);
    expect(mockUserRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(mockUser.markAsDeleted).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  // Although the business rule checks are commented out, we can test
  // that if the 'hasActiveContracts' method were present and returned true,
  // an exception would be thrown *before* markAsDeleted and save are called.
  // This requires temporarily adding the method to the mock user or simulating its behavior.
  it('should throw a business rule exception if user has active contracts (simulated)', async () => {
    // Simulate the presence and behavior of hasActiveContracts returning true
    const userWithActiveContracts = {
      ...mockUser,
      hasRole: vi.fn().mockReturnValue(true), // Simulate having a role that triggers the check
      hasActiveContracts: vi.fn().mockReturnValue(true), // Simulate having active contracts
    };
    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(userWithActiveContracts as any); // Cast for simulation

    // The specific exception depends on the uncommented code, but we expect an error
    // before markAsDeleted and save are called.
    await expect(deleteUserUseCase.execute(mockUser.id, mockCurrentUserSummary)).rejects.toThrow(); // Expecting some error

    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser.id);
    // Since the business rule check is simulated to fail, markAsDeleted and save should not be called on the mocked user entity
    expect(userWithActiveContracts.markAsDeleted).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should update audit fields when marking as deleted', async () => {
    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(mockUser);
    const dateNowSpy = vi.spyOn(global, 'Date').mockImplementation(() => ({
      getTime: () => 12345, // Dummy timestamp
      toISOString: () => '2023-10-26T10:00:00.000Z',
      // Mock other Date methods if needed by markAsDeleted
    } as any)); // Cast for simulation

    await deleteUserUseCase.execute(mockUser.id, mockCurrentUserSummary);

    expect(mockUser.markAsDeleted).toHaveBeenCalledWith(mockCurrentUserSummary);
    // Assertions on the mocked user's audit fields after markAsDeleted is called
    expect(mockUser.audit.deletedAt).not.toBeNull(); // Should be set by markAsDeleted
    expect(mockUser.audit.deletedBy).toBe(mockCurrentUserSummary); // Should be set by markAsDeleted
    expect(mockUser.audit.updatedAt).not.toBeNull(); // Should be updated by markAsDeleted
    expect(mockUser.audit.updatedBy).toBe(mockCurrentUserSummary); // Should be updated by markAsDeleted

    dateNowSpy.mockRestore();
  });
});