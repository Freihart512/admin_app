// domain/value-objects/UserSummary.ts
import { ValueObject } from '../../@shared/value-objects/base.value-object';
import { UUID } from '../../@shared/value-objects/uuid.value-object';
import { EmailAddress } from './email-address.value-object';
import { AccountStatus } from '../user.types';
import { InvalidUserSummaryError } from '../errors/invalid-user-summary.error';
import { UserSummaryType, UserSummaryProps } from '../user.types';



export class UserSummary extends ValueObject<UserSummaryType, undefined> {
  public static create(props: UserSummaryProps): UserSummary {
    return new UserSummary(props);
  }

  public getId(): UUID {
    return this.value.id;
  }

  public getName(): string {
    return this.value.name;
  }

  public getLastName(): string {
    return this.value.lastName;
  }

  public getEmail(): EmailAddress {
    return this.value.email;
  }

  public getStatus(): AccountStatus {
    return this.value.status;
  }

  public toPrimitives() {
    return {
      id: this.getId().getValue(),
      name: this.getName(),
      lastName: this.getLastName(),
      email: this.getEmail().getValue(),
      status: this.getStatus(),
    };
  }

  protected ensureIsValid(props: UserSummaryProps): void {
    const reasons: string[] = [];

    if (!props.name) reasons.push('Missing name');
    if (!props.lastName) reasons.push('Missing last name');

    if (reasons.length > 0) {
      throw new InvalidUserSummaryError(reasons);
    }
  }
}
