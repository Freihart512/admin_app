
import { UserLoggedInEvent } from '../../shared/events/authentication/UserLoggedInEvent';
import { UserLoginFailedEvent } from '../../shared/events/authentication/UserLoginFailedEvent';
import { HandlerExecutionFailedEvent } from '../../shared/events/application/HandlerExecutionFailedEvent';
import { IAuditLogRepository } from '../../domain/repositories/IAuditLogRepository';

export class AuditLogEventHandler {
  constructor(
    private auditLogRepository: IAuditLogRepository // Inyectamos el repositorio de auditoría
    // private logger: ILogger // Opcional: Inyectar un servicio de logging
  ) {}

  /**
   * Maneja un evento de login exitoso para registrarlo en el log de auditoría.
   * @param event El evento UserLoggedInEvent.
   */
  async handleUserLoggedInEvent(event: UserLoggedInEvent): Promise<void> {
    console.log(`AuditLogEventHandler: Handling UserLoggedInEvent for user ${event.userId}`);
    try {
      // Guardar el evento completo en el repositorio de auditoría
      await this.auditLogRepository.saveEvent(event);
      // console.log('Audit log saved for UserLoggedInEvent.');
       // Opcional: Loguear con un logger externo también
       // this.logger.info('User logged in successfully', { userId: event.userId, email: event.payload.email });

    } catch (error: any) {
      console.error(`Error saving audit log for UserLoggedInEvent (user ${event.userId}):`, error);
      // Si falla el guardado del log de auditoría, solo lo registramos y continuamos.
      // No deberíamos detener el proceso principal solo porque el log de auditoría no se pudo guardar.
      // *** NOTA: Aquí NO emitimos HandlerExecutionFailedEvent para evitar bucles si el fallo ocurre DENTRO de este manejador ***
    }
  }

  /**
   * Maneja un evento de login fallido para registrarlo en el log de auditoría.
   * @param event El evento UserLoginFailedEvent.
   */
  async handleUserLoginFailedEvent(event: UserLoginFailedEvent): Promise<void> {
     console.log(`AuditLogEventHandler: Handling UserLoginFailedEvent for email ${event.payload.email}`);
     try {
        // Guardar el evento completo en el repositorio de auditoría
       await this.auditLogRepository.saveEvent(event);
       // console.log('Audit log saved for UserLoginFailedEvent.');
       // Opcional: Loguear con un logger externo también
       // this.logger.warn('User login failed', { email: event.payload.email, reason: event.payload.reason });

     } catch (error: any) {
       console.error(`Error saving audit log for UserLoginFailedEvent (email ${event.payload.email}):`, error);
        // Si falla el guardado del log de auditoría, solo lo registramos y continuamos.
        // *** NOTA: Aquí NO emitimos HandlerExecutionFailedEvent para evitar bucles si el fallo ocurre DENTRO de este manejador ***
     }
  }

  /**
   * Maneja un evento de fallo de ejecución de manejador para registrarlo en el log de auditoría.
   * Este manejador es crucial para evitar bucles de eventos de error.
   * @param event El evento HandlerExecutionFailedEvent.
   */
  async handleHandlerExecutionFailedEvent(event: HandlerExecutionFailedEvent): Promise<void> {
    console.log(`AuditLogEventHandler: Handling HandlerExecutionFailedEvent for original event type ${event.payload.originalEventType}`);
    try {
      // Guardar el evento completo de fallo de manejador en el repositorio de auditoría
      await this.auditLogRepository.saveEvent(event);
      console.log(`Audit log saved for HandlerExecutionFailedEvent for original event: ${event.payload.originalEventType}`);
      // Opcional: Loguear con un logger externo
      // this.logger.error('Event handler execution failed', event.payload);

    } catch (error: any) {
      // *** Lógica CRÍTICA para evitar bucles: ***
      // Si falla el guardado del log de auditoría para un HandlerExecutionFailedEvent,
      // simplemente logueamos esto como un error FATAL y NO emitimos NINGÚN otro evento.
      console.error('FATAL: Error saving audit log for HandlerExecutionFailedEvent. Potential audit log system issue:', error);
      // No hagas NADA más aquí que pueda lanzar errores o emitir eventos.
    }
  }


   // Añadir métodos manejadores para otros eventos que quieras auditar
   // async handlePasswordResetRequestedEvent(event: PasswordResetRequestedEvent): Promise<void> {
   //    try {
   //        await this.auditLogRepository.saveEvent(event);
   //    } catch (error) {
   //        console.error(`Error saving audit log for PasswordResetRequestedEvent (user ${event.userId}):`, error);
   //    }
   // }
   // ... otros manejadores
}
