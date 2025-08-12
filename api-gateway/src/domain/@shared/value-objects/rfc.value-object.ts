import { ValueObject } from './base.value-object';
import { InvalidRFCError, RFCValidationReason } from '../errors/invalid-rfc.error';
import { RFCValidatorPort } from '../ports/rfc.validator.port';
import { InvalidFormatError } from '@shared/errors/invalid-format.error';

export class RFC extends ValueObject<string> {
  private static validator?: RFCValidatorPort;

  /** Registrar validador global (composition root) */
  static registerValidator(validator: RFCValidatorPort): void {
    RFC.validator = validator;
  }

  /** Sólo para tests: evitar fugas entre casos */
  static resetForTests(): void {
    RFC.validator = undefined;
  }

  /** API de dominio */
  static create(raw: string): RFC {
    if (!raw) {
      throw new InvalidRFCError('', RFCValidationReason.Empty);
    }
    if (!RFC.validator) {
      throw new Error('RFC validator has not been registered');
    }
    // Normalizamos a mayúsculas porque el RFC es case-insensitive por convención
    return new RFC(raw.toUpperCase());
  }

  /** Validación interna: traduce errores técnicos a errores de dominio */
  protected ensureIsValid(value: string): void {
    if (!RFC.validator) return; // cubierto por create()

    try {
      const ok = RFC.validator.validate(value);
      if (!ok) {
        // El validador puede devolver false (legacy) o lanzar InvalidFormatError (nuevo)
        throw new InvalidRFCError(value, RFCValidationReason.InvalidFormat);
      }
    } catch (e) {
      if (e instanceof InvalidFormatError) {
        // Mapeo agnóstico → dominio
        throw new InvalidRFCError(value, RFCValidationReason.InvalidFormat);
      }
      // Cualquier otro error se considera fallo técnico no mapeable
      throw e;
    }
  }
}
