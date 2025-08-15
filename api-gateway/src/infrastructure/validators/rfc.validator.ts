import validateRfc from 'validate-rfc';
import { RFCValidatorPort } from '@domain/@shared/ports/rfc.validator.port';
import { InvalidFormatError } from '@shared/errors/invalid-format.error';
import { Injectable } from '@nestjs/common';

/**
 * Adapter that delegates RFC validation to the `validate-rfc` package.
 *
 * Nest will instantiate this class when it is registered as a provider on a
 * module. Decorating it with `@Injectable()` allows Nest’s DI system to
 * properly construct and cache the instance. Without this decorator the
 * provider would not be recognized and dependency resolution would fail.
 */
@Injectable()
export class RfcValidator implements RFCValidatorPort {
  /**
   * Validate a Mexican RFC string. Throws an InvalidFormatError when invalid.
   * @param rfc RFC string to validate
   * @returns true if the RFC is valid
   */
  validate(rfc: string): boolean {
    const result = validateRfc(rfc);

    if (!result.isValid) {
      // Collect all error messages returned by the validator and surface them
      // through our domain‑level InvalidFormatError. This ensures callers
      // receive a rich explanation of why the RFC is invalid.
      console.error(
        `Invalid RFC: ${rfc}, validation result: ${JSON.stringify(result.errors)}`,
      );
      const technicalErrorReasons = (result.errors || [])
        .map((error) => error)
        .join(', ');
      throw new InvalidFormatError(
        rfc,
        `Invalid RFC format: ${technicalErrorReasons}`,
      );
    }
    return true;
  }
}
