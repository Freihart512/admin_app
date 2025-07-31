// Error de dominio cuando un RFC ya existe (violación de unicidad)
export class RfcAlreadyExistsError extends Error {
  constructor(rfc: string, message?: string) {
    super(message || `RFC "${rfc}" already exists.`);
    this.name = 'RfcAlreadyExistsError';
    // Podrías añadir propiedades adicionales si son útiles
    // this.rfc = rfc;
  }
}
