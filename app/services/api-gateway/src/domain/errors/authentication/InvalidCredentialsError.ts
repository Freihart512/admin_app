// Error de dominio para credenciales de autenticación inválidas
export class InvalidCredentialsError extends Error {
    constructor(message?: string) {
      // Por seguridad, el mensaje aquí podría ser genérico
      super(message || 'Invalid credentials.');
      this.name = 'InvalidCredentialsError';
    }
  }
  