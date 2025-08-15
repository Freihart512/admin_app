import { describe, it, expect } from 'vitest';
import { AlreadyValueExistError } from '../already-value-exist.error';

describe('AlreadyValueExistError', () => {
  it('should create an instance and have correct properties', () => {
    const testValue = 'existing@example.com';
    const testField = 'email';
    const error = new AlreadyValueExistError(testValue, testField);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AlreadyValueExistError');
    expect(error.message).toBe(
      `Already exist an user with ${testField} value: "${testValue}"`,
    );

    expect(error.value).toBe(testValue);
    expect(error.field).toBe(testField);
  });

  it('should have correct properties when created with different values', () => {
    const testValue = '1234567890';
    const testField = 'phoneNumber';
    const error = new AlreadyValueExistError(testValue, testField);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AlreadyValueExistError');
    expect(error.message).toBe(
      `Already exist an user with ${testField} value: "${testValue}"`,
    );

    expect(error.value).toBe(testValue);
    expect(error.field).toBe(testField);
  });
});
