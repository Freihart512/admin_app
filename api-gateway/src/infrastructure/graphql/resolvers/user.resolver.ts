import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { CreateUserUseCase } from '../../../application/user/use-cases/create-user.use-case'
import { UpdateUserUseCase } from '../../../application/user/use-cases/update-user.use-case'
import { DeleteUserUseCase } from '../../../application/user/use-cases/delete-user.use-case'
import { ManageUserRolesUseCase } from '../../../application/user/use-cases/manage-user-roles.use-case';
import { ToggleAdminUseCase } from '../../../application/user/use-cases/toggle-admin.use-case'
import { GetUsersUseCase } from '../../../application/user/use-cases/get-users.use-case'
import { GetUserByIdUseCase } from '../../../application/user/use-cases/get-user-by-id.use-case'
import { NotFoundException } from '@nestjs/common';
import {
 CreateUserInput,
  UpdateUserInput,
 UpdateUserBusinessRolesInput,
  ToggleAdminInput,
  User as GraphQLUser, // Rename to avoid conflict with domain User 
  PaginatedUsers,
} from '../dtos/user.graphql.dtos'; 
import { User as DomainUser } from '../../../domain/user/entity/user.entity';
import {
  CreateUserDto,
  UpdateUserDto,
} from '../../../application/user/dtos/user.dtos';
import { AccountStatus } from 'src/@shared/core/types';
import { AuditFields as GraphQLAuditFields, UserSummary as GraphQLUserSummary } from '../dtos/user.graphql.dtos'; // Import GraphQL AuditFields and UserSummary
import { EmailAddress } from '../../../domain/user/value-objects/email-address.value-object'; // Import EmailAddress
import { RFC } from '../../../domain/@shared/value-objects/rfc.value-object'; // Import RFC
import { PhoneNumber } from '../../../domain/user/value-objects/phone-number.value-object'; // Import PhoneNumber
import { UserSummary } from '../../../domain/user/value-objects/user-summary.value-object'; // Import Domain UserSummary

@Resolver(() => GraphQLUser)
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
 private readonly manageUserRolesUseCase: ManageUserRolesUseCase,
    private readonly toggleAdminUseCase: ToggleAdminUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) { }

  @Mutation(() => GraphQLUser)
  async createUser(
    @Args('input') input: CreateUserInput,
    // TODO: Implement @CurrentUser() decorator to get the authenticated user's UserSummary
    // Example placeholder UserSummary (replace with actual user data from context)
    // @CurrentUser() currentUser: UserSummary,
  ): Promise<GraphQLUser> {
    const currentUser: UserSummary | null = null; // Replace with actual logic to get current user
    const createUserDto: CreateUserDto = {
 email: input.email,
 password: input.password, // Pass plain text password to DTO
      isAdmin: input.isAdmin ?? false,
      name: input.name,
      lastName: input.lastName,
 phoneNumber: input.phoneNumber, // Pass plain text phone number to DTO
      roles: input.roles ?? [],
    };
    const createdUser: DomainUser = await this.createUserUseCase.execute(
 currentUser, // Pass currentUser to the use case
      createUserDto,
    );
    return this.mapDomainUserToGraphQLUser(createdUser);
  }

  @Mutation(() => GraphQLUser)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
    // TODO: Implement @CurrentUser() decorator to get the authenticated user's UserSummary
    // Example placeholder UserSummary (replace with actual user data from context)
    // @CurrentUser() currentUser: UserSummary,
  ): Promise<GraphQLUser> {
    const currentUser: UserSummary | null = null; // Replace with actual logic to get current user
    const updateUserDto: UpdateUserDto = {
      id: id, // Add the ID to the DTO
 name: input.name,
 lastName: input.lastName,
 phoneNumber: input.phoneNumber,
 rfc: input.rfc,
 address: input.address,
      status: input.status,
    };
    const updatedUser: DomainUser = await this.updateUserUseCase.execute(
      id,
      updateUserDto,
 currentUser, // Pass currentUser to the use case
    );
    return this.mapDomainUserToGraphQLUser(updatedUser);
  }

  @Mutation(() => GraphQLUser)
  async deleteUser(
    @Args('id', { type: () => ID }) id: string,
    // TODO: Implement @CurrentUser() decorator to get the authenticated user's UserSummary
    // Example placeholder UserSummary (replace with actual user data from context)
    // @CurrentUser() currentUser: UserSummary,
  ): Promise<GraphQLUser> {
    const currentUser: UserSummary | null = null; // Replace with actual logic to get current user
    const deletedUser: DomainUser = await this.deleteUserUseCase.execute(id, currentUser); // Pass currentUser to the use case
    return this.mapDomainUserToGraphQLUser(deletedUser);
  }

 @Mutation(() => GraphQLUser)
  async updateUserBusinessRoles(
 @Args('input') input: UpdateUserBusinessRolesInput,
  ): Promise<GraphQLUser> {
    // TODO: Implement @CurrentUser() decorator to get the authenticated user's UserSummary
    // Example placeholder UserSummary (replace with actual user data from context)
    // @CurrentUser() currentUser: UserSummary,
    const currentUser: UserSummary | null = null; // Replace with actual logic to get current user
    const userWithUpdatedRoles: DomainUser = await this.manageUserRolesUseCase.execute({
 userId: input.userId,
      finalRoles: input.roles, // The use case now expects the final list of roles
 }, currentUser); // Pass currentUser as the second argument
    return this.mapDomainUserToGraphQLUser(userWithUpdatedRoles);
  }

 @Mutation(() => GraphQLUser)
  async toggleAdmin(
    @Args('input') input: ToggleAdminInput,
  ): Promise<GraphQLUser> {
    // TODO: Implement @CurrentUser() decorator to get the authenticated user's UserSummary
    // Example placeholder UserSummary (replace with actual user data from context)
    // @CurrentUser() currentUser: UserSummary,
    const currentUser: UserSummary | null = null; // Replace with actual logic to get current user
    const userWithAdminStatus: DomainUser =
      await this.toggleAdminUseCase.execute(input.userId, input.isAdmin, currentUser); // Pass currentUser to the use case
    return this.mapDomainUserToGraphQLUser(userWithAdminStatus);
  }

  @Query(() => PaginatedUsers, { name: 'users' })
  async users(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<PaginatedUsers> {
    // Assuming GetUsersUseCase handles pagination and filtering
    const { users, totalCount, hasNextPage } = await this.getUsersUseCase.execute({ limit, offset });
    return {
      users: users.map(this.mapDomainUserToGraphQLUser),
      totalCount,
      hasNextPage,
    };
  }

  @Query(() => GraphQLUser, { name: 'user' })
  async user(@Args('id', { type: () => ID }) id: string): Promise<GraphQLUser> {
    const user: DomainUser | null = await this.getUserByIdUseCase.execute(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.mapDomainUserToGraphQLUser(user);
  }

  // Helper function to map DomainUser to GraphQLUser
  private mapDomainUserToGraphQLUser(user: DomainUser): GraphQLUser {
    return {
      id: user.id,
 email: user.email.getValue(), // Get string value from EmailAddress
      name: user.name,
 lastName: user.lastName,
 phoneNumber: user.phoneNumber?.getValue() ?? null, // Get string value from PhoneNumber
 address: user.address,
 rfc: user.rfc?.getValue() ?? null, // Get string value from RFC
      isAdmin: user.isAdmin,
      roles: user.roles,
      status: user.status.toUpperCase() as AccountStatus, // Explicitly cast to match GraphQL enum casing
      audit: { // Map audit fields into a nested object
        createdAt: user.audit.createdAt ?? new Date(0), // Provide a default Date if null
        createdBy: user.audit.createdBy ? GraphQLUserSummary.fromDomain(user.audit.createdBy) : null, // Map domain UserSummary to GraphQL UserSummary
        updatedAt: user.audit.updatedAt ?? null,
        updatedBy: user.audit.updatedBy ? GraphQLUserSummary.fromDomain(user.audit.updatedBy) : null, // Map domain UserSummary to GraphQL UserSummary
        deletedAt: user.audit.deletedAt ?? null,
        deletedBy: user.audit.deletedBy ? GraphQLUserSummary.fromDomain(user.audit.deletedBy) : null, // Map domain UserSummary to GraphQL UserSummary
      },
    };
  }
}
