import { AuditFields } from '@shared/core/types';
import { BusinessRole, AccountStatus } from '@domain/user/user.types';
import { EmailAddress } from '../value-objects/email-address.value-object';
import { Password } from '../value-objects/password.value-object';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { PhoneNumber } from '../value-objects/phone-number.value-object';
import { UserInitialProps, UserSummaryType } from '../user.types';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { AdminCannotHaveBusinessRolesError, NonAdminMustHaveRolesError, AddressRequiredForOwnerError, FieldRequiredForRoleError, RoleUserCannotBeAdminError } from '../errors';

export class User {
  private readonly id: UUID;
  private email: EmailAddress;
  private password: Password;
  private isAdmin: boolean;
  private roles: BusinessRole[];

  // PII (Personally Identifiable Information)
  private name: string;
  private lastName: string;
  private phoneNumber?: PhoneNumber;
  private address?: string;
  private rfc?: RFC;

  // Account status
  private status: AccountStatus;
  private readonly audit?: AuditFields;

  constructor(props: UserInitialProps) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.isAdmin = props.isAdmin;
    this.roles = props.roles;
    this.name = props.name;
    this.lastName = props.lastName;
    this.phoneNumber = props.phoneNumber;
    this.address = props.address;
    this.rfc = props.rfc;
    this.status = props.status ?? AccountStatus.ACTIVE;
    this.audit = props.audit;

    this.validateStateConsistency();
  }

  private ensureFieldIsPresent<T>(fieldValue: T | undefined, error: Error): void {
    if (!fieldValue) {
      throw error;
    }
  }

  private validateAdminRules(): void {
    if (this.roles.length > 0) {
      throw new AdminCannotHaveBusinessRolesError(); // Admin cannot have any business roles
    }
  }

  private validateOwnerRules = (): void => {
    this.ensureFieldIsPresent(this.address, new AddressRequiredForOwnerError());
    this.ensureFieldIsPresent(this.phoneNumber, new FieldRequiredForRoleError('phone number', BusinessRole.OWNER));
    this.ensureFieldIsPresent(this.rfc, new FieldRequiredForRoleError('RFC', BusinessRole.OWNER));
  }

  private validateTenantRules = (): void => {
    this.ensureFieldIsPresent(this.phoneNumber, new FieldRequiredForRoleError('phone number', BusinessRole.TENANT));
    this.ensureFieldIsPresent(this.rfc, new FieldRequiredForRoleError('RFC', BusinessRole.TENANT));
  }

  private validateAccountantRules = (): void => {
    this.ensureFieldIsPresent(this.phoneNumber, new FieldRequiredForRoleError('phone number', BusinessRole.ACCOUNTANT));
  }

  private roleValidationMap: Record<BusinessRole, () => void> = {
    [BusinessRole.OWNER]: this.validateOwnerRules,
    [BusinessRole.TENANT]: this.validateTenantRules,
    [BusinessRole.ACCOUNTANT]: this.validateAccountantRules,
  };

  private validateStateConsistency(): void {
    if (this.isAdmin) {
      this.validateAdminRules();
    } else {
      if (this.roles.length === 0) {
        throw new NonAdminMustHaveRolesError();
      }

      for (const role of this.roles) {
        const validateFn = this.roleValidationMap[role];
        if (validateFn) {
          validateFn();
        }
      }
    }
  }

  public getId(): UUID {
    return this.id;
  }

  public getEmail(): EmailAddress {
    return this.email;
  }

  public getPassword(): Password {
    return this.password;
  }

  public getIsAdmin(): boolean {
    return this.isAdmin;
  }

  public getRoles(): BusinessRole[] {
    return this.roles;
  }

  public getName(): string {
    return this.name;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getPhoneNumber(): PhoneNumber | null {
    return this.phoneNumber ?? null;
  }

  public getAddress(): string | null {
    return this.address ?? null;
  }

  public getRfc(): RFC | null {
    return this.rfc ?? null;
  }

  public getStatus(): AccountStatus {
    return this.status;
  }

  public getAudit(): AuditFields | undefined {
    return this.audit;
  }

  private applyUpdateAuditFields(updatedBy: UserSummaryType): AuditFields | undefined {
    if (!this.audit) {
      return undefined; // Or throw an error if audit is mandatory after creation
    }
    return {
      ...this.audit,
      updatedAt: new Date(),
      updatedBy,
    };
  }

  public hasRole(role: BusinessRole): boolean {
    return this.roles.includes(role);
  }

  public isActive(): boolean {
    return this.status === AccountStatus.ACTIVE;
  }

  public isOwner(): boolean {
    return this.hasRole(BusinessRole.OWNER);
  }

  public isTenant(): boolean {
    return this.hasRole(BusinessRole.TENANT);
  }

  public isAccountant(): boolean {
    return this.hasRole(BusinessRole.ACCOUNTANT);
  }

  public updateName(newName: string, updatedBy: UserSummaryType): User {
    return new User({
      ...this,
      name: newName,
      audit: this.applyUpdateAuditFields(updatedBy),
    });
  }

  public updateLastName(newLastName: string, updatedBy: UserSummaryType): User {
    return new User({
      ...this,
      lastName: newLastName,
      audit: this.applyUpdateAuditFields(updatedBy),
    });
  }

  public updateEmail(newEmail: EmailAddress, updatedBy: UserSummaryType): User {
    return new User({
      ...this,
      email: newEmail,
      audit: this.applyUpdateAuditFields(updatedBy),
    });
  }

  public updatePassword(newPassword: Password, updatedBy: UserSummaryType): User {
    // Note: Updating password might involve specific domain logic
    // (e.g., checking if it's different from the old one).
    // For simplicity here, we just create a new User with the new password.
    return new User({
      ...this,
      password: newPassword,
      audit: this.applyUpdateAuditFields(updatedBy),
    });
  }

  public updatePhoneNumber(newPhoneNumber: PhoneNumber | undefined, updatedBy: UserSummaryType): User {
    return new User({
      ...this,
      phoneNumber: newPhoneNumber,
      audit: this.applyUpdateAuditFields(updatedBy),
    });
  }

  public updateAddress(newAddress: string | undefined, updatedBy: UserSummaryType): User {
    return new User({
      ...this,
      address: newAddress,
      audit: this.applyUpdateAuditFields(updatedBy),
    });
  }

  public updateRfc(newRfc: RFC | undefined, updatedBy: UserSummaryType): User {
    return new User({
      ...this,
      rfc: newRfc,
      audit: this.applyUpdateAuditFields(updatedBy),
    });
  }

  public updateStatus(newStatus: AccountStatus, updatedBy: UserSummaryType): User {
    // Note: Changing status might have specific domain rules (e.g., cannot
    // change from DELETED, requires approval workflow). This simple update
    // assumes direct status changes are allowed.
    const newUser = new User({
      ...this,
      status: newStatus,
      audit: this.applyUpdateAuditFields(updatedBy),
    });
    // Optionally re-validate state consistency if status changes affect other rules
    // newUser.validateStateConsistency();
    return newUser;
  }

  public updateRoles(newRoles: BusinessRole[], updatedBy: UserSummaryType): User {
    if (this.isAdmin) {
      throw new RoleUserCannotBeAdminError();
    }

    const validRoles = newRoles.filter(role => Object.values(BusinessRole).includes(role));
    return new User({
      ...this,
      roles: Array.from(new Set(validRoles)),
      audit: this.applyUpdateAuditFields(updatedBy),
    });
  }
}
