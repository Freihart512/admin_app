import { describe, it, expect, vi, afterEach } from 'vitest';
import { RFC } from '../rfc.value-object';
import { InvalidRFCError, RFCValidationReason } from '../../errors/invalid-rfc.error';
import type { RFCValidatorPort } from '../../ports/rfc.validator.port';

const validRFC = 'GODE561231GR8';
const invalidRFC = 'INVALID_RFC';

// Factory to generate a mocked validator
function mockValidator(valid: boolean): RFCValidatorPort {
  return {
    validate: vi.fn().mockReturnValue(valid),
  };
}

describe('RFC Value Object', () => {
  afterEach(() => {
    RFC.resetForTests();
  });

  it('should create RFC successfully with a valid RFC string', () => {
    const validator = mockValidator(true);
    RFC.registerValidator(validator);
    const rfc = RFC.create(validRFC);

    expect(rfc).toBeInstanceOf(RFC);
    expect(rfc.getValue()).toBe(validRFC.toUpperCase());
    expect(rfc.toJSON()).toBe(validRFC.toUpperCase());
  });

  it('should throw InvalidRFCError with reason EMPTY if input is empty', () => {
    const validator = mockValidator(true);
    RFC.registerValidator(validator);

    expect(() => {
      RFC.create('');
    }).toThrowError(new InvalidRFCError('', RFCValidationReason.Empty));
  });

  it('should throw InvalidRFCError with reason INVALID_FORMAT if validator fails', () => {
    const validator = mockValidator(false);
    RFC.registerValidator(validator);

    expect(() => {
      RFC.create(invalidRFC);
    }).toThrowError(new InvalidRFCError(invalidRFC.toUpperCase(), RFCValidationReason.InvalidFormat));
  });

  it('should consider two RFCs with same value equal', () => {
    const validator = mockValidator(true);
    RFC.registerValidator(validator);
    const rfc1 = RFC.create(validRFC);
    const rfc2 = RFC.create(validRFC.toLowerCase()); // lowercased input

    expect(rfc1.equals(rfc2)).toBe(true);
  });

  it('should consider two RFCs with different value not equal', () => {
    const validator = mockValidator(true);
    RFC.registerValidator(validator);
    const rfc1 = RFC.create('AAAA000101AAA');
    const rfc2 = RFC.create('BBBB000101BBB');

    expect(rfc1.equals(rfc2)).toBe(false);
  });
});