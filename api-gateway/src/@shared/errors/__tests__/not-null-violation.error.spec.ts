import { describe, it, expect } from 'vitest';
import { NotNullViolationError } from '../not-null-violation.error';
import { RepositoryError } from '../repository.error';

describe('NotNullViolationError', () => {
  const testField = 'email';

  it('should be an instance of Error and RepositoryError', () => {
    const error = new NotNullViolationError(testField);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(RepositoryError);
  });

  it('should have the correct name property', () => {
    const error = new NotNullViolationError(testField);
    expect(error.name).toBe('NotNullViolationError');
  });

  it('should set the message correctly based on the field', () => {
    const error = new NotNullViolationError(testField);
    expect(error.message).toBe(`Not null violation on ${testField}`);
  });

  it('should expose the field property', () => {
    const error = new NotNullViolationError(testField);
    expect(error.field).toBe(testField);
  });
});
