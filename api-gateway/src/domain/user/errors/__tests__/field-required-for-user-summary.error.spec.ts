import { describe, it, expect } from 'vitest';
import { FieldRequiredForUserSummaryError } from '../field-required-for-user-summary.error';

describe('FieldRequiredForUserSummaryError', () => {
  it('should create an instance for 'name' field', () => {
    const error = new FieldRequiredForUserSummaryError('name');
    expect(error).toBeInstanceOf(FieldRequiredForUserSummaryError);
    expect(error.name).toBe('FieldRequiredForUserSummaryError');
    expect(error.field).toBe('name');
    expect(error.message).toBe('User Summary field name is required');
  });

  it('should create an instance for 'lastName' field', () => {
    const error = new FieldRequiredForUserSummaryError('lastName');
    expect(error).toBeInstanceOf(FieldRequiredForUserSummaryError);
    expect(error.name).toBe('FieldRequiredForUserSummaryError');
    expect(error.field).toBe('lastName');
    expect(error.message).toBe('User Summary field lastName is required');
  });
});
