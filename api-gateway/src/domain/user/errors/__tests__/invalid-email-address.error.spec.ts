import { describe, it, expect } from 'vitest';
import {
  InvalidEmailAddress,
  InvalidEmailReasons,
} from '../invalid-email-address.error';

describe('InvalidEmailAddress', () => {
  it('should be instance of Error and InvalidEmailAddress', () => {
    const error = new InvalidEmailAddress('invalid@', InvalidEmailReasons.InvalidFormat);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InvalidEmailAddress);
  });

  it('should expose the value and reason', () => {
    const email = 'invalid@';
    const reason = InvalidEmailReasons.InvalidFormat;
    const error = new InvalidEmailAddress(email, reason);

    expect(error.value).toBe(email);
    expect(error.reason).toBe(reason);
  });

  it('should set the error name correctly', () => {
    const error = new InvalidEmailAddress('user@longdomain.com', InvalidEmailReasons.TooLong);
    expect(error.name).toBe('InvalidEmailAddress');
  });

  it('should generate the correct error message', () => {
    const email = 'user@domain.com';
    const reason = InvalidEmailReasons.InvalidFormat;
    const error = new InvalidEmailAddress(email, reason);

    expect(error.message).toBe(`Invalid email address (${reason}): "${email}"`);
  });
});
