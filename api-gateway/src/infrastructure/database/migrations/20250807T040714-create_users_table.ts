import { Kysely, sql, type SqlBool } from 'kysely';
import { Database } from 'src/infrastructure/database/kysely.db'; // Adjust the path if necessary

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.unique().notNull())
    .addColumn('password_hash', 'text', (col) => col.notNull())
    .addColumn('is_admin', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('roles', 'jsonb', (col) => col.notNull().defaultTo('[]')) // Use jsonb if supported and preferred
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('last_name', 'text', (col) => col.notNull())
    .addColumn('phone_number', 'text') // Nullable by default
    .addColumn('address', 'text') // Nullable by default
    .addColumn('rfc', 'text') // Nullable by default
    .addColumn('status', 'text', (col) => col.notNull().defaultTo('active'))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn('created_by', 'uuid', col => col.references('users.id').onDelete('set null').notNull()) // created_by no debería ser nulo si siempre hay un creador
    .addColumn('updated_at', 'timestamptz')
    .addColumn('updated_by', 'uuid', col => col.references('users.id').onDelete('set null')) // updated_by puede ser nulo
    .addColumn('deleted_at', 'timestamptz')
    .addColumn('deleted_by', 'uuid', col => col.references('users.id').onDelete('set null')) // deleted_by puede ser nulo
    .execute();

  // Optional: Create indices for improved performance
  await db.schema
    .createIndex('users_email_index')
    .on('users')
    .column('email')
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

  await db.insertInto('users').values({
    id: 'b6e49855-9863-4d94-b48b-47a3e407bf6f',
    email: 'admin@example.com',
    password_hash: 'hashed_initial_password',
    is_admin: true,
    roles: '[]',
    name: 'Admin',
    last_name: 'User',
    status: 'active',
    created_by: sql`'b6e49855-9863-4d94-b48b-47a3e407bf6f'`, // Usar un ID de sistema o el mismo ID del usuario admin si es autocreado
    created_at: sql`now()`
  }).execute();

}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('users').execute();
}