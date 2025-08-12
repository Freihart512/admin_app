
// infrastructure/repositories/KyselyUserRepository.ts
import { Kysely, OperandValueExpressionOrList } from 'kysely';
import { Database, db } from '../database/kysely.db';
import { UserRepository } from '../../domain/user/ports/user.repository.port';
import { User } from '../../domain/user/entity/user.entity';
import { PhoneNumber } from '../../domain/user/value-objects/phone-number.value-object';
import { EmailAddress } from '../../domain/user/value-objects/email-address.value-object';
import { RFC } from '../../domain/@shared/value-objects/rfc.value-object';
import { AlreadyValueExistError } from '@domain/user/errors/already-value-exist.error';
import { DataAccessError } from '@infrastructure/database/errors/data-access.error';
import { UserTable } from '@infrastructure/database/types';


export class KyselyUserRepository implements UserRepository {
  /**
   * The underlying database connection.  Defaults to the shared
   * `db` instance exported from the database module.  Passing a
   * different connection allows for easier testing.
   */
  constructor(private readonly db: Kysely<Database> = db) {}

  /**
   * Convert a domain `User` entity into a plain object compatible
   * with the `users` table defined in the database layer.  This
   * method extracts the primitive values from each value object and
   * serialises arrays into JSON strings where appropriate.
   */
  private toPersistence(user: User): UserTable {
    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      password_hash: user.getPassword().getHashedValue(),
      is_admin: user.getIsAdmin(),
      roles: JSON.stringify(user.getRoles()),
      name: user.getName(),
      last_name: user.getLastName(),
      phone_number: user.getPhoneNumber() ? user.getPhoneNumber()!.getValue() : null,
      address: user.getAddress() ?? null,
      rfc: user.getRfc() ? user.getRfc()!.getValue() : null,
      status: user.getStatus(),
      // Audit fields are optional on creation; set sensible defaults
      created_at: user.getAudit()?.createdAt ?? new Date(),
      created_by: user.getAudit()?.createdBy?.id ?? 'system',
      updated_at: user.getAudit()?.updatedAt ?? null,
      updated_by: user.getAudit()?.updatedBy?.id ?? null,
      deleted_at: user.getAudit()?.deletedAt ?? null,
      deleted_by: user.getAudit()?.deletedBy?.id ?? null,
    };
  }

  /**
   * Generic helper to check whether a given column value is unique in
   * the users table.  Returns `true` when no record exists with the
   * provided value.  Throws a `DataAccessError` if the underlying
   * query fails.
   */
  private async isUniqueValueByField<Field extends keyof UserTable>(
    value: OperandValueExpressionOrList<Database, 'users', Field>,
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
      throw new DataAccessError(`Error checking uniqueness of ${String(field)}: ${String(value)}`);
    }
  }


  async isEmailUnique(email: EmailAddress): Promise<boolean> {
    return this.isUniqueValueByField(email.getValue().toLowerCase(), 'email');
  }

  async isPhoneNumberUnique(phoneNumber: PhoneNumber): Promise<boolean> {
    return this.isUniqueValueByField(phoneNumber.getValue(), 'phone_number');
  }

  async isRfcUnique(rfc: RFC): Promise<boolean> {
    return this.isUniqueValueByField(rfc.getValue().toUpperCase(), 'rfc');
  }

  /**
   * Persists a new user entity to the database.  If a unique
   * constraint is violated the repository throws an
   * AlreadyValueExistError to allow the application layer to respond
   * accordingly.  Any low‑level query errors are wrapped in
   * DataAccessError.
   */
  async create(user: User): Promise<void> {
    const row = this.toPersistence(user);
    try {
      await this.db.insertInto('users').values(row).execute();
    } catch (error: any) {
      // PostgreSQL uses error code 23505 for unique violations.  The
      // constraint property indicates which unique index triggered.
      if (error?.code === '23505') {
        const constraint: string | undefined = error?.constraint;
        if (constraint) {
          if (constraint.includes('email')) {
            throw new AlreadyValueExistError(row.email, 'email');
          } else if (constraint.includes('phone_number')) {
            throw new AlreadyValueExistError(row.phone_number ?? '', 'phoneNumber');
          } else if (constraint.includes('rfc')) {
            throw new AlreadyValueExistError(row.rfc ?? '', 'rfc');
          }
        }
        // Generic duplicate
        throw new AlreadyValueExistError('', '');
      }
      throw new DataAccessError('Error inserting user into database');
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

