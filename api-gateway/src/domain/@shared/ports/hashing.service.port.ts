export interface HashingService {
  hash(value: string): Promise<string>;
  compare(raw: string, hashed: string): Promise<boolean>;
  validateHash?(hashed: string): boolean;
  needsRehash?(hashed: string): boolean;
}