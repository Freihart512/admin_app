// test/unit/domain/value-objects/UserSummary.spec.ts
import { describe, it, expect } from 'vitest';
import { UserSummary } from '../user-summary.value-object';
import { UUID } from '../../../@shared/value-objects/uuid.value-object';
import { EmailAddress } from '../email-address.value-object';
import { InvalidUserSummaryError } from '../../errors/invalid-user-summary.error';
import { AccountStatus } from '../../../../@shared/core/types';

describe('UserSummary', () => {
  const validUUID = UUID.create('40d54afe-a9eb-4295-97be-df1ebacd94fd');
  const validEmail = EmailAddress.create('user883@test.org');
  const status: AccountStatus = AccountStatus.ACTIVE;

  it('should create a valid UserSummary', () => {
    const summary = UserSummary.create({
      id: validUUID,
      name: 'Alice',
      lastName: 'Doe',
      email: validEmail,
      status,
    });

    expect(summary.getId().equals(validUUID)).toBe(true);
    expect(summary.getEmail().equals(validEmail)).toBe(true);
    expect(summary.getName()).toBe('Alice');
    expect(summary.getLastName()).toBe('Doe');
    expect(summary.getStatus()).toBe(status);
  });

  it('should serialize to primitives correctly', () => {
    const summary = UserSummary.create({
      id: validUUID,
      name: 'Alice',
      lastName: 'Doe',
      email: validEmail,
      status,
    });

    expect(summary.toPrimitives()).toEqual({
      id: validUUID.getValue(),
      name: 'Alice',
      lastName: 'Doe',
      email: validEmail.getValue(),
      status,
    });
  });

  it('should throw if name is missing', () => {
    expect(() =>
      UserSummary.create({
        id: validUUID,
        name: '',
        lastName: 'Doe',
        email: validEmail,
        status,
      })
    ).toThrowError(InvalidUserSummaryError);
  });

  it('should throw if lastName is missing', () => {
    expect(() =>
      UserSummary.create({
        id: validUUID,
        name: 'Alice',
        lastName: '',
        email: validEmail,
        status,
      })
    ).toThrowError(InvalidUserSummaryError);
  });
});
