import { DataIntegrityError } from '../data-integrity.error';

describe('DataIntegrityError', () => {
  it('should create an instance of DataIntegrityError that is also an instance of Error', () => {
    const errorMessage = 'Test data integrity error message';
    const error = new DataIntegrityError(errorMessage);

    expect(error).toBeInstanceOf(DataIntegrityError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('DataIntegrityError');
    expect(error.message).toBe(errorMessage);
  });
});