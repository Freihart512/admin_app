import { NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../domain/user/ports/user.repository.port';
import { User } from 'src/domain/user/entity/user.entity';
import { UserSummary } from 'src/domain/user/value-objects/user-summary.value-object';
import { BusinessRole } from 'src/@shared/core/types'; // Assuming BusinessRole is used for checks
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  
  async execute(userId: string, currentUser: UserSummary): Promise<User> {
    const user = await this.userRepository.findById(userId); // Assuming findById loads UserSummary for createdBy/updatedBy

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // Apply business rules for soft deletion based on roles
    // This is a simplified example. You would need to implement
    // the actual checks for active contracts, properties, etc. 
    // if (user.hasRole(BusinessRole.OWNER) && user.hasActiveContracts()) {
    //     throw new ConflictException(`Cannot delete Owner with active contracts.`);
    // }

    // if (user.hasRole(BusinessRole.TENANT) && user.hasActiveContracts()) {
    //     throw new ConflictException(`Cannot delete Tenant with active contracts.`); 
    // }

    // You might need similar checks for ACCOUNTANT if they have active associations

    // If checks pass, perform soft delete
    user.markAsDeleted(currentUser); // Use the entity method for soft deletion

    await this.userRepository.save(user); // Assuming save handles updating the deletedAt/deletedBy fields in the database
    return user;
  }
}