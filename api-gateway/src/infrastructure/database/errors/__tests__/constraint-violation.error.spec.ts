import { ConstraintViolationError } from '../src/errors/constraint-violation.error'; // Adjust the import path as necessary

describe('ConstraintViolationError', () => {
  it('should create an instance of ConstraintViolationError with the correct properties', () => {
    const errorMessage = 'This is a constraint violation error';
    const error = new ConstraintViolationError(errorMessage);

    expect(error).toBeInstanceOf(ConstraintViolationError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ConstraintViolationError');
    expect(error.message).toBe(errorMessage);
  });
});