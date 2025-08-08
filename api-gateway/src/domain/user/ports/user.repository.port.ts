import { User } from '../entity/user.entity';
import { BusinessRole } from '../../../@shared/core/types';
import { EmailAddress } from '../value-objects/email-address.value-object';
import { UUID } from '../../@shared/value-objects/uuid.value-object';

export interface UserRepository {
  update(user: User): Promise<void>;
  create(user: User): Promise<void>;
  findById(id: UUID): Promise<User | null>;
  findByEmail(email: EmailAddress): Promise<User | null>;
  delete(user: User): Promise<void>;
  listUsers(options: { // Make options required to define pagination/filters
    status?: 'active' | 'inactive';
    role?: BusinessRole;
    isAdmin?: boolean;
    limit?: number; 
    offset?: number; 
  }): Promise<{
    users: User[];
    totalCount: number;
    hasNextPage: boolean;
  }>;
}
