import { describe, it, expect } from 'vitest';
import {
  InvalidEmailAddressError,
} from '../invalid-email-address.error';
import { InvalidEmailReasons } from '../';

describe('InvalidEmailAddressError', () => {
  it('should be instance of Error and InvalidEmailAddressError', () => {
    const error = new InvalidEmailAddressError('invalid@', InvalidEmailReasons.InvalidFormat);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InvalidEmailAddressError);
  });

  it('should expose the value and reason', () => {
    const email = 'invalid@';
    const reason = InvalidEmailReasons.InvalidFormat;
    const error = new InvalidEmailAddressError(email, reason);

    expect(error.value).toBe(email);
    expect(error.reason).toBe(reason);
  });

  it('should set the error name correctly', () => {
    const error = new InvalidEmailAddressError('user@longdomain.com', InvalidEmailReasons.TooLong);
    expect(error.name).toBe('InvalidEmailAddress');
  });

  it('should generate the correct error message', () => {
    const email = 'user@domain.com';
    const reason = InvalidEmailReasons.InvalidFormat;
    const error = new InvalidEmailAddressError(email, reason);

    expect(error.message).toBe(`Invalid email address (${reason}): "${email}"`);
  });
});
