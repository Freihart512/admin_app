import { Module } from '@nestjs/common';
import { UserResolver } from '../../infrastructure/graphql/resolvers/user.resolver';
import { KyselyUserRepository } from '../../infrastructure/repositories/user-kysely.repository';
import { CreateUserUseCase } from '../../application/user/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../../application/user/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/user/use-cases/delete-user.use-case';
import { ManageUserRolesUseCase } from '../../application/user/use-cases/manage-user-roles.use-case';
import { ToggleAdminUseCase } from '../../application/user/use-cases/toggle-admin.use-case';
import { GetUsersUseCase } from '../../application/user/use-cases/get-users.use-case';
import { GetUserByIdUseCase } from '../../application/user/use-cases/get-user-by-id.use-case';

@Module({
  providers: [
    UserResolver,
    KyselyUserRepository,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ManageUserRolesUseCase,
    ToggleAdminUseCase,
    GetUsersUseCase,
    GetUserByIdUseCase,
  ],
  exports: [
    KyselyUserRepository,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ManageUserRolesUseCase,
    ToggleAdminUseCase,
    GetUsersUseCase,
    GetUserByIdUseCase,
  ],
})
export class UserModule {}
