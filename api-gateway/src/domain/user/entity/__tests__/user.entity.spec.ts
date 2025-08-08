import { describe, it, expect, beforeEach, vi } from 'vitest';
import { User } from '../user.entity';
import { BusinessRole, AccountStatus, AuditFields } from '../../../../@shared/core/types';
import { UserSummary } from '../../value-objects/user-summary.value-object';

describe('User Domain Entity', () => {
  let userProps: any;
  let mockCurrentUserSummary: UserSummary;
  let initialAudit: AuditFields;

  beforeEach(() => {
    mockCurrentUserSummary = new UserSummary({
      id: 'current-user-id',
      name: 'Current',
      lastName: 'User',
      email: 'current@example.com',
      status: AccountStatus.ACTIVE,
    });

    initialAudit = {
      createdAt: new Date(),
      createdBy: mockCurrentUserSummary,
      updatedAt: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    };

    userProps = {
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      name: 'Test',
      lastName: 'User',
      audit: initialAudit,
    };
  });

  describe('constructor', () => {
    it('should create a user with default values', () => {
      const user = new User(userProps);
      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('hashedpassword');
      expect(user.isAdmin).toBe(false);
      expect(user.roles).toEqual([]);
      expect(user.name).toBe('Test');
      expect(user.lastName).toBe('User');
      expect(user.phoneNumber).toBeNull();
      expect(user.address).toBeNull();
      expect(user.rfc).toBeNull();
      expect(user.status).toBe(AccountStatus.ACTIVE);
      expect(user.audit).toEqual(initialAudit);
    });

    it('should create a user with provided values', () => {
      const customProps = {
        ...userProps,
        id: 'custom-id',
        isAdmin: true,
        roles: [BusinessRole.OWNER],
        phoneNumber: '1234567890',
        address: '123 Test St',
        rfc: 'ABC123XYZ',
        status: AccountStatus.INACTIVE,
        audit: {
          createdAt: new Date('2023-01-01'),
          createdBy: new UserSummary({ id: 'admin-id', name: 'Admin', lastName: 'User', email: 'admin@example.com', status: AccountStatus.ACTIVE }),
          updatedAt: new Date('2023-01-02'),
          updatedBy: new UserSummary({ id: 'updater-id', name: 'Updater', lastName: 'User', email: 'updater@example.com', status: AccountStatus.ACTIVE }),
          deletedAt: new Date('2023-01-03'),
          deletedBy: new UserSummary({ id: 'deleter-id', name: 'Deleter', lastName: 'User', email: 'deleter@example.com', status: AccountStatus.INACTIVE }),
        },
      };
      const user = new User(customProps);

      expect(user.id).toBe('custom-id');
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('hashedpassword');
      expect(user.isAdmin).toBe(true);
      // Admin roles are cleared in the constructor
      expect(user.roles).toEqual([]);
      expect(user.name).toBe('Test');
      expect(user.lastName).toBe('User');
      expect(user.phoneNumber).toBe('1234567890');
      expect(user.address).toBe('123 Test St');
      expect(user.rfc).toBe('ABC123XYZ');
      expect(user.status).toBe(AccountStatus.INACTIVE);
      expect(user.audit).toEqual(customProps.audit);
    });

    it('should clear roles if isAdmin is true', () => {
      const propsWithAdminAndRoles = {
        ...userProps,
        isAdmin: true,
        roles: [BusinessRole.OWNER, BusinessRole.TENANT],
      };
      const user = new User(propsWithAdminAndRoles);
      expect(user.isAdmin).toBe(true);
      expect(user.roles).toEqual([]);
    });
  });

  describe('validateRoleConsistency', () => {
    it('should not throw error for non-admin users without roles', () => {
      const user = new User(userProps);
      expect(() => user.validateRoleConsistency()).not.toThrow();
    });

    it('should not throw error for non-admin users with valid roles and fields', () => {
      const ownerProps = {
        ...userProps,
        roles: [BusinessRole.OWNER],
        phoneNumber: '123',
        address: 'xyz',
        rfc: 'abc',
      };
      const user = new User(ownerProps);
      expect(() => user.validateRoleConsistency()).not.toThrow();

      const tenantProps = {
        ...userProps,
        roles: [BusinessRole.TENANT],
        phoneNumber: '123',
        rfc: 'abc',
      };
      const tenantUser = new User(tenantProps);
      expect(() => tenantUser.validateRoleConsistency()).not.toThrow();

      const accountantProps = {
        ...userProps,
        roles: [BusinessRole.ACCOUNTANT],
      };
      const accountantUser = new User(accountantProps);
      expect(() => accountantUser.validateRoleConsistency()).not.toThrow();
    });

    it('should throw error if Admin has business roles', () => {
      const adminWithRolesProps = {
        ...userProps,
        isAdmin: true,
        roles: [BusinessRole.OWNER], // Roles should be cleared by constructor, but testing explicitly
      };
      // Constructor clears roles, so validateRoleConsistency shouldn't throw here
      const user = new User(adminWithRolesProps);
      expect(() => user.validateRoleConsistency()).not.toThrow();

      // Simulate adding a role after creation (though updateRoles handles this)
      user.roles = [BusinessRole.TENANT];
      expect(() => user.validateRoleConsistency()).toThrow('Admin users cannot have business roles');
    });

    it('should throw error if Owner is missing phone number', () => {
      const ownerMissingPhoneProps = {
        ...userProps,
        roles: [BusinessRole.OWNER],
        address: 'xyz',
        rfc: 'abc',
      };
      const user = new User(ownerMissingPhoneProps);
      expect(() => user.validateRoleConsistency()).toThrow('Phone number is required for Owner or Tenant.');
    });

    it('should throw error if Owner is missing address', () => {
      const ownerMissingAddressProps = {
        ...userProps,
        roles: [BusinessRole.OWNER],
        phoneNumber: '123',
        rfc: 'abc',
      };
      const user = new User(ownerMissingAddressProps);
      expect(() => user.validateRoleConsistency()).toThrow('Address is required for Owner.');
    });

    it('should throw error if Owner is missing rfc', () => {
      const ownerMissingRfcProps = {
        ...userProps,
        roles: [BusinessRole.OWNER],
        phoneNumber: '123',
        address: 'xyz',
      };
      const user = new User(ownerMissingRfcProps);
      expect(() => user.validateRoleConsistency()).toThrow('RFC is required for Owner or Tenant.');
    });

    it('should throw error if Tenant is missing phone number', () => {
      const tenantMissingPhoneProps = {
        ...userProps,
        roles: [BusinessRole.TENANT],
        rfc: 'abc',
      };
      const user = new User(tenantMissingPhoneProps);
      expect(() => user.validateRoleConsistency()).toThrow('Phone number is required for Owner or Tenant.');
    });

    it('should throw error if Tenant is missing rfc', () => {
      const tenantMissingRfcProps = {
        ...userProps,
        roles: [BusinessRole.TENANT],
        phoneNumber: '123',
      };
      const user = new User(tenantMissingRfcProps);
      expect(() => user.validateRoleConsistency()).toThrow('RFC is required for Owner or Tenant.');
    });
  });

  describe('validateRoles', () => {
    it('should clear roles if user is admin', () => {
      const adminUser = new User({ ...userProps, isAdmin: true, roles: [BusinessRole.OWNER] });
      // Constructor calls validateRoles, so roles should be empty
      expect(adminUser.roles).toEqual([]);

      // Test calling validateRoles again
      adminUser.roles = [BusinessRole.TENANT];
      (adminUser as any).validateRoles(); // Access private method for testing
      expect(adminUser.roles).toEqual([]);
    });

    it('should not clear roles if user is not admin', () => {
      const regularUser = new User({ ...userProps, isAdmin: false, roles: [BusinessRole.OWNER] });
      // Constructor calls validateRoles, roles should remain
      expect(regularUser.roles).toEqual([BusinessRole.OWNER]);

      // Test calling validateRoles again
      regularUser.roles = [BusinessRole.TENANT];
      (regularUser as any).validateRoles(); // Access private method for testing
      expect(regularUser.roles).toEqual([BusinessRole.TENANT]);
    });
  });

  describe('hasRole', () => {
    it('should return true if user has the specified role', () => {
      const user = new User({ ...userProps, roles: [BusinessRole.OWNER, BusinessRole.ACCOUNTANT] });
      expect(user.hasRole(BusinessRole.OWNER)).toBe(true);
      expect(user.hasRole(BusinessRole.ACCOUNTANT)).toBe(true);
    });

    it('should return false if user does not have the specified role', () => {
      const user = new User({ ...userProps, roles: [BusinessRole.OWNER] });
      expect(user.hasRole(BusinessRole.TENANT)).toBe(false);
    });

    it('should return false if user has no roles', () => {
      const user = new User(userProps);
      expect(user.hasRole(BusinessRole.OWNER)).toBe(false);
    });
  });

  describe('isActive', () => {
    it('should return true if status is active', () => {
      const user = new User({ ...userProps, status: AccountStatus.ACTIVE });
      expect(user.isActive()).toBe(true);
    });

    it('should return false if status is inactive', () => {
      const user = new User({ ...userProps, status: AccountStatus.INACTIVE });
      expect(user.isActive()).toBe(false);
    });
  });

  describe('markAsDeleted', () => {
    it('should set deletedAt, status to inactive, updatedAt, and updatedBy', () => {
      const user = new User(userProps);
      const initialUpdatedAt = user.audit.updatedAt;
      const initialUpdatedBy = user.audit.updatedBy;

      vi.useFakeTimers();
      const mockNow = new Date(2024, 0, 20, 10, 0, 0);
      vi.setSystemTime(mockNow);

      user.markAsDeleted(mockCurrentUserSummary);

      expect(user.audit.deletedAt).toEqual(mockNow);
      expect(user.status).toBe(AccountStatus.INACTIVE);
      expect(user.audit.updatedAt).toEqual(mockNow);
      expect(user.audit.updatedBy).toBe(mockCurrentUserSummary);

      vi.useRealTimers();
    });

    it('should not modify deleted user if already marked as deleted', () => {
      const deletedUserProps = {
        ...userProps,
        status: AccountStatus.INACTIVE,
        audit: {
          ...initialAudit,
          deletedAt: new Date('2023-10-01'),
          deletedBy: new UserSummary({ id: 'deleter-id', name: 'Deleter', lastName: 'User', email: 'deleter@example.com', status: AccountStatus.ACTIVE }),
        },
      };
      const user = new User(deletedUserProps);
      const initialDeletedAt = user.audit.deletedAt;
      const initialDeletedBy = user.audit.deletedBy;
      const initialStatus = user.status;

      vi.useFakeTimers();
      const mockNow = new Date(2024, 0, 20, 10, 0, 0);
      vi.setSystemTime(mockNow);

      user.markAsDeleted(mockCurrentUserSummary);

      expect(user.audit.deletedAt).toEqual(initialDeletedAt);
      expect(user.status).toBe(initialStatus);
      // Updated fields should also not change if already deleted
      expect(user.audit.updatedAt).toBe(deletedUserProps.audit.updatedAt);
      expect(user.audit.updatedBy).toBe(deletedUserProps.audit.updatedBy);
      expect(user.audit.deletedBy).toBe(initialDeletedBy);


      vi.useRealTimers();
    });
  });

  describe('updateRoles', () => {
    it('should update roles for non-admin users', () => {
      const user = new User(userProps);
      const newRoles = [BusinessRole.OWNER, BusinessRole.ACCOUNTANT];
      user.updateRoles(newRoles);
      expect(user.roles).toEqual(expect.arrayContaining(newRoles));
      expect(user.roles.length).toBe(newRoles.length);
    });

    it('should remove duplicate roles', () => {
      const user = new User(userProps);
      const newRoles = [BusinessRole.OWNER, BusinessRole.OWNER, BusinessRole.TENANT];
      user.updateRoles(newRoles);
      expect(user.roles).toEqual(expect.arrayContaining([BusinessRole.OWNER, BusinessRole.TENANT]));
      expect(user.roles.length).toBe(2);
    });

    it('should clear roles if user becomes admin', () => {
      const user = new User({ ...userProps, roles: [BusinessRole.OWNER] });
      user.isAdmin = true; // Simulate becoming admin
      user.updateRoles([BusinessRole.TENANT]); // Try to add roles as admin
      expect(user.roles).toEqual([]);
    });

    it('should filter out invalid roles', () => {
        const user = new User(userProps);
        const newRoles = [BusinessRole.OWNER, 'INVALID_ROLE' as BusinessRole, BusinessRole.TENANT];
        user.updateRoles(newRoles);
        expect(user.roles).toEqual(expect.arrayContaining([BusinessRole.OWNER, BusinessRole.TENANT]));
        expect(user.roles.length).toBe(2);
    });
  });

  describe('validateRequiredFields', () => {
    it('should not throw error for admin users', () => {
      const adminUser = new User({ ...userProps, isAdmin: true });
      expect(() => adminUser.validateRequiredFields()).not.toThrow();
    });

    it('should not throw error for non-admin users without specific roles', () => {
      const regularUser = new User(userProps);
      expect(() => regularUser.validateRequiredFields()).not.toThrow();
    });

    it('should not throw error for Owner with required fields', () => {
      const ownerUser = new User({
        ...userProps,
        roles: [BusinessRole.OWNER],
        phoneNumber: '123',
        address: 'xyz',
        rfc: 'abc',
      });
      expect(() => ownerUser.validateRequiredFields()).not.toThrow();
    });

    it('should throw error for Owner missing phone number', () => {
      const ownerMissingPhone = new User({
        ...userProps,
        roles: [BusinessRole.OWNER],
        address: 'xyz',
        rfc: 'abc',
      });
      expect(() => ownerMissingPhone.validateRequiredFields()).toThrow('Phone number is required for Owner or Tenant.');
    });

    it('should throw error for Owner missing address', () => {
      const ownerMissingAddress = new User({
        ...userProps,
        roles: [BusinessRole.OWNER],
        phoneNumber: '123',
        rfc: 'abc',
      });
      expect(() => ownerMissingAddress.validateRequiredFields()).toThrow('Address is required for Owner.');
    });

    it('should throw error for Owner missing rfc', () => {
        const ownerMissingRfc = new User({
            ...userProps,
            roles: [BusinessRole.OWNER],
            phoneNumber: '123',
            address: 'xyz',
        });
        expect(() => ownerMissingRfc.validateRequiredFields()).toThrow('RFC is required for Owner.');
    });

    it('should not throw error for Tenant with required fields', () => {
      const tenantUser = new User({
        ...userProps,
        roles: [BusinessRole.TENANT],
        phoneNumber: '123',
        rfc: 'abc',
      });
      expect(() => tenantUser.validateRequiredFields()).not.toThrow();
    });

    it('should throw error for Tenant missing phone number', () => {
      const tenantMissingPhone = new User({
        ...userProps,
        roles: [BusinessRole.TENANT],
        rfc: 'abc',
      });
      expect(() => tenantMissingPhone.validateRequiredFields()).toThrow('Phone number is required for Owner or Tenant.');
    });

    it('should throw error for Tenant missing rfc', () => {
        const tenantMissingRfc = new User({
            ...userProps,
            roles: [BusinessRole.TENANT],
            phoneNumber: '123',
        });
        expect(() => tenantMissingRfc.validateRequiredFields()).toThrow('RFC is required for Tenant.');
    });
  });
});