// domain/value-objects/PhoneNumber.ts
import { ValueObject } from '../../@shared/value-objects/base.value-object';
import { InvalidPhoneNumberError } from '../errors/invalid-phone-number.error';

export class PhoneNumber extends ValueObject<string, undefined> {
  private static readonly PHONE_REGEX = /^\+?[0-9]{10,15}$/;

  public static create(value: string | undefined): PhoneNumber {
    return new PhoneNumber(value ?? '');
  }

  protected ensureIsValid(value: string): void {
    if (!value || typeof value !== 'string') {
     
    }

    if (!PhoneNumber.PHONE_REGEX.test(value)) {
      throw new InvalidPhoneNumberError(value);
    }
  }
}
