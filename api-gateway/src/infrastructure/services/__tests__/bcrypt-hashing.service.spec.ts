import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import * as bcrypt from 'bcrypt';
import { BcryptHashingService } from '../bcrypt-hashing.service';

// Mock explícito
vi.mock('bcrypt', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe('BcryptHashingService', () => {
  const service = new BcryptHashingService();

  const plain: string = 'My$ecureP@ssw0rd';
  const hashed: string = '$2b$10$abcdefg1234567890fakeHashValue';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should hash the value using bcrypt', async () => {
    (bcrypt.hash as Mock).mockResolvedValue(hashed);

    const result = await service.hash(plain);

    expect(bcrypt.hash).toHaveBeenCalledWith(plain, 10);
    expect(result).toBe(hashed);
  });

  it('should compare a raw value with a hash using bcrypt', async () => {
    (bcrypt.compare as Mock).mockResolvedValue(true);

    const result = await service.compare(plain, hashed);

    expect(bcrypt.compare).toHaveBeenCalledWith(plain, hashed);
    expect(result).toBe(true);
  });

  it('should return false if the password does not match', async () => {
    (bcrypt.compare as Mock).mockResolvedValue(false);

    const result = await service.compare('wrongPassword', hashed);

    expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', hashed);
    expect(result).toBe(false);
  });
});
