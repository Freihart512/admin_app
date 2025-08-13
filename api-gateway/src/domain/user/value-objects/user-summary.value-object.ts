import { ValueObject } from '@domain/@shared/value-objects/base.value-object';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { EmailAddress } from './email-address.value-object';
import { AccountStatus } from '../user.types';
import { FieldRequiredForUserSummaryError } from '../errors/field-required-for-user-summary.error';
import { UserSummaryRequiredError } from '../errors/user-summary-required.error';

export interface UserSummaryProps {
  id: UUID;
  name: string;
  lastName: string;
  email: EmailAddress;
  status: AccountStatus;
}

export class UserSummary extends ValueObject<UserSummaryProps> {
  private constructor(props: UserSummaryProps) {
    // congela para evitar mutaciones externas (shallow es suficiente aquí)
    super(Object.freeze({ ...props }));
  }

  static create(raw: UserSummaryProps): UserSummary {
    return new UserSummary(raw);
  }

  get id(): UUID { return this.getValue().id; }
  get name(): string { return this.getValue().name; }
  get lastName(): string { return this.getValue().lastName; }
  get email(): EmailAddress { return this.getValue().email; }
  get status(): AccountStatus { return this.getValue().status; }

  protected ensureIsValid(v: UserSummaryProps): void {
  if (!v) throw new UserSummaryRequiredError();

  if (!v.name?.trim()) throw new FieldRequiredForUserSummaryError('name');
  if (!v.lastName?.trim()) throw new FieldRequiredForUserSummaryError('lastName');
}

  public equals(other: unknown): boolean {
    if (!(other instanceof UserSummary)) return false;
    const a = this.getValue();
    const b = other.getValue();
    return (
      a.id.equals(b.id) &&
      a.email.equals(b.email) &&
      a.name === b.name &&
      a.lastName === b.lastName &&
      a.status === b.status
    );
  }

  public override toJSON(): UserSummaryProps {
  return this.getValue();
}
}
