// import { Kysely } from 'kysely';
// import { Database } from '../database/kysely.db';
// import { UserRepository } from '../../domain/user/user.repository';
// import { User } from '../../domain/user/user';
// import { BusinessRole, AccountStatus} from '../../shared/types';
// import { UserSummary } from '../../domain/user/valueObjects/UserSummary'; // Import UserSummary
// import { PhoneNumber } from '../../domain/user/valueObjects/PhoneNumber'; // Import PhoneNumber
// import { EmailAddress } from '../../domain/user/valueObjects/EmailAddress';
// import { RFC } from '../../domain/valueObjects/Rfc';
 
// import { Password } from '../../domain/user/valueObjects/Password'; // Import Password
// export class KyselyUserRepository implements UserRepository {
//   constructor(private db: Kysely<Database>) {}

//   async save(user: User): Promise<void> {
//     const userRow = {
//       id: user.id,
//       password_hash: user.passwordHash.getHashedValue(), // Get hashed string value from Password Value Object
//       is_admin: user.isAdmin, // Ensure boolean matches DB type
//       roles: JSON.stringify(user.roles), // Store roles as JSON string
//       name: user.name as string, // Ensure name is string
//       last_name: user.lastName as string,
//       phone_number: user.phoneNumber ? user.phoneNumber.getValue() : null, // Get string value from PhoneNumber Value Object
//       address: user.address ?? null, // Explicitly convert undefined to null for DB
//       rfc: user.rfc ? user.rfc.getValue() : null, // Get string value from RFC Value Object
//       status: user.status, // Assuming AccountStatus maps directly to a DB string type
//       created_at: user.audit.createdAt, // Access from audit object
//       // Store only the ID for auditor fields
//       created_by: user.audit.createdBy?.id ?? null, // Access from audit object
//  updated_at: user.audit.updatedAt, // Access from audit object
//       updated_by: user.audit.updatedBy as string | null, // Access from audit object
//       deleted_at: user.audit.deletedAt, // Access from audit object
//     };

//     // Use Kysely's upsert to handle both insert and update based on primary key (id)
//     // This requires a primary key constraint on the 'id' column in the 'users' table.
//     try {
//       await this.db
//         .insertInto('users')
//         .values(userRow)
//  .onConflict(oc => {
//  oc.column('id');
//  const updateSet = { ...userRow } as any;
//  delete updateSet.email; // Prevent updating email on conflict
//  return oc.doUpdateSet(updateSet);
//           .column('id')
//           .doUpdateSet(userRow) // Update all fields if conflict on id
//         )
//  .executeTakeFirst(); // Use executeTakeFirst instead of executeTakeFirstOrThrow for upsert

//         // If deletedBy is set on the domain entity's audit object, update the deleted_by column separately.
//         // This handles the case where soft delete is performed via a method call before save.
//         if (user.audit.deletedBy?.id) { // Access deletedBy from audit object
//             await this.db.updateTable('users').set({ deleted_by: user.audit.deletedBy.id }).where('id', '=', user.id).execute(); // Access deletedBy from audit object
//         }
//     } catch (error: any) {
//       // Handle potential unique constraint errors for email, phone_number, rfc
//       if (error.code === '23505') { // PostgreSQL unique violation error code
//         if (error.constraint === 'users_email_unique') {
//           throw new Error('Email already exists.');
//         }
//         if (error.constraint === 'users_phone_number_unique') {
//           throw new Error('Phone number already exists.');
//         }
//         if (error.constraint === 'users_rfc_unique') {
//           throw new Error('RFC already exists.');
//         }
//       }
//       throw error; // Re-throw other errors
//     }
//   }

//   async findById(id: string): Promise<User | null> {
//     const userRow = await this.db
//       .selectFrom('users')
//       .selectAll()
//       .where('id', '=', id)
//       .executeTakeFirst();

//     if (!userRow) {
//       return null;
//     }

//  return this.mapRowToUser(userRow);
//   }

//   async findByEmail(email: EmailAddress): Promise<User | null> {
//     const userRow = await this.db
//       .selectFrom('users')
//       .selectAll() // Select all columns
//       .where('email', '=', email.getValue().toLowerCase())
//       .where('status', '=', 'active' as AccountStatus) // Only find active users by email for login/unique check
//       .executeTakeFirst();
//     if (!userRow) {
//       return null;
//     }
//  return this.mapRowToUser(userRow);
//   }

//   async delete(id: string): Promise<void> {
//     // This method implements soft delete
//     await this.db
//       .updateTable('users')
//       .set({ deleted_at: new Date(), status: 'inactive' })
//  .where('id', '=', id)
//       .executeTakeFirst(); // Use executeTakeFirst
//     // Note: Setting deleted_by should ideally happen in the domain entity's
//     // markAsDeleted method and then persisted by the save method.
//     // If you are using this delete method directly in a use case,
//     // you might need to fetch the user first, call markAsDeleted, and then save.
//     // Or, pass the deletedBy user's ID to this method.
//   }

//  async listUsers(options?: {
//     status?: AccountStatus;
//     role?: BusinessRole;
//     isAdmin?: boolean;
//     limit?: number;
//     offset?: number;
//   }): Promise<{ users: User[]; totalCount: number; hasNextPage: boolean }> {
//     let query = this.db.selectFrom('users').selectAll();
//     if (options?.status) {
//       query = query.where('status', '=', options.status as string);
//     }
//     if (options?.role) {
//        query = query.where('roles', 'like', `%\"${options.role}\"%`);
//     }
//     if (options?.isAdmin !== undefined) {
//       query = query.where('is_admin', '=', options.isAdmin);
//     }
//     if (options?.limit !== undefined) {
//       query = query.limit(options.limit);
//     }
//     if (options?.offset !== undefined) {
//       query = query.offset(options.offset);
//     }

//     // To get the total count without limit/offset, we need a separate query or
//     // use a window function, but a simple separate count query is often clearer.
//     // Kysely's paginate plugin can also handle this, but let's do it manually for clarity.
//     const totalCountResult = await this.db
//       .selectFrom('users')
//       .select(this.db.fn.count('id').as('count'))
//       .executeTakeFirst();

//     const totalCount = Number(totalCountResult?.count || 0);
//     const userRows = await query.execute(); // Execute the paginated query

//     const hasNextPage = options?.limit !== undefined && (options.offset ?? 0) + userRows.length < totalCount;

//  return {
//  users: userRows.map(userRow => this.mapRowToUser(userRow)),
//  totalCount,
//  hasNextPage,
//  };
//   }

//   async findByPhoneNumber(phoneNumber: PhoneNumber): Promise<User | null> {
//     const userRow = await this.db
//       .selectFrom('users')
//       .selectAll()
//       .where('phone_number', '=', phoneNumber.getValue()) // Get string value from PhoneNumber
//       .where('status', '=', 'active') // Only find active users by phone for unique check
//       .executeTakeFirst();

//     if (!userRow) {
//       return null;
//     }

//     return this.mapRowToUser(userRow);
//   }

//   async findByRfc(rfc: RFC): Promise<User | null> {
//      const userRow = await this.db
//        .selectFrom('users')
//        .selectAll()
//        .where('rfc', '=', rfc.getValue().toUpperCase()) // Get string value from RFC and uppercase for consistent lookup
//        .where('status', '=', 'active') // Only find active users by rfc for unique check
//        .executeTakeFirst();

//      if (!userRow) {
//        return null;
//      }

//      return this.mapRowToUser(userRow);
//   }

//   private mapRowToUser(userRow: any): User {
//     // Create UserSummary instances from auditor IDs
//     // Note: We are only mapping the ID to UserSummary here for simplicity
//     // as the UserSummary includes name, email, etc., which are not available
//     // in the userRow without a JOIN. To hydrate the full UserSummary,
//     // you would need to fetch the auditor user separately or modify the queries to JOIN.
//     const createdBySummary = userRow.created_by ? new UserSummary({ id: userRow.created_by, name: '', lastName: '', email: '', status: userRow.status as AccountStatus }) : null;
//     const updatedBySummary = userRow.updated_by ? new UserSummary({ id: userRow.updated_by, name: '', lastName: '', email: '', status: userRow.status as AccountStatus }) : null;
//     const deletedBySummary = userRow.deleted_by ? new UserSummary({ id: userRow.deleted_by, name: '', lastName: '', email: '', status: userRow.status as AccountStatus }) : null;

//     // Construct the AuditFields object
//     const auditFields = {
//       createdAt: userRow.created_at,
//       createdBy: createdBySummary,
//       updatedAt: userRow.updated_at ?? null,
//       updatedBy: updatedBySummary,
//       deletedAt: userRow.deleted_at ?? null,
//       deletedBy: deletedBySummary,
//     };
//     return new User(
//  {
//  id: userRow.id,
//  email: new EmailAddress(userRow.email), // Create EmailAddress instance from DB string 
//  passwordHash: Password.fromHash(userRow.password_hash), // Create Password instance from DB string hash
//  isAdmin: userRow.is_admin, // Ensure boolean matches DB type
//  name: userRow.name,
//  lastName: userRow.last_name,
//         roles: JSON.parse(userRow.roles as string) as BusinessRole[], // Assuming roles are stored as JSON string
//         phoneNumber: userRow.phone_number ? new PhoneNumber(userRow.phone_number) : undefined, // Create PhoneNumber instance from DB string
//         address: userRow.address ?? undefined,
//         rfc: userRow.rfc ? new RFC(userRow.rfc) : undefined, // Create RFC instance from DB string
//         status: userRow.status as AccountStatus,
//         audit: auditFields, // Pass the AuditFields object to the User constructor
//  }
//     );
//   }
// }

// infrastructure/repositories/KyselyUserRepository.ts
import { Kysely } from 'kysely';
import { Database } from '../database/kysely.db';
import { UserRepository } from '../../domain/user/ports/user.repository.port';
import { User } from '../../domain/user/entity/user.entity';
import { BusinessRole, AccountStatus } from '../../@shared/core/types';
import { UserSummary } from '../../domain/user/value-objects/user-summary.value-object';
import { PhoneNumber } from '../../domain/user/value-objects/phone-number.value-object';
import { EmailAddress } from '../../domain/user/value-objects/email-address.value-object';
import { RFC } from '../../domain/@shared/value-objects/rfc.value-object';
import { Password } from '../../domain/user/value-objects/password.value-object';

export class KyselyUserRepository implements UserRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async save(user: User): Promise<void> {
    const row = this.toPersistence(user);

    try {
      await this.db
        .insertInto('users')
        .values(row)
        .onConflict(oc => {
          oc.column('id');
          const updateSet = { ...row };
          delete updateSet.email; // Prevent email update
          return oc.doUpdateSet(updateSet);
        })
        .executeTakeFirst();

      if (user.audit.deletedBy?.id) {
        await this.db
          .updateTable('users')
          .set({ deleted_by: user.audit.deletedBy.id })
          .where('id', '=', user.id)
          .execute();
      }
    } catch (error: any) {
      if (error.code === '23505') {
        switch (error.constraint) {
          case 'users_email_unique':
            throw new Error('Email already exists.');
          case 'users_phone_number_unique':
            throw new Error('Phone number already exists.');
          case 'users_rfc_unique':
            throw new Error('RFC already exists.');
        }
      }
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return row ? this.mapToDomain(row) : null;
  }

  async findByEmail(email: EmailAddress): Promise<User | null> {
    const row = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email.getValue().toLowerCase())
      .where('status', '=', 'active')
      .executeTakeFirst();

    return row ? this.mapToDomain(row) : null;
  }

  async findByPhoneNumber(phone: PhoneNumber): Promise<User | null> {
    const row = await this.db
      .selectFrom('users')
      .selectAll()
      .where('phone_number', '=', phone.getValue())
      .where('status', '=', 'active')
      .executeTakeFirst();

    return row ? this.mapToDomain(row) : null;
  }

  async findByRfc(rfc: RFC): Promise<User | null> {
    const row = await this.db
      .selectFrom('users')
      .selectAll()
      .where('rfc', '=', rfc.getValue().toUpperCase())
      .where('status', '=', 'active')
      .executeTakeFirst();

    return row ? this.mapToDomain(row) : null;
  }

  async delete(id: string): Promise<void> {
    await this.db
      .updateTable('users')
      .set({ deleted_at: new Date(), status: 'inactive' })
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async listUsers(options?: {
    status?: AccountStatus;
    role?: BusinessRole;
    isAdmin?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ users: User[]; totalCount: number; hasNextPage: boolean }> {
    let query = this.db.selectFrom('users').selectAll();

    if (options?.status) {
      query = query.where('status', '=', options.status);
    }
    if (options?.role) {
      query = query.where('roles', 'like', `%\"${options.role}\"%`);
    }
    if (options?.isAdmin !== undefined) {
      query = query.where('is_admin', '=', options.isAdmin);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const countRes = await this.db
      .selectFrom('users')
      .select(this.db.fn.count('id').as('count'))
      .executeTakeFirst();

    const totalCount = Number(countRes?.count || 0);
    const rows = await query.execute();
    const hasNext = (options?.offset ?? 0) + rows.length < totalCount;

    return {
      users: rows.map(this.mapToDomain),
      totalCount,
      hasNextPage: hasNext,
    };
  }

  private toPersistence(user: User): Database['users'] {
    return {
      id: user.id,
      email: user.email.getValue(),
      password_hash: user.passwordHash.getHashedValue(),
      is_admin: user.isAdmin,
      roles: JSON.stringify(user.roles),
      name: user.name,
      last_name: user.lastName,
      phone_number: user.phoneNumber?.getValue() ?? null,
      address: user.address ?? null,
      rfc: user.rfc?.getValue() ?? null,
      status: user.status,
      created_at: user.audit.createdAt,
      created_by: user.audit.createdBy?.id ?? null,
      updated_at: user.audit.updatedAt ?? null,
      updated_by: user.audit.updatedBy?.id ?? null,
      deleted_at: user.audit.deletedAt ?? null,
      deleted_by: user.audit.deletedBy?.id ?? null,
    };
  }

  private mapToDomain = (row: Database['users']): User => {
    const summary = (id?: string): UserSummary | null =>
      id ? new UserSummary({ id, name: '', lastName: '', email: '', status: row.status }) : null;

    return new User({
      id: row.id,
      email: EmailAddress.create(row.email),
      passwordHash: Password.fromHash(row.password_hash),
      isAdmin: row.is_admin,
      name: row.name,
      lastName: row.last_name,
      roles: JSON.parse(row.roles) as BusinessRole[],
      phoneNumber: row.phone_number ? new PhoneNumber(row.phone_number) : undefined,
      address: row.address ?? undefined,
      rfc: row.rfc ? new RFC(row.rfc) : undefined,
      status: row.status,
      audit: {
        createdAt: row.created_at,
        createdBy: summary(row.created_by),
        updatedAt: row.updated_at ?? null,
        updatedBy: summary(row.updated_by),
        deletedAt: row.deleted_at ?? null,
        deletedBy: summary(row.deleted_by),
      },
    });
  };
}


