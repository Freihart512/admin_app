// src/infrastructure/services/bcrypt-hashing.service.ts
import * as bcrypt from 'bcrypt';
import { HashingService } from '@domain/@shared/ports';
import { InvalidFormatError, ServiceUnavailableError } from '@shared/errors';
import { Injectable } from '@nestjs/common';

type BcryptOptions = { saltRounds?: number; minAcceptedCost?: number };

@Injectable()
export class BcryptHashingService implements HashingService {
  private readonly saltRounds: number;
  private readonly minAcceptedCost: number;

  constructor(opts: BcryptOptions = {}) {
    this.saltRounds = opts.saltRounds ?? 12;
    this.minAcceptedCost = opts.minAcceptedCost ?? this.saltRounds;
  }

  async hash(value: string): Promise<string> {
    try {
      return await bcrypt.hash(value, this.saltRounds);
    } catch (e) {
      throw new ServiceUnavailableError('hash() failed');
    }
  }

  async compare(raw: string, hashed: string): Promise<boolean> {
    try {
      return await bcrypt.compare(raw, hashed);
    } catch {
      throw new ServiceUnavailableError('compare() failed');
    }
  }

  validateHash(hashed: string): boolean {
    // Forma bcrypt: $2a|$2b|$2y$CC$...
    const re = /^\$2[aby]\$(\d{2})\$[./A-Za-z0-9]{53}$/;
    const m = re.exec(hashed);
    if (!m) throw new InvalidFormatError('Invalid bcrypt hash format');

    const cost = Number.parseInt(m[1], 10);
    if (!Number.isFinite(cost) || cost < this.minAcceptedCost) {
      throw new InvalidFormatError('Bcrypt cost too low');
    }
    return true;
  }

  needsRehash(hashed: string): boolean {
    const m = /^\$2[aby]\$(\d{2})\$/.exec(hashed);
    if (!m) return true;
    const cost = Number.parseInt(m[1], 10);
    return !Number.isFinite(cost) || cost < this.saltRounds;
  }
}
