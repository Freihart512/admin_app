import { describe, it, expect, vi, afterEach } from 'vitest';
import { UUID } from '../uuid.value-object';
import { InvalidUUIDError } from '../../errors/invalid-uuid.error';
import type { UuidValidatorPort } from '../../ports/uuid.validator.port';

const validUUID = '123e4567-e89b-12d3-a456-426614174000';
const invalidUUID = 'not-a-uuid';

// Utilidad para mockear el validador
function mockValidator(valid: boolean): UuidValidatorPort {
  return {
    validate: vi.fn().mockReturnValue(valid),
  };
}

describe('UUID Value Object', () => {
  it('should create UUID successfully with a valid UUID', () => {
    const validator = mockValidator(true);
    UUID.registerValidator(validator);
    const uuid = UUID.create(validUUID.toUpperCase());

    expect(uuid).toBeInstanceOf(UUID);
    expect(uuid.getValue()).toBe(validUUID.toLowerCase());
    expect(uuid.toJSON()).toBe(validUUID.toLowerCase());
  });

  it('should throw InvalidUUIDError if the UUID is invalid', () => {
    const validator = mockValidator(false);
    UUID.registerValidator(validator);

    expect(() => {
      UUID.create(invalidUUID);
    }).toThrowError(new InvalidUUIDError(invalidUUID));
  });

  it('should consider two UUIDs with the same value as equal', () => {
    const validator = mockValidator(true);
    UUID.registerValidator(validator);
    const uuid1 = UUID.create(validUUID);
    const uuid2 = UUID.create(validUUID.toUpperCase());

    expect(uuid1.equals(uuid2)).toBe(true);
  });

  it('should consider two different UUIDs as not equal', () => {
    const validator = mockValidator(true);
    UUID.registerValidator(validator);
    const uuid1 = UUID.create(validUUID);
    const uuid2 = UUID.create('123e4567-e89b-12d3-a456-426614174999');

    expect(uuid1.equals(uuid2)).toBe(false);
  });
});