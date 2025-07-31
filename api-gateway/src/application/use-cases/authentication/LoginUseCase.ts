import { LoginInput, LoginPayload } from '../../../interfaces/graphql/generated/graphql';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';
import { User } from '../../../domain/entities/User';
// Importamos los errores de dominio
import { InvalidCredentialsError } from '../../../domain/errors/authentication/InvalidCredentialsError';
// Importamos el dispatcher de eventos y los eventos que vamos a emitir
import { IEventDispatcher } from '../../../shared/events/IEventDispatcher';
import { UserLoggedInEvent } from '../../../shared/events/authentication/UserLoggedInEvent';
import { UserLoginFailedEvent } from '../../../shared/events/authentication/UserLoginFailedEvent';

interface IAuthTokenGenerator {
  generateToken(user: User): string;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private authTokenGenerator: IAuthTokenGenerator,
    private eventDispatcher: IEventDispatcher
  ) {}

  async execute(input: LoginInput): Promise<LoginPayload> {
    if (!input.email || !input.password) {
      await this.eventDispatcher.dispatch(
        new UserLoginFailedEvent({ email: input.email, reason: 'MISSING_INPUT' })
      );
      throw new InvalidCredentialsError('Invalid credentials or user is inactive.');
    }

    let user: User | null = null; // Inicializar user a null
    try {
      user = await this.userRepository.findByEmail(input.email);
    } catch (error: any) {
      console.error('Error from UserRepository.findByEmail in LoginUseCase:', error);
      await this.eventDispatcher.dispatch(
        new UserLoginFailedEvent({ email: input.email, reason: 'DATABASE_ERROR' })
      );
      throw new InvalidCredentialsError('Invalid credentials or user is inactive.');
    }

    if (!user || !user.isActive) {
      const reason = user ? 'USER_INACTIVE' : 'USER_NOT_FOUND';
      await this.eventDispatcher.dispatch(
        new UserLoginFailedEvent({ email: input.email, reason: reason }, user?.id)
      );
      throw new InvalidCredentialsError('Invalid credentials or user is inactive.');
    }
    let passwordMatches: boolean;
    try {
      passwordMatches = await this.passwordHasher.compare(input.password, user.passwordHash);
    } catch (error: any) {
      console.error('Error from PasswordHasher.compare in LoginUseCase:', error);
      await this.eventDispatcher.dispatch(
        new UserLoginFailedEvent({ email: input.email, reason: 'PASSWORD_HASHER_ERROR' }, user.id)
      );
      throw new InvalidCredentialsError('Invalid credentials or user is inactive.');
    }

    if (!passwordMatches) {
      await this.eventDispatcher.dispatch(
        new UserLoginFailedEvent({ email: input.email, reason: 'INVALID_CREDENTIALS' }, user.id)
      );
      throw new InvalidCredentialsError('Invalid credentials or user is inactive.');
    }

    const token = this.authTokenGenerator.generateToken(user);

    await this.eventDispatcher.dispatch(new UserLoggedInEvent(user));

    return {
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        roles: user.roles,
      },
    };
  }
}
