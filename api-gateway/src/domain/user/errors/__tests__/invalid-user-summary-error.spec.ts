// test/unit/domain/errors/InvalidUserSummaryError.spec.ts
import { describe, it, expect } from 'vitest';
import { InvalidUserSummaryError } from '../invalid-user-summary.error';

describe('InvalidUserSummaryError', () => {
  it('should be an instance of Error and InvalidUserSummaryError', () => {
    const error = new InvalidUserSummaryError(['Missing name']);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InvalidUserSummaryError);
  });

  it('should expose the reasons array', () => {
    const reasons = ['Missing name', 'Missing last name'];
    const error = new InvalidUserSummaryError(reasons);
    expect(error.reasons).toEqual(reasons);
  });

  it('should set the name to "InvalidUserSummaryError"', () => {
    const error = new InvalidUserSummaryError(['Missing email']);
    expect(error.name).toBe('InvalidUserSummaryError');
  });

  it('should format the error message correctly with multiple reasons', () => {
    const reasons = ['Missing name', 'Missing email'];
    const error = new InvalidUserSummaryError(reasons);
    expect(error.message).toBe('Invalid User Summary: Missing name, Missing email');
  });

  it('should format the error message correctly with a single reason', () => {
    const reasons = ['Missing UUID'];
    const error = new InvalidUserSummaryError(reasons);
    expect(error.message).toBe('Invalid User Summary: Missing UUID');
  });

  it('should work with empty reasons array (though unusual)', () => {
    const error = new InvalidUserSummaryError([]);
    expect(error.message).toBe('Invalid User Summary: ');
  });
});
