// src/infrastructure/database/error-mapper.ts
import {
  RepositoryError,
  RepositoryUnavailableError,
  RepositoryTimeoutError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  ConcurrencyConflictError,
  ServiceUnavailableError,
  InvalidFormatError,
} from '@shared/errors';

/**
 * Contexto opcional para enriquecer mensajes o transformar constraints a errores de dominio.
 */
export type DbErrorContext = {
  /** Texto corto útil para logs (e.g. "insert users"). */
  context?: string;
  /**
   * Mapa de nombres de constraints (exactos) a funciones que lanzan el error deseado.
   * Útil para transformar unique_violation de email/phone/rfc a AlreadyValueExistError, etc.
   */
  constraintToDomain?: Record<string, (err: any) => never>;
};

/**
 * Lanza el error @shared apropiado (o el de dominio si se configura constraintToDomain).
 * Está pensado para Postgres (códigos SQLSTATE) vía node-postgres (pg).
 */
export function mapKyselyPgError(err: any, ctx?: DbErrorContext): never {
  const code = err?.code as string | undefined; // SQLSTATE (ej. '23505')
  const constraint = err?.constraint as string | undefined;
  const column = err?.column as string | undefined;
  const detail = err?.detail as string | undefined;
  const message = err?.message as string | undefined;

  // 1) Si hay un constraint y hay un mapeo explícito a error de dominio, úsalo
  if (
    constraint &&
    ctx?.constraintToDomain &&
    ctx.constraintToDomain[constraint]
  ) {
    return ctx.constraintToDomain[constraint](err);
  }

  // 2) Códigos comunes de Postgres → errores @shared
  switch (code) {
    case '23505': {
      // unique_violation
      const msg = ctx?.context
        ? `${ctx.context}: unique violation (${constraint ?? 'unknown'})`
        : 'unique violation';
      throw new UniqueViolationError(msg);
    }
    case '23502': {
      // not_null_violation
      const msg = ctx?.context
        ? `${ctx.context}: not null violation (${column ?? 'unknown'})`
        : 'not null violation';
      throw new NotNullViolationError(msg);
    }
    case '23503': {
      // foreign_key_violation
      const msg = ctx?.context
        ? `${ctx.context}: foreign key violation (${constraint ?? 'unknown'})`
        : 'foreign key violation';
      throw new ForeignKeyViolationError(msg);
    }
    case '23514': // check_violation
    case '22P02': // invalid_text_representation
    case '22001': // string_data_right_truncation
    case '42804': {
      // datatype_mismatch
      const msg = ctx?.context
        ? `${ctx.context}: invalid format (${detail ?? message ?? ''})`
        : 'invalid format';
      throw new InvalidFormatError(msg);
    }
    case '40001': // serialization_failure
    case '40P01': {
      // deadlock_detected
      const msg = ctx?.context
        ? `${ctx.context}: transaction concurrency conflict`
        : 'transaction concurrency conflict';
      throw new ConcurrencyConflictError(msg);
    }
    case '57014': {
      // query_canceled (p.ej. timeout cancelado por el pool)
      const msg = ctx?.context
        ? `${ctx.context}: repository timeout`
        : 'repository timeout';
      throw new RepositoryTimeoutError(msg);
    }
  }

  // 3) Errores de red/disponibilidad típicos del driver
  const networkCode = err?.code as string | undefined; // algunos drivers reusan 'code'
  if (['ETIMEDOUT'].includes(networkCode ?? '')) {
    const msg = ctx?.context
      ? `${ctx.context}: repository timeout`
      : 'repository timeout';
    throw new RepositoryTimeoutError(msg);
  }
  if (
    ['ECONNREFUSED', 'EAI_AGAIN', 'ENOTFOUND', 'ECONNRESET'].includes(
      networkCode ?? '',
    )
  ) {
    const msg = ctx?.context
      ? `${ctx.context}: repository unavailable`
      : 'repository unavailable';
    throw new RepositoryUnavailableError(msg);
  }

  // 4) Por defecto, error técnico genérico
  const msg = ctx?.context
    ? `${ctx.context}: ${message ?? String(err)}`
    : (message ?? 'repository error');
  throw new RepositoryError(msg);
}

/**
 * Helper para envolver promesas de Kysely con el mapeo anterior.
 */
export async function withDbErrorMapping<T>(
  p: Promise<T>,
  ctx?: DbErrorContext,
): Promise<T> {
  try {
    return await p;
  } catch (err) {
    return mapKyselyPgError(err, ctx);
  }
}
