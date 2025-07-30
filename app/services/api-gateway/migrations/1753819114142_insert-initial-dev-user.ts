import { MigrationBuilder } from 'node-pg-migrate';
// Importamos bcrypt para hashear la contraseña si queremos generarla en la migración (más complejo)
// import * as bcrypt from 'bcrypt';


// Define un ID fijo para el usuario de desarrollo inicial
const DEV_USER_ID = '8c7e92ee-1124-48c6-bd46-8388e8aab6b1'; // Usar un UUID fijo conocido
const DEV_USER_EMAIL = 'dev.admin@example.com';
const DEV_USER_PASSWORD_HASH = '$2b$10$GTKYZrZ.ueVZYpeuaSQ7weulRdtGyqCiqUwEvCT4Z0Ujh2g6OfBzK'; // admintaco


export async function up(pgm: MigrationBuilder): Promise<void> {
  // Verificar si el usuario ya existe para evitar errores si la migración se aplica varias veces sin revertir
  const existingUser = await pgm.db.query('SELECT id FROM users WHERE email = $1', [DEV_USER_EMAIL]);

  if (existingUser.rowCount === 0) {
    console.log(`Inserting initial development user: ${DEV_USER_EMAIL}`);

     // Si quisieras generar el hash en la migración (requiere async/await y bcrypt en la migración)
     // const hashedPassword = await bcrypt.hash('password123', 10); // Usar una contraseña de prueba

    const query = `
      INSERT INTO users (id, email, name, last_name, phone_number, address, rfc, roles, password_hash, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    const values = [
      DEV_USER_ID,
      DEV_USER_EMAIL,
      'Development',
      'Admin',
      null, // Opcional para Admin
      null, // Opcional para Admin
      null, // Opcional para Admin
      ['Administrador'], // Asignar el rol Administrador
      DEV_USER_PASSWORD_HASH, // Usar el hash pre-generado
      true // Activo por defecto
    ];
    await pgm.db.query(query, values);
  } else {
     console.log(`Development user ${DEV_USER_EMAIL} already exists.`);
  }
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  console.log(`Deleting initial development user: ${DEV_USER_EMAIL}`);
  // Eliminar el usuario por su ID fijo
  await pgm.db.query('DELETE FROM users WHERE id = $1', [DEV_USER_ID]);
   // Nota: Eliminar un usuario puede tener efectos en cascada si hay claves foráneas configuradas con ON DELETE CASCADE.
   // Asegúrate de que la lógica de eliminación de usuario (física o lógica) se alinee con tus requisitos.
}
