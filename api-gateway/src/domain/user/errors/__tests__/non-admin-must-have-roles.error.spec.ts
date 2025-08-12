import { describe, it, expect } from 'vitest'; 
import { NonAdminMustHaveRolesError } from '../non-admin-must-have-roles.error';

describe('NonAdminMustHaveRolesError', () => {
  it('should be an instance of Error', () => {
    const error = new NonAdminMustHaveRolesError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name', () => {
    const error = new NonAdminMustHaveRolesError();
    expect(error.name).toBe('NonAdminMustHaveRolesError');
  });

  it('should use the default message when no message is provided', () => {
    const error = new NonAdminMustHaveRolesError();
    expect(error.message).toBe('Non-admin users must have at least one role');
  });

  it('should use the custom message when provided', () => {
    const customMessage = 'User requires roles.';
    const error = new NonAdminMustHaveRolesError(customMessage);
    expect(error.message).toBe(customMessage);
  });
});