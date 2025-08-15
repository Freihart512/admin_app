import { describe, it, expect } from 'vitest';
import { AppErrorMapper } from '../app-error-mapper.service';
import { AlreadyValueExistError } from '@domain/user/errors/already-value-exist.error';
import {
  ConcurrencyConflictError,
  RepositoryTimeoutError,
  RepositoryUnavailableError,
  ServiceUnavailableError,
  InvalidFormatError,
  UniqueViolationError,
  RepositoryError,
} from '@shared/errors';
import { AppError } from '@shared/errors/app-error';
import { AppErrorCodes } from '@shared/core/types';

/**
 * Unit tests for the {@link AppErrorMapper} service.  Each test
 * triggers a specific error condition and asserts that the mapper
 * produces an {@link AppError} with the correct code, HTTP status,
 * message prefix and original cause.  The wrap helper is also
 * exercised to ensure it delegates to map on rejection and passes
 * through successful resolutions untouched.
 */
describe('AppErrorMapper', () => {
  const mapper = new AppErrorMapper();

  it('maps AlreadyValueExistError to ALREADY_EXISTS', () => {
    const cause = new AlreadyValueExistError('dup@example.com', 'email');
    try {
      mapper.map(cause, 'users.create');
    } catch (err) {
      const e = err as AppError;
      expect(e.code).toBe(AppErrorCodes.ALREADY_EXISTS);
      expect(e.status).toBe(409);
      expect(e.message).toBe('[users.create] ' + cause.message);
      expect(e.cause).toBe(cause);
    }
  });

  it('maps ConcurrencyConflictError to CONFLICT', () => {
    const cause = new ConcurrencyConflictError('row version mismatch');
    try {
      mapper.map(cause, 'users.update');
    } catch (err) {
      const e = err as AppError;
      expect(e.code).toBe(AppErrorCodes.CONFLICT);
      expect(e.status).toBe(409);
      expect(e.message).toBe('[users.update] concurrency conflict');
      expect(e.cause).toBe(cause);
    }
  });

  it('maps RepositoryTimeoutError to TIMEOUT', () => {
    const cause = new RepositoryTimeoutError('timeout');
    try {
      mapper.map(cause, 'users.find');
    } catch (err) {
      const e = err as AppError;
      expect(e.code).toBe(AppErrorCodes.TIMEOUT);
      expect(e.status).toBe(504);
      expect(e.message).toBe('[users.find] the repository timed out');
      expect(e.cause).toBe(cause);
    }
  });

  it('maps RepositoryUnavailableError to SERVICE_UNAVAILABLE', () => {
    const cause = new RepositoryUnavailableError('offline');
    try {
      mapper.map(cause, 'users.find');
    } catch (err) {
      const e = err as AppError;
      expect(e.code).toBe(AppErrorCodes.SERVICE_UNAVAILABLE);
      expect(e.status).toBe(503);
      expect(e.message).toBe('[users.find] repository is unavailable');
      expect(e.cause).toBe(cause);
    }
  });

  it('maps ServiceUnavailableError to SERVICE_UNAVAILABLE', () => {
    const cause = new ServiceUnavailableError('service down');
    try {
      mapper.map(cause, 'users.list');
    } catch (err) {
      const e = err as AppError;
      expect(e.code).toBe(AppErrorCodes.SERVICE_UNAVAILABLE);
      expect(e.status).toBe(503);
      expect(e.message).toBe('[users.list] repository is unavailable');
      expect(e.cause).toBe(cause);
    }
  });

  it('maps InvalidFormatError to VALIDATION', () => {
    const cause = new InvalidFormatError('bad data');
    try {
      mapper.map(cause, 'users.parse');
    } catch (err) {
      const e = err as AppError;
      expect(e.code).toBe(AppErrorCodes.VALIDATION);
      expect(e.status).toBe(422);
      expect(e.message).toBe('[users.parse] data format is invalid');
      expect(e.cause).toBe(cause);
    }
  });

  it('maps UniqueViolationError to ALREADY_EXISTS', () => {
    const cause = new UniqueViolationError('unique violation');
    try {
      mapper.map(cause, 'users.create');
    } catch (err) {
      const e = err as AppError;
      expect(e.code).toBe(AppErrorCodes.ALREADY_EXISTS);
      expect(e.status).toBe(409);
      expect(e.message).toBe('[users.create] duplicate value found');
      expect(e.cause).toBe(cause);
    }
  });

  it('maps RepositoryError to SERVICE_UNAVAILABLE', () => {
    const cause = new RepositoryError('generic repository error');
    try {
      mapper.map(cause, 'users.action');
    } catch (err) {
      const e = err as AppError;
      expect(e.code).toBe(AppErrorCodes.SERVICE_UNAVAILABLE);
      expect(e.status).toBe(503);
      expect(e.message).toBe('[users.action] repository error occurred');
      expect(e.cause).toBe(cause);
    }
  });

  it('maps unknown errors to UNKNOWN', () => {
    const cause = new Error('unexpected');
    try {
      mapper.map(cause, 'users.unknown');
    } catch (err) {
      const e = err as AppError;
      expect(e.code).toBe(AppErrorCodes.UNKNOWN);
      expect(e.status).toBe(500);
      expect(e.message).toBe('[users.unknown] unexpected error occurred');
      expect(e.cause).toBe(cause);
    }
  });

  it('wrap returns resolved values and maps rejected values', async () => {
    // wrap should simply return the resolved value
    const result = await mapper.wrap(Promise.resolve(42), 'ctx');
    expect(result).toBe(42);

    // wrap should map the error when the promise rejects
    const rejection = mapper.wrap(
      Promise.reject(new InvalidFormatError('bad format')),
      'test',
    );
    await expect(rejection).rejects.toBeInstanceOf(AppError);
  });
});
