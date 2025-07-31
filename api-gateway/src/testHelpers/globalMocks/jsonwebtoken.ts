// src/testHelpers/globalMocks/jsonwebtoken.ts

import { vi } from 'vitest';
// No necesitamos importar la librería jsonwebtoken real aquí si vamos a mockear todos sus métodos

// Mockeamos el método sign de jsonwebtoken
export const mockSign = vi.fn();

// Mockeamos el método verify de jsonwebtoken (si lo vas a usar para verificar tokens, ej. en un middleware)
export const mockVerify = vi.fn();

// Exportamos los mocks como parte del default export para que vi.mock pueda importarlos
export default {
  sign: mockSign,
  verify: mockVerify,
  // Añade otros métodos de jsonwebtoken que uses y necesites mockear
};
