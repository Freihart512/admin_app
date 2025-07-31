// testHelpers/globalMocks/pg.ts
import { vi } from 'vitest';
import type { Pool } from 'pg';

export const mockConnect = vi.fn();
export const mockQuery = vi.fn();
export const mockEnd = vi.fn();

export const mockPool: Partial<Pool> = {
  connect: mockConnect,
  query: mockQuery,
  end: mockEnd,
};

const mockPoolFactory = vi.fn(() => mockPool);

export default { Pool: mockPoolFactory, mockConnect, mockQuery, mockEnd, mockPool };
