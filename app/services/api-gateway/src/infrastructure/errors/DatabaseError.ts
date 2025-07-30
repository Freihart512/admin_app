// Error genérico para problemas relacionados con la base de datos en la capa de infraestructura
export class DatabaseError extends Error {
  // Tipo de error de base de datos (opcional, si quieres categorizar)
  public type?: string;

  // Código de error específico de la base de datos (para depuración interna)
  public dbErrorCode?: string;

  // Información adicional sobre la operación de base de datos que falló
  public details?: {
      table?: string;
      operation?: string; // Ej: 'INSERT', 'UPDATE', 'SELECT', 'DELETE'
      query?: string; // La consulta SQL (¡ten cuidado con datos sensibles!)
      field?: string; // <-- Añadimos la propiedad 'field' aquí (opcional)
  };

  // El error original de la base de datos (para depuración interna)
  public originalError?: any;


  constructor(
    message?: string,
    options?: {
      type?: string;
      dbErrorCode?: string;
      details?: { table?: string; operation?: string; query?: string; field?: string }; // <-- Añadimos 'field' aquí
      originalError?: any;
    }
  ) {
    super(message || 'A database error occurred.');
    this.name = 'DatabaseError';

    if (options) {
      this.type = options.type;
      this.dbErrorCode = options.dbErrorCode;
      this.details = options.details;
      this.originalError = options.originalError;
    }

    // Error.captureStackTrace(this, DatabaseError); // Opcional
  }

  public getCleanMessage(): string {
      return 'A database error occurred.';
  }
}
