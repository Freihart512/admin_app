// domain/value-objects/UUID.ts
import { ValueObject } from './base.value-object';
import { UUIDValidator } from '../ports/uuid.validator.port';
import { InvalidUUIDError } from '../errors/invalid-uuid.error';

/**
 * UUID value object using a globally-registered validator.
 */
export class UUID extends ValueObject<string> {
  private static validator?: UUIDValidator;

  /** Register global validator (call once in bootstrap). */
  static registerValidator(validator: UUIDValidator): void {
    UUID.validator = validator;
  }

  /** For unit tests only: clear registered validator to avoid cross-test leakage. */
  static resetForTests(): void {
    UUID.validator = undefined;
  }

  static create(raw: string): UUID {
    if (!UUID.validator) {
      throw new Error('UUID validator has not been registered');
    }
    return new UUID(raw.toLowerCase());
  }

  protected ensureIsValid(value: string): void {
    if (!UUID.validator) return; // prevented by create()
    const ok = UUID.validator.validate(value);
    if (!ok) throw new InvalidUUIDError(value);
  }
}
