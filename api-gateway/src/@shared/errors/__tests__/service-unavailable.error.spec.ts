import { describe, it, expect } from 'vitest';
import { ServiceUnavailableError } from '../service-unavailable.error';

describe('ServiceUnavailableError', () => {
  it('should be an instance of Error', () => {
    const error = new ServiceUnavailableError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name property', () => {
    const error = new ServiceUnavailableError();
    expect(error.name).toBe('ServiceUnavailableError');
  });

  it('should use the default message when no message is provided', () => {
    const error = new ServiceUnavailableError();
    expect(error.message).toBe('Service is currently unavailable.');
  });

  it('should use a custom message when provided', () => {
    const customMessage = 'Database connection failed.';
    const error = new ServiceUnavailableError(customMessage);
    expect(error.message).toBe(customMessage);
  });
});
