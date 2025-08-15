import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateUserUseCase } from '../create-user.use-case';
import type { UserRepository } from '@domain/user/ports/user.repository.port';
import type { PasswordGeneratorPort } from '@domain/@shared/ports/password-generator.port';
import type { ErrorMapperPort } from '@domain/@shared/ports/error-mapper.port';
import { User } from '@domain/user/entity/user.entity';
import { EmailAddress } from '@domain/user/value-objects/email-address.value-object';
import { PhoneNumber } from '@domain/user/value-objects/phone-number.value-object';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { Password } from '@domain/user/value-objects/password.value-object';
import { AlreadyValueExistError } from '@domain/user/errors/already-value-exist.error';
import { BusinessRole } from '@domain/user/user.types';
import { CreateUserDto } from '@application/user/dtos';

/**
 * Unit tests for the {@link CreateUserUseCase} class.  These tests
 * construct the use case with stubbed dependencies that mimic the
 * behaviours of the repository, password generator and error
 * mapper.  The success case verifies that the use case delegates
 * uniqueness checks and persistence to the repository and produces
 * a {@link User} domain entity.  A failure case asserts that the
 * appropriate domain error is thrown when the email uniqueness
 * constraint fails.
 */
describe('CreateUserUseCase', () => {
  let userRepository: UserRepository;
  let passwordGenerator: PasswordGeneratorPort;
  let errorMapper: ErrorMapperPort;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    // Stub repository methods
    userRepository = {
      create: vi.fn(),
      isEmailUnique: vi.fn(),
      isPhoneNumberUnique: vi.fn(),
      isRfcUnique: vi.fn(),
    } as unknown as UserRepository;
    // Stub password generator to return a deterministic raw password
    passwordGenerator = {
      getRandomPassword: vi.fn().mockReturnValue('rawPassword123!'),
    } as PasswordGeneratorPort;
    // Stub error mapper to simply return the underlying promise
    errorMapper = {
      wrap: <T>(promise: Promise<T>): Promise<T> => promise,
      map: vi.fn((): never => {
        throw new Error('should not be called');
      }),
    } as unknown as ErrorMapperPort;

    useCase = new CreateUserUseCase(
      userRepository,
      passwordGenerator,
      errorMapper,
    );

    // Spy on Password.create to avoid needing a hashing service.  The
    // returned object implements the minimal interface required by the
    // User entity (getHashedValue).  Note that Password.create is
    // asynchronous, so we mockResolvedValue here.
    vi.spyOn(Password, 'create').mockResolvedValue({
      getHashedValue: () => 'hashedPassword123!',
    } as any);

    // Register dummy validators to satisfy UUID and RFC value objects
    UUID.registerValidator({ validate: vi.fn().mockReturnValue(true) });
    RFC.registerValidator({ validate: vi.fn().mockReturnValue(true) });
  });

  it('creates a user successfully when all uniqueness checks pass', async () => {
    const dto: CreateUserDto = {
      id: 'test-id-1234',
      email: 'test@example.com',
      name: 'Test',
      lastName: 'User',
      roles: [BusinessRole.OWNER],
      rfc: 'GODE561231GR8',
      phoneNumber: '1234567890',
      address: 'Some Address',
      isAdmin: false,
    };
    // All uniqueness checks succeed
    (userRepository.isEmailUnique as any).mockResolvedValue(true);
    (userRepository.isRfcUnique as any).mockResolvedValue(true);
    (userRepository.isPhoneNumberUnique as any).mockResolvedValue(true);
    (userRepository.create as any).mockResolvedValue(undefined);

    const result = await useCase.execute(dto);

    // Expect repository methods to be called with value objects
    expect(userRepository.isEmailUnique).toHaveBeenCalledWith(
      expect.any(EmailAddress),
    );
    expect(userRepository.isRfcUnique).toHaveBeenCalledWith(expect.any(RFC));
    expect(userRepository.isPhoneNumberUnique).toHaveBeenCalledWith(
      expect.any(PhoneNumber),
    );
    expect(userRepository.create).toHaveBeenCalledWith(expect.any(User));
    expect(result).toBeInstanceOf(User);
  });

  it('throws AlreadyValueExistError when email is not unique', async () => {
    const dto: CreateUserDto = {
      id: 'test-id-dup',
      email: 'duplicate@example.com',
      name: 'Dup',
      lastName: 'User',
      roles: [],
      isAdmin: false,
    };
    (userRepository.isEmailUnique as any).mockResolvedValue(false);

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(
      AlreadyValueExistError,
    );
  });

  it('throws AlreadyValueExistError when rfc is not unique', async () => {
    const dto: CreateUserDto = {
      id: 'test-id-rfc-dup',
      email: 'test.rfc@example.com',
      name: 'Test',
      lastName: 'User',
      roles: [BusinessRole.OWNER],
      rfc: 'DUPL123123GR8',
      address: 'Some Address',
      isAdmin: false,
    };
    (userRepository.isEmailUnique as any).mockResolvedValue(true);
    (userRepository.isRfcUnique as any).mockResolvedValue(false);

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(
      AlreadyValueExistError,
    );
  });

  it('throws AlreadyValueExistError when phone number is not unique', async () => {
    const dto: CreateUserDto = {
      id: 'test-id-phone-dup',
      email: 'test.phone@example.com',
      name: 'Test',
      lastName: 'User',
      roles: [BusinessRole.OWNER],
      phoneNumber: '0987654321',
      address: 'Some Address',
      isAdmin: false,
    };
    (userRepository.isEmailUnique as any).mockResolvedValue(true);
    (userRepository.isPhoneNumberUnique as any).mockResolvedValue(false);

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(
      AlreadyValueExistError,
    );
  });

  it('creates a user successfully without optional fields', async () => {
    const dto: CreateUserDto = {
      id: 'test-id-no-optional',
      email: 'no-optional@example.com',
      name: 'No',
      lastName: 'Optional',
      roles: [],
      isAdmin: false,
    };
    (userRepository.isEmailUnique as any).mockResolvedValue(true);
    (userRepository.create as any).mockResolvedValue(undefined);

    const result = await useCase.execute(dto);

    expect(userRepository.isEmailUnique).toHaveBeenCalledWith(
      expect.any(EmailAddress),
    );
    expect(userRepository.isRfcUnique).not.toHaveBeenCalled();
    expect(userRepository.isPhoneNumberUnique).not.toHaveBeenCalled();
    expect(userRepository.create).toHaveBeenCalledWith(expect.any(User));
    expect(result).toBeInstanceOf(User);
  });
});
