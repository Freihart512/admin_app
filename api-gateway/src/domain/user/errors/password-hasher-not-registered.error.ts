export class PasswordHasherNotRegisteredError extends Error {
  constructor(message = 'Password hasher not registered') {
    super(message);
    this.name = 'PasswordHasherNotRegisteredError';
  }
}
