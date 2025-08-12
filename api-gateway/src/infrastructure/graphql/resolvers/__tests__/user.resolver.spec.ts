import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserResolver } from '../../../src/infrastructure/graphql/resolvers/user.resolver';
import { CreateUserUseCase } from '../../../src/application/user/use-cases/create-user.usecase';
import { UpdateUserUseCase } from '../../../src/application/user/use-cases/update-user.usecase';
import { DeleteUserUseCase } from '../../../src/application/user/use-cases/delete-user.usecase';
import { ManageUserRolesUseCase } from '../../../src/application/user/use-cases/manage-user-roles.usecase';
import { ToggleAdminUseCase } from '../../../src/application/user/use-cases/toggle-admin.usecase';
import { GetUsersUseCase } from '../../../src/application/user/use-cases/get-users.usecase';
import { GetUserByIdUseCase } from '../../../src/application/user/use-cases/get-user-by-id.usecase';
import { NotFoundException } from '@nestjs/common';
import {
  CreateUserInput,
  UpdateUserInput,
  UpdateUserBusinessRolesInput,
  ToggleAdminInput,
  User as GraphQLUser,
  PaginatedUsers,
  AuditFields as GraphQLAuditFields,
  UserSummary as GraphQLUserSummary,
} from '../../../src/infrastructure/graphql/dtos/user.graphql.dtos';
import { User as DomainUser } from '../../../src/domain/user/user';
import { UserSummary as DomainUserSummary } from '../../../src/domain/user/value-objects/user-summary';
import { BusinessRole, AccountStatus } from '../../../src/shared/types';

// Mock the use cases
const mockCreateUserUseCase = { execute: vi.fn() };
const mockUpdateUserUseCase = { execute: vi.fn() };
const mockDeleteUserUseCase = { execute: vi.fn() };
const mockManageUserRolesUseCase = { execute: vi.fn() };
const mockToggleAdminUseCase = { execute: vi.fn() };
const mockGetUsersUseCase = { execute: vi.fn() };
const mockGetUserByIdUseCase = { execute: vi.fn() };

// Mock domain entities and value objects
const mockDomainUserSummary = new DomainUserSummary({
  id: 'current-user-id',
  name: 'Current',
  lastName: 'User',
  email: 'current@example.com',
  status: AccountStatus.ACTIVE,
});

const mockDomainUser = {
  id: 'user-id',
  email: 'test@example.com',
  passwordHash: 'hashed',
  isAdmin: false,
  roles: [BusinessRole.TENANT],
  name: 'Test',
  lastName: 'User',
  phoneNumber: '123',
  address: 'abc',
  rfc: 'xyz',
  status: AccountStatus.ACTIVE,
  audit: {
    createdAt: new Date(),
    createdBy: mockDomainUserSummary,
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  },
} as DomainUser; // Cast to DomainUser for typing

const mockGraphQLUser = {
  id: 'user-id',
  email: 'test@example.com',
  name: 'Test',
  lastName: 'User',
  phoneNumber: '123',
  address: 'abc',
  rfc: 'xyz',
  isAdmin: false,
  roles: [BusinessRole.TENANT],
  status: AccountStatus.ACTIVE,
  audit: {
    createdAt: new Date(),
    createdBy: {
      id: 'current-user-id',
      name: 'Current',
      lastName: 'User',
      email: 'current@example.com',
      status: AccountStatus.ACTIVE,
    },
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  },
} as GraphQLUser; // Cast to GraphQLUser for typing

// Mock GraphQL DTO methods
vi.mock('../../../src/infrastructure/graphql/dtos/user.graphql.dtos', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/infrastructure/graphql/dtos/user.graphql.dtos')>();
  return {
    ...actual,
    User: {
      ...actual.User,
      fromDomain: vi.fn((user: DomainUser) => {
        // Basic mapping for testing purposes
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          address: user.address,
          rfc: user.rfc,
          isAdmin: user.isAdmin,
          roles: user.roles,
          status: user.status.toUpperCase() as AccountStatus,
          audit: {
            createdAt: user.audit.createdAt,
            createdBy: user.audit.createdBy ? {
              id: user.audit.createdBy.id,
              name: user.audit.createdBy.name,
              lastName: user.audit.createdBy.lastName,
              email: user.audit.createdBy.email,
              status: user.audit.createdBy.status,
            } as GraphQLUserSummary : null,
            updatedAt: user.audit.updatedAt,
            updatedBy: user.audit.updatedBy ? {
              id: user.audit.updatedBy.id,
              name: user.audit.updatedBy.name,
              lastName: user.audit.updatedBy.lastName,
              email: user.audit.updatedBy.email,
              status: user.audit.updatedBy.status,
            } as GraphQLUserSummary : null,
            deletedAt: user.audit.deletedAt,
            deletedBy: user.audit.deletedBy ? {
              id: user.audit.deletedBy.id,
              name: user.audit.deletedBy.name,
              lastName: user.audit.deletedBy.lastName,
              email: user.audit.deletedBy.email,
              status: user.audit.deletedBy.status,
            } as GraphQLUserSummary : null,
          } as GraphQLAuditFields,
        } as GraphQLUser;
      }),
    },
  };
});


describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(() => {
    resolver = new UserResolver(
      mockCreateUserUseCase as any,
      mockUpdateUserUseCase as any,
      mockDeleteUserUseCase as any,
      mockManageUserRolesUseCase as any,
      mockToggleAdminUseCase as any,
      mockGetUsersUseCase as any,
      mockGetUserByIdUseCase as any,
    );

    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    it('should call CreateUserUseCase and return the created user', async () => {
      const createUserInput: CreateUserInput = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New',
        lastName: 'User',
      };
      // Mock the use case to return a DomainUser
      mockCreateUserUseCase.execute.mockResolvedValue(mockDomainUser);

      // TODO: Replace null with actual currentUser when @CurrentUser() is implemented
      const currentUser = null;
      const result = await resolver.createUser(createUserInput, currentUser as any);

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(
        currentUser, // Should pass the current user
        {
          ...createUserInput,
          password: createUserInput.password ?? '',
          isAdmin: createUserInput.isAdmin ?? false,
          roles: createUserInput.roles ?? [],
        }
      );
      // Ensure the result is mapped using the mocked fromDomain
      expect(result).toEqual(GraphQLUser.fromDomain(mockDomainUser));
    });

    it('should handle errors from CreateUserUseCase', async () => {
      const createUserInput: CreateUserInput = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing',
        lastName: 'User',
      };
      const error = new Error('User with this email already exists');
      mockCreateUserUseCase.execute.mockRejectedValue(error);

      // TODO: Replace null with actual currentUser
      const currentUser = null;
      await expect(resolver.createUser(createUserInput, currentUser as any)).rejects.toThrow(error);
      expect(mockCreateUserUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });

  // describe('updateUser', () => {
  //   it('should call UpdateUserUseCase and return the updated user', async () => {
  //     const userId = 'user-id';
  //     const updateUserInput: UpdateUserInput = { name: 'Updated Name' };
  //     // Mock the use case to return a DomainUser
  //     mockUpdateUserUseCase.execute.mockResolvedValue(mockDomainUser);

  //     // TODO: Replace null with actual currentUser
  //     const currentUser = null;
  //     const result = await resolver.updateUser(userId, updateUserInput, currentUser as any);

  //     expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith(
  //       userId,
  //       updateUserInput,
  //       currentUser, // Should pass the current user
  //     );
  //     expect(result).toEqual(GraphQLUser.fromDomain(mockDomainUser));
  //   });

  //   it('should handle NotFoundException from UpdateUserUseCase', async () => {
  //     const userId = 'non-existent-id';
  //     const updateUserInput: UpdateUserInput = { name: 'Updated Name' };
  //     const error = new NotFoundException(`User with ID ${userId} not found.`);
  //     mockUpdateUserUseCase.execute.mockRejectedValue(error);

  //     // TODO: Replace null with actual currentUser
  //     const currentUser = null;
  //     await expect(resolver.updateUser(userId, updateUserInput, currentUser as any)).rejects.toThrow(NotFoundException);
  //     expect(mockUpdateUserUseCase.execute).toHaveBeenCalledTimes(1);
  //   });

  //   it('should handle other errors from UpdateUserUseCase', async () => {
  //       const userId = 'user-id';
  //       const updateUserInput: UpdateUserInput = { phoneNumber: '1234567890' };
  //       const error = new Error('Some other error');
  //       mockUpdateUserUseCase.execute.mockRejectedValue(error);

  //       // TODO: Replace null with actual currentUser
  //       const currentUser = null;
  //       await expect(resolver.updateUser(userId, updateUserInput, currentUser as any)).rejects.toThrow('Some other error');
  //       expect(mockUpdateUserUseCase.execute).toHaveBeenCalledTimes(1);
  //     });
  // });

  // describe('deleteUser', () => {
  //   it('should call DeleteUserUseCase and return the deleted user', async () => {
  //     const userId = 'user-id';
  //     // Mock the use case to return a DomainUser
  //     mockDeleteUserUseCase.execute.mockResolvedValue({ ...mockDomainUser, status: AccountStatus.INACTIVE });

  //     // TODO: Replace null with actual currentUser
  //     const currentUser = null;
  //     const result = await resolver.deleteUser(userId, currentUser as any);

  //     expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith(userId, currentUser); // Should pass the current user
  //     expect(result).toEqual(GraphQLUser.fromDomain({ ...mockDomainUser, status: AccountStatus.INACTIVE }));
  //   });

  //   it('should handle NotFoundException from DeleteUserUseCase', async () => {
  //     const userId = 'non-existent-id';
  //     const error = new NotFoundException(`User with ID ${userId} not found.`);
  //     mockDeleteUserUseCase.execute.mockRejectedValue(error);

  //     // TODO: Replace null with actual currentUser
  //     const currentUser = null;
  //     await expect(resolver.deleteUser(userId, currentUser as any)).rejects.toThrow(NotFoundException);
  //     expect(mockDeleteUserUseCase.execute).toHaveBeenCalledTimes(1);
  //   });

  //   it('should handle other errors from DeleteUserUseCase', async () => {
  //       const userId = 'user-id';
  //       const error = new Error('Some business rule violation');
  //       mockDeleteUserUseCase.execute.mockRejectedValue(error);

  //       // TODO: Replace null with actual currentUser
  //       const currentUser = null;
  //       await expect(resolver.deleteUser(userId, currentUser as any)).rejects.toThrow('Some business rule violation');
  //       expect(mockDeleteUserUseCase.execute).toHaveBeenCalledTimes(1);
  //     });
  // });

  // describe('updateUserBusinessRoles', () => {
  //   it('should call ManageUserRolesUseCase and return the user', async () => {
  //     const input: UpdateUserBusinessRolesInput = {
  //       userId: 'user-id',
  //       roles: [BusinessRole.ACCOUNTANT],
  //     };
  //     // Mock the use case to return a DomainUser
  //     const userWithNewRoles = { ...mockDomainUser, roles: input.roles };
  //     mockManageUserRolesUseCase.execute.mockResolvedValue(userWithNewRoles);

  //     // TODO: Replace null with actual currentUser
  //     const currentUser = null;
  //     const result = await resolver.updateUserBusinessRoles(input, currentUser as any);

  //     expect(mockManageUserRolesUseCase.execute).toHaveBeenCalledWith({
  //       userId: input.userId,
  //       finalRoles: input.roles,
  //     }, currentUser); // Should pass the current user
  //     expect(result).toEqual(GraphQLUser.fromDomain(userWithNewRoles));
  //   });

  //   it('should handle NotFoundException from ManageUserRolesUseCase', async () => {
  //     const input: UpdateUserBusinessRolesInput = {
  //       userId: 'non-existent-id',
  //       roles: [BusinessRole.ACCOUNTANT],
  //     };
  //     const error = new NotFoundException(`User with ID ${input.userId} not found.`);
  //     mockManageUserRolesUseCase.execute.mockRejectedValue(error);

  //     // TODO: Replace null with actual currentUser
  //     const currentUser = null;
  //     await expect(resolver.updateUserBusinessRoles(input, currentUser as any)).rejects.toThrow(NotFoundException);
  //     expect(mockManageUserRolesUseCase.execute).toHaveBeenCalledTimes(1);
  //   });

  //   it('should handle other errors from ManageUserRolesUseCase', async () => {
  //       const input: UpdateUserBusinessRolesInput = {
  //           userId: 'user-id',
  //           roles: [BusinessRole.OWNER],
  //         };
  //       const error = new Error('Cannot assign role to admin');
  //       mockManageUserRolesUseCase.execute.mockRejectedValue(error);

  //       // TODO: Replace null with actual currentUser
  //       const currentUser = null;
  //       await expect(resolver.updateUserBusinessRoles(input, currentUser as any)).rejects.toThrow('Cannot assign role to admin');
  //       expect(mockManageUserRolesUseCase.execute).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe('toggleAdmin', () => {
  //   it('should call ToggleAdminUseCase and return the user', async () => {
  //     const input: ToggleAdminInput = {
  //       userId: 'user-id',
  //       isAdmin: true,
  //     };
  //     // Mock the use case to return a DomainUser
  //     const userMadeAdmin = { ...mockDomainUser, isAdmin: true, roles: [] };
  //     mockToggleAdminUseCase.execute.mockResolvedValue(userMadeAdmin);

  //     // TODO: Replace null with actual currentUser
  //     const currentUser = null;
  //     const result = await resolver.toggleAdmin(input, currentUser as any);

  //     expect(mockToggleAdminUseCase.execute).toHaveBeenCalledWith(input.userId, input.isAdmin, currentUser); // Should pass the current user
  //     expect(result).toEqual(GraphQLUser.fromDomain(userMadeAdmin));
  //   });

  //   it('should handle errors from ToggleAdminUseCase', async () => {
  //     const input: ToggleAdminInput = {
  //       userId: 'non-existent-id',
  //       isAdmin: false,
  //     };
  //     const error = new Error('User not found');
  //     mockToggleAdminUseCase.execute.mockRejectedValue(error);

  //     // TODO: Replace null with actual currentUser
  //     const currentUser = null;
  //     await expect(resolver.toggleAdmin(input, currentUser as any)).rejects.toThrow('User not found');
  //     expect(mockToggleAdminUseCase.execute).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe('users (Query)', () => {
  //   it('should call GetUsersUseCase and return paginated users', async () => {
  //     const limit = 5;
  //     const offset = 10;
  //     const mockPaginatedResult = {
  //       users: [mockDomainUser],
  //       totalCount: 1,
  //       hasNextPage: false,
  //     };
  //     mockGetUsersUseCase.execute.mockResolvedValue(mockPaginatedResult);

  //     const result = await resolver.users(limit, offset);

  //     expect(mockGetUsersUseCase.execute).toHaveBeenCalledWith({ limit, offset });
  //     expect(result.users.length).toBe(mockPaginatedResult.users.length);
  //     expect(result.totalCount).toBe(mockPaginatedResult.totalCount);
  //     expect(result.hasNextPage).toBe(mockPaginatedResult.hasNextPage);
  //     // Ensure users are mapped using the mocked fromDomain
  //     expect(result.users[0]).toEqual(GraphQLUser.fromDomain(mockDomainUser));
  //   });

  //   it('should call GetUsersUseCase with default parameters if none provided', async () => {
  //       const mockPaginatedResult = {
  //           users: [mockDomainUser],
  //           totalCount: 1,
  //           hasNextPage: false,
  //         };
  //         mockGetUsersUseCase.execute.mockResolvedValue(mockPaginatedResult);

  //       const result = await resolver.users();

  //       expect(mockGetUsersUseCase.execute).toHaveBeenCalledWith({ limit: undefined, offset: undefined });
  //       expect(result.users.length).toBe(mockPaginatedResult.users.length);
  //       expect(result.totalCount).toBe(mockPaginatedResult.totalCount);
  //       expect(result.hasNextPage).toBe(mockPaginatedResult.hasNextPage);
  //       // Ensure users are mapped using the mocked fromDomain
  //       expect(result.users[0]).toEqual(GraphQLUser.fromDomain(mockDomainUser));
  //   });
  // });

  // describe('user (Query)', () => {
  //   it('should call GetUserByIdUseCase and return the user', async () => {
  //     const userId = 'user-id';
  //     mockGetUserByIdUseCase.execute.mockResolvedValue(mockDomainUser);

  //     const result = await resolver.user(userId);

  //     expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith(userId);
  //     expect(result).toEqual(GraphQLUser.fromDomain(mockDomainUser));
  //   });

  //   it('should throw NotFoundException if user is not found', async () => {
  //     const userId = 'non-existent-id';
  //     mockGetUserByIdUseCase.execute.mockResolvedValue(null);

  //     await expect(resolver.user(userId)).rejects.toThrow(NotFoundException);
  //     expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith(userId);
  //   });

  //   it('should handle other errors from GetUserByIdUseCase', async () => {
  //       const userId = 'user-id';
  //       const error = new Error('Database error');
  //       mockGetUserByIdUseCase.execute.mockRejectedValue(error);

  //       await expect(resolver.user(userId)).rejects.toThrow('Database error');
  //       expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith(userId);
  //   });
  // });

  // You might also want to add tests for the mapDomainUserToGraphQLUser helper function directly
  // to ensure it maps all fields correctly, including the audit object and enums.
});