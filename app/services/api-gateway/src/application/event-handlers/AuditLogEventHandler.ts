import { IDomainEvent } from '../../../shared/events/IDomainEvent';
// Importamos los eventos específicos que este manejador va a escuchar
import { UserLoggedInEvent, UserLoggedInPayload } from '../../../shared/events/authentication/UserLoggedInEvent';
import { UserLoginFailedEvent, UserLoginFailedPayload } from '../../../shared/events/authentication/UserLoginFailedEvent';
// Importa otros eventos que quieras auditar aquí
// Importamos la interfaz del repositorio de auditoría
import { IAuditLogRepository } from '../../../domain/repositories/IAuditLogRepository';

// Puedes definir una interfaz para un servicio de logging si quieres abstraer la implementación de logging
// interface ILogger { ... }


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
