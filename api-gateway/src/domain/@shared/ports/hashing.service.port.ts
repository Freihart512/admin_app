// domain/ports/HashingService.ts
export interface HashingService {
    hash(value: string): Promise<string>;
    compare(raw: string, hashed: string): Promise<boolean>;
  }
  