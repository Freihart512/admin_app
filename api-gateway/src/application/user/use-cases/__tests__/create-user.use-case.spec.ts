import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateUserUseCase } from '../../application/user/use-cases/create-user.usecase';
import { UserRepository } from '../../domain/user/user.repository';
import { User } from '../../domain/user/user';
import { UserSummary } from '../../domain/user/value-objects/user-summary';
import { AssignRoleUseCase } from '../../application/user/use-cases/assign-role.usecase';
import { RFC } from '../../domain/user/value-objects/rfc';
import { ManageUserRolesUseCase } from '../../application/user/use-cases/manage-user-roles.usecase';

describe('CreateUserUseCase', () => {
  let userRepository: UserRepository;
  let manageUserRolesUseCase: ManageUserRolesUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findAll: vi.fn(),
      findUsersWithRoles: vi.fn(),
    };
    manageUserRolesUseCase = new ManageUserRolesUseCase(userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository, manageUserRolesUseCase);
  });

  it('should create a user successfully', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      roles: ['user'],
      rfc: 'GODE561231GR8'
    };

    const mockUser = {
        id: 'test-id',
        email: { value: createUserDto.email },
        rfc: new RFC(createUserDto.rfc),
        // ... other user properties
    };

    vi.mock('../../domain/user/user', async (importOriginal) => {
        const original = await importOriginal();
        return {
            ...original,
            User: vi.fn().mockImplementation((props) => ({
                id: props.id || 'generated-id',
                email: { value: props.email },
                passwordHash: props.passwordHash,
                isAdmin: props.isAdmin,
                roles: props.roles,
                name: props.name,
                lastName: props.lastName,
                phoneNumber: props.phoneNumber,
                address: props.address,
                rfc: props.rfc ? new RFC(props.rfc) : null,
                status: props.status,
                audit: props.audit,
                validateRoleConsistency: vi.fn(),
                validateRequiredFields: vi.fn(),
                hasRole: vi.fn(),
                isActive: vi.fn(),
                markAsDeleted: vi.fn(),
                updateRoles: vi.fn(),
            })),
        })),
    }));
    vi.mock('../../domain/user/value-objects/user-summary', () => ({
        UserSummary: vi.fn().mockImplementation((id, email, firstName, lastName, roles) => ({
            id, email, firstName, lastName, roles
        }))
    }));


    (userRepository.findByEmail as vi.Mock).mockResolvedValue(null);
    (userRepository.create as vi.Mock).mockResolvedValue(mockUser);

    const userSummary = await createUserUseCase.execute(createUserDto);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
    expect(User).toHaveBeenCalledWith(expect.objectContaining({
      email: createUserDto.email, // Expecting the string input here
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      rfc: createUserDto.rfc, // Expecting the string input here
    }), createUserDto.password);
    expect(userSummary).toBeInstanceOf(UserSummary);
    expect(userSummary.email).toBe(createUserDto.email);
    expect(userSummary.firstName).toBe(createUserDto.firstName);
    expect(userSummary.lastName).toBe(createUserDto.lastName);
    expect(userSummary.roles).toEqual(['user']);
  });

  it('should throw an error if user with the same email already exists', async () => {
    const createUserDto = {
      email: 'existing@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      roles: ['user'],
    };

    const existingUser = new User('existing-id', createUserDto.email, 'hashedpassword', 'Existing', 'User', ['user']);
    (userRepository.findByEmail as vi.Mock).mockResolvedValue(existingUser);

    await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow('User with this email already exists');
    expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error for invalid roles during creation', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      roles: ['invalid_role'],
    };

    (userRepository.findByEmail as vi.Mock).mockResolvedValue(null);

    await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow('Invalid role(s) provided');
    expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if required fields are missing in the DTO', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: '', // Missing first name
      lastName: 'Doe',
      roles: ['user'],
    };

    await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow('First name is required');
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if email is invalid', async () => {
    const createUserDto = {
      email: 'invalid-email', // Invalid email format
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      roles: ['user'],
    };

    await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow('Invalid email format');
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});