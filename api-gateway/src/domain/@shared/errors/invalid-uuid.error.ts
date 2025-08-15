export class InvalidUUIDError extends Error {
  constructor(public readonly value: string) {
    super(`Invalid UUID format: "${value}"`);
    this.name = 'InvalidUUIDError';
  }
}
