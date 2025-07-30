import { LoginInput, LoginPayload } from '../../../interfaces/graphql/generated/graphql';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';
import { User } from '../../../domain/entities/User';
// Importamos los errores de dominio
import { InvalidCredentialsError } from '../../../domain/errors/authentication/InvalidCredentialsError';
// Importamos el dispatcher de eventos y los eventos que vamos a emitir
import { IEventDispatcher } from '../../../shared/events/IEventDispatcher';
import { UserLoggedInEvent } from '../../../shared/events/authentication/UserLoggedInEvent'; // Importamos el evento de login exitoso
import { UserLoginFailedEvent } from '../../../shared/events/authentication/UserLoginFailedEvent'; // Importamos el evento de login fallido


// Interfaz para el servicio de generación de tokens
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
    console.log('Executing LoginUseCase for:', input.email);

    // Validar input básico
    if (!input.email || !input.password) {
        // Emitir evento de login fallido por input inválido (NO hay userId aquí)
        await this.eventDispatcher.dispatch(new UserLoginFailedEvent({ email: input.email, reason: 'MISSING_INPUT' }));
        throw new InvalidCredentialsError('Invalid credentials or user is inactive.');
    }

    let user: User | null = null; // Inicializar user a null
    try {
       // **Intentar buscar usuario por email primero**
       user = await this.userRepository.findByEmail(input.email);
    } catch (error: any) {
        console.error('Error from UserRepository.findByEmail in LoginUseCase:', error);
        // Emitir evento de login fallido por error de base de datos (SI hay email, NO hay userId aún)
        await this.eventDispatcher.dispatch(new UserLoginFailedEvent({ email: input.email, reason: 'DATABASE_ERROR' }));
        throw new InvalidCredentialsError('Invalid credentials or user is inactive.');
    }


    // **Validar si el usuario EXISTE y está activo**
    if (!user || !user.isActive) {
      console.log('User not found or inactive during login attempt.');
      // Emitir evento de login fallido (SI hay email, **PASAMOS userId si se encontró al usuario**)
      const reason = user ? 'USER_INACTIVE' : 'USER_NOT_FOUND'; // Razón más específica si se encontró al usuario
      await this.eventDispatcher.dispatch(new UserLoginFailedEvent({ email: input.email, reason: reason }, user?.id)); // Pasar user.id si user no es null
      throw new InvalidCredentialsError('Invalid credentials or user is inactive.');
    }

    // Si el usuario existe y está activo, ahora verificamos la contraseña
    let passwordMatches: boolean;
    try {
       passwordMatches = await this.passwordHasher.compare(input.password, user.passwordHash);
    } catch (error: any) {
        console.error('Error from PasswordHasher.compare in LoginUseCase:', error);
         // Emitir evento de login fallido por error del hasher (SI hay email, **PASAMOS userId**)
        await this.eventDispatcher.dispatch(new UserLoginFailedEvent({ email: input.email, reason: 'PASSWORD_HASHER_ERROR' }, user.id)); // Pasar user.id
        throw new InvalidCredentialsError('Invalid credentials or user is inactive.');
    }


    if (!passwordMatches) {
      console.log('Password mismatch during login attempt.');
      // Emitir evento de login fallido por contraseña incorrecta (SI hay email, **PASAMOS userId**)
      await this.eventDispatcher.dispatch(new UserLoginFailedEvent({ email: input.email, reason: 'INVALID_CREDENTIALS' }, user.id)); // Pasar user.id
       throw new InvalidCredentialsError('Invalid credentials or user is inactive.');
    }

    // Si las credenciales son válidas y el usuario está activo, generar token JWT
    const token = this.authTokenGenerator.generateToken(user);

    // **Emitir evento de login exitoso** (SI hay email, **PASAMOS userId**)
    await this.eventDispatcher.dispatch(new UserLoggedInEvent(user)); // UserLoggedInEvent ya tiene el constructor para tomar el User y obtener el ID
    console.log(`User ${user.email} logged in successfully. Emitting UserLoggedInEvent.`);


    // Devolver token y datos básicos del usuario
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