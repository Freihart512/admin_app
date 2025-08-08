import { describe, it, expect } from 'vitest';
import { InvalidRFCError, RFCValidationReason } from '../invalid-rfc.error';

describe('InvalidRFCError', () => {
  const sampleValue = 'ABC123456T78';
  const sampleReason = RFCValidationReason.InvalidFormat;

  it('should create an instance of InvalidRFCError', () => {
    const error = new InvalidRFCError(sampleValue, sampleReason);

    expect(error).toBeInstanceOf(InvalidRFCError);
    expect(error.name).toBe('InvalidRFCError');
    expect(error.value).toBe(sampleValue);
    expect(error.reason).toBe(sampleReason);
    expect(error.message).toBe(`Invalid RFC: "${sampleValue}" – ${sampleReason}`);
  });

  it('should expose the correct message for EMPTY reason', () => {
    const error = new InvalidRFCError('', RFCValidationReason.Empty);
    expect(error.message).toBe(`Invalid RFC: "" – ${RFCValidationReason.Empty}`);
  });
});
