import { describe, it, expect, vi } from 'vitest';
import { RFC } from '../rfc.value-object';
import { InvalidRFCError, RFCValidationReason } from '../../errors/invalid-rfc.error';
import type { RFCValidator } from '../../ports/rfc.validator.port';

const validRFC = 'GODE561231GR8';
const invalidRFC = 'INVALID_RFC';

// Factory to generate a mocked validator
function mockValidator(valid: boolean): RFCValidator {
  return {
    validate: vi.fn().mockImplementation((rfc: string) => {
      if (!valid) throw new Error('Invalid RFC');
      return true;
    }),
  };
}

describe('RFC Value Object', () => {
  it('should create RFC successfully with a valid RFC string', () => {
    const validator = mockValidator(true);
    const rfc = RFC.create(validRFC, validator);

    expect(rfc).toBeInstanceOf(RFC);
    expect(rfc.getValue()).toBe(validRFC.toUpperCase());
    expect(rfc.toJSON()).toBe(validRFC.toUpperCase());
  });

  it('should throw InvalidRFCError with reason EMPTY if input is empty', () => {
    const validator = mockValidator(true);

    expect(() => {
      RFC.create('', validator);
    }).toThrowError(new InvalidRFCError('', RFCValidationReason.Empty));
  });

  it('should throw InvalidRFCError with reason INVALID_FORMAT if validator fails', () => {
    const validator = mockValidator(false);

    expect(() => {
      RFC.create(invalidRFC, validator);
    }).toThrowError(new InvalidRFCError(invalidRFC.toUpperCase(), RFCValidationReason.InvalidFormat));
  });

  it('should consider two RFCs with same value equal', () => {
    const validator = mockValidator(true);
    const rfc1 = RFC.create(validRFC, validator);
    const rfc2 = RFC.create(validRFC.toLowerCase(), validator); // lowercased input

    expect(rfc1.equals(rfc2)).toBe(true);
  });

  it('should consider two RFCs with different value not equal', () => {
    const validator = mockValidator(true);
    const rfc1 = RFC.create('AAAA000101AAA', validator);
    const rfc2 = RFC.create('BBBB000101BBB', validator);

    expect(rfc1.equals(rfc2)).toBe(false);
  });
});
