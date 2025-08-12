import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { CreateUserUseCase } from '../create-user.use-case';
import { UserRepository } from '@domain/user/ports/user.repository.port';
import { User } from '@domain/user/entity/user.entity';
import { HashingService } from '@domain/@shared/ports/hashing.service.port';
import { RFCValidator } from '@domain/@shared/ports/rfc.validator.port';
import { UUIDValidator } from '@domain/@shared/ports/uuid.validator.port';
import { EmailAddress } from '@domain/user/value-objects/email-address.value-object';
import { AlreadyValueExistError } from '@domain/user/errors/already-value-exist.error';
import { DataAccessError } from '@infrastructure/database/errors/data-access.error';
import { ServiceUnavailableError } from '@shared/errors/service-unavailable.error';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { PhoneNumber } from '@domain/user/value-objects/phone-number.value-object';
import { BusinessRole } from '@domain/user/user.types';

// const mockUserInstance = {
//     getRfc: vi.fn().mockReturnValue({ getValue: () => createUserDto.rfc }),
//     getPhoneNumber: vi.fn().mockReturnValue({ getValue: () => createUserDto.phoneNumber }),
//     getId: vi.fn().mockReturnValue({ getValue: () => createUserDto.id }),
//     getEmail: vi.fn().mockReturnValue({ getValue: () => createUserDto.email }),
//     getRoles: vi.fn().mockReturnValue(createUserDto.roles),
// };



// vi.mock('@domain/user/entity/user.entity', () => ({
//     User: vi.fn().mockImplementation((props) => {
//         // Basic validation checks inside mock to simulate entity behavior
//         if (!props.email) throw new Error('Email is required');
//         if (!props.name) throw new Error('Name is required');
//         if (!props.lastName) throw new Error('Last name is required');
//         if (props.roles.includes('OWNER') && !props.address) throw new Error('Address is required for Owner role');


//         return mockUserInstance;
//     }),
// }));
// vi.mock('@domain/user/value-objects/password.value-object', () => ({
//     Password: {
//         create: vi.fn().mockImplementation(async (raw, hasher) => {
//             if (!raw || raw.length < 8) throw new Error('Password too short');
//             const hashed = await hasher.hash(raw);
//             return { getHashedValue: () => hashed };
//         }),
//     },
// }));
// vi.mock('@domain/user/value-objects/email-address.value-object', () => ({
//     EmailAddress: {
//         create: vi.fn().mockImplementation((email) => {
//             if (!email || !email.includes('@')) throw new Error('Invalid email format');
//             return { getValue: () => email };
//         }),
//     },
// }));
// vi.mock('@domain/@shared/value-objects/rfc.value-object', () => ({
//     RFC: {
//         create: vi.fn().mockImplementation((rfc, validator) => {
//             if (rfc && !validator.validate(rfc)) throw new Error('Invalid RFC');
//             return { getValue: () => rfc };
//         }),
//     },
// }));
// vi.mock('@domain/user/value-objects/phone-number.value-object', () => ({
//     PhoneNumber: {
//         create: vi.fn().mockImplementation((phoneNumber) => {
//             return { getValue: () => phoneNumber };
//         }),
//     },
// }));
// vi.mock('@shared/utils/password-generator', () => ({
//     generateRandomPassword: vi.fn().mockReturnValue('randomsecurepassword1!'),
// }));
// vi.mock('@domain/@shared/value-objects/uuid.value-object', () => ({
//     UUID: {
//         create: vi.fn().mockImplementation((id, validator) => {
//             if (id && !validator.validate(id)) throw new Error('Invalid UUID');
//             return { getValue: () => id };
//         }),
//     },
// }));

describe('CreateUserUseCase', () => {
    let userRepository: UserRepository;
    let createUserUseCase: CreateUserUseCase;
    let hashingService: HashingService;
    let validateRfc: RFCValidator;
    let validateUUID: UUIDValidator;

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
        validateRfc = {
            validate: vi.fn(),
        };
        validateUUID = {
            validate: vi.fn(),
        };
        createUserUseCase = new CreateUserUseCase(userRepository);
    });

    it.only('should create a user successfully', async () => {
        const createUserDto = {
            id: 'generated-uuid',
            email: 'test@example.com',
            password: 'leq,O24@#yZ1',
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
        (validateRfc.validate as Mock).mockReturnValue(true);
        (validateUUID.validate as Mock).mockReturnValue(true);
        (userRepository.isRfcUnique as Mock).mockResolvedValue(true);
        (userRepository.isPhoneNumberUnique as Mock).mockResolvedValue(true);
        (userRepository.create as Mock).mockResolvedValue(undefined); 

        // Mock the User constructor and its methods
        const createdUser = await createUserUseCase.execute(createUserDto, hashingService, validateRfc, validateUUID);

        expect(userRepository.isEmailUnique).toHaveBeenCalledWith(expect.any(EmailAddress));
        expect(hashingService.hash).toHaveBeenCalledWith('leq,O24@#yZ1');
        // expect(User).toHaveBeenCalledWith(expect.objectContaining({
        //     email: createUserDto.email, // Expecting the string input here
        //     name: createUserDto.name,
        //     lastName: createUserDto.lastName,
        //     rfc: createUserDto.rfc, // Expecting the string input here
        //     id: createUserDto.id,
        // }));
        expect(userRepository.isRfcUnique).toHaveBeenCalledWith(expect.any(RFC));
        expect(userRepository.isPhoneNumberUnique).toHaveBeenCalledWith(expect.any(PhoneNumber));
        expect(userRepository.create).toHaveBeenCalledWith(createdUser);
        expect(createdUser).toBe(createdUser);
    });

    // it('should throw an error if user with the same email already exists', async () => {
    //     const createUserDto = {
    //         id: 'some-uuid',
    //         email: 'existing@example.com',
    //         password: 'password123',
    //         name: 'John',
    //         lastName: 'Doe',
    //         roles: ['user'],
    //         isAdmin: false,
    //     };

    //     (userRepository.isEmailUnique as vi.Mock).mockResolvedValue(false);
    //     (hashingService.hash as vi.Mock).mockResolvedValue('hashed');
    //     (validateRfc.isValid as vi.Mock).mockReturnValue(true);
    //     (validateUUID.isValid as vi.Mock).mockReturnValue(true);

    //     await expect(createUserUseCase.execute(createUserDto, hashingService, validateRfc, validateUUID)).rejects.toThrow(AlreadyValueExistError);
    //     await expect(createUserUseCase.execute(createUserDto, hashingService, validateRfc, validateUUID)).rejects.toThrow('Email already exists');
    //     expect(userRepository.isEmailUnique).toHaveBeenCalledWith(expect.any(EmailAddress));
    //     expect(userRepository.create).not.toHaveBeenCalled();
    // });

    // it('should throw AlreadyValueExistError if RFC is not unique', async () => {
    //     const createUserDto = {
    //         id: 'some-uuid',
    //         email: 'test@example.com',
    //         password: 'password123',
    //         name: 'John',
    //         lastName: 'Doe',
    //         roles: ['OWNER'], // RFC is required for OWNER
    //         rfc: 'EXISTINGRFC',
    //         isAdmin: false,
    //         address: '123 Main St',
    //     };
    //     const hashedPassword = 'hashed-password';

    //     (userRepository.isEmailUnique as vi.Mock).mockResolvedValue(true);
    //     (hashingService.hash as vi.Mock).mockResolvedValue(hashedPassword);
    //     (validateRfc.isValid as vi.Mock).mockReturnValue(true);
    //     (validateUUID.isValid as vi.Mock).mockReturnValue(true);
    //     (userRepository.isRfcUnique as vi.Mock).mockResolvedValue(false); // RFC is not unique
    //     (userRepository.isPhoneNumberUnique as vi.Mock).mockResolvedValue(true); // Phone number is unique

    //     // Mock the User constructor and its methods
    //     const mockUserInstance = {
    //         getRfc: vi.fn().mockReturnValue({ getValue: () => createUserDto.rfc }),
    //         getPhoneNumber: vi.fn().mockReturnValue(undefined), // No phone number for this test
    //         getId: vi.fn().mockReturnValue({ getValue: () => createUserDto.id }),
    //         getEmail: vi.fn().mockReturnValue({ getValue: () => createUserDto.email }),
    //         getRoles: vi.fn().mockReturnValue(createUserDto.roles),
    //     };
    //     vi.mock('@domain/user/entity/user.entity', () => ({
    //         User: vi.fn().mockImplementation((props, rfcValidator, uuidValidator) => {
    //             if (!props.email) throw new Error('Email is required');
    //             if (!props.name) throw new Error('Name is required');
    //             if (!props.lastName) throw new Error('Last name is required');
    //             if (props.roles.includes('OWNER') && !props.address) throw new Error('Address is required for Owner role');
    //             if (props.rfc && !rfcValidator.isValid(props.rfc)) throw new Error('Invalid RFC');
    //             if (props.id && !uuidValidator.isValid(props.id)) throw new Error('Invalid UUID');
    //             return mockUserInstance;
    //         }),
    //     }));
    //     vi.mock('@domain/user/value-objects/password.value-object', () => ({
    //         Password: {
    //             create: vi.fn().mockImplementation(async (raw, hasher) => {
    //                 const hashed = await hasher.hash(raw);
    //                 return { getHashedValue: () => hashed };
    //             }),
    //         },
    //     }));
    //     vi.mock('@domain/user/value-objects/email-address.value-object', () => ({
    //         EmailAddress: {
    //             create: vi.fn().mockImplementation((email) => {
    //                 return { getValue: () => email };
    //             }),
    //         },
    //     }));
    //     vi.mock('@domain/@shared/value-objects/rfc.value-object', () => ({
    //         RFC: {
    //             create: vi.fn().mockImplementation((rfc, validator) => {
    //                 if (rfc && !validator.isValid(rfc)) throw new Error('Invalid RFC');
    //                 return { getValue: () => rfc };
    //             }),
    //         },
    //     }));
    //     vi.mock('@domain/user/value-objects/phone-number.value-object', () => ({
    //         PhoneNumber: {
    //             create: vi.fn().mockImplementation((phoneNumber) => {
    //                 return { getValue: () => phoneNumber };
    //             }),
    //         },
    //     }));
    //     vi.mock('@shared/utils/password-generator', () => ({
    //         generateRandomPassword: vi.fn().mockReturnValue('randomsecurepassword1!'),
    //     }));
    //     vi.mock('@domain/@shared/value-objects/uuid.value-object', () => ({
    //         UUID: {
    //             create: vi.fn().mockImplementation((id, validator) => {
    //                 if (id && !validator.isValid(id)) throw new Error('Invalid UUID');
    //                 return { getValue: () => id };
    //             }),
    //         },
    //     }));

    //     await expect(createUserUseCase.execute(createUserDto, hashingService, validateRfc, validateUUID)).rejects.toThrow(AlreadyValueExistError);
    //     await expect(createUserUseCase.execute(createUserDto, hashingService, validateRfc, validateUUID)).rejects.toThrow('EXISTINGRFC already exists');
    //     expect(userRepository.isRfcUnique).toHaveBeenCalledWith(expect.any(RFC));
    //     expect(userRepository.create).not.toHaveBeenCalled();
    // });

    // it('should throw AlreadyValueExistError if Phone Number is not unique', async () => {
    //     const createUserDto = {
    //         id: 'some-uuid',
    //         email: 'test@example.com',
    //         password: 'password123',
    //         name: 'John',
    //         lastName: 'Doe',
    //         roles: ['TENANT'], // Phone Number might be required for TENANT depending on your rules
    //         phoneNumber: 'EXISTINGPHONE',
    //         isAdmin: false,
    //     };
    //     const hashedPassword = 'hashed-password';

    //     (userRepository.isEmailUnique as vi.Mock).mockResolvedValue(true);
    //     (hashingService.hash as vi.Mock).mockResolvedValue(hashedPassword);
    //     (validateRfc.isValid as vi.Mock).mockReturnValue(true);
    //     (validateUUID.isValid as vi.Mock).mockReturnValue(true);
    //     (userRepository.isRfcUnique as vi.Mock).mockResolvedValue(true); // RFC is unique
    //     (userRepository.isPhoneNumberUnique as vi.Mock).mockResolvedValue(false); // Phone number is not unique

    //     // Mock the User constructor and its methods
    //     const mockUserInstance = {
    //         getRfc: vi.fn().mockReturnValue(undefined), // No RFC for this test
    //         getPhoneNumber: vi.fn().mockReturnValue({ getValue: () => createUserDto.phoneNumber }),
    //         getId: vi.fn().mockReturnValue({ getValue: () => createUserDto.id }),
    //         getEmail: vi.fn().mockReturnValue({ getValue: () => createUserDto.email }),
    //         getRoles: vi.fn().mockReturnValue(createUserDto.roles),
    //     };
    //     vi.mock('@domain/user/entity/user.entity', () => ({
    //         User: vi.fn().mockImplementation((props, rfcValidator, uuidValidator) => {
    //             if (!props.email) throw new Error('Email is required');
    //             if (!props.name) throw new Error('Name is required');
    //             if (!props.lastName) throw new Error('Last name is required');
    //             if (props.roles.includes('OWNER') && !props.address) throw new Error('Address is required for Owner role');
    //             if (props.rfc && !rfcValidator.isValid(props.rfc)) throw new Error('Invalid RFC');
    //             if (props.id && !uuidValidator.isValid(props.id)) throw new Error('Invalid UUID');
    //             return mockUserInstance;
    //         }),
    //     }));
    //     vi.mock('@domain/user/value-objects/password.value-object', () => ({
    //         Password: {
    //             create: vi.fn().mockImplementation(async (raw, hasher) => {
    //                 const hashed = await hasher.hash(raw);
    //                 return { getHashedValue: () => hashed };
    //             }),
    //         },
    //     }));
    //     vi.mock('@domain/user/value-objects/email-address.value-object', () => ({
    //         EmailAddress: {
    //             create: vi.fn().mockImplementation((email) => {
    //                 return { getValue: () => email };
    //             }),
    //         },
    //     }));
    //     vi.mock('@domain/@shared/value-objects/rfc.value-object', () => ({
    //         RFC: {
    //             create: vi.fn().mockImplementation((rfc, validator) => {
    //                 if (rfc && !validator.isValid(rfc)) throw new Error('Invalid RFC');
    //                 return { getValue: () => rfc };
    //             }),
    //         },
    //     }));
    //     vi.mock('@domain/user/value-objects/phone-number.value-object', () => ({
    //         PhoneNumber: {
    //             create: vi.fn().mockImplementation((phoneNumber) => {
    //                 return { getValue: () => phoneNumber };
    //             }),
    //         },
    //     }));
    //     vi.mock('@shared/utils/password-generator', () => ({
    //         generateRandomPassword: vi.fn().mockReturnValue('randomsecurepassword1!'),
    //     }));
    //     vi.mock('@domain/@shared/value-objects/uuid.value-object', () => ({
    //         UUID: {
    //             create: vi.fn().mockImplementation((id, validator) => {
    //                 if (id && !validator.isValid(id)) throw new Error('Invalid UUID');
    //                 return { getValue: () => id };
    //             }),
    //         },
    //     }));

    //     await expect(createUserUseCase.execute(createUserDto, hashingService, validateRfc, validateUUID)).rejects.toThrow(AlreadyValueExistError);
    //     await expect(createUserUseCase.execute(createUserDto, hashingService, validateRfc, validateUUID)).rejects.toThrow('EXISTINGPHONE already exists');
    //     expect(userRepository.isPhoneNumberUnique).toHaveBeenCalledWith(expect.any(PhoneNumber));
    //     expect(userRepository.create).not.toHaveBeenCalled();
    // });

    // it('should throw ServiceUnavailableError if DataAccessError occurs during uniqueness check', async () => {
    //     const createUserDto = {
    //         id: 'some-uuid',
    //         email: 'test@example.com',
    //         password: 'password123',
    //         name: 'John',
    //         lastName: 'Doe',
    //         roles: ['user'],
    //         phoneNumber: '1234567890',
    //         isAdmin: false,
    //     };
    //     const hashedPassword = 'hashed-password';

    //     (userRepository.isEmailUnique as vi.Mock).mockResolvedValue(true);
    //     (hashingService.hash as vi.Mock).mockResolvedValue(hashedPassword);
    //     (validateRfc.isValid as vi.Mock).mockReturnValue(true);
    //     (validateUUID.isValid as vi.Mock).mockReturnValue(true);
    //     (userRepository.isRfcUnique as vi.Mock).mockResolvedValue(true);
    //     (userRepository.isPhoneNumberUnique as vi.Mock).mockRejectedValue(new DataAccessError('Database connection failed')); // Simulate data access error

    //     // Mock the User constructor and its methods
    //     const mockUserInstance = {
    //         getRfc: vi.fn().mockReturnValue(undefined),
    //         getPhoneNumber: vi.fn().mockReturnValue({ getValue: () => createUserDto.phoneNumber }),
    //         getId: vi.fn().mockReturnValue({ getValue: () => createUserDto.id }),
    //         getEmail: vi.fn().mockReturnValue({ getValue: () => createUserDto.email }),
    //         getRoles: vi.fn().mockReturnValue(createUserDto.roles),
    //     };
    //     vi.mock('@domain/user/entity/user.entity', () => ({
    //         User: vi.fn().mockImplementation((props, rfcValidator, uuidValidator) => {
    //             if (!props.email) throw new Error('Email is required');
    //             if (!props.name) throw new Error('Name is required');
    //             if (!props.lastName) throw new Error('Last name is required');
    //             if (props.roles.includes('OWNER') && !props.address) throw new Error('Address is required for Owner role');
    //             if (props.rfc && !rfcValidator.isValid(props.rfc)) throw new Error('Invalid RFC');
    //             if (props.id && !uuidValidator.isValid(props.id)) throw new Error('Invalid UUID');
    //             return mockUserInstance;
    //         }),
    //     }));
    //     vi.mock('@domain/user/value-objects/password.value-object', () => ({
    //         Password: {
    //             create: vi.fn().mockImplementation(async (raw, hasher) => {
    //                 const hashed = await hasher.hash(raw);
    //                 return { getHashedValue: () => hashed };
    //             }),
    //         },
    //     }));
    //     vi.mock('@domain/user/value-objects/email-address.value-object', () => ({
    //         EmailAddress: {
    //             create: vi.fn().mockImplementation((email) => {
    //                 return { getValue: () => email };
    //             }),
    //         },
    //     }));
    //     vi.mock('@domain/@shared/value-objects/rfc.value-object', () => ({
    //         RFC: {
    //             create: vi.fn().mockImplementation((rfc, validator) => {
    //                 if (rfc && !validator.isValid(rfc)) throw new Error('Invalid RFC');
    //                 return { getValue: () => rfc };
    //             }),
    //         },
    //     }));
    //     vi.mock('@domain/user/value-objects/phone-number.value-object', () => ({
    //         PhoneNumber: {
    //             create: vi.fn().mockImplementation((phoneNumber) => {
    //                 return { getValue: () => phoneNumber };
    //             }),
    //         },
    //     }));
    //     vi.mock('@shared/utils/password-generator', () => ({
    //         generateRandomPassword: vi.fn().mockReturnValue('randomsecurepassword1!'),
    //     }));
    //     vi.mock('@domain/@shared/value-objects/uuid.value-object', () => ({
    //         UUID: {
    //             create: vi.fn().mockImplementation((id, validator) => {
    //                 if (id && !validator.isValid(id)) throw new Error('Invalid UUID');
    //                 return { getValue: () => id };
    //             }),
    //         },
    //     }));

    //     await expect(createUserUseCase.execute(createUserDto, hashingService, validateRfc, validateUUID)).rejects.toThrow(ServiceUnavailableError);
    //     await expect(createUserUseCase.execute(createUserDto, hashingService, validateRfc, validateUUID)).rejects.toThrow('Imposible check unique values');
    //     expect(userRepository.isPhoneNumberUnique).toHaveBeenCalledWith(expect.any(PhoneNumber));
    //     // The console.error in validateUniqueValue should be called
    //     expect(console.error).toHaveBeenCalled();
    //     expect(userRepository.create).not.toHaveBeenCalled();
    // });

    // it('should re-throw other unexpected errors during uniqueness check', async () => {
    //     const createUserDto = {
    //         id: 'some-uuid',
    //         email: 'test@example.com',
    //         password: 'password123',
    //         name: 'John',
    //         lastName: 'Doe',
    //         roles: ['user'],
    //         phoneNumber: '1234567890',
    //         isAdmin: false,
    //     };
    //     const hashedPassword = 'hashed-password';
    //     const unexpectedError = new Error('Something unexpected happened');

    //     (userRepository.isEmailUnique as vi.Mock).mockResolvedValue(true);
    //     (hashingService.hash as vi.Mock).mockResolvedValue(hashedPassword);
    //     (validateRfc.isValid as vi.Mock).mockReturnValue(true);
    //     (validateUUID.isValid as vi.Mock).mockReturnValue(true);
    //     (userRepository.isRfcUnique as vi.Mock).mockResolvedValue(true);
    //     (userRepository.isPhoneNumberUnique as vi.Mock).mockRejectedValue(unexpectedError); // Simulate unexpected error

    //     // Mock the User constructor and its methods
    //     const mockUserInstance = {
    //         getRfc: vi.fn().mockReturnValue(undefined),
    //         getPhoneNumber: vi.fn().mockReturnValue({ getValue: () => createUserDto.phoneNumber }),
    //         getId: vi.fn().mockReturnValue({ getValue: () => createUserDto.id }),
    //         getEmail: vi.fn().mockReturnValue({ getValue: () => createUserDto.email }),
    //         getRoles: vi.fn().mockReturnValue(createUserDto.roles),
    //     };
    //     vi.mock('@domain/user/entity/user.entity', () => ({
    //         User: vi.fn().mockImplementation((props, rfcValidator, uuidValidator) => {
    //             if (!props.email) throw new Error('Email is required');
    //             if (!props.name) throw new Error('Name is required');
    //             if (!props.lastName) throw new Error('Last name is required');
    //             if (props.roles.includes('OWNER') && !props.address) throw new Error('Address is required for Owner role');
    //             if (props.rfc && !rfcValidator.isValid(props.rfc)) throw new Error('Invalid RFC');
    //             if (props.id && !uuidValidator.isValid(props.id)) throw new Error('Invalid UUID');
    //             return mockUserInstance;
    //         }),
    //     }));
    //     vi.mock('@domain/user/value-objects/password.value-object', () => ({
    //         Password: {
    //             create: vi.fn().mockImplementation(async (raw, hasher) => {
    //                 const hashed = await hasher.hash(raw);
    //                 return { getHashedValue: () => hashed };
    //             }),
    //         },
    //     }));
    //     vi.mock('@domain/user/value-objects/email-address.value-object', () => ({
    //         EmailAddress: {
    //             create: vi.fn().mockImplementation((email) => {
    //                 return { getValue: () => email };
    //             }),
    //         },
    //     }));
    //     vi.mock('@domain/@shared/value-objects/rfc.value-object', () => ({
    //         RFC: {
    //             create: vi.fn().mockImplementation((rfc, validator) => {
    //                 if (rfc && !validator.isValid(rfc)) throw new Error('Invalid RFC');
    //                 return { getValue: () => rfc };
    //             }),
    //         },
    //     }));
    //     vi.mock('@domain/user/value-objects/phone-number.value-object', () => ({
    //         PhoneNumber: {
    //             create: vi.fn().mockImplementation((phoneNumber) => {
    //                 return { getValue: () => phoneNumber };
    //             }),
    //         },
    //     }));
    //     vi.mock('@shared/utils/password-generator', () => ({
    //         generateRandomPassword: vi.fn().mockReturnValue('randomsecurepassword1!'),
    //     }));
    //     vi.mock('@domain/@shared/value-objects/uuid.value-object', () => ({
    //         UUID: {
    //             create: vi.fn().mockImplementation((id, validator) => {
    //                 console.log("HELLO", validator)
    //                 if (id && !validator.isValid(id)) throw new Error('Invalid UUID');
    //                 return { getValue: () => id };
    //             }),
    //         },
    //     }));

    //     await expect(createUserUseCase.execute(createUserDto, hashingService, validateRfc, validateUUID)).rejects.toThrow(unexpectedError);
    //     expect(userRepository.isPhoneNumberUnique).toHaveBeenCalledWith(expect.any(PhoneNumber));
    //     // The console.error in validateUniqueValue should be called
    //     expect(console.error).toHaveBeenCalled();
    //     expect(userRepository.create).not.toHaveBeenCalled();
    // });

});