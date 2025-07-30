import * as path from 'path';

module.exports = {
  // La URL de conexión a la base de datos se toma de las variables de entorno.
  // Docker Compose la inyectará en el contenedor.
  databaseUrl: process.env.DATABASE_URL,

  // Directorio donde se guardarán los archivos de migración.
  // Relativo a la ubicación de este archivo de configuración.
  migrationsFolder: path.join(__dirname, 'src', 'infrastructure', 'database', 'migrations'),

  // Opciones adicionales para la conexión si es necesario
  // ssl: true,

  // Opciones para el archivo de historial de migraciones en la base de datos
  // schema: 'public',
  // migrationsTable: 'pgmigrations',

  // Permite usar archivos TypeScript para las migraciones
  typescript: true,
};
import * as path from 'path';

module.exports = {
  // La URL de conexión a la base de datos se toma de las variables de entorno.
  // Docker Compose la inyectará en el contenedor.
  databaseUrl: process.env.DATABASE_URL,

  // Directorio donde se guardarán los archivos de migración.
  // Relativo a la ubicación de este archivo de configuración.
  migrationsFolder: path.join(__dirname, 'src', 'infrastructure', 'database', 'migrations'),

  // Opciones adicionales para la conexión si es necesario
  // ssl: true,

  // Opciones para el archivo de historial de migraciones en la base de datos
  // schema: 'public',
  // migrationsTable: 'pgmigrations',

  // Permite usar archivos TypeScript para las migraciones
  typescript: true,

  // Opciones para transpilar TypeScript si no usas ts-node directamente
  // file: 'ts-node/register'
};