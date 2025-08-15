import { Module } from '@nestjs/common';
import { ValueObjectRegistry } from '@infrastructure/value-objects/value-object.registry';
import { RfcValidator } from '@infrastructure/validators/rfc.validator';
import { UuidValidator } from '@infrastructure/validators/uuid.validator';
import { BcryptHashingService } from '@infrastructure/services/bcrypt-hashing.service';
import { KyselyUserRepository } from '@infrastructure/repositories/user-kysely.repository';
import { UserResolver } from '@infrastructure/graphql/resolvers/user.resolver';
import { CreateUserUseCase } from '@application/user/use-cases/create-user.use-case';
import { PasswordGeneratorService } from '@shared/services/password-generator.service';
import { AppErrorMapper } from '@shared/services/app-error-mapper.service';

/**
 * UserModule wires together the infrastructure, application and domain layers
 * for the User bounded context. It registers the repository, validators,
 * services and use cases required by the GraphQL resolvers.
 */
@Module({
  providers: [
    // Domain validators and services
    RfcValidator,
    UuidValidator,
    BcryptHashingService,
    ValueObjectRegistry,

    // Adapter for generating random passwords
    PasswordGeneratorService,

    // Repository implementation bound to the UserRepository token
    {
      provide: 'UserRepository',
      useClass: KyselyUserRepository,
    },
    // Password generator port token binding: alias the concrete service under its port token
    {
      provide: 'PasswordGeneratorPort',
      useExisting: PasswordGeneratorService,
    },
    // Use case – Nest will resolve its dependencies via the tokens above
    CreateUserUseCase,
    // GraphQL resolver
    UserResolver,
    // Global error mapper service
    {
      provide: 'ErrorMapperPort',
      useClass: AppErrorMapper,
    },
  ],
  exports: [CreateUserUseCase],
})
export class UserModule {}
