// test/unit/shared/ValueObject.spec.ts
import { describe, it, expect } from 'vitest';
import { ValueObject } from '../base.value-object';

// MOCK CLASS FOR TESTING
class TestVO extends ValueObject<string> {
  protected ensureIsValid(value: string): void {
    if (!value || value.length < 3) {
      throw new Error('Value must be at least 3 characters long');
    }
  }

  public static create(value: string): TestVO {
    return new TestVO(value);
  }
}

describe('ValueObject', () => {
  it('should create a value object with valid value', () => {
    const vo = TestVO.create('abc');
    expect(vo.getValue()).toBe('abc');
  });

  it('should throw when ensureIsValid fails', () => {
    expect(() => TestVO.create('')).toThrow();
  });

  it('should return the value on toJSON()', () => {
    const vo = TestVO.create('hello');
    expect(vo.toJSON()).toBe('hello');
  });

  it('should return the value as string on toString()', () => {
    const vo = TestVO.create('hello');
    expect(vo.toString()).toBe('hello');
  });

  it('should return true for equal value objects of same type and value', () => {
    const a = TestVO.create('equal');
    const b = TestVO.create('equal');
    expect(a.equals(b)).toBe(true);
  });

  it('should return false for value objects of different values', () => {
    const a = TestVO.create('one');
    const b = TestVO.create('two');
    expect(a.equals(b)).toBe(false);
  });

  it('should return false for value objects of different classes', () => {
    class AnotherVO extends ValueObject<string> {
      protected ensureIsValid(): void {}

      public static create(value: string): AnotherVO {
        return new AnotherVO(value);
      }
    }

    const a = TestVO.create('same');
    const b = AnotherVO.create('same');
    expect(a.equals(b)).toBe(false);
  });

  it('should return false when comparing with non-ValueObject', () => {
    const vo = TestVO.create('abc');
    expect(vo.equals({ getValue: () => 'abc' })).toBe(false);
  });
});
