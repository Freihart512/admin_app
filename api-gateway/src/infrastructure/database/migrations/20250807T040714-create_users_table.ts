import { Kysely, sql, type SqlBool } from 'kysely';
import type { Database } from 'src/infrastructure/database/kysely.db'; // ajusta si tu ruta difiere

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('password_hash', 'text', (col) => col.notNull())
    .addColumn('is_admin', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('roles', 'jsonb', (col) =>
      col.notNull().defaultTo(sql`'[]'::jsonb`),
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('last_name', 'text', (col) => col.notNull())
    .addColumn('phone_number', 'text')
    .addColumn('address', 'text')
    .addColumn('rfc', 'text')
    .addColumn('status', 'text', (col) => col.notNull().defaultTo('active'))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('created_by', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('updated_at', 'timestamptz')
    .addColumn('updated_by', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('deleted_at', 'timestamptz')
    .addColumn('deleted_by', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .execute();

  await db.schema
    .alterTable('users')
    .addUniqueConstraint('users_email_unique', ['email'])
    .execute();

  await db.schema
    .createIndex('users_phone_number_unique_partial')
    .on('users')
    .column('phone_number')
    .unique()
    .where(sql<SqlBool>`phone_number IS NOT NULL`)
    .execute();

  await db.schema
    .createIndex('users_rfc_unique_partial')
    .on('users')
    .column('rfc')
    .unique()
    .where(sql<SqlBool>`rfc IS NOT NULL`)
    .execute();

  const adminId = 'b6e49855-9863-4d94-b48b-47a3e407bf6f';

  await db
    .insertInto('users')
    .values({
      id: adminId,
      email: 'admin@example.com',
      password_hash:
        '$2b$10$jp/rC6D5QUQCGLf6oNnjbedLZssIZz7hBk47S./n/x1BSbb.w9k1q', // hash de 'taco1234'
      is_admin: true,
      roles: sql`'[]'::jsonb`,
      name: 'Admin',
      last_name: 'User',
      status: 'active',
      created_at: sql`now()`,
    })
    .execute();

  // Seteamos created_by = id (ahora sí existe la fila)
  await db
    .updateTable('users')
    .set({ created_by: adminId })
    .where('id', '=', adminId)
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropIndex('users_rfc_unique_partial').execute();
  await db.schema.dropIndex('users_phone_number_unique_partial').execute();

  await db.schema
    .alterTable('users')
    .dropConstraint('users_email_unique')
    .execute();

  await db.schema.dropTable('users').execute();
}
