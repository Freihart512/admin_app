import { describe, it, expect } from 'vitest';
import { AddressRequiredForOwnerError } from '../address-required-for-owner.error';

describe('AddressRequiredForOwnerError', () => {
  it('should be an instance of Error', () => {
    const error = new AddressRequiredForOwnerError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name', () => {
    const error = new AddressRequiredForOwnerError();
    expect(error.name).toBe('AddressRequiredForOwnerError');
  });

  it('should use the default message when no message is provided', () => {
    const error = new AddressRequiredForOwnerError();
    expect(error.message).toBe('Address is required for Owner role');
  });

  it('should use the custom message when provided', () => {
    const customMessage = 'Custom error message for address.';
    const error = new AddressRequiredForOwnerError(customMessage);
    expect(error.message).toBe(customMessage);
  });
});
