// Importamos el mock del Pool y los mocks de los métodos que vamos a usar
import { Pool } from 'pg';
import { mockQuery, mockPool } from '../../../../testHelpers/globalMocks/pg';

import { PostgresUserRepository } from '../PostgresUserRepository';
import { User } from '../../../../domain/entities/User';
import { UserNotFoundError } from '../../../../domain/errors/user/UserNotFoundError';
import { EmailAlreadyExistsError } from '../../../../domain/errors/user/EmailAlreadyExistsError';
import { RfcAlreadyExistsError } from '../../../../domain/errors/user/RfcAlreadyExistsError';
import { DatabaseError } from '../../../errors/DatabaseError';

describe('PostgresUserRepository (Infrastructure Integration Test)', () => {
  let postgresUserRepository: PostgresUserRepository;


  beforeEach(() => {
    vi.clearAllMocks(); // Limpiamos todos los mocks (incluyendo el mockQuery global)
    // Instanciamos el repositorio, inyectando una nueva instancia del Pool mockeado
    postgresUserRepository = new PostgresUserRepository(mockPool as Pool);
  });


   // Datos de prueba de usuario (simula cómo se ve en la DB)
  const testUserRow = {
      id: '8c7e92ee-1124-48c6-bd46-8388e8aab6b1',
      email: 'test@example.com',
      name: 'Test',
      last_name: 'User',
      phone_number: '1234567890',
      address: 'Test Address',
      rfc: 'ABC123XYZ',
      roles: ['Inquilino', 'Propietario'],
      password_hash: 'hashed-password-of-test-user',
      is_active: true,
  };

  // Datos de prueba de usuario como entidad User
  const testUserEntity = new User(
      testUserRow.id,
      testUserRow.email,
      testUserRow.name,
      testUserRow.last_name,
      testUserRow.phone_number,
      testUserRow.address,
      testUserRow.rfc,
      testUserRow.roles,
      testUserRow.password_hash,
      testUserRow.is_active
  );


  // --- Prueba: findByEmail - Usuario Encontrado ---
  it('should return a User when finding by email and user exists', async () => {
    mockQuery.mockResolvedValue({ rows: [testUserRow], rowCount: 1 });

    const result = await postgresUserRepository.findByEmail('test@example.com');

    expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['test@example.com']
    );
    expect(result).toBeInstanceOf(User);
    // Verifica el mapeo de propiedades
    expect(result?.id).toBe(testUserRow.id);
    expect(result?.email).toBe(testUserRow.email);
    expect(result?.name).toBe(testUserRow.name);
    expect(result?.lastName).toBe(testUserRow.last_name); // snake_case to camelCase
     expect(result?.phoneNumber).toBe(testUserRow.phone_number);
     expect(result?.address).toBe(testUserRow.address);
     expect(result?.rfc).toBe(testUserRow.rfc);
     expect(result?.roles).toEqual(testUserRow.roles); // Comparar arrays
     expect(result?.passwordHash).toBe(testUserRow.password_hash);
     expect(result?.isActive).toBe(testUserRow.is_active);
  });

  // --- Prueba: findByEmail - Usuario No Encontrado ---
  it('should return null when finding by email and user does not exist', async () => {
     mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });

     const result = await postgresUserRepository.findByEmail('nonexistent@example.com');

     expect(mockQuery).toHaveBeenCalledWith(
         expect.stringContaining('SELECT'),
         ['nonexistent@example.com']
     );
     expect(result).toBeNull();
  });

    // --- Prueba: findByEmail - Error de Base de Datos ---
   it('should throw DatabaseError on database query error in findByEmail', async () => {
       const dbError = new Error('Simulated DB query error');
       mockQuery.mockRejectedValue(dbError);

       const email = 'test@example.com';

       await expect(postgresUserRepository.findByEmail(email)).rejects.toThrow(DatabaseError);
        await expect(postgresUserRepository.findByEmail(email)).rejects.toThrow(expect.objectContaining({
            message: expect.stringContaining(`Failed to query user by email: ${dbError.message}`),
            type: 'QUERY_ERROR',
            originalError: dbError
        }));

       expect(mockQuery).toHaveBeenCalledWith(
           expect.stringContaining('SELECT'),
           [email]
       );
   });


    // --- Prueba: findById - Usuario Encontrado ---
   it('should return a User when finding by id and user exists', async () => {
     mockQuery.mockResolvedValue({ rows: [testUserRow], rowCount: 1 });

     const result = await postgresUserRepository.findById(testUserRow.id);

     expect(mockQuery).toHaveBeenCalledWith(
         expect.stringContaining('SELECT id, email'),
         [testUserRow.id]
     );
     expect(result).toBeInstanceOf(User);
      // Verifica el mapeo de propiedades (similar a findByEmail)
      expect(result?.id).toBe(testUserRow.id);
      expect(result?.email).toBe(testUserRow.email);
      expect(result?.lastName).toBe(testUserRow.last_name); // snake_case to camelCase
      // ... verifica otros campos
   });

    // --- Prueba: findById - Usuario No Encontrado ---
   it('should return null when finding by id and user does not exist', async () => {
     mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });

     const nonExistentId = '8c7e92ee-1124-48c6-bd46-8388e8aab6b1';
     const result = await postgresUserRepository.findById(nonExistentId);

     expect(mockQuery).toHaveBeenCalledWith(
         expect.stringContaining('SELECT'),
         [nonExistentId]
     );
     expect(result).toBeNull();
   });

    // --- Prueba: findById - Error de Base de Datos ---
    it('should throw DatabaseError on database query error in findById', async () => {
       const dbError = new Error('Simulated DB query error');
       mockQuery.mockRejectedValue(dbError);

       const userId = '8c7e92ee-1124-48c6-bd46-8388e8aab6b1';

       await expect(postgresUserRepository.findById(userId)).rejects.toThrow(DatabaseError);
        await expect(postgresUserRepository.findById(userId)).rejects.toThrow(expect.objectContaining({
            message: expect.stringContaining(`Failed to query user by id: ${dbError.message}`),
            type: 'QUERY_ERROR',
            originalError: dbError
        }));


       expect(mockQuery).toHaveBeenCalledWith(
           expect.stringContaining('SELECT'),
           [userId]
       );
    });


    // --- Prueba: save - Usuario guardado exitosamente ---
   it('should save a user successfully', async () => {
     // Para save, esperamos que pool.query se resuelva sin error (puede retornar { rowCount: 1 } o similar)
     mockQuery.mockResolvedValue({ rowCount: 1 });

     const newUser = new User(
         '8c7e92ee-1124-48c6-bd46-8388e8aab6b1', 'newuser@example.com', 'New', 'User',
         '0987654321', 'New Address', 'XYZ789ABC', ['Inquilino'],
         'hashed-password-of-new-user', true
     );

     await postgresUserRepository.save(newUser);

     // Verificar que se llamó a pool.query con la consulta INSERT y los valores correctos
     expect(mockQuery).toHaveBeenCalledWith(
         expect.stringContaining('INSERT INTO users'),
         [
             newUser.id, newUser.email, newUser.name, newUser.lastName,
             newUser.phoneNumber, newUser.address, newUser.rfc, newUser.roles,
             newUser.passwordHash, newUser.isActive
         ]
     );
   });

    // --- Prueba: save - Error de unicidad de email ---
    it('should throw EmailAlreadyExistsError on email unique constraint violation', async () => {
        const pgError = new Error('duplicate key value violates unique constraint "users_email_key"') as any;
        pgError.code = '23505'; // Código de error de PostgreSQL para violación de unicidad
        pgError.constraint = 'users_email_key'; // Nombre de la restricción única de email

        mockQuery.mockRejectedValue(pgError); // Simula que pool.query lanza este error

        const newUser = new User('8c7e92ee-1124-48c6-bd46-8388e8aab6b1', 'existing@example.com', 'Existing', 'User', undefined, undefined, undefined, [], 'hash', true);

        // Esperar que el repositorio capture el error de pg y lance EmailAlreadyExistsError
        await expect(postgresUserRepository.save(newUser)).rejects.toThrow(EmailAlreadyExistsError);
         await expect(postgresUserRepository.save(newUser)).rejects.toThrow(expect.objectContaining({
             message: expect.stringContaining(`Email "${newUser.email}" already exists.`)
         }));

        // Verificar que se llamó a pool.query
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT'),
            expect.any(Array) // No verificamos los valores exactos aquí, solo que se llamó
        );
    });

     // --- Prueba: save - Error de unicidad de RFC ---
    it('should throw RfcAlreadyExistsError on rfc unique constraint violation', async () => {
        const pgError = new Error('duplicate key value violates unique constraint "users_rfc_key"') as any; // Ajusta el nombre si es diferente
        pgError.code = '23505';
        pgError.constraint = 'users_rfc_key'; // Nombre de la restricción única de RFC

        mockQuery.mockRejectedValue(pgError);

        const newUser = new User('8c7e92ee-1124-48c6-bd46-8388e8aab6b1', 'user@example.com', 'User', 'One', undefined, undefined, 'RFC123', [], 'hash', true);

        await expect(postgresUserRepository.save(newUser)).rejects.toThrow(RfcAlreadyExistsError);
        await expect(postgresUserRepository.save(newUser)).rejects.toThrow(expect.objectContaining({
             message: expect.stringContaining(`RFC "${newUser.rfc}" already exists.`)
         }));

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT'),
            expect.any(Array)
        );
    });

    // --- Prueba: save - Error de Base de Datos genérico ---
     it('should throw DatabaseError on generic database error in save', async () => {
        const dbError = new Error('Simulated generic save DB error'); // Un error de DB no relacionado con unicidad
        mockQuery.mockRejectedValue(dbError);

        const newUser = new User('8c7e92ee-1124-48c6-bd46-8388e8aab6b1', 'user@example.com', 'User', 'One', undefined, undefined, undefined, [], 'hash', true);

         await expect(postgresUserRepository.save(newUser)).rejects.toThrow(DatabaseError);
         await expect(postgresUserRepository.save(newUser)).rejects.toThrow(expect.objectContaining({
            message: expect.stringContaining(`Failed to save user: ${dbError.message}`),
            type: 'INSERT_ERROR',
            originalError: dbError
         }));

         expect(mockQuery).toHaveBeenCalledWith(
             expect.stringContaining('INSERT'),
             expect.any(Array)
         );
     });


    // --- Prueba: update - Usuario actualizado exitosamente ---
   it('should update a user successfully', async () => {
      // Para update, esperamos que pool.query afecte al menos una fila (rowCount > 0)
     mockQuery.mockResolvedValue({ rowCount: 1 });

     const updatedUser = new User(
         testUserEntity.id, 'updated@example.com', 'Updated', 'User',
         '999888777', 'Updated Address', 'UPDATEDRFC', ['Propietario'],
         testUserEntity.passwordHash, false // Cambiamos algunos campos
     );

     await postgresUserRepository.update(updatedUser);

     // Verificar que se llamó a pool.query con la consulta UPDATE y los valores correctos
      expect(mockQuery).toHaveBeenCalledWith(
          expect.stringContaining('UPDATE'),
          [
              updatedUser.email, updatedUser.name, updatedUser.lastName,
              updatedUser.phoneNumber, updatedUser.address, updatedUser.rfc,
              updatedUser.roles, updatedUser.isActive, updatedUser.id // ID al final para la cláusula WHERE
          ]
      );
   });

    // --- Prueba: update - Usuario no encontrado al actualizar ---
   it('should throw UserNotFoundError when updating a user that does not exist', async () => {
     // Para update, simulamos que no se afectó ninguna fila
     mockQuery.mockResolvedValue({ rowCount: 0 });

     const nonExistentUser = new User('8c7e92ee-1124-48c6-bd46-8388e8aab6b1', 'noexiste@example.com', 'No', 'Existe', undefined, undefined, undefined, [], 'hash', true);

     await expect(postgresUserRepository.update(nonExistentUser)).rejects.toThrow(UserNotFoundError);
      await expect(postgresUserRepository.update(nonExistentUser)).rejects.toThrow(expect.objectContaining({
          message: expect.stringContaining(`User with ID ${nonExistentUser.id} not found.`)
      }));

      // Verificar que se llamó a pool.query
     expect(mockQuery).toHaveBeenCalledWith(
         expect.stringContaining('UPDATE'),
         expect.any(Array)
     );
   });

    // --- Prueba: update - Error de unicidad de email al actualizar ---
    it('should throw EmailAlreadyExistsError on email unique constraint violation during update', async () => {
        const pgError = new Error('duplicate key value violates unique constraint "users_email_key"') as any;
        pgError.code = '23505';
        pgError.constraint = 'users_email_key';

        mockQuery.mockRejectedValue(pgError);

        const userToUpdate = new User(testUserEntity.id, 'existing@example.com', 'Updated', 'User', undefined, undefined, undefined, [], 'hash', true); // Email que ya existe para otro usuario

        await expect(postgresUserRepository.update(userToUpdate)).rejects.toThrow(EmailAlreadyExistsError);
        await expect(postgresUserRepository.update(userToUpdate)).rejects.toThrow(expect.objectContaining({
             message: expect.stringContaining(`Email "${userToUpdate.email}" already exists.`)
         }));

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE'),
            expect.any(Array)
        );
    });

     // --- Prueba: update - Error de unicidad de RFC al actualizar ---
    it('should throw RfcAlreadyExistsError on rfc unique constraint violation during update', async () => {
        const pgError = new Error('duplicate key value violates unique constraint "users_rfc_key"') as any;
        pgError.code = '23505';
        pgError.constraint = 'users_rfc_key';

        mockQuery.mockRejectedValue(pgError);

        const userToUpdate = new User(testUserEntity.id, testUserEntity.email, 'Updated', 'User', undefined, undefined, 'RFC123', [], 'hash', true); // RFC que ya existe para otro usuario

        await expect(postgresUserRepository.update(userToUpdate)).rejects.toThrow(RfcAlreadyExistsError);
         await expect(postgresUserRepository.update(userToUpdate)).rejects.toThrow(expect.objectContaining({
             message: expect.stringContaining(`RFC "${userToUpdate.rfc}" already exists.`)
         }));

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE'),
            expect.any(Array)
        );
    });

     // --- Prueba: update - Error de Base de Datos genérico ---
     it('should throw DatabaseError on generic database error in update', async () => {
        const dbError = new Error('Simulated generic update DB error');
        mockQuery.mockRejectedValue(dbError);

        const userToUpdate = new User(testUserEntity.id, testUserEntity.email, 'Updated', 'User', undefined, undefined, undefined, [], 'hash', true);

         await expect(postgresUserRepository.update(userToUpdate)).rejects.toThrow(DatabaseError);
         await expect(postgresUserRepository.update(userToUpdate)).rejects.toThrow(expect.objectContaining({
            message: expect.stringContaining(`Failed to update user: ${dbError.message}`),
            type: 'UPDATE_ERROR',
            originalError: dbError
         }));

         expect(mockQuery).toHaveBeenCalledWith(
             expect.stringContaining('UPDATE'),
             expect.any(Array)
         );
     });


    // --- Prueba: updatePassword - Contraseña actualizada exitosamente ---
    it('should update password successfully', async () => {
        mockQuery.mockResolvedValue({ rowCount: 1 });

        const userId = testUserRow.id;
        const newHashedPassword = 'new-hashed-password';

        await postgresUserRepository.updatePassword(userId, newHashedPassword);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE'),
            [newHashedPassword, userId]
        );
    });

    // --- Prueba: updatePassword - Usuario no encontrado al actualizar contraseña ---
     it('should throw UserNotFoundError when updating password for a user that does not exist', async () => {
        mockQuery.mockResolvedValue({ rowCount: 0 });

        const nonExistentUserId = '8c7e92ee-1124-48c6-bd46-8388e8aab6b1';
        const newHashedPassword = 'new-hashed-password';

        await expect(postgresUserRepository.updatePassword(nonExistentUserId, newHashedPassword)).rejects.toThrow(UserNotFoundError);
         await expect(postgresUserRepository.updatePassword(nonExistentUserId, newHashedPassword)).rejects.toThrow(expect.objectContaining({
             message: expect.stringContaining(`User with ID ${nonExistentUserId} not found.`)
         }));

         expect(mockQuery).toHaveBeenCalledWith(
             expect.stringContaining('UPDATE'),
             [newHashedPassword, nonExistentUserId]
         );
     });

     // --- Prueba: updatePassword - Error de Base de Datos genérico ---
     it('should throw DatabaseError on generic database error in updatePassword', async () => {
        const dbError = new Error('Simulated generic updatePassword DB error');
        mockQuery.mockRejectedValue(dbError);

        const userId = testUserRow.id;
        const newHashedPassword = 'new-hashed-password';

         await expect(postgresUserRepository.updatePassword(userId, newHashedPassword)).rejects.toThrow(DatabaseError);
         await expect(postgresUserRepository.updatePassword(userId, newHashedPassword)).rejects.toThrow(expect.objectContaining({
            message: expect.stringContaining(`Failed to update password for user ${userId}: ${dbError.message}`),
            type: 'UPDATE_ERROR',
            originalError: dbError
         }));

         expect(mockQuery).toHaveBeenCalledWith(
             expect.stringContaining('UPDATE'),
             [newHashedPassword, userId]
         );
     });


    // --- Prueba: savePasswordResetToken - Token guardado exitosamente ---
    it('should save password reset token successfully', async () => {
        mockQuery.mockResolvedValue({ rowCount: 1 });

        const userId = testUserRow.id;
        const token = 'simulated-reset-token';
        const expiresAt = new Date(Date.now() + 3600000); // 1 hora en el futuro

        await postgresUserRepository.savePasswordResetToken(userId, token, expiresAt);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO'),
            [userId, token, expiresAt]
        );
    });

    // --- Prueba: savePasswordResetToken - Error de Base de Datos genérico ---
     it('should throw DatabaseError on generic database error in savePasswordResetToken', async () => {
        const dbError = new Error('Simulated generic savePasswordResetToken DB error');
        mockQuery.mockRejectedValue(dbError);

        const userId = testUserRow.id;
        const token = 'simulated-reset-token';
        const expiresAt = new Date(Date.now() + 3600000);

         await expect(postgresUserRepository.savePasswordResetToken(userId, token, expiresAt)).rejects.toThrow(DatabaseError);
         await expect(postgresUserRepository.savePasswordResetToken(userId, token, expiresAt)).rejects.toThrow(expect.objectContaining({
            message: expect.stringContaining(`Failed to save password reset token for user ${userId}: ${dbError.message}`),
            type: 'INSERT_ERROR',
            originalError: dbError
         }));

         expect(mockQuery).toHaveBeenCalledWith(
             expect.stringContaining('INSERT INTO'),
             [userId, token, expiresAt]
         );
     });


    // --- Prueba: findPasswordResetToken - Token encontrado y válido ---
    it('should return token data when finding a valid password reset token', async () => {
        const tokenRow = { user_id: testUserRow.id, expires_at: new Date(Date.now() + 3600000) }; // 1 hora en el futuro
        mockQuery.mockResolvedValue({ rows: [tokenRow], rowCount: 1 });

        const token = 'existing-valid-token';
        const result = await postgresUserRepository.findPasswordResetToken(token);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used IS FALSE'),
            [token]
        );
        expect(result).toEqual({ userId: tokenRow.user_id, expiresAt: tokenRow.expires_at });
    });

    // --- Prueba: findPasswordResetToken - Token no encontrado ---
     it('should return null when finding a password reset token that does not exist', async () => {
        mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });

        const token = 'nonexistent-token';
        const result = await postgresUserRepository.findPasswordResetToken(token);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT user_id, expires_at FROM password_reset_tokens'),
            [token]
        );
        expect(result).toBeNull();
     });

     // --- Prueba: findPasswordResetToken - Token expirado ---
      it('should return null when finding an expired password reset token', async () => {
         // Simula un token con expires_at en el pasado
        const tokenRow = { user_id: testUserRow.id, expires_at: new Date(Date.now() - 3600000) }; // 1 hora en el pasado
        // El query con 'expires_at > NOW()' debería resultar en 0 filas
        mockQuery.mockResolvedValue({ rows: [], rowCount: 0 }); // Simulate query result

         const token = 'expired-token';
         const result = await postgresUserRepository.findPasswordResetToken(token);

         expect(mockQuery).toHaveBeenCalledWith(
             expect.stringContaining('SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used IS FALSE'),
             [token]
         );
         expect(result).toBeNull(); // Should return null
      });

       // --- Prueba: findPasswordResetToken - Token ya usado ---
      it('should return null when finding an already used password reset token', async () => {
         // Simula un token con used = TRUE
         const tokenRow = { user_id: testUserRow.id, expires_at: new Date(Date.now() + 3600000), used: true };
         // El query con 'used IS FALSE' debería resultar en 0 filas
         mockQuery.mockResolvedValue({ rows: [], rowCount: 0 }); // Simulate query result

          const token = 'used-token';
          const result = await postgresUserRepository.findPasswordResetToken(token);

          expect(mockQuery).toHaveBeenCalledWith(
              expect.stringContaining('SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used IS FALSE'),
              [token]
          );
          expect(result).toBeNull(); // Should return null
       });


    // --- Prueba: findPasswordResetToken - Error de Base de Datos genérico ---
     it('should throw DatabaseError on generic database error in findPasswordResetToken', async () => {
        const dbError = new Error('Simulated generic findPasswordResetToken DB error');
        mockQuery.mockRejectedValue(dbError);

        const token = 'simulated-token';

         await expect(postgresUserRepository.findPasswordResetToken(token)).rejects.toThrow(DatabaseError);
         await expect(postgresUserRepository.findPasswordResetToken(token)).rejects.toThrow(expect.objectContaining({
            message: expect.stringContaining(`Failed to find password reset token: ${dbError.message}`),
            type: 'QUERY_ERROR',
            originalError: dbError
         }));

         expect(mockQuery).toHaveBeenCalledWith(
             expect.stringContaining('SELECT'),
             [token]
         );
     });


    // --- Prueba: invalidatePasswordResetToken - Token invalidado exitosamente ---
    it('should invalidate password reset token successfully', async () => {
        mockQuery.mockResolvedValue({ rowCount: 1 });

        const token = 'token-to-invalidate';
        await postgresUserRepository.invalidatePasswordResetToken(token);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE'),
            [token]
        );
    });

    // --- Prueba: invalidatePasswordResetToken - Error de Base de Datos genérico ---
     it('should throw DatabaseError on generic database error in invalidatePasswordResetToken', async () => {
        const dbError = new Error('Simulated generic invalidatePasswordResetToken DB error');
        mockQuery.mockRejectedValue(dbError);

        const token = 'token-to-invalidate';

         await expect(postgresUserRepository.invalidatePasswordResetToken(token)).rejects.toThrow(DatabaseError);
         await expect(postgresUserRepository.invalidatePasswordResetToken(token)).rejects.toThrow(expect.objectContaining({
            message: expect.stringContaining(`Failed to invalidate password reset token: ${dbError.message}`),
            type: 'UPDATE_ERROR', // O el tipo de error que uses para UPDATE
            originalError: dbError
         }));

         expect(mockQuery).toHaveBeenCalledWith(
             expect.stringContaining('UPDATE'),
             [token]
         );
     });


    // --- Prueba: updateStatus - Estado actualizado exitosamente ---
    it('should update user status successfully', async () => {
        mockQuery.mockResolvedValue({ rowCount: 1 });

        const userId = testUserRow.id;
        const isActive = false; // Cambiando a inactivo

        await postgresUserRepository.updateStatus(userId, isActive);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE'),
            [isActive, userId]
        );
    });

     // --- Prueba: updateStatus - Usuario no encontrado al actualizar estado ---
     it('should throw UserNotFoundError when updating status for a user that does not exist', async () => {
        mockQuery.mockResolvedValue({ rowCount: 0 });

        const nonExistentUserId = '8c7e92ee-1124-48c6-bd46-8388e8aab6b1';
        const isActive = false;

        await expect(postgresUserRepository.updateStatus(nonExistentUserId, isActive)).rejects.toThrow(UserNotFoundError);
        await expect(postgresUserRepository.updateStatus(nonExistentUserId, isActive)).rejects.toThrow(expect.objectContaining({
             message: expect.stringContaining(`User with ID ${nonExistentUserId} not found.`)
         }));

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE'),
            [isActive, nonExistentUserId]
        );
     });

     // --- Prueba: updateStatus - Error de Base de Datos genérico ---
     it('should throw DatabaseError on generic database error in updateStatus', async () => {
        const dbError = new Error('Simulated generic updateStatus DB error');
        mockQuery.mockRejectedValue(dbError);

        const userId = testUserRow.id;
        const isActive = false;

         await expect(postgresUserRepository.updateStatus(userId, isActive)).rejects.toThrow(DatabaseError);
         await expect(postgresUserRepository.updateStatus(userId, isActive)).rejects.toThrow(expect.objectContaining({
            message: expect.stringContaining(`Failed to update status for user ${userId}: ${dbError.message}`),
            type: 'UPDATE_ERROR',
            originalError: dbError
         }));

         expect(mockQuery).toHaveBeenCalledWith(
             expect.stringContaining('UPDATE'),
             [isActive, userId]
         );
     });


    // --- Prueba: updateRoles - Roles actualizados exitosamente ---
    it('should update user roles successfully', async () => {
        mockQuery.mockResolvedValue({ rowCount: 1 });

        const userId = testUserRow.id;
        const newRoles = ['Administrador', 'Supervisor'];

        await postgresUserRepository.updateRoles(userId, newRoles);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE'),
            [newRoles, userId]
        );
    });

    // --- Prueba: updateRoles - Usuario no encontrado al actualizar roles ---
     it('should throw UserNotFoundError when updating roles for a user that does not exist', async () => {
        mockQuery.mockResolvedValue({ rowCount: 0 });

        const nonExistentUserId = '8c7e92ee-1124-48c6-bd46-8388e8aab6b1';
        const newRoles = ['Guest'];

        await expect(postgresUserRepository.updateRoles(nonExistentUserId, newRoles)).rejects.toThrow(UserNotFoundError);
         await expect(postgresUserRepository.updateRoles(nonExistentUserId, newRoles)).rejects.toThrow(expect.objectContaining({
             message: expect.stringContaining(`User with ID ${nonExistentUserId} not found.`)
         }));

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE'),
            [newRoles, nonExistentUserId]
        );
     });

     // --- Prueba: updateRoles - Error de Base de Datos genérico ---
     it('should throw DatabaseError on generic database error in updateRoles', async () => {
        const dbError = new Error('Simulated generic updateRoles DB error');
        mockQuery.mockRejectedValue(dbError);

        const userId = testUserRow.id;
        const newRoles = ['Guest'];

         await expect(postgresUserRepository.updateRoles(userId, newRoles)).rejects.toThrow(DatabaseError);
         await expect(postgresUserRepository.updateRoles(userId, newRoles)).rejects.toThrow(expect.objectContaining({
            message: expect.stringContaining(`Failed to update roles for user ${userId}: ${dbError.message}`),
            type: 'UPDATE_ERROR',
            originalError: dbError
         }));

         expect(mockQuery).toHaveBeenCalledWith(
             expect.stringContaining('UPDATE'),
             [newRoles, userId]
         );
     });


});
