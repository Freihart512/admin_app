import { describe, it, expect } from 'vitest';
import { UserSummary } from '../user-summary.value-object';
import type { UserSummaryProps } from '../user-summary.value-object';
import { FieldRequiredForUserSummaryError } from '../../errors/field-required-for-user-summary.error';
import { UserSummaryRequiredError } from '../../errors/user-summary-required.error';

function makeFakeUUID(id: string) {
  return {
    _val: id,
    equals(other: unknown) {
      return typeof (other as any)?._val !== 'undefined'
        ? (other as any)._val === this._val
        : String(other) === this._val;
    },
    toString() {
      return this._val;
    },
  } as unknown as import('@domain/@shared/value-objects/uuid.value-object').UUID;
}

function makeFakeEmail(value: string) {
  return {
    _val: value,
    equals(other: unknown) {
      return typeof (other as any)?._val !== 'undefined'
        ? (other as any)._val === this._val
        : String(other) === this._val;
    },
    toString() {
      return this._val;
    },
  } as unknown as import('../email-address.value-object').EmailAddress;
}

function makeProps(
  overrides: Partial<UserSummaryProps> = {},
): UserSummaryProps {
  return {
    id: makeFakeUUID('uuid-1'),
    name: 'Alice',
    lastName: 'Doe',
    email: makeFakeEmail('alice@example.com'),
    status: 1 as any,
    ...overrides,
  };
}

describe('UserSummary.ensureIsValid', () => {
  it('throw UserSummaryRequiredError if props is undefined/null', () => {
    expect(() => (UserSummary as any).create(undefined)).toThrow(
      UserSummaryRequiredError,
    );

    expect(() => (UserSummary as any).create(null)).toThrow(
      UserSummaryRequiredError,
    );
  });

  it('throw FieldRequiredForUserSummaryError("name") if name is empty or blank spaces', () => {
    expect(() => UserSummary.create(makeProps({ name: '' }))).toThrow(
      FieldRequiredForUserSummaryError,
    );
    expect(() => UserSummary.create(makeProps({ name: '   ' }))).toThrow(
      FieldRequiredForUserSummaryError,
    );
  });

  it('throw FieldRequiredForUserSummaryError("lastName") if lastName is empty or blank spaces', () => {
    expect(() => UserSummary.create(makeProps({ lastName: '' }))).toThrow(
      FieldRequiredForUserSummaryError,
    );
    expect(() => UserSummary.create(makeProps({ lastName: '   ' }))).toThrow(
      FieldRequiredForUserSummaryError,
    );
  });

  it('create correctly when name and lastName have content', () => {
    const props = makeProps({ name: ' Alice ', lastName: ' Doe ' });
    const us = UserSummary.create(props);
    expect(us).toBeInstanceOf(UserSummary);
    // Los getters leen del value congelado
    expect(us.name).toBe(' Alice ');
    expect(us.lastName).toBe(' Doe ');
    expect(us.email.toString()).toBe('alice@example.com');
    expect(us.id.toString()).toBe('uuid-1');
  });
});

describe('UserSummary.equals', () => {
  it('return true if all attributes (including VOs) are equivalent', () => {
    const a = UserSummary.create(
      makeProps({
        id: makeFakeUUID('uuid-1'),
        email: makeFakeEmail('alice@example.com'),
      }),
    );
    const b = UserSummary.create(
      makeProps({
        id: makeFakeUUID('uuid-1'),
        email: makeFakeEmail('alice@example.com'),
      }),
    );
    expect(a.equals(b)).toBe(true);
    expect(b.equals(a)).toBe(true);
  });

  it('return false if id is different ', () => {
    const a = UserSummary.create(makeProps({ id: makeFakeUUID('uuid-1') }));
    const b = UserSummary.create(makeProps({ id: makeFakeUUID('uuid-2') }));
    expect(a.equals(b)).toBe(false);
  });

  it('return false if email is different', () => {
    const a = UserSummary.create(
      makeProps({ email: makeFakeEmail('alice@example.com') }),
    );
    const b = UserSummary.create(
      makeProps({ email: makeFakeEmail('other@example.com') }),
    );
    expect(a.equals(b)).toBe(false);
  });

  it('return false if  name/lastName/status change', () => {
    const base = makeProps();
    expect(
      UserSummary.create(base).equals(
        UserSummary.create({ ...base, name: 'Alicia' }),
      ),
    ).toBe(false);
    expect(
      UserSummary.create(base).equals(
        UserSummary.create({ ...base, lastName: 'D.' }),
      ),
    ).toBe(false);
    expect(
      UserSummary.create(base).equals(
        UserSummary.create({ ...base, status: 2 as any }),
      ),
    ).toBe(false);
  });
});

describe('UserSummary.toJSON', () => {
  it('return exact object with same values as getValue()', () => {
    const props = makeProps();
    const us = UserSummary.create(props);
    const json = us.toJSON();

    expect(json).toBe(us.getValue());
    expect(json.id.toString()).toBe('uuid-1');
    expect(json.email.toString()).toBe('alice@example.com');
  });
});
