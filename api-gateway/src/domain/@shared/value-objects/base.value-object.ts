// domain/shared/ValueObject.ts
export abstract class ValueObject<T> {
  protected constructor(protected readonly value: T) {
    this.ensureIsValid(value);
  }

  protected abstract ensureIsValid(value: T): void;

  public getValue(): T {
    return this.value;
  }

  public toString(): string {
    return String(this.value);
  }

  public toJSON(): T {
    return this.value;
  }

  public equals(other: unknown): boolean {
    return (
      other instanceof ValueObject &&
      other.constructor === this.constructor &&
      other.getValue() === this.value
    );
  }
}
