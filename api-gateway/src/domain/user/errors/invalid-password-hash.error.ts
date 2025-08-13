// src/domain/user/errors/invalid-password-hash.error.ts
export class InvalidPasswordHashError extends Error {
  constructor() {
    super('Invalid password hash');
    this.name = 'InvalidPasswordHashError';
  }
}
