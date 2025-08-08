// domain/shared/ValueObject.ts
export abstract class ValueObject<T> {
    protected constructor(protected readonly value: T) {
      this.ensureIsValid(value);
    }
  
    // Subclases deben implementar su propia validación
    protected abstract ensureIsValid(value: T): void;
  
    // Devuelve el valor primitivo
    public getValue(): T {
      return this.value;
    }
  
    // Para logs, UI, o integración
    public toString(): string {
      return String(this.value);
    }
  
    // Para serialización automática (ej. JSON.stringify)
    public toJSON(): T {
      return this.value;
    }
  
    // Comparación por valor
    public equals(other: unknown): boolean {
      return (
        other instanceof ValueObject &&
        other.constructor === this.constructor &&
        other.getValue() === this.value
      );
    }
  }
  