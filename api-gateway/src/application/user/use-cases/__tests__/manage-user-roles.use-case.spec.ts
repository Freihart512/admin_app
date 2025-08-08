import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRepository } from '../../../../domain/user/ports/user.repository.port';
import { User } from '../../../../domain/user/entity/user.entity';
import { UserSummary } from '../../../../domain/user/value-objects/user-summary.value-object';
import { BusinessRole, AccountStatus } from '../../../../@shared/core/types';
import { ManageUserRolesUseCase } from '../manage-user-roles.use-case';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ManageUserRolesUseCase', () => {
  let userRepository: UserRepository;
  let manageUserRolesUseCase: ManageUserRolesUseCase;

  const mockCurrentUserSummary: UserSummary = {
    id: 'current-user-id',
    name: 'Current',
    lastName: 'User',
    email: 'currentuser@example.com',
    status: AccountStatus.ACTIVE,
  };

  beforeEach(() => {
    userRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      delete: vi.fn(),
      listUsers: vi.fn(),
      findByPhoneNumber: vi.fn(),
      findByRfc: vi.fn(),
    };

    manageUserRolesUseCase = new ManageUserRolesUseCase(userRepository);
  });

  it('should successfully update user roles for a non-admin user', async () => {
    const userId = 'user-to-update-id';
    const initialRoles: BusinessRole[] = [BusinessRole.TENANT];
    const finalRoles: BusinessRole[] = [BusinessRole.OWNER, BusinessRole.ACCOUNTANT];

    const mockUser = new User({
      id: userId,
      email: 'test@example.com',
      passwordHash: 'hashed',
      isAdmin: false,
      name: 'Test',
      lastName: 'User',
      roles: initialRoles,
      audit: {
        createdAt: new Date(),
        createdBy: mockCurrentUserSummary,
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
      },
    });

    const updateRolesSpy = vi.spyOn(mockUser, 'updateRoles');
    const validateRoleConsistencySpy = vi.spyOn(mockUser, 'validateRoleConsistency');

    vi.mocked(userRepository.findById).mockResolvedValue(mockUser);

    const result = await manageUserRolesUseCase.execute({ userId, finalRoles }, mockCurrentUserSummary);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(updateRolesSpy).toHaveBeenCalledWith(finalRoles);
    expect(validateRoleConsistencySpy).toHaveBeenCalled();
    expect(mockUser.audit.updatedBy).toEqual(mockCurrentUserSummary);
    expect(mockUser.audit.updatedAt).toBeInstanceOf(Date);
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user is not found', async () => {
    const userId = 'non-existent-user-id';
    const finalRoles: BusinessRole[] = [BusinessRole.OWNER];

    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await expect(manageUserRolesUseCase.execute({ userId, finalRoles }, mockCurrentUserSummary)).rejects.toThrow(
      new NotFoundException(`User with ID ${userId} not found.`)
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if attempting to manage roles for an admin user', async () => {
    const userId = 'admin-user-id';
    const finalRoles: BusinessRole[] = [BusinessRole.OWNER];

    const mockAdminUser = new User({
      id: userId,
      email: 'admin@example.com',
      passwordHash: 'hashed',
      isAdmin: true,
      name: 'Admin',
      lastName: 'User',
      roles: [],
      audit: {
        createdAt: new Date(),
        createdBy: mockCurrentUserSummary,
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
      },
    });

    vi.mocked(userRepository.findById).mockResolvedValue(mockAdminUser);

    await expect(manageUserRolesUseCase.execute({ userId, finalRoles }, mockCurrentUserSummary)).rejects.toThrow(
      new BadRequestException('Cannot manage business roles for an admin user.')
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should re-throw domain errors from validateRoleConsistency', async () => {
    const userId = 'user-with-invalid-roles';
    const finalRoles: BusinessRole[] = [BusinessRole.OWNER, BusinessRole.TENANT]; // Example invalid combination

    const mockUser = new User({
      id: userId,
      email: 'test@example.com',
      passwordHash: 'hashed',
      isAdmin: false,
      name: 'Test',
      lastName: 'User',
      roles: [],
      audit: {
        createdAt: new Date(),
        createdBy: mockCurrentUserSummary,
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
      },
    });

    // Mocking the domain validation to throw an error
    vi.spyOn(mockUser, 'validateRoleConsistency').mockImplementation(() => {
      throw new Error('Invalid role combination');
    });
    vi.spyOn(mockUser, 'updateRoles').mockImplementation(() => {
      mockUser.roles = finalRoles; // Simulate roles being set before validation
    });


    vi.mocked(userRepository.findById).mockResolvedValue(mockUser);

    await expect(manageUserRolesUseCase.execute({ userId, finalRoles }, mockCurrentUserSummary)).rejects.toThrow(
      'Invalid role combination'
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUser.updateRoles).toHaveBeenCalledWith(finalRoles);
    expect(mockUser.validateRoleConsistency).toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled(); // Save should not be called if validation fails
  });
});