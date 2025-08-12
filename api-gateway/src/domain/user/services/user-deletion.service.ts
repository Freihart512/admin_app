// domain/user/services/UserDeletionService.ts
import { User } from '@domain/user/entity/user.entity';
import { UserSummary } from '@domain/user/value-objects/user-summary.value-object';
import { UserDeletionError } from '@domain/user/errors/user-delation-error';

export class UserDeletionService {
  static execute(user: User, deletedBy: UserSummary, options: {
    hasActiveContracts: boolean;
  }): User {
    if (options.hasActiveContracts) {
      throw new UserDeletionError('User cannot be deleted with active contracts');
    }

    const userClone = user.clone();
    userClone.markAsDeleted(deletedBy);
    return userClone;
  }
}
