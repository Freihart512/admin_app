import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  BusinessRoles,
  AccountStatuses,
  AccountStatusType,
  BusinessRoleType,
} from '@domain/user/user.types';

// Enums expuestos en el esquema
registerEnumType(BusinessRoles, { name: 'BusinessRole' });
registerEnumType(AccountStatuses, { name: 'AccountStatus' });

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field()
  lastName!: string;

  @Field({ nullable: true })
  phoneNumber?: string | null;

  @Field({ nullable: true })
  address?: string | null;

  @Field({ nullable: true })
  rfc?: string | null;

  @Field()
  isAdmin!: boolean;

  @Field(() => [BusinessRoles], { nullable: true })
  roles!: BusinessRoleType[];

  @Field(() => AccountStatuses)
  status!: AccountStatusType;
}

@InputType()
export class CreateUserInput {
  @Field()
  email!: string;

  @Field({ nullable: true })
  isAdmin?: boolean;

  @Field(() => [BusinessRoles], { nullable: true })
  roles?: BusinessRoleType[];

  @Field()
  name!: string;

  @Field()
  lastName!: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  rfc?: string;
}
