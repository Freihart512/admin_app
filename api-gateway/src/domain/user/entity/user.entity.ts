import { v4 as uuidv4 } from 'uuid';
import { BusinessRole, AccountStatus, AuditFields } from '../../../@shared/core/types';
import { EmailAddress } from '../value-objects/email-address.value-object';
import { Password } from '../value-objects/password.value-object';

import { RFC } from '../../@shared/value-objects/rfc.value-object';
import { PhoneNumber } from '../value-objects/phone-number.value-object';
import { UserSummary } from '../value-objects/user-summary.value-object';
// Export the User class
// Export the User class
export class User { // Export the User class
  public readonly id: string;
  public email: EmailAddress;
  public passwordHash: Password;
 public isAdmin: boolean;
  public roles: BusinessRole[];

  // PII
  public name: string;
  public lastName: string;
  public phoneNumber?: PhoneNumber | null | undefined;
  public address?: string | null | undefined;
 public rfc?: RFC | null | undefined;

  // Account status
  public status: AccountStatus;

 public readonly audit: AuditFields; // Should be part of the constructor props

  constructor(props: {
    email: string;
    passwordHash: string;
    isAdmin?: boolean; // Make optional with default
    name: string;
    lastName: string;
    roles?: BusinessRole[] | null;
    phoneNumber?: string | null;
    address?: string | null;
    rfc?: string | null;
    status?: AccountStatus; // Use the enum type directly
    id?: string; // Make optional to allow UUID generation
    audit: AuditFields; // Accept audit fields as a single object
    deletedAt?: Date | null,
  }) {
    // Use default values where applicable
    this.id = props.id || uuidv4();
    this.email = new EmailAddress(props.email);
    this.passwordHash = Password.fromHash(props.passwordHash);
    this.isAdmin = props.isAdmin ?? false;
    this.roles = props.roles || [];
    this.name = props.name;
    this.lastName = props.lastName;
    this.phoneNumber = props.phoneNumber ? new PhoneNumber(props.phoneNumber) : null;
    this.address = props.address ?? null;
    this.rfc = props.rfc ? new RFC(props.rfc) : null;

    // Ensure status is correctly assigned, using a default if not provided
    this.status = props.status ?? AccountStatus.ACTIVE;
    this.audit = props.audit; // Assign the audit object

    this.validateRoles();
  }

  public validateRoleConsistency(): void {
    // Validation: Admin users cannot have business roles
    if (this.isAdmin && this.roles.length > 0) {
      throw new Error('Admin users cannot have business roles'); // Consider using a custom domain error
    }

    // Validation: Required fields for specific roles (Owner, Tenant)
    if (!this.isAdmin) { // Apply these checks only for non-admin users
      if (this.hasRole(BusinessRole.OWNER) || this.hasRole(BusinessRole.TENANT)) {
        if (!this.phoneNumber) {
          throw new Error('Phone number is required for Owner or Tenant.'); // Consider using a custom domain error
        }
 if (!this.rfc) {
           // RFC is required for both Owner and Tenant
           throw new Error('RFC is required for Owner or Tenant.'); // Consider using a custom domain error
        }
 }

      if (this.hasRole(BusinessRole.OWNER)) {
        if (!this.address) {
          throw new Error('Address is required for Owner.'); // Consider using a custom domain error
        }
      }
       // Note: The RFC check for Tenant is already covered in the combined check above,
       // but ensure any specific Tenant-only requirements are handled.
    }
     // Consider adding validation for ensuring at least one role for non-admin users if required
  }

  private validateRoles(): void {
    if (this.isAdmin && this.roles.length > 0) {
      this.roles = []; // Admin role is exclusive
    }
    if (!this.isAdmin && this.roles.length === 0) {
      // This case should ideally be handled at creation/update input level,
      // but including a check here for domain consistency.
      // Depending on requirements, this might throw an error or add a default role.
      // For now, we allow it at the entity level assuming it's caught upstream.
    }
  }

  public hasRole(role: BusinessRole): boolean {
    return this.roles.includes(role);
  }

  public isActive(): boolean {
    return this.status === 'active';
  }

  public markAsDeleted(deletedBy: UserSummary): void {
    if (this.audit.deletedAt) {
      // Already deleted
      return;
    }
    this.audit.deletedAt = new Date();
    this.status = AccountStatus.INACTIVE;
    this.audit.updatedAt = new Date();
    this.audit.updatedBy = deletedBy;
  }

  // Add or remove roles, handling admin exclusivity
  public updateRoles(newRoles: BusinessRole[]): void {
    if (this.isAdmin) {
      // If admin, roles must remain empty
      this.roles = [];
    } else {
      // Ensure all new roles are valid BusinessRoles
      const validRoles = newRoles.filter(role => ['OWNER', 'TENANT', 'ACCOUNTANT'].includes(role));
      // Ensure no duplicate roles
      this.roles = Array.from(new Set(validRoles));
    }
  }

  // Basic validation for required fields based on roles
  public validateRequiredFields(): void {
    if (!this.isAdmin) {
      if (this.hasRole(BusinessRole.OWNER) || this.hasRole(BusinessRole.TENANT)) {
        if (!this.phoneNumber || !this.phoneNumber.getValue()) {
          throw new Error('Phone number is required for Owner or Tenant.');
        }
 }
      if (this.hasRole(BusinessRole.OWNER)) {
        if (!this.address) {
          throw new Error('Address is required for Owner.');
        }
      }
      // RFC validation is handled by the RFC value object constructor
      // RFC validation can be added here using the regex
      if (this.hasRole(BusinessRole.TENANT)) {
        if (!this.rfc) {
          throw new Error('RFC is required for Tenant.');
        }
      }
    }
  }
}
