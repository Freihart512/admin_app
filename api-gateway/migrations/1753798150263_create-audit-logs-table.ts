import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

// Define las definiciones de las columnas para la tabla audit_logs
const columnDefinitions: ColumnDefinitions = {
  id: {
    type: 'uuid', // Usamos UUIDs para identificar cada entrada de log
    primaryKey: true,
    notNull: true,
    default: 'gen_random_uuid()', // Función para generar UUIDs (asegúrate de tener pgcrypto extensión)
  },
  timestamp: {
    type: 'timestamptz', // Marca de tiempo con zona horaria
    notNull: true,
    default: 'now()', // Usar la hora actual por defecto
  },
  event_type: {
    // El tipo de evento (ej. 'UserLoggedInEvent')
    type: 'varchar(255)', // O un tipo ENUM si tienes un conjunto fijo de tipos de eventos
    notNull: true,
  },
  user_id: {
    // Campo explícito para el ID del usuario asociado al evento (puede ser NULL)
    type: 'uuid',
    // references: 'users', // Opcional: Clave foránea a la tabla users
    // onDelete: 'SET NULL' // Opcional: Qué hacer si el usuario referenciado es eliminado
    // notNull: false // Por defecto un campo es NULLABLE si no se especifica notNull
  },
  payload: {
    // Los datos del evento en formato JSON
    type: 'jsonb', // Usamos JSONB para almacenar el payload del evento
    notNull: true, // El payload siempre debe existir, aunque esté vacío si no hay datos específicos
  },
  // Puedes añadir otros campos de contexto si son relevantes para todos los logs
  // ip_address: { type: 'inet' }, // Tipo de red para direcciones IP
  // user_agent: { type: 'text' }, // Información del agente de usuario
};

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Opcional: Crea la extensión para generar UUIDs si no existe (si no la creaste en la migración de users)
  // pgm.createExtension('pgcrypto', { ifNotExists: true });

  // Crea la tabla audit_logs con las definiciones de columnas
  pgm.createTable('audit_logs', columnDefinitions);

  // Opcional: Crear índices para mejorar el rendimiento de las consultas comunes
  pgm.createIndex('audit_logs', 'timestamp'); // Índice por marca de tiempo
  pgm.createIndex('audit_logs', 'event_type'); // Índice por tipo de evento
  pgm.createIndex('audit_logs', 'user_id', { where: 'user_id IS NOT NULL' }); // Índice parcial por user_id si es opcional
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Elimina la tabla audit_logs
  pgm.dropTable('audit_logs');
}
