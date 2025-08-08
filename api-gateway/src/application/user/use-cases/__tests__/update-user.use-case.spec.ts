import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateUserUseCase } from '../update-user.use-case';
import { UserRepository } from '../../../../domain/user/ports/user.repository.port';
import { User } from '../../../../domain/user/entity/user.entity';
import { UserSummary } from '../../../../domain/user/value-objects/user-summary.value-object';
import { UpdateUserDto } from '../../dtos/user.dtos';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RFC } from '../../../../domain/@shared/value-objects/rfc.value-object';
import { AccountStatus, BusinessRole } from '../../../../@shared/core/types';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let mockUserRepository: UserRepository;
  let mockCurrentUser: UserSummary;
  let mockExistingUser: User;

  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
      save: vi.fn(),
      findByEmail: vi.fn(),
      delete: vi.fn(),
      listUsers: vi.fn(),
      findByPhoneNumber: vi.fn(),
      findByRfc: vi.fn(),
    };

    mockCurrentUser = new UserSummary({
      id: 'current-user-id',
      name: 'Current',
      lastName: 'User',
      email: 'current@example.com',
      status: AccountStatus.ACTIVE,
    });

    mockExistingUser = new User({
      id: 'existing-user-id',
      email: 'existing@example.com',
      passwordHash: 'hashed-password',
      isAdmin: false,
      name: 'Existing',
      lastName: 'User',
      roles: [],
      audit: {
        createdAt: new Date(),
        createdBy: new UserSummary({
          id: 'creator-id',
          name: 'Creator',
          lastName: 'User',
          email: 'creator@example.com',
          status: AccountStatus.ACTIVE,
        }),
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
      },
    });
    mockExistingUser.validateRequiredFields = vi.fn();
    mockExistingUser.audit.updatedAt = null; // Ensure initially null for tests
    mockExistingUser.audit.updatedBy = null; // Ensure initially null for tests


    useCase = new UpdateUserUseCase(mockUserRepository);
  });

  it('should update user details and save', async () => {
    const updateDto: UpdateUserDto = {
      name: 'Updated Name',
      lastName: 'Updated Last Name',
      phoneNumber: '1234567890',
    };

    mockUserRepository.findById = vi.fn().mockResolvedValue(mockExistingUser);
    mockUserRepository.findByPhoneNumber = vi.fn().mockResolvedValue(null);
    mockUserRepository.findByRfc = vi.fn().mockResolvedValue(null);
    mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

    const updatedUser = await useCase.execute('existing-user-id', updateDto, mockCurrentUser);

    expect(mockUserRepository.findById).toHaveBeenCalledWith('existing-user-id');
    expect(mockExistingUser.name).toBe(updateDto.name);
    expect(mockExistingUser.lastName).toBe(updateDto.lastName);
    expect(mockExistingUser.phoneNumber).toBe(updateDto.phoneNumber);
    expect(mockExistingUser.address).toBeUndefined(); // Should remain undefined if not in DTO
    expect(mockExistingUser.rfc).toBeNull(); // Should remain null if not in DTO and was null initially
    expect(mockExistingUser.audit.updatedBy?.id).toBe(mockCurrentUser.id);
    expect(mockExistingUser.audit.updatedAt).toEqual(expect.any(Date));
    expect(mockExistingUser.validateRequiredFields).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockExistingUser);
    expect(updatedUser).toBe(mockExistingUser);
  });

  it('should return NotFoundException if user does not exist', async () => {
    const updateDto: UpdateUserDto = { name: 'Updated Name' };
    mockUserRepository.findById = vi.fn().mockResolvedValue(null);

    await expect(useCase.execute('non-existent-id', updateDto, mockCurrentUser)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockExistingUser.validateRequiredFields).not.toHaveBeenCalled();
  });

  it('should throw ConflictException if phone number is already in use', async () => {
    const updateDto: UpdateUserDto = { phoneNumber: '9876543210' };
    const otherUserWithPhone = new User({
      id: 'other-user-id',
      email: 'other@example.com',
      passwordHash: 'hashed-password',
      isAdmin: false,
      name: 'Other',
      lastName: 'User',
      roles: [],
      audit: {
        createdAt: new Date(),
        createdBy: new UserSummary({
          id: 'creator-id',
          name: 'Creator',
          lastName: 'User',
          email: 'creator@example.com',
          status: AccountStatus.ACTIVE,
        }),
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
      },
    });

    mockUserRepository.findById = vi.fn().mockResolvedValue(mockExistingUser);
    mockUserRepository.findByPhoneNumber = vi.fn().mockResolvedValue(otherUserWithPhone);
    mockUserRepository.findByRfc = vi.fn().mockResolvedValue(null);

    await expect(useCase.execute('existing-user-id', updateDto, mockCurrentUser)).rejects.toThrow(
      ConflictException,
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith('existing-user-id');
    expect(mockUserRepository.findByPhoneNumber).toHaveBeenCalledWith(updateDto.phoneNumber);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockExistingUser.validateRequiredFields).not.toHaveBeenCalled();
  });

  it('should not throw ConflictException if phone number is the same as the existing user', async () => {
    const updateDto: UpdateUserDto = { phoneNumber: '1112223333' };
    mockExistingUser.phoneNumber = '1112223333'; // Set phone number on the existing user

    mockUserRepository.findById = vi.fn().mockResolvedValue(mockExistingUser);
    // findByPhoneNumber should ideally not be called if the number is the same,
    // but if it is, it should return the same user.
    mockUserRepository.findByPhoneNumber = vi.fn().mockResolvedValue(mockExistingUser);
    mockUserRepository.findByRfc = vi.fn().mockResolvedValue(null);
    mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

    const updatedUser = await useCase.execute('existing-user-id', updateDto, mockCurrentUser);

    expect(mockUserRepository.findById).toHaveBeenCalledWith('existing-user-id');
    // The findByPhoneNumber check should skip if the phone number is not changing or is null
    // The current implementation in the Use Case does this check.
    expect(mockUserRepository.findByPhoneNumber).toHaveBeenCalledWith(updateDto.phoneNumber);
    expect(mockExistingUser.phoneNumber).toBe(updateDto.phoneNumber);
    expect(mockExistingUser.validateRequiredFields).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockExistingUser);
    expect(updatedUser).toBe(mockExistingUser);
  });

  it('should throw ConflictException if RFC is already in use', async () => {
    const updateDto: UpdateUserDto = { rfc: 'AADD800923XXX' }; // Valid RFC
    const otherUserWithRfc = new User({
      id: 'other-user-id-2',
      email: 'other2@example.com',
      passwordHash: 'hashed-password',
      isAdmin: false,
      name: 'Other 2',
      lastName: 'User 2',
      roles: [],
      audit: {
        createdAt: new Date(),
        createdBy: new UserSummary({
          id: 'creator-id',
          name: 'Creator',
          lastName: 'User',
          email: 'creator@example.com',
          status: AccountStatus.ACTIVE,
        }),
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
      },
    });

    mockUserRepository.findById = vi.fn().mockResolvedValue(mockExistingUser);
    mockUserRepository.findByPhoneNumber = vi.fn().mockResolvedValue(null);
    mockUserRepository.findByRfc = vi.fn().mockResolvedValue(otherUserWithRfc);

    await expect(useCase.execute('existing-user-id', updateDto, mockCurrentUser)).rejects.toThrow(
      ConflictException,
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith('existing-user-id');
    expect(mockUserRepository.findByRfc).toHaveBeenCalledWith(updateDto.rfc);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockExistingUser.validateRequiredFields).not.toHaveBeenCalled();
  });

  it('should not throw ConflictException if RFC is the same as the existing user', async () => {
    const updateDto: UpdateUserDto = { rfc: 'DEF456UVW' }; // Assuming DEF456UVW was the initial RFC string
    mockExistingUser.rfc = 'DEF456UVW'; // Set RFC on the existing user

    mockUserRepository.findById = vi.fn().mockResolvedValue(mockExistingUser);
    // findByRfc should ideally not be called if the RFC is the same,
    // but if it is, it should return the same user.
    mockUserRepository.findByRfc = vi.fn().mockResolvedValue(mockExistingUser);
    mockUserRepository.findByPhoneNumber = vi.fn().mockResolvedValue(null);
    mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

    const updatedUser = await useCase.execute('existing-user-id', updateDto, mockCurrentUser);

    expect(mockUserRepository.findById).toHaveBeenCalledWith('existing-user-id');
    // The findByRfc check should skip if the RFC is not changing or is null
    // The current implementation in the Use Case does this check.
    expect(mockUserRepository.findByRfc).toHaveBeenCalledWith(updateDto.rfc);
    // RFC is now a Value Object, so compare value
    expect(mockExistingUser.rfc?.value).toBe(updateDto.rfc);
    expect(mockExistingUser.validateRequiredFields).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockExistingUser);
    expect(updatedUser).toBe(mockExistingUser);
  });

  it('should call validateRequiredFields on the user entity', async () => {
    const updateDto: UpdateUserDto = { name: 'Updated Name' };
    mockUserRepository.findById = vi.fn().mockResolvedValue(mockExistingUser);
    mockUserRepository.findByPhoneNumber = vi.fn().mockResolvedValue(null);
    mockUserRepository.findByRfc = vi.fn().mockResolvedValue(null);
    mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

    await useCase.execute('existing-user-id', updateDto, mockCurrentUser);

    expect(mockExistingUser.validateRequiredFields).toHaveBeenCalled();
  });

  it('should set updatedAt and updatedBy audit fields', async () => {
    const updateDto: UpdateUserDto = { name: 'Updated Name' };
    mockUserRepository.findById = vi.fn().mockResolvedValue(mockExistingUser);
    mockUserRepository.findByPhoneNumber = vi.fn().mockResolvedValue(null);
    mockUserRepository.findByRfc = vi.fn().mockResolvedValue(null);
    mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

    const now = new Date();
    vi.useFakeTimers().setSystemTime(now);

    await useCase.execute('existing-user-id', updateDto, mockCurrentUser);

    expect(mockExistingUser.audit.updatedBy?.id).toBe(mockCurrentUser.id);
    expect(mockExistingUser.audit.updatedAt).toEqual(now);

    vi.useRealTimers();
  });

  it('should throw an error if the provided RFC is invalid', async () => {
    const updateDto: UpdateUserDto = { rfc: 'INVALID-RFC' }; // Invalid RFC string

    mockUserRepository.findById = vi.fn().mockResolvedValue(mockExistingUser);
    mockUserRepository.findByPhoneNumber = vi.fn().mockResolvedValue(null);
    mockUserRepository.findByRfc = vi.fn().mockResolvedValue(null);

    // The error should be thrown by the RFC value object constructor
    await expect(useCase.execute('existing-user-id', updateDto, mockCurrentUser)).rejects.toThrow(
      /Invalid RFC format/ // Use a regex to match the expected error message
    );

    expect(mockUserRepository.findById).toHaveBeenCalledWith('existing-user-id');
    // The RFC validation happens before the repository checks, so findByRfc and save should not be called.
    expect(mockUserRepository.findByRfc).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});