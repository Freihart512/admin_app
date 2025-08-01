// test/infrastructure/repositories/PostgresAuditLogRepository.test.ts
import { describe, it, expect, vi } from 'vitest';
import { Pool } from 'pg';
import { PostgresAuditLogRepository } from '../../../src/infrastructure/repositories/PostgresAuditLogRepository';
import { IDomainEvent } from '../../../src/shared/events/IDomainEvent';
import { DatabaseError } from '../../../src/infrastructure/errors/DatabaseError';

const fakeEvent: IDomainEvent = {
  type: 'TestEvent',
  timestamp: new Date(),
  payload: { data: 'test' },
};

describe('PostgresAuditLogRepository', () => {
  const mockQuery = vi.fn();
  const mockPool = { query: mockQuery } as unknown as Pool;

  const repository = new PostgresAuditLogRepository(mockPool);

  it('debería guardar un evento correctamente', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });

    await expect(repository.saveEvent(fakeEvent)).resolves.toBeUndefined();

    expect(mockQuery).toHaveBeenCalledOnce();
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO audit_logs'), expect.any(Array));
  });

  it('debería lanzar DatabaseError si falla el query', async () => {
    mockQuery.mockRejectedValueOnce(new Error('db fail'));

    await expect(repository.saveEvent(fakeEvent)).rejects.toThrow(DatabaseError);
  });
});
