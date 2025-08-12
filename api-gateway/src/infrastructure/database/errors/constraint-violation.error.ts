export class ConstraintViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConstraintViolationError"; // Ejemplo: Violación de restricciones como NOT NULL o claves únicas
  }
}
