// domain/value-objects/RFC.ts
import { ValueObject } from './base.value-object';
import { InvalidRFCError, RFCValidationReason } from '../errors/invalid-rfc.error';
import { RFCValidator } from '../ports/rfc.validator.port';

export class RFC extends ValueObject<string> {
  private readonly validator: RFCValidator;

  private constructor(value: string, validator: RFCValidator) {
    super(value);
    this.validator = validator;
  }

  public static create(raw: string, validator: RFCValidator): RFC {
    if (!raw) {
      throw new InvalidRFCError('', RFCValidationReason.Empty);
    }

    const upper = raw.toUpperCase();
    return new RFC(upper, validator);
  }

  protected ensureIsValid(value: string): void {
    try {
      this.validator.validate(value);
    } catch {
      throw new InvalidRFCError(value, RFCValidationReason.InvalidFormat);
    }
  }
}
