export class ValidatorNotRegisteredError extends Error {
  constructor(public readonly type: 'uuid' | 'rfc') {
    super(`Not validator registered for type "${type}"`);
    this.name = 'ValidatorNotRegisteredError';
  }
}
