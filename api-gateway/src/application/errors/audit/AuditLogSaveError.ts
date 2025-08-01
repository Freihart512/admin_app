export class AuditLogSaveError extends Error {
    public readonly originalEvent: unknown;
    public readonly cause?: Error;
  
    constructor(originalEvent: unknown, cause?: unknown) {
      super('Failed to save audit log event');
      this.name = 'AuditLogSaveError';
      this.originalEvent = originalEvent;
  
      if (cause instanceof Error) {
        this.cause = cause;
        this.stack += `\nCaused by: ${cause.stack}`;
      } else if (typeof cause === 'string') {
        this.cause = new Error(cause);
      } else if (cause !== undefined) {
        this.cause = new Error(JSON.stringify(cause));
      }
    }
  }
  