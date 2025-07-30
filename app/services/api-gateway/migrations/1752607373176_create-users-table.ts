import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

const columnDefinitions: ColumnDefinitions = {
  id: {
    type: 'uuid',
    primaryKey: true,
    notNull: true,
    default: 'gen_random_uuid()',
  },
  email: {
    type: 'varchar(255)',
    notNull: true,
    unique: true,
  },
  name: {
    type: 'varchar(255)',
    notNull: true,
  },
  last_name: {
    type: 'varchar(255)',
    notNull: true,
  },
  phone_number: {
    type: 'varchar(50)',
  },
  address: {
    type: 'text',
  },
  rfc: {
    type: 'varchar(20)',
  },
  roles: {
    type: 'text[]',
    notNull: true,
    default: '{}',
  },
  password_hash: {
    type: 'text',
    notNull: true,
  },
  is_active: {
    type: 'boolean',
    notNull: true,
    default: true,
  },
  created_at: {
    type: 'timestamptz',
    notNull: true,
    default: 'now()',
  },
  created_by: {
    type: 'uuid',
    references: 'users',
    onDelete: 'SET NULL',
  },
  updated_at: {
    type: 'timestamptz',
  },
  updated_by: {
    type: 'uuid',
    references: 'users',
    onDelete: 'SET NULL',
  },
  deleted_at: {
    type: 'timestamptz',
  },
};

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createExtension('pgcrypto', { ifNotExists: true });

  pgm.createTable('users', columnDefinitions);

  pgm.createIndex('users', 'rfc', {
    unique: true,
    where: 'rfc IS NOT NULL',
  });

  pgm.createIndex('users', 'phone_number', {
    unique: true,
    where: 'phone_number IS NOT NULL',
  });

  pgm.createIndex('users', 'created_by');
  pgm.createIndex('users', 'updated_by');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users');
}
