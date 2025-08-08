import {
  CreateUserDto,
  UpdateUserDto,
  AssignRoleDto,
  RemoveRoleDto,
  ToggleAdminDto,
  UserDto,
  UserListDto,
  GetUserByIdDto,
} from '../user.dtos';
import { describe, it, expect } from 'vitest';
import { BusinessRole, AccountStatus } from '../../../../@shared/core/types';

describe('User DTOs', () => {
  it('CreateUserDto should be instantiable with required properties', () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'John',
      lastName: 'Doe',
    };
    expect(dto.email).toBe('test@example.com');
    expect(dto.password).toBe('password123');
    expect(dto.name).toBe('John');
    expect(dto.lastName).toBe('Doe');
    expect(dto.isAdmin).toBe(false); // Default value
    expect(dto.roles).toEqual([]); // Default value
    expect(dto.phoneNumber).toBeUndefined();
    expect(dto.address).toBeUndefined();
    expect(dto.rfc).toBeUndefined();
  });

  it('CreateUserDto should be instantiable with all properties', () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      isAdmin: true,
      roles: [BusinessRole.OWNER],
      name: 'John',
      lastName: 'Doe',
      phoneNumber: '123-456-7890',
      address: '123 Main St',
      rfc: 'ABC123XYZ9',
    };
    expect(dto.email).toBe('test@example.com');
    expect(dto.password).toBe('password123');
    expect(dto.isAdmin).toBe(true);
    expect(dto.roles).toEqual([BusinessRole.OWNER]);
    expect(dto.name).toBe('John');
    expect(dto.lastName).toBe('Doe');
    expect(dto.phoneNumber).toBe('123-456-7890');
    expect(dto.address).toBe('123 Main St');
    expect(dto.rfc).toBe('ABC123XYZ9');
  });

  it('UpdateUserDto should be instantiable with optional properties', () => {
    const dto: UpdateUserDto = {
      name: 'Jane',
      phoneNumber: '987-654-3210',
    };
    expect(dto.name).toBe('Jane');
    expect(dto.lastName).toBeUndefined();
    expect(dto.phoneNumber).toBe('987-654-3210');
    expect(dto.address).toBeUndefined();
    expect(dto.rfc).toBeUndefined();
  });

  it('AssignRoleDto should be instantiable with required properties', () => {
    const dto: AssignRoleDto = {
      userId: 'some-user-id',
      roles: [BusinessRole.TENANT, BusinessRole.ACCOUNTANT],
    };
    expect(dto.userId).toBe('some-user-id');
    expect(dto.roles).toEqual([BusinessRole.TENANT, BusinessRole.ACCOUNTANT]);
  });

  it('RemoveRoleDto should be instantiable with required properties', () => {
    const dto: RemoveRoleDto = {
      userId: 'some-user-id',
      roles: [BusinessRole.TENANT],
    };
    expect(dto.userId).toBe('some-user-id');
    expect(dto.roles).toEqual([BusinessRole.TENANT]);
  });

  it('ToggleAdminDto should be instantiable with required properties', () => {
    const dto: ToggleAdminDto = {
      userId: 'some-user-id',
      isAdmin: true,
    };
    expect(dto.userId).toBe('some-user-id');
    expect(dto.isAdmin).toBe(true);
  });

  it('UserDto should be instantiable with required properties', () => {
    const dto: UserDto = {
      id: 'user-123',
      email: 'user@example.com',
      isAdmin: false,
      roles: [],
      name: 'Test',
      lastName: 'User',
      status: AccountStatus.ACTIVE,
      createdAt: new Date(),
      createdBy: 'creator-id',
    };
    expect(dto.id).toBe('user-123');
    expect(dto.email).toBe('user@example.com');
    expect(dto.isAdmin).toBe(false);
    expect(dto.roles).toEqual([]);
    expect(dto.name).toBe('Test');
    expect(dto.lastName).toBe('User');
    expect(dto.status).toBe(AccountStatus.ACTIVE);
    expect(dto.createdAt).toBeInstanceOf(Date);
    expect(dto.createdBy).toBe('creator-id');
    expect(dto.phoneNumber).toBeUndefined();
    expect(dto.updatedAt).toBeUndefined();
  });

  it('UserDto should be instantiable with all properties', () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    const deletedAt = new Date();
    const dto: UserDto = {
      id: 'user-123',
      email: 'user@example.com',
      isAdmin: true,
      roles: [BusinessRole.OWNER],
      name: 'Test',
      lastName: 'User',
      phoneNumber: '555-1234',
      address: '456 Pine St',
      rfc: 'DEF456UVW0',
      status: AccountStatus.INACTIVE,
      createdAt: createdAt,
      createdBy: 'creator-id',
      updatedAt: updatedAt,
      updatedBy: 'updater-id',
      deletedAt: deletedAt,
    };
    expect(dto.id).toBe('user-123');
    expect(dto.email).toBe('user@example.com');
    expect(dto.isAdmin).toBe(true);
    expect(dto.roles).toEqual([BusinessRole.OWNER]);
    expect(dto.name).toBe('Test');
    expect(dto.lastName).toBe('User');
    expect(dto.phoneNumber).toBe('555-1234');
    expect(dto.address).toBe('456 Pine St');
    expect(dto.rfc).toBe('DEF456UVW0');
    expect(dto.status).toBe(AccountStatus.INACTIVE);
    expect(dto.createdAt).toBe(createdAt);
    expect(dto.createdBy).toBe('creator-id');
    expect(dto.updatedAt).toBe(updatedAt);
    expect(dto.updatedBy).toBe('updater-id');
    expect(dto.deletedAt).toBe(deletedAt);
  });

  it('UserListDto should be instantiable', () => {
    const user1: UserDto = {
      id: 'user-1',
      email: 'user1@example.com',
      isAdmin: false,
      roles: [],
      name: 'User',
      lastName: 'One',
      status: AccountStatus.ACTIVE,
      createdAt: new Date(),
      createdBy: 'creator-a',
    };
    const user2: UserDto = {
      id: 'user-2',
      email: 'user2@example.com',
      isAdmin: true,
      roles: [],
      name: 'User',
      lastName: 'Two',
      status: AccountStatus.ACTIVE,
      createdAt: new Date(),
      createdBy: 'creator-b',
    };
    const dto: UserListDto = {
      users: [user1, user2],
      totalCount: 2,
    };
    expect(dto.users).toEqual([user1, user2]);
    expect(dto.totalCount).toBe(2);
  });

  it('GetUserByIdDto should be instantiable with required property', () => {
    const dto: GetUserByIdDto = {
      userId: 'some-user-id-to-get',
    };
    expect(dto.userId).toBe('some-user-id-to-get');
  });
});