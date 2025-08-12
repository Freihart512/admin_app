import { User } from '@domain/user/entity/user.entity';
import { EmailAddress } from '@domain/user/value-objects/email-address.value-object';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { FindPaginatedParams, PaginatedResult } from '@shared/core/types'
import { UserFilters } from '@domain/user/user.types'
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { PhoneNumber } from '../value-objects/phone-number.value-object';

export interface UserRepository {
  // update(user: User): Promise<void>;
  create(user: User): Promise<void>;
  // findById(id: UUID): Promise<User | null>;
  // findByEmail(email: EmailAddress): Promise<User | null>;
  // findUsers(options: FindPaginatedParams<UserFilters>): Promise<PaginatedResult<User>>;
  isEmailUnique(email: EmailAddress): Promise<boolean>;
  isPhoneNumberUnique(phoneNumber: PhoneNumber): Promise<boolean>;
  isRfcUnique(rfc: RFC): Promise<boolean>;
}
