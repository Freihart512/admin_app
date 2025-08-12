import { DataAccessError } from '../data-access.error';

describe('DataAccessError', () => {
  it('should be an instance of Error', () => {
    const error = new DataAccessError('Test message');
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name', () => {
    const error = new DataAccessError('Test message');
    expect(error.name).toBe('DataAccessError');
  });

  it('should have the correct message', () => {
    const errorMessage = 'This is a data access error';
    const error = new DataAccessError(errorMessage);
    expect(error.message).toBe(errorMessage);
  });
});