export class InvalidFormatError extends Error {
  constructor(
    public readonly field: string,
    message?: string,
  ) {
    super(message ?? `${field} has invalid format`);
    this.name = 'InvalidFormatError';
  }
}
