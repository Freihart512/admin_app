// test/setup.ts
import { vi, beforeEach } from 'vitest';
// Importamos los mocks centralizados
import pgMock from './globalMocks/pg';
import bcryptMock from './globalMocks/bcrypt';
import jsonwebtokenMock from './globalMocks/jsonwebtoken'; // <-- Importamos los mocks de jsonwebtoken


// ---------------------------------

//  Pg Mock

// ---------------------------------
vi.mock('pg', () => pgMock);

// Limpia todos los mocks de pg entre tests
beforeEach(() => {
  pgMock.mockConnect.mockReset();
  pgMock.mockQuery.mockReset();
  pgMock.mockEnd.mockReset();
  pgMock.Pool.mockReset();
});


// ---------------------------------

//  Bcrypt Mock

// ---------------------------------
vi.mock('bcrypt', () => bcryptMock);

// Limpia los mocks de bcrypt entre tests
beforeEach(() => {
  bcryptMock.hash.mockReset();
  bcryptMock.compare.mockReset();
});


// ---------------------------------

//  Jsonwebtoken Mock

// ---------------------------------
vi.mock('jsonwebtoken', () => jsonwebtokenMock); // <-- Mockeamos jsonwebtoken

// Limpia los mocks de jsonwebtoken entre tests
beforeEach(() => {
  jsonwebtokenMock.sign.mockReset(); // <-- Limpiamos el mockSign
  jsonwebtokenMock.verify.mockReset(); // <-- Limpiamos el mockVerify (si lo usas)
});


// Nota: Las funciones de Vitest como describe, it, expect, vi están disponibles globalmente
// si has configurado globals: true en vitest.config.ts.
