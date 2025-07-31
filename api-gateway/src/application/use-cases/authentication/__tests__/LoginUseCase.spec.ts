import { LoginUseCase } from '../LoginUseCase';
import { PostgresUserRepository } from '../../../../infrastructure/database/repositories/PostgresUserRepository';
import { BCryptPasswordHasher } from '../../../../infrastructure/services/BCryptPasswordHasher';
import { IEventDispatcher } from '../../../../shared/events/IEventDispatcher';
import { JwtAuthTokenGenerator } from '../../../../infrastructure/services/JwtAuthTokenGenerator';
import { UserLoggedInEvent } from '../../../../shared/events/authentication/UserLoggedInEvent';
import { UserLoginFailedEvent } from '../../../../shared/events/authentication/UserLoginFailedEvent';
import { User } from '../../../../domain/entities/User';
import { InvalidCredentialsError } from '../../../../domain/errors/authentication/InvalidCredentialsError';
import { DatabaseError } from '../../../../infrastructure/errors/DatabaseError';
import { mockQuery, mockPool } from '../../../../testHelpers/globalMocks/pg';
import { mockCompare } from '../../../../testHelpers/globalMocks/bcrypt';
import { mockSign } from '../../../../testHelpers/globalMocks/jsonwebtoken';
import { Pool } from 'pg';

const mockEventDispatcher: IEventDispatcher = {
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  dispatch: vi.fn(),
};

describe('LoginUseCase (Component Integration Test - Mocking external libs)', () => {
  let loginUseCase: LoginUseCase;
  let userRepository: PostgresUserRepository;
  let passwordHasher: BCryptPasswordHasher;
  let authTokenGenerator: JwtAuthTokenGenerator;
  let eventDispatcher: IEventDispatcher;

  const testUser = new User(
    'user-id-123',
    'test@example.com',
    'Test',
    'User',
    undefined,
    undefined,
    undefined,
    ['Inquilino'],
    'hashed-password-of-test-user',
    true
  );

  const inactiveUser = new User(
    'user-id-456',
    'inactive@example.com',
    'Inactive',
    'User',
    undefined,
    undefined,
    undefined,
    ['Inquilino'],
    'hashed-password-of-inactive-user',
    false
  );

  beforeEach(() => {
    vi.clearAllMocks();

    userRepository = new PostgresUserRepository(mockPool as Pool);
    passwordHasher = new BCryptPasswordHasher();
    authTokenGenerator = new JwtAuthTokenGenerator('testsecret', '1h');
    eventDispatcher = mockEventDispatcher;

    loginUseCase = new LoginUseCase(
      userRepository,
      passwordHasher,
      authTokenGenerator,
      eventDispatcher
    );

    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
    mockCompare.mockResolvedValue(false);
    mockSign.mockReturnValue('default-mock-token');
  });

  it('should successfully log in an active user with valid credentials', async () => {
    mockQuery.mockResolvedValue({
      rows: [
        {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          last_name: testUser.lastName,
          phone_number: testUser.phoneNumber,
          address: testUser.address,
          rfc: testUser.rfc,
          roles: testUser.roles,
          password_hash: testUser.passwordHash,
          is_active: testUser.isActive,
        },
      ],
      rowCount: 1,
    });
    mockCompare.mockResolvedValue(true);

    const expectedToken = 'specific-mock-jwt-token';
    mockSign.mockReturnValue(expectedToken);

    const input = { email: testUser.email, password: 'validpassword123' };

    const result = await loginUseCase.execute(input);

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]);
    expect(mockCompare).toHaveBeenCalledWith(input.password, testUser.passwordHash);

    expect(mockSign).toHaveBeenCalledWith(
      { sub: testUser.id, email: testUser.email, roles: testUser.roles },
      'testsecret',
      { expiresIn: '1h' }
    );

    expect(result).toEqual({
      token: expectedToken,
      user: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        lastName: testUser.lastName,
        roles: testUser.roles,
      },
    });

    expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoggedInEvent));
    const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock
      .calls[0][0] as UserLoggedInEvent;
    expect(emittedEvent.type).toBe('UserLoggedInEvent');
    expect(emittedEvent.userId).toBe(testUser.id);
    expect(emittedEvent.payload.email).toBe(testUser.email);
  });

  it('should throw InvalidCredentialsError for incorrect password and emit UserLoginFailedEvent', async () => {
    mockQuery.mockResolvedValue({
      rows: [
        {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          last_name: testUser.lastName,
          phone_number: testUser.phoneNumber,
          address: testUser.address,
          rfc: testUser.rfc,
          roles: testUser.roles,
          password_hash: testUser.passwordHash,
          is_active: testUser.isActive,
        },
      ],
      rowCount: 1,
    });

    mockCompare.mockResolvedValue(false);

    const input = { email: testUser.email, password: 'wrongpassword' };

    await expect(loginUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]);
    expect(mockCompare).toHaveBeenCalledWith(input.password, testUser.passwordHash);
    expect(mockSign).not.toHaveBeenCalled();

    expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoginFailedEvent));
    const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock
      .calls[0][0] as UserLoginFailedEvent;
    expect(emittedEvent.type).toBe('UserLoginFailedEvent');
    expect(emittedEvent.payload.email).toBe(input.email);
    expect(emittedEvent.payload.reason).toBe('INVALID_CREDENTIALS');
    expect(emittedEvent.userId).toBe(testUser.id);
  });

  it('should throw InvalidCredentialsError for not found email and emit UserLoginFailedEvent', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });

    const input = { email: 'nonexistent@example.com', password: 'anypassword' };

    await expect(loginUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]);
    expect(mockCompare).not.toHaveBeenCalled();
    expect(mockSign).not.toHaveBeenCalled();

    expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoginFailedEvent));
    const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock
      .calls[0][0] as UserLoginFailedEvent;
    expect(emittedEvent.type).toBe('UserLoginFailedEvent');
    expect(emittedEvent.payload.email).toBe(input.email);
    expect(emittedEvent.payload.reason).toBe('USER_NOT_FOUND');
    expect(emittedEvent.userId).toBeUndefined();
  });

  it('should throw InvalidCredentialsError for inactive user and emit UserLoginFailedEvent', async () => {
    mockQuery.mockResolvedValue({
      rows: [
        {
          id: inactiveUser.id,
          email: inactiveUser.email,
          name: inactiveUser.name,
          last_name: inactiveUser.lastName,
          phone_number: inactiveUser.phoneNumber,
          address: inactiveUser.address,
          rfc: inactiveUser.rfc,
          roles: inactiveUser.roles,
          password_hash: inactiveUser.passwordHash,
          is_active: inactiveUser.isActive,
        },
      ],
      rowCount: 1,
    });

    const input = { email: inactiveUser.email, password: 'anypassword' };

    await expect(loginUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]);
    expect(mockCompare).not.toHaveBeenCalled();
    expect(mockSign).not.toHaveBeenCalled();

    expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoginFailedEvent));
    const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock
      .calls[0][0] as UserLoginFailedEvent;
    expect(emittedEvent.type).toBe('UserLoginFailedEvent');
    expect(emittedEvent.payload.email).toBe(input.email);
    expect(emittedEvent.payload.reason).toBe('USER_INACTIVE');
    expect(emittedEvent.userId).toBe(inactiveUser.id);
  });

  it('should throw InvalidCredentialsError for invalid input and emit UserLoginFailedEvent', async () => {
    const input = { email: '', password: 'anypassword' };

    await expect(loginUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);

    expect(mockQuery).not.toHaveBeenCalled();
    expect(mockCompare).not.toHaveBeenCalled();
    expect(mockSign).not.toHaveBeenCalled();

    expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoginFailedEvent));
    const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock
      .calls[0][0] as UserLoginFailedEvent;
    expect(emittedEvent.type).toBe('UserLoginFailedEvent');
    expect(emittedEvent.payload.email).toBe(input.email);
    expect(emittedEvent.payload.reason).toBe('MISSING_INPUT');
    expect(emittedEvent.userId).toBeUndefined();
  });

  it('should throw InvalidCredentialsError and emit UserLoginFailedEvent on database error', async () => {
    const dbError = new DatabaseError('Simulated database error', {
      type: 'QUERY_ERROR',
      dbErrorCode: 'simulated-code',
      details: { table: 'users' },
      originalError: new Error('Original pg error'),
    });
    mockQuery.mockRejectedValue(dbError);

    const input = { email: 'test@example.com', password: 'anypassword' };

    await expect(loginUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]);
    expect(mockCompare).not.toHaveBeenCalled();
    expect(mockSign).not.toHaveBeenCalled();

    expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoginFailedEvent));
    const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock
      .calls[0][0] as UserLoginFailedEvent;
    expect(emittedEvent.type).toBe('UserLoginFailedEvent');
    expect(emittedEvent.payload.email).toBe(input.email);
    expect(emittedEvent.payload.reason).toBe('DATABASE_ERROR');
    expect(emittedEvent.userId).toBeUndefined();
  });

  it('should throw InvalidCredentialsError and emit UserLoginFailedEvent on password hasher error', async () => {
    mockQuery.mockResolvedValue({
      rows: [
        {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          last_name: testUser.lastName,
          phone_number: testUser.phoneNumber,
          address: testUser.address,
          rfc: testUser.rfc,
          roles: testUser.roles,
          password_hash: testUser.passwordHash,
          is_active: testUser.isActive,
        },
      ],
      rowCount: 1,
    });

    const hasherError = new Error('Simulated bcrypt compare error');
    mockCompare.mockRejectedValue(hasherError);

    const input = { email: testUser.email, password: 'anypassword' };

    await expect(loginUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]);
    expect(mockCompare).toHaveBeenCalledWith(input.password, testUser.passwordHash);
    expect(mockSign).not.toHaveBeenCalled();

    expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoginFailedEvent));
    const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock
      .calls[0][0] as UserLoginFailedEvent;
    expect(emittedEvent.type).toBe('UserLoginFailedEvent');
    expect(emittedEvent.payload.email).toBe(input.email);
    expect(emittedEvent.payload.reason).toBe('PASSWORD_HASHER_ERROR');
    expect(emittedEvent.userId).toBe(testUser.id);
  });

  it('should throw a generic error if jsonwebtoken.sign fails', async () => {
    mockQuery.mockResolvedValue({
      rows: [
        {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          last_name: testUser.lastName,
          phone_number: testUser.phoneNumber,
          address: testUser.address,
          rfc: testUser.rfc,
          roles: testUser.roles,
          password_hash: testUser.passwordHash,
          is_active: testUser.isActive,
        },
      ],
      rowCount: 1,
    });
    mockCompare.mockResolvedValue(true);

    const signError = new Error('Simulated JWT sign error');
    mockSign.mockImplementation(() => {
      throw signError;
    });

    const input = { email: testUser.email, password: 'validpassword123' };

    await expect(loginUseCase.execute(input)).rejects.toThrow('Simulated JWT sign error');

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]);
    expect(mockCompare).toHaveBeenCalledWith(input.password, testUser.passwordHash);
    expect(mockSign).toHaveBeenCalledWith(
      { sub: testUser.id, email: testUser.email, roles: testUser.roles },
      'testsecret',
      { expiresIn: '1h' }
    );
  });
});
