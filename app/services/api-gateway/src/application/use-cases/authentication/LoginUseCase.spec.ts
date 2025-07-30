// Importamos el caso de uso que vamos a probar
import { LoginUseCase } from './LoginUseCase';
// Importamos las implementaciones REALES de las dependencias que usan mocks globales
import { PostgresUserRepository } from '../../../infrastructure/database/repositories/PostgresUserRepository';
import { BCryptPasswordHasher } from '../../../infrastructure/services/BCryptPasswordHasher';
// Importamos el dispatcher real o mockeamos la interfaz
import { InMemoryEventDispatcher } from '../../../infrastructure/event-dispatcher/InMemoryEventDispatcher'; // O mockeamos la interfaz
import { IEventDispatcher } from '../../../shared/events/IEventDispatcher'; // Si mockeas la interfaz
// Importamos la implementación REAL del generador de tokens
import { JwtAuthTokenGenerator } from '../../../infrastructure/services/JwtAuthTokenGenerator';
// Importamos las clases de eventos para verificar que se emiten correctamente
import { UserLoggedInEvent } from '../../../shared/events/authentication/UserLoggedInEvent';
import { UserLoginFailedEvent } from '../../../shared/events/authentication/UserLoginFailedEvent';
import { ApplicationErrorEvent } from '../../../shared/events/application/ApplicationErrorEvent'; // Importamos el evento de error general
// Importamos la entidad User para crear datos de prueba
import { User } from '../../../domain/entities/User';
// Importamos errores de dominio e infraestructura
import { InvalidCredentialsError } from '../../../domain/errors/authentication/InvalidCredentialsError';
import { DatabaseError } from '../../../infrastructure/errors/DatabaseError'; // Importamos el error de infraestructura de DB

// Importamos los mocks específicos de pg, bcrypt y jsonwebtoken para configurarlos en las pruebas
import { mockQuery, mockPool } from '../../../testHelpers/globalMocks/pg'; // Importamos el mock de pool.query y la clase Pool mockeada
import { mockCompare, mockHash } from '../../../testHelpers/globalMocks/bcrypt'; // Importamos los mocks de bcrypt
import { mockSign } from '../../../testHelpers/globalMocks/jsonwebtoken'; // Importamos el mock de jsonwebtoken.sign
import { Pool } from 'pg';


// Si decides mockear el dispatcher en lugar de usar InMemoryEventDispatcher:
const mockEventDispatcher: IEventDispatcher = {
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    dispatch: vi.fn(),
};


// --- Pruebas de Integración de Componentes para LoginUseCase ---

describe('LoginUseCase (Component Integration Test - Mocking external libs)', () => {
  let loginUseCase: LoginUseCase;
  // Instancias de las implementaciones reales
  let userRepository: PostgresUserRepository;
  let passwordHasher: BCryptPasswordHasher;
  let authTokenGenerator: JwtAuthTokenGenerator; // Usaremos la implementación real
  let eventDispatcher: IEventDispatcher; // Usaremos el mock o la implementación real simple

  // Datos de prueba
  const testUser = new User(
    'user-id-123',
    'test@example.com',
    'Test',
    'User',
    undefined, undefined, undefined,
    ['Inquilino'],
    'hashed-password-of-test-user',
    true // Activo
  );

   const inactiveUser = new User(
        'user-id-456',
        'inactive@example.com',
        'Inactive',
        'User',
        undefined, undefined, undefined,
        ['Inquilino'],
        'hashed-password-of-inactive-user',
        false // Usuario INACTIVO
     );


  beforeEach(() => {
    vi.clearAllMocks(); // Limpiamos todos los mocks (incluyendo los globales de pg, bcrypt, jsonwebtoken)

    // Instanciamos las implementaciones reales de las dependencias
    // Estas instancias usarán automáticamente los mocks globales de pg, bcrypt, jsonwebtoken
    userRepository = new PostgresUserRepository(mockPool as Pool); // Pasa una instancia del Pool mockeado
    passwordHasher = new BCryptPasswordHasher();
    authTokenGenerator = new JwtAuthTokenGenerator('testsecret', '1h'); // Instancia el generador de tokens real
    // Decide si usar el mock del dispatcher o la implementación real simple
    eventDispatcher = mockEventDispatcher; // Usamos el mock
    // eventDispatcher = new InMemoryEventDispatcher(); // Usamos la implementación real simple

    // Instanciamos el caso de uso inyectando las dependencias reales/mockeadas
    loginUseCase = new LoginUseCase(
      userRepository,
      passwordHasher,
      authTokenGenerator, // Inyectamos el generador de tokens real
      eventDispatcher // Inyectamos el dispatcher (mock o real)
    );

     // Configuraciones por defecto para los mocks si es necesario (ej. para evitar errores en beforeEach)
     // mockQuery.mockResolvedValue({ rows: [], rowCount: 0 }); // Por defecto, el repo no encuentra nada
     // mockCompare.mockResolvedValue(false); // Por defecto, la comparación de contraseñas falla
     // mockSign.mockReturnValue('default-mock-token'); // Por defecto, generateToken retorna un token mock

  });


  // --- Escenario de Login Exitoso ---
  it('should successfully log in an active user with valid credentials', async () => {
    // Configurar el mock de pg.query para que el repositorio encuentre al usuario
    mockQuery.mockResolvedValue({ rows: [{ // Simula la fila de DB que devuelve el repositorio
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        last_name: testUser.lastName,
        phone_number: testUser.phoneNumber,
        address: testUser.address,
        rfc: testUser.rfc,
        roles: testUser.roles,
        password_hash: testUser.passwordHash,
        is_active: testUser.isActive,
      }], rowCount: 1 });

    // Configurar el mock de bcrypt.compare para que la comparación de contraseña sea exitosa
    mockCompare.mockResolvedValue(true);

    // Configurar el mock de jsonwebtoken.sign para que retorne un token específico
     const expectedToken = 'specific-mock-jwt-token';
    mockSign.mockReturnValue(expectedToken);

    const input = { email: testUser.email, password: 'validpassword123' };

    const result = await loginUseCase.execute(input);

    // Verificar llamadas a los mocks de librerías externas
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]); // Verifica que el repositorio llamó a query
    expect(mockCompare).toHaveBeenCalledWith(input.password, testUser.passwordHash); // Verifica que el hasher llamó a compare
     // Verificar que jsonwebtoken.sign fue llamado por el generador de tokens real
     expect(mockSign).toHaveBeenCalledWith({ sub: testUser.id, email: testUser.email, roles: testUser.roles }, 'testsecret', { expiresIn: '1h' });


    // Verificar resultado
    expect(result).toEqual({
      token: expectedToken, // Debe retornar el token mockeado por mockSign
      user: { // Asegúrate de que el mapeo en el repositorio es correcto
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        lastName: testUser.lastName,
        roles: testUser.roles,
      },
    });

    // Verificar emisión de evento de éxito
    expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoggedInEvent));
     const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock.calls[0][0] as UserLoggedInEvent;
     expect(emittedEvent.type).toBe('UserLoggedInEvent');
     expect(emittedEvent.userId).toBe(testUser.id); // Verifica el userId en el evento
     expect(emittedEvent.payload.email).toBe(testUser.email);

  });

  // --- Escenario de Login Fallido (Contraseña Incorrecta) ---
  it('should throw InvalidCredentialsError for incorrect password and emit UserLoginFailedEvent', async () => {
      // Configurar el mock de pg.query para que el repositorio encuentre al usuario
      mockQuery.mockResolvedValue({ rows: [{ // Simula la fila de DB
          id: testUser.id, email: testUser.email, name: testUser.name, last_name: testUser.lastName,
          phone_number: testUser.phoneNumber, address: testUser.address, rfc: testUser.rfc, roles: testUser.roles,
          password_hash: testUser.passwordHash, is_active: testUser.isActive,
         }], rowCount: 1 });

      // Configurar el mock de bcrypt.compare para que la comparación de contraseña FALLE
      mockCompare.mockResolvedValue(false);

      const input = { email: testUser.email, password: 'wrongpassword' };

      await expect(loginUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);

      // Verificar llamadas a mocks de librerías externas
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]); // Se llamó a pool.query (en findByEmail)
      expect(mockCompare).toHaveBeenCalledWith(input.password, testUser.passwordHash); // Se llamó a bcrypt.compare
      expect(mockSign).not.toHaveBeenCalled(); // NO se llamó a jsonwebtoken.sign

      // Verificar emisión de evento de fallo
      expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoginFailedEvent));
       const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock.calls[0][0] as UserLoginFailedEvent;
       expect(emittedEvent.type).toBe('UserLoginFailedEvent');
       expect(emittedEvent.payload.email).toBe(input.email);
       expect(emittedEvent.payload.reason).toBe('INVALID_CREDENTIALS');
       expect(emittedEvent.userId).toBe(testUser.id); // userId debe estar presente ya que el usuario fue encontrado
  });

   // Escenario: Correo electrónico no encontrado
   it('should throw InvalidCredentialsError for not found email and emit UserLoginFailedEvent', async () => {
     // Configurar el mock de pg.query para que el repositorio NO encuentre al usuario
     mockQuery.mockResolvedValue({ rows: [], rowCount: 0 }); // findByEmail retorna null

     const input = { email: 'nonexistent@example.com', password: 'anypassword' };

     await expect(loginUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);

     // Verificar llamadas a mocks de librerías externas
     expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]); // Se llamó a pool.query
     expect(mockCompare).not.toHaveBeenCalled(); // No se llamó a bcrypt.compare
     expect(mockSign).not.toHaveBeenCalled(); // No se llamó a jsonwebtoken.sign

      // Verificar emisión de evento de fallo
     expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoginFailedEvent));
      const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock.calls[0][0] as UserLoginFailedEvent;
      expect(emittedEvent.type).toBe('UserLoginFailedEvent');
      expect(emittedEvent.payload.email).toBe(input.email);
      expect(emittedEvent.payload.reason).toBe('USER_NOT_FOUND'); // Razón esperada
      expect(emittedEvent.userId).toBeUndefined(); // userId NO debe estar presente ya que el usuario no fue encontrado
   });

    // Escenario: Usuario inactivo
   it('should throw InvalidCredentialsError for inactive user and emit UserLoginFailedEvent', async () => {
     // Configurar el mock de pg.query para que el repositorio encuentre al usuario INACTIVO
     mockQuery.mockResolvedValue({ rows: [{ // Simula la fila de DB
          id: inactiveUser.id, email: inactiveUser.email, name: inactiveUser.name, last_name: inactiveUser.lastName,
          phone_number: inactiveUser.phoneNumber, address: inactiveUser.address, rfc: inactiveUser.rfc, roles: inactiveUser.roles,
          password_hash: inactiveUser.passwordHash, is_active: inactiveUser.isActive, // is_active es false
         }], rowCount: 1 });

     const input = { email: inactiveUser.email, password: 'anypassword' };

     await expect(loginUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);

     // Verificar llamadas a mocks de librerías externas
     expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]); // Se llamó a pool.query
     expect(mockCompare).not.toHaveBeenCalled(); // No se llamó a bcrypt.compare (si isActive se verifica primero)
     expect(mockSign).not.toHaveBeenCalled(); // No se llamó a jsonwebtoken.sign

      // Verificar emisión de evento de fallo
     expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoginFailedEvent));
      const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock.calls[0][0] as UserLoginFailedEvent;
      expect(emittedEvent.type).toBe('UserLoginFailedEvent');
      expect(emittedEvent.payload.email).toBe(input.email);
      expect(emittedEvent.payload.reason).toBe('USER_INACTIVE'); // Razón esperada
      expect(emittedEvent.userId).toBe(inactiveUser.id); // userId debe estar presente ya que el usuario fue encontrado
   });


    // Escenario: Input inválido (ej. email vacío)
   it('should throw InvalidCredentialsError for invalid input and emit UserLoginFailedEvent', async () => {
      // Ninguna dependencia (repositorio, hasher, generador de tokens) debería ser llamada

      const input = { email: '', password: 'anypassword' }; // Email vacío

      await expect(loginUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);

      // Verificar que NO se llamaron a los mocks de librerías externas
      expect(mockQuery).not.toHaveBeenCalled();
      expect(mockCompare).not.toHaveBeenCalled();
      expect(mockSign).not.toHaveBeenCalled();

       // Verificar emisión de evento de fallo
      expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoginFailedEvent));
       const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock.calls[0][0] as UserLoginFailedEvent;
       expect(emittedEvent.type).toBe('UserLoginFailedEvent');
       expect(emittedEvent.payload.email).toBe(input.email);
       expect(emittedEvent.payload.reason).toBe('MISSING_INPUT'); // Razón esperada
       expect(emittedEvent.userId).toBeUndefined(); // No hay userId para input inválido
    });

    // Escenario: Error de base de datos al buscar usuario
    it('should throw InvalidCredentialsError and emit UserLoginFailedEvent on database error', async () => {
      // Configurar mock de pg.query para que lance un DatabaseError (como lo haría PostgresUserRepository)
      const dbError = new DatabaseError('Simulated database error', {
          type: 'QUERY_ERROR',
          dbErrorCode: 'simulated-code',
          details: { table: 'users' },
          originalError: new Error('Original pg error')
      });
      mockQuery.mockRejectedValue(dbError); // findByEmail lanza este DatabaseError

      const input = { email: 'test@example.com', password: 'anypassword' };

       // Esperar que el caso de uso capture el DatabaseError y lance InvalidCredentialsError
       await expect(loginUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);

       // Verificar llamadas a mocks de librerías externas
       expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]); // Se llamó a pool.query
       expect(mockCompare).not.toHaveBeenCalled(); // No se llamó a bcrypt.compare
       expect(mockSign).not.toHaveBeenCalled(); // No se llamó a jsonwebtoken.sign


        // Verificar emisión de evento de fallo
       expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoginFailedEvent));
        const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock.calls[0][0] as UserLoginFailedEvent;
        expect(emittedEvent.type).toBe('UserLoginFailedEvent');
        expect(emittedEvent.payload.email).toBe(input.email);
        expect(emittedEvent.payload.reason).toBe('DATABASE_ERROR'); // Razón esperada
        expect(emittedEvent.userId).toBeUndefined(); // No hay userId ya que el usuario no fue encontrado antes del error de DB
     });

     // Escenario: Error del hasher de contraseñas
     it('should throw InvalidCredentialsError and emit UserLoginFailedEvent on password hasher error', async () => {
        // Configurar mocks
        mockQuery.mockResolvedValue({ rows: [{ // Simula la fila de DB (usuario encontrado)
            id: testUser.id, email: testUser.email, name: testUser.name, last_name: testUser.lastName,
            phone_number: testUser.phoneNumber, address: testUser.address, rfc: testUser.rfc, roles: testUser.roles,
            password_hash: testUser.passwordHash, is_active: testUser.isActive,
           }], rowCount: 1 });

        const hasherError = new Error('Simulated bcrypt compare error'); // Un error genérico del hasher
        mockCompare.mockRejectedValue(hasherError); // compare lanza un error


        const input = { email: testUser.email, password: 'anypassword' };

        // Esperar que el caso de uso capture el error del hasher y lance InvalidCredentialsError
         await expect(loginUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);

         // Verificar llamadas a mocks de librerías externas
         expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]); // Se llamó a pool.query
         expect(mockCompare).toHaveBeenCalledWith(input.password, testUser.passwordHash); // Se llamó a bcrypt.compare
         expect(mockSign).not.toHaveBeenCalled(); // No se llamó a jsonwebtoken.sign


          // Verificar emisión de evento de fallo
         expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(UserLoginFailedEvent));
          const emittedEvent = vi.mocked(mockEventDispatcher.dispatch).mock.calls[0][0] as UserLoginFailedEvent;
          expect(emittedEvent.type).toBe('UserLoginFailedEvent');
          expect(emittedEvent.payload.email).toBe(input.email);
          expect(emittedEvent.payload.reason).toBe('PASSWORD_HASHER_ERROR'); // Razón esperada
          expect(emittedEvent.userId).toBe(testUser.id); // userId debe estar presente ya que el usuario fue encontrado
      });

      // Escenario: Error en jsonwebtoken.sign (dentro del JwtAuthTokenGenerator)
      it('should throw a generic error if jsonwebtoken.sign fails', async () => {
          // Configurar mocks para llegar a generateToken
          mockQuery.mockResolvedValue({ rows: [{ // Simula la fila de DB (usuario encontrado)
              id: testUser.id, email: testUser.email, name: testUser.name, last_name: testUser.lastName,
              phone_number: testUser.phoneNumber, address: testUser.address, rfc: testUser.rfc, roles: testUser.roles,
              password_hash: testUser.passwordHash, is_active: testUser.isActive,
             }], rowCount: 1 });
          mockCompare.mockResolvedValue(true); // Comparación de contraseña exitosa

          const signError = new Error('Simulated JWT sign error'); // Error del generador de tokens
          mockSign.mockImplementation(() => { throw signError; }); // Configura mockSign para lanzar un error


          const input = { email: testUser.email, password: 'validpassword123' };

           // Esperar que el caso de uso capture el error y lance un error genérico (o ApplicationErrorEvent si lo emite)
           // El LoginUseCase actualmente relanza errores inesperados como 'An unexpected error occurred.'
           await expect(loginUseCase.execute(input)).rejects.toThrow('Simulated JWT sign error');


           // Verificar llamadas a mocks de librerías externas hasta el punto del error
           expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [input.email]);
           expect(mockCompare).toHaveBeenCalledWith(input.password, testUser.passwordHash);
           expect(mockSign).toHaveBeenCalledWith({ sub: testUser.id, email: testUser.email, roles: testUser.roles }, 'testsecret', { expiresIn: '1h' });

           // Verificar emisión de evento de error general (ApplicationErrorEvent)
           // Si tu LoginUseCase emite ApplicationErrorEvent en caso de errores inesperados
           // expect(mockEventDispatcher.dispatch).toHaveBeenCalledWith(expect.any(ApplicationErrorEvent));
           // const emittedErrorEvent = vi.mocked(mockEventDispatcher.dispatch).mock.calls[0][0] as ApplicationErrorEvent;
           // expect(emittedErrorEvent.type).toBe('ApplicationErrorEvent');
           // expect(emittedErrorEvent.payload.name).toBe('Error'); // O el nombre del error lanzado por JwtAuthTokenGenerator
           // expect(emittedErrorEvent.payload.message).toBe('Simulated JWT sign error');

           // Si LoginUseCase solo emite UserLoginFailedEvent para fallos específicos y relanza otros
           // expect(mockEventDispatcher.dispatch).not.toHaveBeenCalledWith(expect.any(UserLoginFailedEvent)); // No debería emitir LoginFailed en este caso
           // Verifica si emite algún otro evento o solo relanza el error

        });


});
