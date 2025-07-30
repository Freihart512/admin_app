// Importamos la clase que vamos a probar
import { JwtAuthTokenGenerator } from './JwtAuthTokenGenerator';
// Importamos la entidad User para crear datos de prueba
import { User } from '../../domain/entities/User';
// Importamos los mocks de jsonwebtoken centralizados
import { mockSign } from '../../testHelpers/globalMocks/jsonwebtoken';


describe('JwtAuthTokenGenerator (Unit Test - Mocking jsonwebtoken)', () => {
  // Definimos un secreto JWT de prueba y una duración de expiración
  const testJwtSecret = 'test-jwt-secret';
  const testJwtExpiresIn = '1h';
  let authTokenGenerator: JwtAuthTokenGenerator;
  let testUser: User; // Usuario de prueba

  beforeEach(() => {
    // Limpiamos los mocks (ya se hace en setup.ts, pero es buena práctica para claridad)
    // vi.clearAllMocks(); // O usar mockSign.mockReset() si solo limpias este mock aquí
    // Creamos una nueva instancia del generador de tokens antes de cada prueba
    authTokenGenerator = new JwtAuthTokenGenerator(testJwtSecret, testJwtExpiresIn);

     // Definimos un usuario de prueba para generar tokens
     testUser = new User(
        'user-id-123',
        'test@example.com',
        'Test',
        'User',
        '1234567890',
        'Test Address',
        'ABC123XYZ',
        ['Inquilino'],
        'hashed-password-of-test-user',
        true // Usuario activo
     );
  });

  // --- Prueba: Constructor ---
  it('should throw an error if jwtSecret is not provided', () => {
    // Esperamos que el constructor lance un error si el secreto es nulo, indefinido o vacío
    expect(() => new JwtAuthTokenGenerator(null as any)).toThrow('JWT secret is not provided.');
    expect(() => new JwtAuthTokenGenerator(undefined as any)).toThrow('JWT secret is not provided.');
    expect(() => new JwtAuthTokenGenerator('')).toThrow('JWT secret is not provided.');
  });

  // --- Prueba: generateToken ---
  it('should call jsonwebtoken.sign with correct payload and options', () => {
    const expectedToken = 'mock-generated-token';
    // Configuramos el mock de jsonwebtoken.sign para que retorne un valor específico
    mockSign.mockReturnValue(expectedToken);

    // Llamamos al método generateToken del generador
    const generatedToken = authTokenGenerator.generateToken(testUser);

    // Definimos el payload que esperamos que se pase a jsonwebtoken.sign
    const expectedPayload = {
      sub: testUser.id,
      email: testUser.email,
      roles: testUser.roles,
      // Asegúrate de que el payload coincida con lo que construyes en JwtAuthTokenGenerator
    };

    // Verificar que jsonwebtoken.sign fue llamado con los argumentos correctos
    expect(mockSign).toHaveBeenCalledWith(
      expectedPayload, // Debe llamarse con el payload esperado
      testJwtSecret,   // Debe llamarse con el secreto JWT configurado
      { expiresIn: testJwtExpiresIn } // Debe llamarse con las opciones de expiración configuradas
    );

    // Verificar que el método generateToken retorna el valor mockeado
    expect(generatedToken).toBe(expectedToken);
  });

  // Puedes añadir más pruebas si tu generador de tokens tiene lógica más compleja
  // Por ejemplo, si el payload varía según los roles del usuario, etc.

});
