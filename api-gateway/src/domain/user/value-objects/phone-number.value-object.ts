// domain/value-objects/PhoneNumber.ts
import { ValueObject } from '../../@shared/value-objects/base.value-object';
import { InvalidPhoneNumberReasons } from '../errors/index.js';
import { InvalidPhoneNumberError } from '../errors/invalid-phone-number.error';

export class PhoneNumber extends ValueObject<string> {
  private static readonly PHONE_REGEX = /^\+?[0-9]{10,15}$/;

  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): PhoneNumber {
    return new PhoneNumber(value);
  }

  protected ensureIsValid(value: string): void {
    if (!value || typeof value !== 'string') {
     throw new InvalidPhoneNumberError(value, InvalidPhoneNumberReasons.MissingValue);
    }

    if (!PhoneNumber.PHONE_REGEX.test(value)) {
      throw new InvalidPhoneNumberError(value, InvalidPhoneNumberReasons.InvalidFormat);
    }
  }
}
