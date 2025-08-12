// domain/value-objects/UUID.ts
import { ValueObject } from './base.value-object';
import { UUIDValidator } from '../ports/uuid.validator.port';
import { InvalidUUIDError } from '../errors/invalid-uuid.error';

export class UUID extends ValueObject<string, UUIDValidator> {
  private readonly validator: UUIDValidator;

  private constructor(value: string, validator: UUIDValidator) {
    super(value);
    this.validator = validator;
  }

  public static create(raw: string, validator: UUIDValidator): UUID {
    return new UUID(raw.toLowerCase(), validator);
  }

  protected ensureIsValid(value: string, validator?: UUIDValidator): void {
    if (validator && validator.validate(value)) {
      throw new InvalidUUIDError(value);
    }
  }
}
