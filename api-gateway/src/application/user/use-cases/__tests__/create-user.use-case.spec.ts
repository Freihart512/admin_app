import { describe, it, expect, vi, beforeEach, beforeAll, afterAll, Mock } from 'vitest';
import { CreateUserUseCase } from '../create-user.use-case';
import { UserRepository } from '@domain/user/ports/user.repository.port';
import { User } from '@domain/user/entity/user.entity';
import { HashingService } from '@domain/@shared/ports/hashing.service.port';
import { RFCValidatorPort } from '@domain/@shared/ports/rfc.validator.port';
import { UuidValidatorPort } from '@domain/@shared/ports/uuid.validator.port';
import { EmailAddress } from '@domain/user/value-objects/email-address.value-object';
import { AlreadyValueExistError } from '@domain/user/errors/already-value-exist.error';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { PhoneNumber } from '@domain/user/value-objects/phone-number.value-object';
import { BusinessRole } from '@domain/user/user.types';
import { Password } from '@domain/user/value-objects/password.value-object';

describe('CreateUserUseCase', () => {
    let userRepository: UserRepository;
    let createUserUseCase: CreateUserUseCase;
    let hashingService: HashingService;

    const mockUuidValidator: UuidValidatorPort = { validate: vi.fn().mockReturnValue(true) };
    const mockRfcValidator: RFCValidatorPort = { validate: vi.fn().mockReturnValue(true) };

    beforeAll(() => {
        UUID.registerValidator(mockUuidValidator);
        RFC.registerValidator(mockRfcValidator);
    });

    beforeEach(() => {
        userRepository = {
            create: vi.fn(),
            isEmailUnique: vi.fn(),
            isPhoneNumberUnique: vi.fn(),
            isRfcUnique: vi.fn(),
        };
        hashingService = {
            hash: vi.fn(),
            compare: vi.fn(),
        };
        createUserUseCase = new CreateUserUseCase(userRepository, hashingService);
    });

    it('should create a user successfully', async () => {
        const createUserDto = {
            id: 'generated-uuid',
            email: 'test@example.com',
            name: 'John',
            lastName: 'Doe',
            roles: [BusinessRole.OWNER],
            rfc: 'GODE561231GR8',
            phoneNumber: '1234567890',
            address: '123 Main St',
            isAdmin: false,
        };
        const hashedPassword = 'hashed-password';

        (userRepository.isEmailUnique as Mock).mockResolvedValue(true);
        (hashingService.hash as Mock).mockResolvedValue(hashedPassword);
        (userRepository.isRfcUnique as Mock).mockResolvedValue(true);
        (userRepository.isPhoneNumberUnique as Mock).mockResolvedValue(true);
        (userRepository.create as Mock).mockResolvedValue(undefined); 

        vi.spyOn(Password, 'create').mockResolvedValue({ getHashedValue: () => hashedPassword } as any);

        const createdUser = await createUserUseCase.execute(createUserDto);

        expect(userRepository.isEmailUnique).toHaveBeenCalledWith(expect.any(EmailAddress));
        expect(userRepository.isRfcUnique).toHaveBeenCalledWith(expect.any(RFC));
        expect(userRepository.isPhoneNumberUnique).toHaveBeenCalledWith(expect.any(PhoneNumber));
        expect(userRepository.create).toHaveBeenCalledWith(expect.any(User));
        expect(createdUser).toBeInstanceOf(User);
    });
});