import validateRfc from 'validate-rfc';
import { RFCValidatorPort } from '@domain/@shared/ports/rfc.validator.port';
import { InvalidFormatError } from '@shared/errors/invalid-format.error';

export class RfcValidator implements RFCValidatorPort {
  validate(rfc: string) {
    const result = validateRfc(rfc);

    if (!result.isValid) {
      console.error(`Invalid RFC: ${rfc}, validation result: ${JSON.stringify(result.errors)}`);
      const technicalErrorReasons = (result.errors || []).map(error => error).join(', ');
      throw new InvalidFormatError(rfc, `Invalid RFC format: ${technicalErrorReasons}`);
    }
    return true
  };
}
