import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { UserResolver } from '../user.resolver';
import { CreateUserUseCase } from '@application/user/use-cases/create-user.use-case';
import { CreateUserInput } from '@infrastructure/graphql/dtos/user.graphql.dtos';
import { v4 as uuidv4 } from 'uuid';
import {
  AlreadyValueExistError,
  AdminCannotHaveBusinessRolesError,
} from '@domain/user/errors';
import { ServiceUnavailableError } from '@shared/errors/service-unavailable.error';
import {
  BadRequestException,
  ConflictException,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@domain/user/entity/user.entity';
import { EmailAddress } from '@domain/user/value-objects/email-address.value-object';
import { Password } from '@domain/user/value-objects/password.value-object';
import { PhoneNumber } from '@domain/user/value-objects/phone-number.value-object';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { UuidValidatorPort } from '@domain/@shared/ports/uuid.validator.port';
import { RFCValidatorPort } from '@domain/@shared/ports/rfc.validator.port';
import { HashingService } from '@domain/@shared/ports/hashing.service.port';
import { AccountStatus, BusinessRole } from '@domain/user/user.types';

const mockCreateUserUseCase = {
  execute: vi.fn(),
};

describe('UserResolver', () => {
  let resolver: UserResolver;
  let createUserUseCase: CreateUserUseCase;

  const mockUuidValidator: UuidValidatorPort = { validate: vi.fn().mockReturnValue(true) };
  const mockRfcValidator: RFCValidatorPort = { validate: vi.fn().mockReturnValue(true) };
  const mockHashingService: HashingService = {
    hash: vi.fn().mockResolvedValue('hashedpassword'),
    compare: vi.fn().mockResolvedValue(true),
  };

  beforeAll(() => {
    UUID.registerValidator(mockUuidValidator);
    RFC.registerValidator(mockRfcValidator);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    createUserUseCase = {
      execute: vi.fn(),
    } as unknown as CreateUserUseCase;
    resolver = new UserResolver(createUserUseCase);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const input: CreateUserInput = {
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        isAdmin: false,
        roles: [BusinessRole.TENANT],
      };

      const userEntity = new User({
        id: UUID.create(uuidv4()),
        email: EmailAddress.create('test@example.com'),
        password: await Password.create('password123!', mockHashingService),
        name: 'Test',
        lastName: 'User',
        isAdmin: false,
        roles: [BusinessRole.TENANT],
        status: AccountStatus.ACTIVE,
        phoneNumber: PhoneNumber.create('1234567890'),
        address: '123 Main St',
        rfc: RFC.create('XAXX010101000'),
      });

      vi.spyOn(createUserUseCase, 'execute').mockResolvedValue(userEntity);

      const result = await resolver.createUser(input);

      expect(createUserUseCase.execute).toHaveBeenCalled();
      expect(result.email).toBe(input.email);
    });

    it('should throw ConflictException if user already exists', async () => {
      const input: CreateUserInput = {
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        roles: [BusinessRole.TENANT],
      };

      vi.spyOn(createUserUseCase, 'execute').mockRejectedValue(
        new AlreadyValueExistError('email', 'test@example.com'),
      );

      await expect(resolver.createUser(input)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ServiceUnavailableException on service error', async () => {
        const input: CreateUserInput = {
            email: 'test@example.com',
            name: 'Test',
            lastName: 'User',
            roles: [BusinessRole.TENANT],
          };

      vi.spyOn(createUserUseCase, 'execute').mockRejectedValue(
        new ServiceUnavailableError(''),
      );

      await expect(resolver.createUser(input)).rejects.toThrow(
        ServiceUnavailableException,
      );
    });

    it('should throw BadRequestException on validation error', async () => {
        const input: CreateUserInput = {
            email: 'test@example.com',
            name: 'Test',
            lastName: 'User',
            roles: [BusinessRole.TENANT],
          };

      vi.spyOn(createUserUseCase, 'execute').mockRejectedValue(
        new AdminCannotHaveBusinessRolesError(),
      );

      await expect(resolver.createUser(input)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
        const input: CreateUserInput = {
            email: 'test@example.com',
            name: 'Test',
            lastName: 'User',
            roles: [BusinessRole.TENANT],
          };

      vi.spyOn(createUserUseCase, 'execute').mockRejectedValue(new Error(''));

      await expect(resolver.createUser(input)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});