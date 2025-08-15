import { describe, it, expect } from 'vitest';
import { AdminCannotHaveBusinessRolesError } from '../admin-cannot-have-business-roles.error';

describe('AdminCannotHaveBusinessRolesError', () => {
  it('should create an instance with the correct default message', () => {
    const error = new AdminCannotHaveBusinessRolesError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AdminCannotHaveBusinessRolesError');
    expect(error.message).toBe('Admin users cannot have business roles');
  });

  it('should create an instance with a custom message', () => {
    const customMessage = 'Admins are not allowed to have roles assigned.';
    const error = new AdminCannotHaveBusinessRolesError(customMessage);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AdminCannotHaveBusinessRolesError');
    expect(error.message).toBe(customMessage);
  });
});
