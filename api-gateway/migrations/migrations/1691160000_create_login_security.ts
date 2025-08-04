import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions = {
  id: {
    type: 'uuid',
    notNull: true,
    primaryKey: true,
    default: 'gen_random_uuid()',
  },
};

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Ajusta el nombre de la tabla de usuarios si NO es "users"
  pgm.createTable('login_security', {
    user_id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    failed_attempts: { type: 'integer', notNull: true, default: 0 },
    locked_until: { type: 'timestamptz', notNull: false },
    last_failed_at: { type: 'timestamptz', notNull: false },
    last_success_at: { type: 'timestamptz', notNull: false },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('NOW()') },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('NOW()') },
  });

  pgm.createIndex('login_security', 'locked_until', { name: 'idx_login_security_locked_until' });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('login_security', 'locked_until', { ifExists: true, name: 'idx_login_security_locked_until' });
  pgm.dropTable('login_security', { ifExists: true });
}
