// domain/value-objects/UUID.ts
import { ValueObject } from './base.value-object';
import { UUIDValidator } from '../ports/uuid.validator.port';
import { InvalidUUIDError } from '../errors/invalid-uuid.error';

export class UUID extends ValueObject<string> {
  private readonly validator: UUIDValidator;

  private constructor(value: string, validator: UUIDValidator) {
    super(value);
    this.validator = validator;
  }

  public static create(raw: string, validator: UUIDValidator): UUID {
    return new UUID(raw.toLowerCase(), validator);
  }

  protected ensureIsValid(value: string): void {
    if (!this.validator.validate(value)) {
      throw new InvalidUUIDError(value);
    }
  }
}
