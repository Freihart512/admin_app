import { describe, it, expect } from 'vitest';
import { FieldRequiredForRoleError } from '../field-required-for-role.error';

describe('FieldRequiredForRoleError', () => {
  it('should create an instance and have correct properties', () => {
    const fieldName = 'address';
    const requiredRole = 'OWNER';
    const error = new FieldRequiredForRoleError(fieldName, requiredRole);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('FieldRequiredForRoleError');
    expect(error.message).toBe(`Field "${fieldName}" is required for user with role: ${requiredRole}`);

    expect(error.fieldName).toBe(fieldName);
    expect(error.requiredRole).toBe(requiredRole);
  });

  it('should correctly set the message for a different field and role', () => {
    const fieldName = 'phoneNumber';
    const requiredRole = 'TENANT';
    const error = new FieldRequiredForRoleError(fieldName, requiredRole);

    expect(error.message).toBe(`Field "${fieldName}" is required for user with role: ${requiredRole}`);
    expect(error.fieldName).toBe(fieldName);
    expect(error.requiredRole).toBe(requiredRole);
  });
});