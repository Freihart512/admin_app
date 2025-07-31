// Error de dominio cuando un usuario no es encontrado
export class UserNotFoundError extends Error {
  constructor(message?: string) {
    super(message || 'User not found.');
    this.name = 'UserNotFoundError';
  }
}
