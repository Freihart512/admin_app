import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { CreateUserUseCase } from '@application/user/use-cases/create-user.use-case'
import { CreateUserInput, User as GraphQLUser,  } from '@infrastructure/graphql/dtos/user.graphql.dtos'; 
import { CreateUserDto } from '@application/user/dtos/user.dto';
import { UserEntityType as DomainUser, UserErrors } from '@domain/user/user.types';
import { HashingService } from '@domain/@shared/ports/hashing.service.port';
import { RFCValidator } from '@domain/@shared/ports/rfc.validator.port';
import { UUIDValidator } from '@domain/@shared/ports/uuid.validator.port';
import { ServiceUnavailableError } from '@shared/errors/service-unavailable.error';
import { v4 as uuidv4 } from 'uuid';

// Import NestJS HTTP exceptions for mapping
import {
  BadRequestException,
  ConflictException,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';


@Resolver(() => GraphQLUser)
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly hashingService: HashingService,
    private readonly rfcValidator: RFCValidator,
    private readonly uuidValidator: UUIDValidator,
  ) { }

  @Mutation(() => GraphQLUser)
  async createUser(
    @Args('input') input: CreateUserInput,
    // TODO: Implement @CurrentUser() decorator to get the authenticated user's UserSummary
    // Example placeholder UserSummary (replace with actual user data from context)
    // @CurrentUser() currentUser: UserSummary,
  ): Promise<GraphQLUser> {

    // Generate a UUID for the new user at the application layer boundary
    // This UUID string will be passed to the domain entity constructor
    const userId = uuidv4();

    const createUserDto: CreateUserDto = {
      id: userId, // Pass the generated UUID string
      email: input.email,
      password: input.password,
      isAdmin: input.isAdmin ?? false,
      name: input.name,
      lastName: input.lastName,
      phoneNumber: input.phoneNumber,
      roles: input.roles ?? [],
      address: input.address, // Include address
      rfc: input.rfc, // Include rfc
    };

    try {
      const createdUser: DomainUser = await this.createUserUseCase.execute(
        createUserDto,
        this.hashingService,
        this.rfcValidator,
        this.uuidValidator,
        // Pass currentUser if implemented
        // currentUser,
      );
      return this.mapDomainUserToGraphQLUser(createdUser);
    } catch (error: any) { // Catch any thrown error
      // Map domain/application errors to NestJS HTTP exceptions
      if (error instanceof UserErrors.AlreadyValueExistError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof ServiceUnavailableError) {
        throw new ServiceUnavailableException(error.message);
      }
      if (error instanceof UserErrors.AdminCannotHaveBusinessRolesError || error instanceof UserErrors.NonAdminMustHaveRolesError || error instanceof UserErrors.AddressRequiredForOwnerError) {
        throw new BadRequestException(error.message);
      }
      console.error('Unexpected error in UserResolver.createUser:', error);
      throw new InternalServerErrorException('Unexpected error in UserResolver.createUser:');
    }
  }

    // Helper function to map DomainUser to GraphQLUser
    private mapDomainUserToGraphQLUser(user: DomainUser): GraphQLUser {
      return {
        id: user.getId().getValue(), // Use getter and get string value from UUID
        email: user.getEmail().getValue(), // Use getter and get string value from EmailAddress
        name: user.getName(), // Use getter
        lastName: user.getLastName(), // Use getter
        phoneNumber: user.getPhoneNumber()?.getValue() ?? null, // Use getter and get string value from PhoneNumber
        address: user.getAddress(), // Use getter
        rfc: user.getRfc()?.getValue() ?? null, // Use getter and get string value from RFC
        isAdmin: user.getIsAdmin(), // Use getter
        roles: user.getRoles(), // Use getter
        status: user.getStatus().toUpperCase() as any, // Use getter and cast to match GraphQL enum casing (assuming it's string based)
        // Assuming GraphQLUserSummary has a static method fromDomain
        // audit: { // Map audit fields into a nested object - Audit fields are not included in GraphQLUser DTO in the snippet
  //         createdAt: user.audit.createdAt ?? new Date(0), // Provide a default Date if null
  //         createdBy: user.audit.createdBy ? GraphQLUserSummary.fromDomain(user.audit.createdBy) : null, // Map domain UserSummary to GraphQL UserSummary
  //         updatedAt: user.audit.updatedAt ?? null,
  //         updatedBy: user.audit.updatedBy ? GraphQLUserSummary.fromDomain(user.audit.updatedBy) : null, // Map domain UserSummary to GraphQL UserSummary
  //         deletedAt: user.audit.deletedAt ?? null,
  //         deletedBy: user.audit.deletedBy ? GraphQLUserSummary.fromDomain(user.audit.deletedBy) : null, // Map domain UserSummary to GraphQL UserSummary
  //       },
      };
    }
}
