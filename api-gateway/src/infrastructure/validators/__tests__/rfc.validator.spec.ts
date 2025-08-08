import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidateRFC, RFCValidationInfraError } from '../rfc.validator';
import * as validateRfcModule from 'validate-rfc';

vi.mock('validate-rfc'); // Mock automático del módulo

describe('RFCValidationInfraError', () => {
  it('should set the correct name and message', () => {
    const rfc = 'INVALIDRFC123';
    const error = new RFCValidationInfraError(rfc);

    expect(error.name).toBe('RFCValidationInfraError');
    expect(error.message).toBe(`RFC validation failed for "${rfc}"`);
    expect(error.rfc).toBe(rfc);
  });
});

describe('ValidateRFC', () => {
  const validateRFC = new ValidateRFC();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true if RFC is valid', () => {
    vi.spyOn(validateRfcModule, 'default').mockReturnValue({
      isValid: true,
      errors: [],
    });

    expect(validateRFC.validate('ABC123456T78')).toBe(true);
  });

  it('should throw RFCValidationInfraError if RFC is invalid', () => {
    const input = 'INVALIDRFC';

    vi.spyOn(validateRfcModule, 'default').mockReturnValue({
      isValid: false,
      errors: ['INVALID_FORMAT'],
    });

    expect(() => validateRFC.validate(input)).toThrowError(RFCValidationInfraError);
    expect(() => validateRFC.validate(input)).toThrowError(`RFC validation failed for "${input}"`);
  });
});
