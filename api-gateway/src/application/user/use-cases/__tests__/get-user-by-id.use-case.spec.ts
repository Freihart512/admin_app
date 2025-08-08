import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRepository } from '../../../../domain/user/ports/user.repository.port';
import { GetUserByIdUseCase } from '../get-user-by-id.use-case';
import { User } from '../../../../domain/user/entity/user.entity'; // Assuming User is in this path
import { AuditFields, AccountStatus } from '../../../../@shared/core/types';
import { UserSummary } from '../../../../domain/user/value-objects/user-summary.value-object';


describe('GetUserByIdUseCase', () => {
  let getUserByIdUseCase: GetUserByIdUseCase;
  let userRepository: UserRepository;

  const mockUser = new User({
    id: 'user-id',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    name: 'Test',
    lastName: 'User',
    audit: {
      createdAt: new Date(),
      createdBy: new UserSummary({ id: 'auditor-id', name: 'Auditor', lastName: 'User', email: 'auditor@example.com', status: AccountStatus.ACTIVE }),
      updatedAt: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    } as AuditFields,
  });

  beforeEach(() => {
    userRepository = {
      findById: vi.fn(),
      save: vi.fn(),
      findByEmail: vi.fn(),
      delete: vi.fn(),
      listUsers: vi.fn(),
      findByPhoneNumber: vi.fn(),
      findByRfc: vi.fn(),
    };

    getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  });

  it('should return the user if found', async () => {
    vi.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

    const result = await getUserByIdUseCase.execute('user-id');

    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    expect(result).toBe(mockUser);
  });

  it('should return null if the user is not found', async () => {
    vi.spyOn(userRepository, 'findById').mockResolvedValue(null);

    const result = await getUserByIdUseCase.execute('non-existent-id');

    expect(userRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(result).toBeNull();
  });
});