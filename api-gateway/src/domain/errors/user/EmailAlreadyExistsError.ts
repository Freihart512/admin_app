// Error de dominio cuando un email ya existe (violación de unicidad)
export class EmailAlreadyExistsError extends Error {
  constructor(email: string, message?: string) {
    super(message || `Email "${email}" already exists.`);
    this.name = 'EmailAlreadyExistsError';
    // Podrías añadir propiedades adicionales si son útiles
    // this.email = email;
  }
}
