import { Pool } from 'pg';

// Lee la URL de conexión a la base de datos desde las variables de entorno
// Esta URL se configura en el archivo .env y docker-compose.yaml
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not defined in environment variables.');
  // En un entorno de producción, deberías salir del proceso o manejar esto de forma más robusta
  process.exit(1);
}

// Crea un pool de conexiones a la base de datos
const pool = new Pool({
  connectionString: databaseUrl,
  // Puedes añadir otras opciones de configuración del pool aquí si es necesario
  // min: 4,
  // max: 20,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
});

// Maneja eventos de error en el pool de conexiones
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  // Aquí podrías implementar lógica de reconexión o manejo de errores más sofisticado
  process.exit(1);
});

console.log('PostgreSQL connection pool created.');

// Exporta la instancia del pool para ser utilizada por los repositorios
export { pool };

// Opcional: Función para probar la conexión al iniciar la aplicación
export async function connectDatabase() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database!');
    client.release(); // Libera el cliente de vuelta al pool
  } catch (err) {
    console.error('Failed to connect to PostgreSQL database:', err);
    // En un entorno de producción, deberías intentar reconectar o manejar esto de forma diferente
    process.exit(1);
  }
}