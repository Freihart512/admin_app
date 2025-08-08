// domain/value-objects/Password.ts
import { HashingService } from '../../@shared/ports/hashing.service.port';

export class Password {
  private constructor(private readonly hashedValue: string) {}

  public static async create(
    raw: string,
    hasher: HashingService
  ): Promise<Password> {
    if (!raw || raw.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const hasNumber = /[0-9]/.test(raw);
    const hasLetter = /[a-zA-Z]/.test(raw);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(raw);

    if (!(hasNumber && hasLetter && hasSpecial)) {
      throw new Error('Password must contain a number, letter, and special character.');
    }

    const hashed = await hasher.hash(raw);
    return new Password(hashed);
  }

  public static fromHash(hash: string): Password {
    if (!hash) throw new Error('Cannot create Password from empty hash');
    return new Password(hash);
  }

  public async compare(
    raw: string,
    hasher: HashingService
  ): Promise<boolean> {
    return hasher.compare(raw, this.hashedValue);
  }

  public getHashedValue(): string {
    return this.hashedValue;
  }

  public equals(other: Password): boolean {
    return this.hashedValue === other.hashedValue;
  }
}
