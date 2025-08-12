// domain/value-objects/RFC.ts
import { ValueObject } from './base.value-object';
import { InvalidRFCError, RFCValidationReason } from '../errors/invalid-rfc.error';
import { RFCValidator } from '../ports/rfc.validator.port';

export class RFC extends ValueObject<string, RFCValidator> {
  private constructor(value: string, validator: RFCValidator) {
    super(value, validator);
  }

  public static create(raw: string | undefined, validator: RFCValidator): RFC {
    if (!raw) {
      throw new InvalidRFCError('', RFCValidationReason.Empty);
    }

    const upper = raw.toUpperCase();
    return new RFC(upper, validator);
  }

  protected ensureIsValid(value: string, validator: RFCValidator): void {
    try {
      validator.validate(value);
    } catch(error) {
      console.error(error)
      throw new InvalidRFCError(value, RFCValidationReason.InvalidFormat);
    }
  }
}
