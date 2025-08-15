// src/domain/user/errors/invalid-password-hash.error.ts
export class InvalidPasswordHashError extends Error {
  constructor(message = 'Invalid password hash') {
    super(message);
    this.name = 'InvalidPasswordHashError';
  }
}
