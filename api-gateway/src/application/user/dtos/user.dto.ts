import { BusinessRole, AccountStatus } from '@domain/user/user.types'; // Assuming BusinessRole and AccountStatus are defined here

export class CreateUserDto {
  id!:string;
  email!: string;
  isAdmin: boolean = false;
  roles: BusinessRole[] = [];
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
  roles!: BusinessRole[];
}

export class RemoveRoleDto {
  userId!: string;
  roles!: BusinessRole[];
}

export class ToggleAdminDto {
  userId!: string;
  isAdmin!: boolean;
}

export class UserDto {
  id!: string;
  email!: string;
  isAdmin!: boolean;
  roles!: BusinessRole[];
  name!: string;
  lastName!: string;
  phoneNumber?: string;
  address?: string;
  rfc?: string;
  status!: AccountStatus;
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