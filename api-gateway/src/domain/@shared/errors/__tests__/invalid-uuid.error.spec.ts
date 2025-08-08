import { describe, it, expect } from 'vitest';
import { InvalidUUIDError } from '../invalid-uuid.error';

describe('InvalidUUIDError', () => {
  const sampleValue = 'invalid-uuid-value';

  it('should be instance of Error and InvalidUUIDError', () => {
    const error = new InvalidUUIDError(sampleValue);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InvalidUUIDError);
  });

  it('should have correct name', () => {
    const error = new InvalidUUIDError(sampleValue);
    expect(error.name).toBe('InvalidUUIDError');
  });

  it('should expose the invalid UUID value', () => {
    const error = new InvalidUUIDError(sampleValue);
    expect(error.value).toBe(sampleValue);
  });

  it('should have correct message format', () => {
    const error = new InvalidUUIDError(sampleValue);
    expect(error.message).toBe(`Invalid UUID format: "${sampleValue}"`);
  });
});
