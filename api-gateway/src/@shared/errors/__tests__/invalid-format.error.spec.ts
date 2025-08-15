import { describe, it, expect } from 'vitest';
import { InvalidFormatError } from '../invalid-format.error';

describe('InvalidFormatError', () => {
  const testField = 'email';

  it('should be an instance of Error', () => {
    const error = new InvalidFormatError(testField);
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name property', () => {
    const error = new InvalidFormatError(testField);
    expect(error.name).toBe('InvalidFormatError');
  });

  it('should set the default message correctly based on the field', () => {
    const error = new InvalidFormatError(testField);
    expect(error.message).toBe(`${testField} has invalid format`);
  });

  it('should set a custom message when provided', () => {
    const customMessage = 'The email format is not valid.';
    const error = new InvalidFormatError(testField, customMessage);
    expect(error.message).toBe(customMessage);
  });

  it('should expose the field property', () => {
    const error = new InvalidFormatError(testField);
    expect(error.field).toBe(testField);
  });
});
