import { User } from '../../../domain/entities/User';
import { IAuthTokenGenerator } from '../../../application/use-cases/authentication/LoginUseCase'; // Importamos la interfaz del generador de tokens
import * as jwt from 'jsonwebtoken'; // Importamos la librería jsonwebtoken

export class JwtAuthTokenGenerator implements IAuthTokenGenerator {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string; // Ej. '1d', '7d', '24h'

  constructor(
    // El secreto JWT se debería inyectar, idealmente desde variables de entorno
    jwtSecret: string,
    jwtExpiresIn: string = '1h' // Valor por defecto
  ) {
    if (!jwtSecret) {
      throw new Error('JWT secret is not provided.');
    }
    this.jwtSecret = jwtSecret;
    this.jwtExpiresIn = jwtExpiresIn;
  }

  generateToken(user: User): string {
    console.log(`Generating JWT for user: ${user.id}`);
    // Creamos el payload del token con información del usuario
    const payload = {
      sub: user.id, // Subject: ID del usuario
      email: user.email,
      roles: user.roles,
      // Puedes añadir otra información no sensible necesaria en el token
    };

    // Generamos el token
    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });

    return token;
  }
}
