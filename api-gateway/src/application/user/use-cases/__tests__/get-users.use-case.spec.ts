import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetUsersUseCase } from '../get-users.use-case';
import { UserRepository } from '../../../../domain/user/ports/user.repository.port';
import { User } from '../../../../domain/user/entity/user.entity';
import { BusinessRole, AccountStatus } from '../../../../@shared/core/types';
import { UserSummary } from '../../../../domain/user/value-objects/user-summary.value-object';

describe('GetUsersUseCase', () => {
  let getUsersUseCase: GetUsersUseCase;
  let userRepository: UserRepository;

  const mockUserSummary: UserSummary = new UserSummary({
    id: 'auditor-id',
    name: 'Auditor',
    lastName: 'User',
    email: 'auditor@example.com',
    status: AccountStatus.ACTIVE,
  });

  const mockUser: User = new User({
    id: 'test-id',
    email: 'test@example.com',
    passwordHash: 'hashed',
    name: 'Test',
    lastName: 'User',
    roles: [],
    isAdmin: false,
    audit: {
      createdAt: new Date(),
      createdBy: mockUserSummary,
      updatedAt: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    },
    status: AccountStatus.ACTIVE,
  });

  beforeEach(() => {
    userRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      delete: vi.fn(),
      listUsers: vi.fn().mockResolvedValue({ users: [mockUser], totalCount: 1, hasNextPage: false }),
      findByPhoneNumber: vi.fn(),
      findByRfc: vi.fn(),
    };
    getUsersUseCase = new GetUsersUseCase(userRepository);
  });

  it('should call userRepository.listUsers with correct parameters and return the result', async () => {
    const params = {
      status: AccountStatus.ACTIVE,
      role: BusinessRole.TENANT,
      isAdmin: false,
      limit: 10,
      offset: 0,
    };

    const result = await getUsersUseCase.execute(params);

    expect(userRepository.listUsers).toHaveBeenCalledWith(params);
    expect(result).toEqual({ users: [mockUser], totalCount: 1, hasNextPage: false });
  });

  it('should call userRepository.listUsers with default parameters when no parameters are provided', async () => {
    const params = {};

    const result = await getUsersUseCase.execute(params);

    expect(userRepository.listUsers).toHaveBeenCalledWith(params);
    expect(result).toEqual({ users: [mockUser], totalCount: 1, hasNextPage: false });
  });

  it('should call userRepository.listUsers with partial parameters', async () => {
    const params = { limit: 5 };

    const result = await getUsersUseCase.execute(params);

    expect(userRepository.listUsers).toHaveBeenCalledWith(params);
    expect(result).toEqual({ users: [mockUser], totalCount: 1, hasNextPage: false });
  });
});