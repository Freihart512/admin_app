import { describe, it, expect } from 'vitest';
import { UserSummaryRequiredError } from '../user-summary-required.error';

describe('UserSummaryRequiredError', () => {
  it('should be an instance of Error', () => {
    const error = new UserSummaryRequiredError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name', () => {
    const error = new UserSummaryRequiredError();
    expect(error.name).toBe('UserSummaryRequiredError');
  });

  it('should use the default message when no message is provided', () => {
    const error = new UserSummaryRequiredError();
    expect(error.message).toBe('User summary is required');
  });

  it('should use the custom message when provided', () => {
    const customMessage = 'User summary object missing.';
    const error = new UserSummaryRequiredError(customMessage);
    expect(error.message).toBe(customMessage);
  });
});
