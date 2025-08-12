
// infrastructure/repositories/KyselyUserRepository.ts
import { Kysely, OperandValueExpressionOrList } from 'kysely';
import { Database } from '../database/kysely.db';
import { UserRepository } from '../../domain/user/ports/user.repository.port';
import { User } from '../../domain/user/entity/user.entity';
import { BusinessRole, AccountStatus } from '../../@shared/core/types';
import { UserSummary } from '../../domain/user/value-objects/user-summary.value-object';
import { PhoneNumber } from '../../domain/user/value-objects/phone-number.value-object';
import { EmailAddress } from '../../domain/user/value-objects/email-address.value-object';
import { RFC } from '../../domain/@shared/value-objects/rfc.value-object';
import { Password } from '../../domain/user/value-objects/password.value-object';
import { ConstraintViolationError } from '@infrastructure/database/errors/constraint-violation.error';
import { DataAccessError } from '@infrastructure/database/errors/data-access.error';
import { DataIntegrityError } from '@infrastructure/database/errors/data-integrity.error';
import { ValueObject } from '@domain/@shared/value-objects/base.value-object';
import { UserTable } from '@infrastructure/database/types';


export class KyselyUserRepository implements UserRepository {
  constructor(private readonly db: Kysely<Database>) { }

  private mapToUser(userData: any): User {
    return new User({
      id: UUID.create(userData.id),
      email: EmailAddress.create(userData.email),
      passwordHash: userData.password_hash,
      isAdmin: userData.is_admin,
      roles: userData.roles,
      name: userData.name,
      lastName: userData.last_name,
      phoneNumber: userData.phone_number,
      address: userData.address,
      rfc: userData.rfc,
      status: userData.status,
      createdAt: userData.created_at,
      createdBy: userData.created_by ? UUID.create(userData.created_by) : null,
      updatedAt: userData.updated_at,
      updatedBy: userData.updated_by ? UUID.create(userData.updated_by) : null,
      deletedAt: userData.deleted_at,
      deletedBy: userData.deleted_by ? UUID.create(userData.deleted_by) : null,
    });
  }

  private async isUniqueValueByField<Field extends keyof UserTable>(
    value: OperandValueExpressionOrList<Database, "users", Field>,
    field: Field
  ): Promise<boolean> {
    try {
      const result = await this.db
        .selectFrom('users')
        .where(field, '=', value)
        .select(field)
        .executeTakeFirst();

      return !result;
    } catch (error) {
      console.error(error);
      throw new DataAccessError(`Error checking uniqueness of ${field}: ${value}`);
    }
  }


  async isEmailUnique(EmailAddress:EmailAddress): Promise<boolean> {
    return this.isUniqueValueByField(EmailAddress.getValue().toLowerCase(), 'email');
  }

  async isPhoneNumberUnique(PhoneNumber:PhoneNumber): Promise<boolean> {
    return this.isUniqueValueByField(PhoneNumber.getValue(), 'phone_number');
  }
  async isRfcUnique(RFC:RFC): Promise<boolean> {
    return this.isUniqueValueByField(RFC.getValue().toUpperCase(), 'rfc');
  }

  async create(user: User): Promise<void> {
    try {
      await this.db
        .insertInto('users')
        .values(row)
        .onConflict(oc => {
          return oc.doNothing();
        })
        .executeTakeFirst();
    } catch (error: any) {
      if (error.code === '23505') {
        switch (error.constraint) {
          case 'users_email_unique':
            throw new ConstraintViolationError('User with this email already exists.');
          case 'users_phone_number_unique':
            throw new ConstraintViolationError('User with this phone number already exists.');
          case 'users_rfc_unique':
            throw new ConstraintViolationError('User with this RFC already exists.');
        }
      }
      throw error;
    }
  }
}



// async update(user: User): Promise<void> {
//   const row = this.toPersistence(user);
//     if (user.audit.deletedBy?.id) {
//       await this.db
//         .updateTable('users')
//         .set({ deleted_by: user.audit.deletedBy.id })
//         .where('id', '=', user.id)
//         .execute();
//     }
//   } catch (error: any) {
//     if (error.code === '23505') {
//       switch (error.constraint) {
//         case 'users_email_unique':
//           throw new Error('Email already exists.');
//         case 'users_phone_number_unique':
//           throw new Error('Phone number already exists.');
//         case 'users_rfc_unique':
//           throw new Error('RFC already exists.');
//       }
//     }
//     throw error;
//   }
// }

// async findById(id: string): Promise<User | null> {
//   const row = await this.db
//     .selectFrom('users')
//     .selectAll()
//     .where('id', '=', id)
//     .executeTakeFirst();

//   return row ? this.mapToDomain(row) : null;
// }

// async findByEmail(email: EmailAddress): Promise<User | null> {
//   const row = await this.db
//     .selectFrom('users')
//     .selectAll()
//     .where('email', '=', email.getValue().toLowerCase())
//     .where('status', '=', 'active')
//     .executeTakeFirst();

//   return row ? this.mapToDomain(row) : null;
// }

// async findByPhoneNumber(phone: PhoneNumber): Promise<User | null> {
//   const row = await this.db
//     .selectFrom('users')
//     .selectAll()
//     .where('phone_number', '=', phone.getValue())
//     .where('status', '=', 'active')
//     .executeTakeFirst();

//   return row ? this.mapToDomain(row) : null;
// }

// async findByRfc(rfc: RFC): Promise<User | null> {
//   const row = await this.db
//     .selectFrom('users')
//     .selectAll()
//     .where('rfc', '=', rfc.getValue().toUpperCase())
//     .where('status', '=', 'active')
//     .executeTakeFirst();

//   return row ? this.mapToDomain(row) : null;
// }

// async delete(id: string): Promise<void> {
//   await this.db
//     .updateTable('users')
//     .set({ deleted_at: new Date(), status: 'inactive' })
//     .where('id', '=', id)
//     .executeTakeFirst();
// }

// async listUsers(options?: {
//   status?: AccountStatus;
//   role?: BusinessRole;
//   isAdmin?: boolean;
//   limit?: number;
//   offset?: number;
// }): Promise<{ users: User[]; totalCount: number; hasNextPage: boolean }> {
//   let query = this.db.selectFrom('users').selectAll();

//   if (options?.status) {
//     query = query.where('status', '=', options.status);
//   }
//   if (options?.role) {
//     query = query.where('roles', 'like', `%\"${options.role}\"%`);
//   }
//   if (options?.isAdmin !== undefined) {
//     query = query.where('is_admin', '=', options.isAdmin);
//   }
//   if (options?.limit) {
//     query = query.limit(options.limit);
//   }
//   if (options?.offset) {
//     query = query.offset(options.offset);
//   }

//   const countRes = await this.db
//     .selectFrom('users')
//     .select(this.db.fn.count('id').as('count'))
//     .executeTakeFirst();

//   const totalCount = Number(countRes?.count || 0);
//   const rows = await query.execute();
//   const hasNext = (options?.offset ?? 0) + rows.length < totalCount;

//   return {
//     users: rows.map(this.mapToDomain),
//     totalCount,
//     hasNextPage: hasNext,
//   };



// private toPersistence(user: User): Database['users'] {
//   return {
//     id: user.id,
//     email: user.email.getValue(),
//     password_hash: user.passwordHash.getHashedValue(),
//     is_admin: user.isAdmin,
//     roles: JSON.stringify(user.roles),
//     name: user.name,
//     last_name: user.lastName,
//     phone_number: user.phoneNumber?.getValue() ?? null,
//     address: user.address ?? null,
//     rfc: user.rfc?.getValue() ?? null,
//     status: user.status,
//     created_at: user.audit.createdAt,
//     created_by: user.audit.createdBy?.id ?? null,
//     updated_at: user.audit.updatedAt ?? null,
//     updated_by: user.audit.updatedBy?.id ?? null,
//     deleted_at: user.audit.deletedAt ?? null,
//     deleted_by: user.audit.deletedBy?.id ?? null,
//   };
// }

// private mapToDomain = (row: Database['users']): User => {
//   const summary = (id?: string): UserSummary | null =>
//     id ? new UserSummary({ id, name: '', lastName: '', email: '', status: row.status }) : null;

//   return new User({
//     id: row.id,
//     email: EmailAddress.create(row.email),
//     passwordHash: Password.fromHash(row.password_hash),
//     isAdmin: row.is_admin,
//     name: row.name,
//     lastName: row.last_name,
//     roles: JSON.parse(row.roles) as BusinessRole[],
//     phoneNumber: row.phone_number ? new PhoneNumber(row.phone_number) : undefined,
//     address: row.address ?? undefined,
//     rfc: row.rfc ? new RFC(row.rfc) : undefined,
//     status: row.status,
//     audit: {
//       createdAt: row.created_at,
//       createdBy: summary(row.created_by),
//       updatedAt: row.updated_at ?? null,
//       updatedBy: summary(row.updated_by),
//       deletedAt: row.deleted_at ?? null,
//       deletedBy: summary(row.deleted_by),
//     },
//   });
// };

