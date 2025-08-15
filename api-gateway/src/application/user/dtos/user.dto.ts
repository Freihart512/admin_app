import { BusinessRoleType, AccountStatusType } from '@domain/user';

export class CreateUserDto {
  id!: string;
  email!: string;
  isAdmin: boolean = false;
  roles: BusinessRoleType[] = [];
  name!: string;
  lastName!: string;
  phoneNumber?: string;
  address?: string;
  rfc?: string;
}

export class UpdateUserDto {
  id?: string;
  name?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  rfc?: string;
}

export class AssignRoleDto {
  userId!: string;
  roles!: BusinessRoleType[];
}

export class RemoveRoleDto {
  userId!: string;
  roles!: BusinessRoleType[];
}

export class ToggleAdminDto {
  userId!: string;
  isAdmin!: boolean;
}

export class UserDto {
  id!: string;
  email!: string;
  isAdmin!: boolean;
  roles!: BusinessRoleType[];
  name!: string;
  lastName!: string;
  phoneNumber?: string;
  address?: string;
  rfc?: string;
  status!: AccountStatusType;
  createdAt!: Date;
  createdBy!: string;
  updatedAt?: Date | null;
  updatedBy?: string | null;
  deletedAt?: Date | null;
}

export class UserListDto {
  users!: UserDto[];
  totalCount!: number;
}

export class GetUserByIdDto {
  userId!: string;
}
