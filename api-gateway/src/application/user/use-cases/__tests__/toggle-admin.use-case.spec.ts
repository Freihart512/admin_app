import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToggleAdminUseCase } from '../toggle-admin.use-case';
import { UserRepository } from '../../../../domain/user/ports/user.repository.port';
import { User } from '../../../../domain/user/entity/user.entity';
import { UserSummary } from '../../../../domain/user/value-objects/user-summary.value-object';
import { AccountStatus } from '../../../../@shared/core/types';

describe('ToggleAdminUseCase', () => {
  let toggleAdminUseCase: ToggleAdminUseCase;
  let mockUserRepository: any;
  let mockUser: any;
  let mockCurrentUser: UserSummary;

  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
      save: vi.fn(),
      listUsers: vi.fn(),
    };

    mockUser = {
      id: 'user-id-1',
      isAdmin: false,
      roles: ['TENANT'],
      audit: {
        updatedBy: null,
        updatedAt: null,
      },
      save: vi.fn(),
      updateRoles: vi.fn(), // Add updateRoles mock
      validateRoleConsistency: vi.fn(), // Add validateRoleConsistency mock
    };

    mockCurrentUser = new UserSummary({
      id: 'current-user-id',
      name: 'Current',
      lastName: 'User',
      email: 'current@example.com',
      status: AccountStatus.ACTIVE,
    });

    toggleAdminUseCase = new ToggleAdminUseCase(mockUserRepository);
  });

  it('should toggle a user to admin successfully', async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.listUsers.mockResolvedValue({ users: [], totalCount: 0, hasNextPage: false }); // No other admins

    await toggleAdminUseCase.execute(mockUser.id, true, mockCurrentUser);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(mockUser.isAdmin).toBe(true);
    expect(mockUser.roles).toEqual([]); // Roles should be cleared
    expect(mockUser.audit.updatedBy).toBe(mockCurrentUser);
    expect(mockUser.audit.updatedAt).toBeInstanceOf(Date);
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should toggle a user from admin successfully', async () => {
    mockUser.isAdmin = true;
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.listUsers.mockResolvedValue({
      users: [{ id: 'another-admin-id' }, mockUser], // Another admin exists
      totalCount: 2,
      hasNextPage: false,
    });

    await toggleAdminUseCase.execute(mockUser.id, false, mockCurrentUser);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(mockUser.isAdmin).toBe(false);
    // Roles are not automatically added when admin is removed, this should be handled
    // by a separate use case or business logic.
    expect(mockUser.audit.updatedBy).toBe(mockCurrentUser);
    expect(mockUser.audit.updatedAt).toBeInstanceOf(Date);
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should throw an error if user is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      toggleAdminUseCase.execute('non-existent-id', true, mockCurrentUser),
    ).rejects.toThrow('User not found');
    expect(mockUserRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error when trying to remove admin status from the last active admin', async () => {
    mockUser.isAdmin = true;
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.listUsers.mockResolvedValue({
      users: [mockUser], // Only the current user is an admin
      totalCount: 1,
      hasNextPage: false,
    });

    await expect(
      toggleAdminUseCase.execute(mockUser.id, false, mockCurrentUser),
    ).rejects.toThrow('Cannot remove admin status from the last active administrator.');
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(mockUserRepository.listUsers).toHaveBeenCalledWith({ isAdmin: true, status: 'active' });
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should clear business roles when toggling to admin', async () => {
    mockUser.isAdmin = false;
    mockUser.roles = ['OWNER', 'ACCOUNTANT'];
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.listUsers.mockResolvedValue({ users: [], totalCount: 0, hasNextPage: false });

    await toggleAdminUseCase.execute(mockUser.id, true, mockCurrentUser);

    expect(mockUser.isAdmin).toBe(true);
    expect(mockUser.roles).toEqual([]);
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should not modify roles when toggling from admin', async () => {
    mockUser.isAdmin = true;
    mockUser.roles = []; // Admins should not have roles
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.listUsers.mockResolvedValue({
      users: [{ id: 'another-admin-id' }, mockUser],
      totalCount: 2,
      hasNextPage: false,
    });

    await toggleAdminUseCase.execute(mockUser.id, false, mockCurrentUser);

    expect(mockUser.isAdmin).toBe(false);
    expect(mockUser.roles).toEqual([]); // Roles remain empty
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });
});