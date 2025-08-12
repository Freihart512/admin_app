import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User as DomainUser } from '../../../domain/user/entity/user.entity';
import { BusinessRole, AccountStatus, AuditFields as DomainAuditFields } from '../../../@shared/core/types'; // Import from shared types
import { EmailAddress } from '../../../domain/user/value-objects/email-address.value-object';
import { UserSummary as DomainUserSummary } from '../../../domain/user/value-objects/user-summary.value-object'; // Import UserSummary
import { PhoneNumber } from '../../../domain/user/value-objects/phone-number.value-object';
import { RFC } from '../../../domain/@shared/value-objects/rfc.value-object';

// Register enums for GraphQL schema
registerEnumType(BusinessRole, {
  name: 'BusinessRole',
});

registerEnumType(AccountStatus, {
  name: 'AccountStatus',
});

@ObjectType()
export class UserSummary {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => AccountStatus)
  status: AccountStatus;

  static fromDomain(userSummary: DomainUserSummary): UserSummary {
    const gqlUserSummary = new UserSummary();
    gqlUserSummary.id = userSummary.id;
    gqlUserSummary.name = userSummary.name;
    gqlUserSummary.lastName = userSummary.lastName;
    gqlUserSummary.email = userSummary.email;
    gqlUserSummary.status = userSummary.status === 'active' ? AccountStatus.ACTIVE : AccountStatus.INACTIVE;
    return gqlUserSummary;
  }
}

@ObjectType()
export class AuditFields {
  @Field(() => Date, { nullable: true })
  createdAt: Date | null;

 @Field(() => UserSummary, { nullable: true })
  createdBy: UserSummary | null;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | null;

 @Field(() => UserSummary, { nullable: true })
  updatedBy: UserSummary | null;

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null;

 @Field(() => UserSummary, { nullable: true })
  deletedBy: UserSummary | null;

  static fromDomain(audit: DomainAuditFields): AuditFields {
    const gqlAudit = new AuditFields();
    gqlAudit.createdAt = audit.createdAt;
    gqlAudit.createdBy = audit.createdBy ? UserSummary.fromDomain(audit.createdBy) : null;
    gqlAudit.updatedAt = audit.updatedAt;
    gqlAudit.updatedBy = audit.updatedBy ? UserSummary.fromDomain(audit.updatedBy) : null;
    gqlAudit.deletedAt = audit.deletedAt;
    gqlAudit.deletedBy = audit.deletedBy ? UserSummary.fromDomain(audit.deletedBy) : null;
    return gqlAudit;
  }
}

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field(() => String, { nullable: true })
  phoneNumber?: string | null;

  @Field(() => String, { nullable: true })
  address?: string | null;

  @Field(() => String, { nullable: true })
  rfc?: string | null;

  @Field()
  isAdmin: boolean;

  @Field(() => [BusinessRole])
  roles: BusinessRole[];

  @Field(() => AccountStatus)
  status: AccountStatus;

 @Field(() => AuditFields)
  audit: AuditFields;

  // Mapping from domain entity
  static fromDomain(user: DomainUser): User {
    const gqlUser = new User();
    gqlUser.id = user.id;
    gqlUser.email = user.email.getValue(); // Get the string value from the EmailAddress VO
    gqlUser.name = user.name;
    gqlUser.lastName = user.lastName;
    gqlUser.phoneNumber = user.phoneNumber ? user.phoneNumber.getValue() : null; // Get the string value from the PhoneNumber VO if it exists
    gqlUser.address = user.address;
    gqlUser.rfc = user.rfc ? user.rfc.getValue() : null; // Get the string value from the RFC VO if it exists
    gqlUser.isAdmin = user.isAdmin;
    gqlUser.roles = user.roles as unknown as BusinessRole[]; // Cast or map if needed
    gqlUser.status = user.status === 'active' ? AccountStatus.ACTIVE : AccountStatus.INACTIVE;
    gqlUser.audit = AuditFields.fromDomain(user.audit);
    return gqlUser;
  }
}

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  isAdmin?: boolean;

  @Field(() => [BusinessRole], { nullable: true })
  roles?: BusinessRole[];

  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  rfc?: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  rfc?: string;

  @Field(() => AccountStatus, { nullable: true })
  status?: AccountStatus;
}

@InputType()
export class UpdateUserBusinessRolesInput {
  @Field(() => ID)
  userId: string;

  @Field(() => [BusinessRole])
  roles: BusinessRole[];
}
export class AssignRoleInput {
  @Field(() => ID)
  userId: string;

  @Field(() => [BusinessRole])
  roles: BusinessRole[];
}

@InputType()
export class RemoveRoleInput {
  @Field(() => ID)
  userId: string;

  @Field(() => [BusinessRole])
  roles: BusinessRole[];
}

@InputType()
export class ToggleAdminInput {
  @Field(() => ID)
  userId: string;

  @Field()
  isAdmin: boolean;
}

@ObjectType()
export class PaginatedUsers {
  @Field(() => [User])
  users: User[];

  @Field()
  totalCount: number;

  @Field()
  hasNextPage: boolean;
}