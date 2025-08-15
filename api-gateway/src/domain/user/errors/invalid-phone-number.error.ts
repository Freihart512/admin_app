import { InvalidPhoneNumberReasonsType } from '../user.types';

export class InvalidPhoneNumberError extends Error {
  constructor(
    public readonly value: string,
    public readonly reason?: InvalidPhoneNumberReasonsType,
  ) {
    super(`Invalid phone number (${reason}): "${value}"`);
    this.name = 'InvalidPhoneNumberError';
  }
}
