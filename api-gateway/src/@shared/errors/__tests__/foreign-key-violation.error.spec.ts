import { describe, it, expect } from 'vitest';
import { ForeignKeyViolationError } from '../foreign-key-violation.error';
import { RepositoryError } from '../repository.error';

describe('ForeignKeyViolationError', () => {
  it('should be an instance of Error and RepositoryError', () => {
    const error = new ForeignKeyViolationError('userId');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(RepositoryError);
  });

  it('should have the correct name', () => {
    const error = new ForeignKeyViolationError('productId');
    expect(error.name).toBe('ForeignKeyViolationError');
  });

  it('should set the message correctly based on the field', () => {
    const fieldName = 'orderId';
    const error = new ForeignKeyViolationError(fieldName);
    expect(error.message).toBe(`Foreign key violation on ${fieldName}`);
  });

  it('should expose the field property', () => {
    const field = 'categoryId';
    const error = new ForeignKeyViolationError(field);
    expect(error.field).toBe(field);
  });
});
