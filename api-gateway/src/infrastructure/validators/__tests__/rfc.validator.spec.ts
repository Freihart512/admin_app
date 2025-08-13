import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RfcValidator } from '../rfc.validator';
import { InvalidFormatError } from '@shared/errors/invalid-format.error';
import * as validateRfcModule from 'validate-rfc';

vi.mock('validate-rfc'); // Mock automático del módulo

describe('RfcValidator', () => {
  const rfcValidator = new RfcValidator();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true if RFC is valid', () => {
    vi.spyOn(validateRfcModule, 'default').mockReturnValue({
      isValid: true,
      errors: [],
    });

    expect(rfcValidator.validate('ABC123456T78')).toBe(true);
  });

  it('should throw InvalidFormatError if RFC is invalid', () => {
    const input = 'INVALIDRFC';

    vi.spyOn(validateRfcModule, 'default').mockReturnValue({
      isValid: false,
      errors: ['INVALID_FORMAT'],
    });

    expect(() => rfcValidator.validate(input)).toThrowError(InvalidFormatError);
    expect(() => rfcValidator.validate(input)).toThrowError(`Invalid RFC format: INVALID_FORMAT`);
  });
});