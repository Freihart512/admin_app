export class PasswordHasherNotRegisteredError extends Error {
  constructor() {
    super('Password hasher has not been registered');
    this.name = 'PasswordHasherNotRegisteredError';
  }
}
