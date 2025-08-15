import { InvalidPasswordFormatReasonsType } from '../user.types';

export class InvalidPasswordFormatError extends Error {
  constructor(
    public value: string,
    public reason: InvalidPasswordFormatReasonsType,
  ) {
    super(`Invalid password format (${reason}): ${value}`);
    this.name = 'InvalidPasswordError';
  }
}
