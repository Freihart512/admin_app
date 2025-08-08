// domain/value-objects/EmailAddress.ts
import { InvalidEmailAddress, InvalidEmailReasons } from '../errors/invalid-email-address.error';
import { ValueObject } from '../../@shared/value-objects/base.value-object';

export class EmailAddress extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  public static create(email: string): EmailAddress {
    return new EmailAddress(email.toLowerCase());
  }

  protected ensureIsValid(value: string): void {
    if (!value || !EmailAddress.EMAIL_REGEX.test(value)) {
      throw new InvalidEmailAddress(value, InvalidEmailReasons.InvalidFormat);
    }

    if (value.length > 254) {
      throw new InvalidEmailAddress(value, InvalidEmailReasons.TooLong);
    }
  }
}
