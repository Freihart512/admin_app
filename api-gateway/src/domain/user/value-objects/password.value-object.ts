// src/domain/user/value-objects/password.value-object.ts
import { ValueObject } from '@domain/@shared/value-objects/index.js';
import { HashingService } from '@domain/@shared/ports';
import {
  PasswordHasherNotRegisteredError,
  InvalidPasswordHashError,
  InvalidPasswordFormatError,
  InvalidPasswordFormatReasons,
} from '@domain/user/errors';
import { InvalidPasswordFormatReasonsType } from '../user.types';
import { InvalidFormatError, ServiceUnavailableError } from '@shared/errors';

export class Password extends ValueObject<string> {
  private static readonly MIN_LENGTH = 8;
  private static hasher?: HashingService;

  private constructor(hash: string) { super(hash); }

  static registerHasher(hasher: HashingService): void { Password.hasher = hasher; }
  static resetForTests(): void { Password.hasher = undefined; }

  static async create(raw: string): Promise<Password> {
    if (!Password.hasher) throw new PasswordHasherNotRegisteredError();
    Password.ensurePolicy(raw);
    const hashed = await Password.hasher.hash(raw);
    return new Password(hashed);
  }

  static fromHash(hash: string): Password {
    if (!hash || typeof hash !== 'string') throw new InvalidPasswordHashError();
    if (!Password.hasher) throw new PasswordHasherNotRegisteredError();
    try {
      Password.hasher.validateHash?.(hash);
    } catch (e) {
      if (e instanceof InvalidFormatError) throw new InvalidPasswordHashError();
      if (e instanceof ServiceUnavailableError) throw e; 
      throw new ServiceUnavailableError('hashing service validate failed');
    }
    return new Password(hash);
  }

  async compare(raw: string): Promise<boolean> {
    if (!Password.hasher) throw new PasswordHasherNotRegisteredError();
    return Password.hasher.compare(raw, this.getValue());
  }

  getHashedValue(): string { return this.getValue(); }

  protected ensureIsValid(hash: string): void {
    if (!hash || typeof hash !== 'string') throw new InvalidPasswordHashError();
  }

  private static assertRule(
    condition: boolean,
    raw: string,
    reason: InvalidPasswordFormatReasonsType,
  ): void {
    if (!condition) throw new InvalidPasswordFormatError(raw, reason);
  }

  private static ensurePolicy(raw: string): void {
    const hasMinimumLength = !!raw && raw.length >= Password.MIN_LENGTH;
    this.assertRule(hasMinimumLength, raw, InvalidPasswordFormatReasons.TooShort);
    const hasNumber = /[0-9]/.test(raw);
    const hasLetter = /[a-zA-Z]/.test(raw);
    const hasSpecial = /[^A-Za-z0-9]/.test(raw);
    this.assertRule(hasNumber, raw, InvalidPasswordFormatReasons.NotNumber);
    this.assertRule(hasLetter, raw, InvalidPasswordFormatReasons.NotLetter);
    this.assertRule(hasSpecial, raw, InvalidPasswordFormatReasons.NotSpecial);
  }

  public toJSON(): string { return '[REDACTED_PASSWORD_HASH]'; }
}
