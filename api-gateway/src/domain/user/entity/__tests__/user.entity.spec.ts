import { describe, it, expect, vi } from 'vitest';
import { User } from '../user.entity';
import { BusinessRole, AccountStatus } from '../../user.types';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { EmailAddress } from '../../value-objects/email-address.value-object';
import { PhoneNumber } from '../../value-objects/phone-number.value-object';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { Password } from '../../value-objects/password.value-object';
import { AdminCannotHaveBusinessRolesError, NonAdminMustHaveRolesError, RoleUserCannotBeAdminError, FieldRequiredForRoleError, AddressRequiredForOwnerError } from '../../errors';
import { UUIDValidator } from '../../../@shared/ports/uuid.validator.port';
import { RFCValidator } from '../../../@shared/ports/rfc.validator.port';
import { HashingService } from '../../../@shared/ports/hashing.service.port';
import { UserSummaryType } from '@domain/user/user.types';

describe('User Class Tests', () => {
  //  Mock validators and hashing service for VO instantiation in tests
  const mockUuidValidator: UUIDValidator = { validate: vi.fn().mockReturnValue(true) };
  const mockRfcValidator: RFCValidator = { validate: vi.fn().mockReturnValue(true) };
  const mockHashingService: HashingService = {
    hash: vi.fn().mockResolvedValue('hashedPass'),
    compare: vi.fn().mockResolvedValue(true),
  };

  // Mock UserSummary for audit fields
  const mockUserSummary: UserSummaryType = {
    id: 'updater-user-id',
    email: 'updater@example.com',
  };
  it('should throw AdminCannotHaveBusinessRolesError if an admin tries to have business roles', async () => {
    const userProps = {
      id: UUID.create('123', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('leq,O24@#yZ1', mockHashingService),
      isAdmin: true,
      roles: [BusinessRole.OWNER],
      name: 'John',
      lastName: 'Doe',
      phoneNumber: PhoneNumber.create('1234567890'),
      address: '123 Street, City, Country',
      rfc: RFC.create('MHTR93041179A', mockRfcValidator),
      status: AccountStatus.ACTIVE,
    };

    expect(() => { new User(userProps) }).toThrowError(AdminCannotHaveBusinessRolesError);
  });



  it('should create a valid User object with required properties', async () => {
    const userProps = {
      id: UUID.create('valid-id', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('leq,O24@#yZ1', mockHashingService),
      isAdmin: false,
      roles: [BusinessRole.OWNER, BusinessRole.TENANT],
      name: 'John',
      lastName: 'Doe',
      phoneNumber: PhoneNumber.create('1234567890'),
      address: '123 Street, City, Country', // Owner requires address
      rfc: RFC.create('MHTR93041179A', mockRfcValidator), // Owner requires RFC
      status: AccountStatus.ACTIVE,
    };

    const user = new User(userProps);

    expect(user.getId()).toBeDefined();
    expect(user.getEmail().getValue()).toBe('test@example.com');
    expect(user.getRoles()).toEqual([BusinessRole.OWNER, BusinessRole.TENANT]);
    expect(user.getName()).toBe('John');
    expect(user.getStatus()).toBe(AccountStatus.ACTIVE);
  });


  it('should throw AdminCannotHaveBusinessRolesError if admin is created with business roles', async () => {
    const userProps = {
      id: UUID.create('admin-id', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('leq,O24@#yZ1', mockHashingService),
      isAdmin: true,
      roles: [BusinessRole.OWNER],
      name: 'John',
      lastName: 'Doe',
      status: AccountStatus.ACTIVE
    };

    expect(() => { new User(userProps) }).toThrowError(new AdminCannotHaveBusinessRolesError());
  });


  it('should throw NonAdminMustHaveRolesError if non-admin user is created with no roles', async () => {
    const userProps = {
      id: UUID.create('user-id', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('leq,O24@#yZ1', mockHashingService),
      isAdmin: false,
      roles: [], // Non-admin must have roles
      name: 'John',
      lastName: 'Doe',
      // No need for optional fields here as the error is for missing roles
      status: AccountStatus.ACTIVE,
    };

    expect(() => {
      new User({
        ...userProps,
        email: EmailAddress.create('test@example.com'),
        password: Password.fromHash(userProps.password),
      });
    }).toThrowError(NonAdminMustHaveRolesError);
  });

  it('should throw RoleUserCannotBeAdminError when trying to update roles of an admin user', async () => {
    const adminUser = new User({
      id: UUID.create('admin-id', mockUuidValidator),
      email: EmailAddress.create('admin@example.com'), // Use EmailAddress.create
      password: Password.fromHash('hashedpassword'),
      isAdmin: true,
      roles: [], // Admins have no business roles
      name: 'Admin',
      lastName: 'User',
      status: AccountStatus.ACTIVE,
    });

    expect(() => {
      adminUser.updateRoles([BusinessRole.OWNER]);
      // Pass a mock UserSummary for the audit fields
    }, mockUserSummary).toThrowError(RoleUserCannotBeAdminError);
  });


  it('should correctly update roles without modifying other properties and return a new instance', async () => {
    const userProps = {
      id: UUID.create('update-id', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('leq,O24@#yZ1', mockHashingService),
      isAdmin: false,
      roles: [BusinessRole.TENANT],
      name: 'John',
      lastName: 'Doe',
      phoneNumber: PhoneNumber.create('1234567890'),
      address: '123 Street, City, Country', // Required for existing OWNER role
      rfc: RFC.create('MHTR93041179A', mockRfcValidator), // Required for existing OWNER role
      status: AccountStatus.ACTIVE,
      audit: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
      },
    };

    const user = new User(userProps);
    const updatedUser = user.updateRoles([BusinessRole.OWNER], mockUserSummary); // Pass mockUserSummary

    expect(updatedUser.getRoles()).toEqual([BusinessRole.OWNER]);
    expect(updatedUser.getEmail()).toEqual(user.getEmail()); // Ensures email is unchanged
    expect(updatedUser.getName()).toBe(user.getName()); // Ensures name is unchanged
    expect(updatedUser).not.toBe(user); // Ensures a new instance is returned
  });


  it('should throw FieldRequiredForRoleError if RFC is missing for OWNER role on creation', async () => {
    const userPropsBase = {
      id: UUID.create('rfc-missing-id', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('leq,O24@#yZ1', mockHashingService),
      isAdmin: false,
      roles: [BusinessRole.OWNER],
      name: 'John',
      lastName: 'Doe',
      phoneNumber: PhoneNumber.create('1234567890'),
      address: '123 Street, City, Country',
      rfc: undefined, // Missing RFC
      status: AccountStatus.ACTIVE,
      audit: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
      }
    };
    const userProps = {
      ...userPropsBase,
      address: '123 Street, City, Country', // Address is also required for Owner
      phoneNumber: PhoneNumber.create('1234567890'), // Phone Number is also required for Owner
    };

    expect(() => {
      new User({
        ...userProps,
        email: EmailAddress.create('test@example.com'),
        password: Password.fromHash(userProps.password),
      });
    }).toThrowError(FieldRequiredForRoleError); // RFC is required for OWNER role
  });


  it('should throw FieldRequiredForRoleError if phone number is missing for ACCOUNTANT role on creation', async () => {
    const userProps = {
      id: UUID.create('phone-missing-id', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('leq,O24@#yZ1', mockHashingService),
      isAdmin: false,
      roles: [BusinessRole.ACCOUNTANT],
      name: 'John',
      lastName: 'Doe',
      address: '123 Street, City, Country',
      rfc: RFC.create('MHTR93041179A', mockRfcValidator),
      status: AccountStatus.ACTIVE,
    };

    expect(() => { new User(userProps) }).toThrowError(new FieldRequiredForRoleError('phone number', BusinessRole.ACCOUNTANT));
  });


  it('should throw AddressRequiredForOwnerError if address is missing for OWNER role on creation', async () => {
    const userPropsBase = {
      id: UUID.create('address-missing-id', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('leq,O24@#yZ1', mockHashingService),
      isAdmin: false,
      roles: [BusinessRole.OWNER],
      name: 'John',
      lastName: 'Doe',
      phoneNumber: PhoneNumber.create('1234567890'),
      rfc: RFC.create('MHTR93041179A', mockRfcValidator), // RFC is also required for Owner
      status: AccountStatus.ACTIVE,
    };
    expect(() => {
      new User(userPropsBase)
    }).toThrowError(AddressRequiredForOwnerError);
  })

  it('should return true for getIsAdmin() if the user is an admin', () => {
    const adminUser = new User({
      id: UUID.create('admin-check-id', mockUuidValidator),
      email: EmailAddress.create('admin@example.com'),
      password: Password.fromHash('hashedpassword'),
      isAdmin: true,
      roles: [], // Admins have no business roles
      name: 'Admin',
      lastName: 'User',
      status: AccountStatus.ACTIVE,
    });

    expect(adminUser.getIsAdmin()).toBe(true);
  });


  it('should return false for getIsAdmin() if the user is not an admin', async () => {
    const regularUser = new User({
      id: UUID.create('regular-user-check-id', mockUuidValidator),
      email: EmailAddress.create('user@example.com'),
      password: await Password.create('leq,O24@#yZ1!', mockHashingService),
      isAdmin: false,
      roles: [BusinessRole.TENANT],
      name: 'Regular',
      lastName: 'User',
      phoneNumber: PhoneNumber.create('1234567890'), // Tenant requires phone number
      rfc: RFC.create('TENANT-RFC', mockRfcValidator), // Tenant requires RFC
      status: AccountStatus.ACTIVE,
    });

    expect(regularUser.getIsAdmin()).toBe(false);
  });

  // --- New tests for update methods ---

  it('should correctly update email without modifying other properties and return a new instance', async () => {
    const userProps = {
      id: UUID.create('update-email-id', mockUuidValidator),
      email: EmailAddress.create('old.email@example.com'),
      password: await Password.create('leq,O24@#yZ1!', mockHashingService),
      isAdmin: false,
      roles: [BusinessRole.TENANT],
      name: 'Update',
      lastName: 'Email',
      phoneNumber: PhoneNumber.create('1234567890'),
      rfc: RFC.create('OLD-RFC', mockRfcValidator),
      status: AccountStatus.ACTIVE,
      audit: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'creator',
        updatedBy: 'creator',
      },
    };

    const user = new User(userProps);
    const newEmail = EmailAddress.create('new.email@example.com');
    const updatedUser = user.updateEmail(newEmail, mockUserSummary);

    expect(updatedUser.getEmail()).toEqual(newEmail);
    expect(updatedUser.getId()).toBe(user.getId());
    expect(updatedUser.getName()).toBe(user.getName());
    expect(updatedUser.getAudit().updatedBy).toBe(mockUserSummary.id);
    expect(updatedUser.getAudit().updatedAt).toBeInstanceOf(Date);
    expect(updatedUser.getAudit().updatedAt.getTime()).toBeGreaterThanOrEqual(user.getAudit().updatedAt.getTime());
    expect(updatedUser).not.toBe(user);
  });

  it('should correctly update password without modifying other properties and return a new instance', async () => {
    const userProps = {
      id: UUID.create('update-password-id', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('oldpassword', mockHashingService),
      isAdmin: false,
      roles: [BusinessRole.TENANT],
      name: 'Update',
      lastName: 'Password',
      phoneNumber: PhoneNumber.create('1234567890'),
      rfc: RFC.create('RFC-UPDATE-PASS', mockRfcValidator),
      status: AccountStatus.ACTIVE,
      audit: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'creator',
        updatedBy: 'creator',
      },
    };

    const user = new User(userProps);
    const newPassword = await Password.create('newpassword', mockHashingService);
    const updatedUser = user.updatePassword(newPassword, mockUserSummary);

    expect(updatedUser.getPassword()).toEqual(newPassword);
    expect(updatedUser.getId()).toBe(user.getId());
    expect(updatedUser.getEmail()).toEqual(user.getEmail());
    expect(updatedUser.getAudit().updatedBy).toBe(mockUserSummary.id);
    expect(updatedUser.getAudit().updatedAt).toBeInstanceOf(Date);
    expect(updatedUser).not.toBe(user);
  });

  it('should correctly update phone number without modifying other properties and return a new instance', async () => {
    const userProps = {
      id: UUID.create('update-phone-id', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('leq,O24@#yZ1!', mockHashingService),
      isAdmin: false,
      roles: [BusinessRole.TENANT],
      name: 'Update',
      lastName: 'Phone',
      phoneNumber: PhoneNumber.create('1112223333'),
      rfc: RFC.create('RFC-UPDATE-PHONE', mockRfcValidator),
      status: AccountStatus.ACTIVE,
      audit: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'creator',
        updatedBy: 'creator',
      },
    };

    const user = new User(userProps);
    const newPhoneNumber = PhoneNumber.create('9998887777');
    const updatedUser = user.updatePhoneNumber(newPhoneNumber, mockUserSummary);

    expect(updatedUser.getPhoneNumber()).toEqual(newPhoneNumber);
    expect(updatedUser.getId()).toBe(user.getId());
    expect(updatedUser.getName()).toBe(user.getName());
    expect(updatedUser.getAudit().updatedBy).toBe(mockUserSummary.id);
    expect(updatedUser.getAudit().updatedAt).toBeInstanceOf(Date);
    expect(updatedUser).not.toBe(user);
  });

  it('should correctly update address without modifying other properties and return a new instance', async () => {
    const userProps = {
      id: UUID.create('update-address-id', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('leq,O24@#yZ1!', mockHashingService),
      isAdmin: false,
      roles: [BusinessRole.TENANT],
      name: 'Update',
      lastName: 'Address',
      phoneNumber: PhoneNumber.create('1234567890'),
      address: 'Old Address',
      rfc: RFC.create('RFC-UPDATE-ADDRESS', mockRfcValidator),
      status: AccountStatus.ACTIVE,
      audit: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'creator',
        updatedBy: 'creator',
      },
    };

    const user = new User(userProps);
    const newAddress = 'New Address';
    const updatedUser = user.updateAddress(newAddress, mockUserSummary);

    expect(updatedUser.getAddress()).toBe(newAddress);
    expect(updatedUser.getId()).toBe(user.getId());
    expect(updatedUser.getName()).toBe(user.getName());
    expect(updatedUser.getAudit().updatedBy).toBe(mockUserSummary.id);
    expect(updatedUser.getAudit().updatedAt).toBeInstanceOf(Date);
    expect(updatedUser).not.toBe(user);
  });

  it('should correctly update RFC without modifying other properties and return a new instance', async () => {
    const userProps = {
      id: UUID.create('update-rfc-id', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('leq,O24@#yZ1!', mockHashingService),
      isAdmin: false,
      roles: [BusinessRole.TENANT],
      name: 'Update',
      lastName: 'RFC',
      phoneNumber: PhoneNumber.create('1234567890'),
      address: 'Test Address',
      rfc: RFC.create('OLD-RFC-VALUE', mockRfcValidator),
      status: AccountStatus.ACTIVE,
      audit: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'creator',
        updatedBy: 'creator',
      },
    };

    const user = new User(userProps);
    const newRfc = RFC.create('NEW-RFC-VALUE', mockRfcValidator);
    const updatedUser = user.updateRfc(newRfc, mockUserSummary);

    expect(updatedUser.getRfc()).toEqual(newRfc);
    expect(updatedUser.getId()).toBe(user.getId());
    expect(updatedUser.getName()).toBe(user.getName());
    expect(updatedUser.getAudit().updatedBy).toBe(mockUserSummary.id);
    expect(updatedUser.getAudit().updatedAt).toBeInstanceOf(Date);
    expect(updatedUser).not.toBe(user);
  });

  it('should correctly update status without modifying other properties and return a new instance', async () => {
    const userProps = {
      id: UUID.create('update-status-id', mockUuidValidator),
      email: EmailAddress.create('test@example.com'),
      password: await Password.create('leq,O24@#yZ1!', mockHashingService),
      isAdmin: false,
      roles: [BusinessRole.TENANT],
      name: 'Update',
      lastName: 'Status',
      phoneNumber: PhoneNumber.create('1234567890'),
      address: 'Test Address',
      rfc: RFC.create('RFC-UPDATE-STATUS', mockRfcValidator),
      status: AccountStatus.ACTIVE,
      audit: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'creator',
        updatedBy: 'creator',
      },
    };

    const user = new User(userProps);
    const newStatus = AccountStatus.INACTIVE;
    const updatedUser = user.updateStatus(newStatus, mockUserSummary);

    expect(updatedUser.getStatus()).toBe(newStatus);
    expect(updatedUser.getId()).toBe(user.getId());
    expect(updatedUser.getName()).toBe(user.getName());
    expect(updatedUser.getAudit().updatedBy).toBe(mockUserSummary.id);
    expect(updatedUser.getAudit().updatedAt).toBeInstanceOf(Date);
    expect(updatedUser).not.toBe(user);
  });
});

