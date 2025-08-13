import { Injectable } from '@nestjs/common';
import {
  RepositoryError,
  RepositoryTimeoutError,
  RepositoryUnavailableError,
  ServiceUnavailableError,
  UniqueViolationError,
  ConcurrencyConflictError,
  InvalidFormatError,
} from '@shared/errors';
import { AlreadyValueExistError } from '@domain/user/errors/already-value-exist.error';
import { AppError } from '../errors';
import { AppErrorCodes } from '../core/types';

@Injectable()
export class AppErrorMapper {
  map(err: unknown, ctx?: string): never {
    const prefix = ctx ? `[${ctx}] ` : '';

    if (err instanceof AlreadyValueExistError) {
      throw new AppError(
        AppErrorCodes.ALREADY_EXISTS,
        prefix + err.message,
        409,
        err,
      );
    }
    if (err instanceof ConcurrencyConflictError) {
      throw new AppError(
        AppErrorCodes.CONFLICT,
        prefix + 'concurrency conflict',
        409,
        err,
      );
    }
    if (err instanceof RepositoryTimeoutError) {
      throw new AppError(
        AppErrorCodes.TIMEOUT,
        prefix + 'the repository timed out',
        504,
        err,
      );
    }
    if (
      err instanceof RepositoryUnavailableError ||
      err instanceof ServiceUnavailableError
    ) {
      throw new AppError(
        AppErrorCodes.SERVICE_UNAVAILABLE,
        prefix + 'repository is unavailable',
        503,
        err,
      );
    }
    if (err instanceof InvalidFormatError) {
      throw new AppError(
        AppErrorCodes.VALIDATION,
        prefix + 'data format is invalid',
        422,
        err,
      );
    }
    if (err instanceof UniqueViolationError) {
      throw new AppError(
        AppErrorCodes.ALREADY_EXISTS,
        prefix + 'duplicate value found',
        409,
        err,
      );
    }
    if (err instanceof RepositoryError) {
      throw new AppError(
        AppErrorCodes.SERVICE_UNAVAILABLE,
        prefix + 'repository error occurred',
        503,
        err,
      );
    }

    throw new AppError(
      AppErrorCodes.UNKNOWN,
      prefix + 'unexpected error occurred',
      500,
      err,
    );
  }

  async wrap<T>(promise: Promise<T>, ctx?: string): Promise<T> {
    try {
      return await promise;
    } catch (e) {
      return this.map(e, ctx);
    }
  }
}
