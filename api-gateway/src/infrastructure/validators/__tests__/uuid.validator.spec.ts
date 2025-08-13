import { describe, it, expect, vi } from 'vitest';
import { UuidValidator } from '../uuid.validator';
import * as uuidLib from 'uuid';

vi.mock('uuid');

describe('UuidValidator', () => {
  const validator = new UuidValidator();

  it('should return true for a valid UUID', () => {
    vi.spyOn(uuidLib, 'validate').mockReturnValue(true);
    const result = validator.validate('a-valid-uuid');
    expect(result).toBe(true);
  });

  it('should return false for an invalid UUID', () => {
    vi.spyOn(uuidLib, 'validate').mockReturnValue(false);
    const result = validator.validate('not-a-uuid');
    expect(result).toBe(false);
  });

  it('should call the uuid.validate function with correct argument', () => {
    const spy = vi.spyOn(uuidLib, 'validate').mockReturnValue(true);
    const input = 'test-uuid';
    validator.validate(input);
    expect(spy).toHaveBeenCalledWith(input);
  });
});