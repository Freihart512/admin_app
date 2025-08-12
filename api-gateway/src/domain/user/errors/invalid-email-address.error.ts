import { InvalidEmailReason } from "../user.types";

export class InvalidEmailAddressError extends Error {
  constructor(
    public readonly value: string,
    public readonly reason: InvalidEmailReason
  ) {
    super(`Invalid email address (${reason}): "${value}"`);
    this.name = 'InvalidEmailAddress';
  }
}
