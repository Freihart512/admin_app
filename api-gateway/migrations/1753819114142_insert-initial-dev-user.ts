import { MigrationBuilder } from 'node-pg-migrate';

const DEV_USER_ID = '8c7e92ee-1124-48c6-bd46-8388e8aab6b1'; // Usar un UUID fijo conocido
const DEV_USER_EMAIL = 'dev.admin@example.com';
const DEV_USER_PASSWORD_HASH = '$2b$10$GTKYZrZ.ueVZYpeuaSQ7weulRdtGyqCiqUwEvCT4Z0Ujh2g6OfBzK'; // admintaco

export async function up(pgm: MigrationBuilder): Promise<void> {
  const existingUser = await pgm.db.query('SELECT id FROM users WHERE email = $1', [
    DEV_USER_EMAIL,
  ]);

  if (existingUser.rowCount === 0) {
    const query = `
      INSERT INTO users (id, email, name, last_name, phone_number, address, rfc, roles, password_hash, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    const values = [
      DEV_USER_ID,
      DEV_USER_EMAIL,
      'Development',
      'Admin',
      null,
      null,
      null,
      ['Administrador'],
      DEV_USER_PASSWORD_HASH,
      true,
    ];
    await pgm.db.query(query, values);
  } else {
    console.error(`Development user ${DEV_USER_EMAIL} already exists.`);
  }
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  await pgm.db.query('DELETE FROM users WHERE id = $1', [DEV_USER_ID]);
}
