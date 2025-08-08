// infrastructure/services/BcryptHashingService.ts
import * as bcrypt from 'bcrypt';
import { HashingService } from '../../domain/@shared/ports/hashing.service.port';

export class BcryptHashingService implements HashingService {
  private readonly saltRounds = 10;

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  async compare(raw: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(raw, hashed);
  }
}
