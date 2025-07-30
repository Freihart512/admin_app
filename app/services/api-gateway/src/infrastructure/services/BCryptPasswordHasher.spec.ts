import { BCryptPasswordHasher } from './BCryptPasswordHasher';
// Importa los mocks reutilizables
import { mockHash, mockCompare } from '../../testHelpers/globalMocks/bcrypt';

describe('BCryptPasswordHasher (Unit Test - Mocking bcrypt)', () => {
  let passwordHasher: BCryptPasswordHasher;

  beforeEach(() => {
    passwordHasher = new BCryptPasswordHasher();
  });

  it('should call bcrypt.hash with correct arguments', async () => {
    mockHash.mockResolvedValue('mock-hashed-password');
    const result = await passwordHasher.hash('testpassword');
    expect(mockHash).toHaveBeenCalledWith('testpassword', 10);
    expect(result).toBe('mock-hashed-password');
  });

  it('should call bcrypt.compare and return true for correct password', async () => {
    mockCompare.mockResolvedValue(true);
    const result = await passwordHasher.compare('testpassword', 'hashed-password');
    expect(mockCompare).toHaveBeenCalledWith('testpassword', 'hashed-password');
    expect(result).toBe(true);
  });

  it('should call bcrypt.compare and return false for incorrect password', async () => {
    mockCompare.mockResolvedValue(false);
    const result = await passwordHasher.compare('wrongpassword', 'hashed-password');
    expect(mockCompare).toHaveBeenCalledWith('wrongpassword', 'hashed-password');
    expect(result).toBe(false);
  });

  it('should throw an error if bcrypt.hash fails', async () => {
    mockHash.mockRejectedValue(new Error('Simulated bcrypt hash error'));
    await expect(passwordHasher.hash('testpassword')).rejects.toThrow('Simulated bcrypt hash error');
    expect(mockHash).toHaveBeenCalledWith('testpassword', 10);
  });

  it('should throw an error if bcrypt.compare fails', async () => {
    mockCompare.mockRejectedValue(new Error('Simulated bcrypt compare error'));
    await expect(passwordHasher.compare('testpassword', 'hashed-password')).rejects.toThrow('Simulated bcrypt compare error');
    expect(mockCompare).toHaveBeenCalledWith('testpassword', 'hashed-password');
  });
});
