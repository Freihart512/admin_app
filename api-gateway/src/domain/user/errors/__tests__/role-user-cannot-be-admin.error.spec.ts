import { describe, it, expect } from 'vitest';
import { RoleUserCannotBeAdminError } from '../role-user-cannot-be-admin.error';

describe('RoleUserCannotBeAdminError', () => {
  it('should be an instance of Error', () => {
    const error = new RoleUserCannotBeAdminError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name', () => {
    const error = new RoleUserCannotBeAdminError();
    expect(error.name).toBe('RoleUserCannotBeAdminError');
  });

  it('should use the default message when no message is provided', () => {
    const error = new RoleUserCannotBeAdminError();
    expect(error.message).toBe('User with a business role cannot be an administrator');
  });

  it('should use the custom message when provided', () => {
    const customMessage = 'This user has a role and cannot be set as admin.';
    const error = new RoleUserCannotBeAdminError(customMessage);
    expect(error.message).toBe(customMessage);
  });
});