import { UserRepository } from '../../../domain/user/ports/user.repository.port';
import { User } from '../../../domain/user/entity/user.entity';
import { BusinessRole } from '../../../domain/user/entity/user.entity'; // Import BusinessRole
import { UserSummary } from '../../../domain/user/value-objects/user-summary.value-object'; // Import UserSummary

export class ToggleAdminUseCase { // Assuming this use case exists and its file name is correct
 constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, isAdmin: boolean, currentUser: UserSummary): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found'); // Or a custom NotFoundException
    }

    if (user.isAdmin && !isAdmin) {
      // Check if this is the last active admin before removing admin status
      const { users: otherActiveAdmins } = await this.userRepository.listUsers({
        isAdmin: true,
        status: 'active',
        // We need a way to exclude the current user's ID from the count.
        // If the repository doesn't support exclusion, we list and check.
      });
      if (otherActiveAdmins.length === 1 && otherActiveAdmins[0].id === userId) {
        throw new Error('Cannot remove admin status from the last active administrator.'); // Or a custom ForbiddenException
      }
    }

    user.isAdmin = isAdmin;
    if (user.isAdmin) {
      user.roles = []; // Clear business roles if becoming an admin
    }

    user.audit.updatedBy = currentUser;
    user.audit.updatedAt = new Date();

    await this.userRepository.save(user);

    return user;
  }
}