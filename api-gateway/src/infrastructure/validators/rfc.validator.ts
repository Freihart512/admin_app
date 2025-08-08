import { RFCValidator } from '../../domain/@shared/ports/rfc.validator.port';
import validateRfc from 'validate-rfc';

export class RFCValidationInfraError extends Error {
  constructor(public readonly rfc: string) {
    super(`RFC validation failed for "${rfc}"`);
    this.name = 'RFCValidationInfraError';
  }
}

export class ValidateRFC implements RFCValidator {
  validate(rfc: string) {
    const result = validateRfc(rfc);

    if (!result.isValid) {
      throw new RFCValidationInfraError(rfc);
    }
    return true
  };
}
