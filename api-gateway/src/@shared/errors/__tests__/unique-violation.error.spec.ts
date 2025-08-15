import { describe, it, expect } from 'vitest';
import { UniqueViolationError } from '../unique-violation.error';
import { RepositoryError } from '../repository.error';

describe('UniqueViolationError', () => {
  it('should be an instance of Error and RepositoryError', () => {
    const error = new UniqueViolationError('email');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(RepositoryError);
    expect(error).toBeInstanceOf(UniqueViolationError);
  });

  it('should have the correct name', () => {
    const error = new UniqueViolationError('username');
    expect(error.name).toBe('UniqueViolationError');
  });

  it('should set the message correctly with only the field', () => {
    const field = 'id';
    const error = new UniqueViolationError(field);
    expect(error.message).toBe(`Unique violation on ${field}`);
  });

  it('should set the message correctly with field and value', () => {
    const field = 'email';
    const value = 'test@example.com';
    const error = new UniqueViolationError(field, value);
    expect(error.message).toBe(
      `Unique violation on ${field} with value "${value}"`,
    );
  });

  it('should expose the field property', () => {
    const field = 'phone_number';
    const error = new UniqueViolationError(field);
    expect(error.field).toBe(field);
  });

  it('should expose the value property when provided', () => {
    const field = 'rfc';
    const value = 'ABC123XYZ';
    const error = new UniqueViolationError(field, value);
    expect(error.value).toBe(value);
  });

  it('should expose undefined for the value property when not provided', () => {
    const field = 'some_unique_key';
    const error = new UniqueViolationError(field);
    expect(error.value).toBeUndefined();
  });
});
