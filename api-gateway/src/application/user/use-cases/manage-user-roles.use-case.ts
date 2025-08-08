import { UserRepository } from '../../../domain/user/ports/user.repository.port';
import { User } from '../../../domain/user/entity/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common'; // Example NestJS exceptions
import { BusinessRole } from 'src/@shared/core/types';
import { UserSummary } from 'src/domain/user/value-objects/user-summary.value-object';

export interface ManageUserRolesParams {
 userId: string;
  finalRoles: BusinessRole[];
}

export class ManageUserRolesUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: ManageUserRolesParams, currentUser: UserSummary): Promise<User> {
    const { userId, finalRoles } = params;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (user.isAdmin) {
      throw new BadRequestException('Cannot manage business roles for an admin user.');
    }

    user.updateRoles(finalRoles);
    user.validateRoleConsistency();

    user.audit.updatedBy = currentUser;
    user.audit.updatedAt = new Date();
    await this.userRepository.save(user);

    return user;
  }
}
