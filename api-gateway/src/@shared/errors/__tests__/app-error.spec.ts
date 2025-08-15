import { describe, it, expect } from 'vitest';
import { AppError } from '../app-error';
import { AppErrorCode, AppErrorCodes } from '@shared/core/types';

describe('AppError', () => {
  it('should create an instance of AppError with the correct properties', () => {
    const code: AppErrorCode = AppErrorCodes.UNKNOWN;
    const message = 'An unknown error occurred';
    const status = 500;
    const cause = new Error('Original error');

    const error = new AppError(code, message, status, cause);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe('AppError');
    expect(error.code).toBe(code);
    expect(error.message).toBe(message);
    expect(error.status).toBe(status);
    expect(error.cause).toBe(cause);
  });

  it('should create an instance of AppError without a cause', () => {
    const code: AppErrorCode = AppErrorCodes.VALIDATION;
    const message = 'Invalid input format';
    const status = 400;

    const error = new AppError(code, message, status);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe('AppError');
    expect(error.code).toBe(code);
    expect(error.message).toBe(message);
    expect(error.status).toBe(status);
    expect(error.cause).toBeUndefined();
  });
});
