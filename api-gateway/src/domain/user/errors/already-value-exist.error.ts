export class AlreadyValueExistError extends Error {
  constructor(
    public readonly value: string,
    public readonly field: string,
  ) {
    super(`Already exist an user with ${field} value: "${value}"`);
    this.name = 'AlreadyValueExistError';
  }
}
