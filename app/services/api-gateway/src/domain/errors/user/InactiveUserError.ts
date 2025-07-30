// Error de dominio cuando un usuario está inactivo
export class InactiveUserError extends Error {
    constructor(message?: string) {
      super(message || 'User account is inactive.');
      this.name = 'InactiveUserError';
    }
  }
  