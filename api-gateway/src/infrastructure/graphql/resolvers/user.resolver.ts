import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateUserUseCase } from '@application/user/use-cases/create-user.use-case';
import {
  CreateUserInput,
  User as GraphQLUser,
} from '@infrastructure/graphql/dtos/user.graphql.dtos';
import { CreateUserDto } from '@application/user/dtos/user.dto';
import { UserEntityType as DomainUser } from '@domain/user/user.types';
import {
  AlreadyValueExistError,
  AdminCannotHaveBusinessRolesError,
  NonAdminMustHaveRolesError,
  AddressRequiredForOwnerError,
} from '@domain/user/errors';
import { ServiceUnavailableError } from '@shared/errors/service-unavailable.error';
import { v4 as uuidv4 } from 'uuid';
import {
  BadRequestException,
  ConflictException,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';

@Resolver(() => GraphQLUser)
export class UserResolver {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Mutation(() => GraphQLUser)
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<GraphQLUser> {
    const userId = uuidv4();

    const createUserDto: CreateUserDto = {
      id: userId,
      email: input.email,
      isAdmin: input.isAdmin ?? false,
      name: input.name,
      lastName: input.lastName,
      phoneNumber: input.phoneNumber,
      roles: input.roles ?? [],
      address: input.address,
      rfc: input.rfc,
    };

    try {
      const createdUser: DomainUser =
        await this.createUserUseCase.execute(createUserDto);
      return this.mapDomainUserToGraphQLUser(createdUser);
    } catch (error: any) {
      if (error instanceof AlreadyValueExistError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof ServiceUnavailableError) {
        throw new ServiceUnavailableException(error.message);
      }
      if (
        error instanceof AdminCannotHaveBusinessRolesError ||
        error instanceof NonAdminMustHaveRolesError ||
        error instanceof AddressRequiredForOwnerError
      ) {
        throw new BadRequestException(error.message);
      }
      console.error('Unexpected error in UserResolver.createUser:', error);
      throw new InternalServerErrorException(
        'Unexpected error in UserResolver.createUser:',
      );
    }
  }

  private mapDomainUserToGraphQLUser(user: DomainUser): GraphQLUser {
    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      name: user.getName(),
      lastName: user.getLastName(),
      phoneNumber: user.getPhoneNumber()?.getValue() ?? null,
      address: user.getAddress(),
      rfc: user.getRfc()?.getValue() ?? null,
      isAdmin: user.getIsAdmin(),
      roles: user.getRoles(),
      status: user.getStatus().toUpperCase() as any,
    };
  }
}
