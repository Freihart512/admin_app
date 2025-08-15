import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { User } from '../user.entity';
import { BusinessRoles, AccountStatuses } from '../../user.types';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { EmailAddress } from '../../value-objects/email-address.value-object';
import { PhoneNumber } from '../../value-objects/phone-number.value-object';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { Password } from '../../value-objects/password.value-object';
import { UserSummary } from '../../value-objects/user-summary.value-object';
import {
  AdminCannotHaveBusinessRolesError,
  NonAdminMustHaveRolesError,
  FieldRequiredForRoleError,
  AddressRequiredForOwnerError,
  RoleUserCannotBeAdminError,
} from '../../errors';
import { UuidValidatorPort } from '../../../@shared/ports/uuid.validator.port';
import { RFCValidatorPort } from '../../../@shared/ports/rfc.validator.port';
import { HashingService } from '../../../@shared/ports/hashing.service.port';
import { BusinessRoleType } from '../../user.types';

describe('User Entity', () => {
  // Mock validators and hashing service for VO instantiation in tests
  const mockUuidValidator: UuidValidatorPort = {
    validate: vi.fn().mockReturnValue(true),
  };
  const mockRfcValidator: RFCValidatorPort = {
    validate: vi.fn().mockReturnValue(true),
  };
  const mockHashingService: HashingService = {
    hash: vi.fn().mockResolvedValue('hashedPass'),
    compare: vi.fn().mockResolvedValue(true),
    validateHash: vi.fn(() => true),
  };

  let mockUserSummary: UserSummary;

  beforeEach(() => {
    vi.clearAllMocks();
    // Register validators for UUID and RFC on each run
    UUID.registerValidator(mockUuidValidator);
    RFC.registerValidator(mockRfcValidator);
    // Register the hashing service globally for Password value object
    Password.registerHasher(mockHashingService);

    // Mock UserSummary for audit fields
    mockUserSummary = UserSummary.create({
      id: UUID.create('updater-user-id'),
      email: EmailAddress.create('updater@example.com'),
      name: 'updater',
      lastName: 'user',
      status: AccountStatuses.ACTIVE,
    });
  });

  afterEach(() => {
    // Reset the Password hasher to avoid cross-test contamination
    Password.resetForTests();
  });

  describe('Constructor (User Creation)', () => {
    it('should create a valid User object with required properties', async () => {
      const userProps = {
        id: UUID.create('valid-id'),
        email: EmailAddress.create('test@example.com'),
        password: await Password.create('leq,O24@#yZ1'),
        isAdmin: false,
        roles: [BusinessRoles.OWNER, BusinessRoles.TENANT],
        name: 'John',
        lastName: 'Doe',
        phoneNumber: PhoneNumber.create('1234567890'),
        address: '123 Street, City, Country', // Owner requires address
        rfc: RFC.create('MHTR93041179A'), // Owner and Tenant require RFC
        status: AccountStatuses.ACTIVE,
      };

      const user = new User(userProps);

      expect(user.getId()).toBeDefined();
      expect(user.getEmail().getValue()).toBe('test@example.com');
      expect(user.getRoles()).toEqual([
        BusinessRoles.OWNER,
        BusinessRoles.TENANT,
      ]);
      expect(user.getName()).toBe('John');
      expect(user.getStatus()).toBe(AccountStatuses.ACTIVE);
    });

    it('should throw AdminCannotHaveBusinessRolesError if admin is created with business roles', async () => {
      const props = {
        id: UUID.create('admin-id'),
        email: EmailAddress.create('test@example.com'),
        password: await Password.create('leq,O24@#yZ1'),
        isAdmin: true,
        roles: [BusinessRoles.OWNER], // Admins cannot have roles
        name: 'John',
        lastName: 'Doe',
        status: AccountStatuses.ACTIVE,
      };
      expect(() => new User(props)).toThrow(AdminCannotHaveBusinessRolesError);
    });

    it('should throw NonAdminMustHaveRolesError if non-admin user is created with no roles', async () => {
      const props = {
        id: UUID.create('user-id'),
        email: EmailAddress.create('test@example.com'),
        password: await Password.create('leq,O24@#yZ1'),
        isAdmin: false,
        roles: [], // Non-admin must have at least one role
        name: 'John',
        lastName: 'Doe',
        status: AccountStatuses.ACTIVE,
      };
      expect(() => new User(props)).toThrow(NonAdminMustHaveRolesError);
    });

    it('should throw FieldRequiredForRoleError if RFC is missing for OWNER role', async () => {
      const props = {
        id: UUID.create('rfc-missing-id'),
        email: EmailAddress.create('test@example.com'),
        password: await Password.create('leq,O24@#yZ1'),
        isAdmin: false,
        roles: [BusinessRoles.OWNER],
        name: 'John',
        lastName: 'Doe',
        phoneNumber: PhoneNumber.create('1234567890'),
        address: '123 Street, City, Country',
        rfc: undefined, // Missing RFC
        status: AccountStatuses.ACTIVE,
      };
      expect(() => new User(props)).toThrow(FieldRequiredForRoleError);
    });

    it('should throw FieldRequiredForRoleError if phone number is missing for ACCOUNTANT role', async () => {
      const props = {
        id: UUID.create('phone-missing-id'),
        email: EmailAddress.create('test@example.com'),
        password: await Password.create('leq,O24@#yZ1'),
        isAdmin: false,
        roles: [BusinessRoles.ACCOUNTANT],
        name: 'John',
        lastName: 'Doe',
        address: '123 Street, City, Country',
        rfc: RFC.create('MHTR93041179A'),
        status: AccountStatuses.ACTIVE,
        phoneNumber: undefined, // Missing phone number
      };
      expect(() => new User(props)).toThrow(FieldRequiredForRoleError);
    });

    it('should throw AddressRequiredForOwnerError if address is missing for OWNER role', async () => {
      const props = {
        id: UUID.create('address-missing-id'),
        email: EmailAddress.create('test@example.com'),
        password: await Password.create('leq,O24@#yZ1'),
        isAdmin: false,
        roles: [BusinessRoles.OWNER],
        name: 'John',
        lastName: 'Doe',
        phoneNumber: PhoneNumber.create('1234567890'),
        rfc: RFC.create('MHTR93041179A'),
        address: undefined, // Missing address
        status: AccountStatuses.ACTIVE,
      };
      expect(() => new User(props)).toThrow(AddressRequiredForOwnerError);
    });
  });

  describe('Getters and Helpers', () => {
    it('should return true for getIsAdmin() if the user is an admin', async () => {
      const adminUser = new User({
        id: UUID.create('admin-check-id'),
        email: EmailAddress.create('admin@example.com'),
        password: await Password.create('password123!'),
        isAdmin: true,
        roles: [],
        name: 'Admin',
        lastName: 'User',
        status: AccountStatuses.ACTIVE,
      });
      expect(adminUser.getIsAdmin()).toBe(true);
    });

    it('should return false for getIsAdmin() if the user is not an admin', async () => {
      const regularUser = new User({
        id: UUID.create('regular-user-check-id'),
        email: EmailAddress.create('user@example.com'),
        password: await Password.create('leq,O24@#yZ1!'),
        isAdmin: false,
        roles: [BusinessRoles.TENANT],
        name: 'Regular',
        lastName: 'User',
        phoneNumber: PhoneNumber.create('1234567890'),
        rfc: RFC.create('TENANT-RFC'),
        status: AccountStatuses.ACTIVE,
      });
      expect(regularUser.getIsAdmin()).toBe(false);
    });
  });

  describe('Update Methods', () => {
    let baseUser: User;

    beforeEach(async () => {
      const userProps = {
        id: UUID.create('base-user-id'),
        email: EmailAddress.create('base@example.com'),
        password: await Password.create('leq,O24@#yZ1!'),
        isAdmin: false,
        roles: [BusinessRoles.TENANT],
        name: 'Base',
        lastName: 'User',
        phoneNumber: PhoneNumber.create('1234567890'),
        rfc: RFC.create('BASE-RFC'),
        status: AccountStatuses.ACTIVE,
        audit: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: mockUserSummary,
          updatedBy: mockUserSummary,
          deletedAt: null,
          deletedBy: null,
        },
      };
      baseUser = new User(userProps);
    });

    it('should return a new instance with updated properties on every update', () => {
      const newEmail = EmailAddress.create('new@example.com');
      const updatedUser = baseUser.updateEmail(newEmail, mockUserSummary);
      expect(updatedUser).not.toBe(baseUser);
      expect(updatedUser.getEmail()).toEqual(newEmail);
      expect(updatedUser.getId()).toBe(baseUser.getId());
    });

    it('should update audit fields correctly on every update', () => {
      const originalAudit = baseUser.getAudit();
      const updatedUser = baseUser.updateName('New Name', mockUserSummary);
      const updatedAudit = updatedUser.getAudit();

      expect(originalAudit).toBeDefined();
      expect(updatedAudit).toBeDefined();

      expect(updatedAudit!.updatedBy!.id.getValue()).toBe(
        mockUserSummary.id.getValue(),
      );
      expect(updatedAudit!.updatedAt!.getTime()).toBeGreaterThan(
        originalAudit!.updatedAt!.getTime(),
      );
      expect(updatedAudit!.createdAt).toEqual(originalAudit!.createdAt);
    });

    it('should correctly update email', () => {
      const newEmail = EmailAddress.create('new.email@example.com');
      const updatedUser = baseUser.updateEmail(newEmail, mockUserSummary);
      expect(updatedUser.getEmail()).toEqual(newEmail);
      expect(updatedUser.getName()).toBe(baseUser.getName());
    });

    it('should correctly update password', async () => {
      const newPassword = await Password.create('Z1O24@#yleq,');
      const updatedUser = baseUser.updatePassword(newPassword, mockUserSummary);
      expect(updatedUser.getPassword()).toEqual(newPassword);
      expect(updatedUser.getEmail()).toEqual(baseUser.getEmail());
    });

    it('should correctly update phone number', () => {
      const newPhoneNumber = PhoneNumber.create('9998887777');
      const updatedUser = baseUser.updatePhoneNumber(
        newPhoneNumber,
        mockUserSummary,
      );
      expect(updatedUser.getPhoneNumber()).toEqual(newPhoneNumber);
    });

    it('should correctly update address', () => {
      const newAddress = 'New Address';
      const updatedUser = baseUser.updateAddress(newAddress, mockUserSummary);
      expect(updatedUser.getAddress()).toBe(newAddress);
    });

    it('should correctly update RFC', () => {
      const newRfc = RFC.create('NEW-RFC-VALUE');
      const updatedUser = baseUser.updateRfc(newRfc, mockUserSummary);
      expect(updatedUser.getRfc()).toEqual(newRfc);
    });

    it('should correctly update status', () => {
      const newStatus = AccountStatuses.INACTIVE;
      const updatedUser = baseUser.updateStatus(newStatus, mockUserSummary);
      expect(updatedUser.getStatus()).toBe(newStatus);
    });

    it('should correctly update name', () => {
      const newName = 'NewName';
      const updatedUser = baseUser.updateName(newName, mockUserSummary);
      expect(updatedUser.getName()).toBe(newName);
    });

    it('should correctly update last name', () => {
      const newLastName = 'NewLastName';
      const updatedUser = baseUser.updateLastName(newLastName, mockUserSummary);
      expect(updatedUser.getLastName()).toBe(newLastName);
    });

    it('should correctly update roles for a non-admin user', () => {
      const newRoles = [BusinessRoles.OWNER, BusinessRoles.ACCOUNTANT];
      const updatedUser = baseUser.updateRoles(newRoles, mockUserSummary);

      // The user now needs to fulfill the requirements for OWNER and ACCOUNTANT
      const finalUser = updatedUser
        .updateAddress('New Address for Owner', mockUserSummary)
        .updateRfc(RFC.create('NEW-RFC-FOR-OWNER'), mockUserSummary);

      const audit = finalUser.getAudit();
      expect(audit).toBeDefined();
      expect(finalUser.getRoles()).toEqual(expect.arrayContaining(newRoles));
      expect(audit!.updatedBy!.id.getValue()).toBe(
        mockUserSummary.id.getValue(),
      );
    });

    it('should throw RoleUserCannotBeAdminError when trying to update roles for an admin user', async () => {
      const adminUser = new User({
        id: UUID.create('admin-roles-id'),
        email: EmailAddress.create('admin@example.com'),
        password: await Password.create('password123!'),
        isAdmin: true,
        roles: [],
        name: 'Admin',
        lastName: 'User',
        status: AccountStatuses.ACTIVE,
      });
      const newRoles = [BusinessRoles.OWNER];
      expect(() => adminUser.updateRoles(newRoles, mockUserSummary)).toThrow(
        RoleUserCannotBeAdminError,
      );
    });

    it('should throw NonAdminMustHaveRolesError when updating roles to an empty array for a non-admin user', () => {
      const newRoles: BusinessRoleType[] = [];
      expect(() => baseUser.updateRoles(newRoles, mockUserSummary)).toThrow(
        NonAdminMustHaveRolesError,
      );
    });
  });

  describe('Helper Methods', () => {
    let user: User;

    beforeEach(async () => {
      const userProps = {
        id: UUID.create('helper-methods-id'),
        email: EmailAddress.create('helper@example.com'),
        password: await Password.create('password123!'),
        isAdmin: false,
        roles: [BusinessRoles.OWNER, BusinessRoles.TENANT],
        name: 'Helper',
        lastName: 'User',
        phoneNumber: PhoneNumber.create('1234567890'),
        address: '123 Helper St',
        rfc: RFC.create('HELPER-RFC'),
        status: AccountStatuses.ACTIVE,
      };
      user = new User(userProps);
    });

    it('hasRole should return true if the user has the role', () => {
      expect(user.hasRole(BusinessRoles.OWNER)).toBe(true);
      expect(user.hasRole(BusinessRoles.TENANT)).toBe(true);
    });

    it('hasRole should return false if the user does not have the role', () => {
      expect(user.hasRole(BusinessRoles.ACCOUNTANT)).toBe(false);
    });

    it('isActive should return true when status is ACTIVE', () => {
      expect(user.isActive()).toBe(true);
    });

    it('isActive should return false when status is not ACTIVE', () => {
      const inactiveUser = user.updateStatus(
        AccountStatuses.INACTIVE,
        mockUserSummary,
      );
      expect(inactiveUser.isActive()).toBe(false);
    });

    it('isOwner should return true if the user has the OWNER role', () => {
      expect(user.isOwner()).toBe(true);
    });

    it('isTenant should return true if the user has the TENANT role', () => {
      expect(user.isTenant()).toBe(true);
    });

    it('isAccountant should return false if the user does not have the ACCOUNTANT role', () => {
      expect(user.isAccountant()).toBe(false);
    });
  });
});
