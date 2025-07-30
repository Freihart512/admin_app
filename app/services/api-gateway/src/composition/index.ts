import { Pool } from 'pg';
// Importaciones de Repositorios y Servicios de Dominio
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../domain/services/IPasswordHasher';
import { IAuditLogRepository } from '../domain/repositories/IAuditLogRepository'; // Importamos la interfaz del repositorio de auditoría
// Importaciones de Implementaciones de Infraestructura
import { PostgresUserRepository } from '../infrastructure/database/repositories/PostgresUserRepository';
import { PostgresAuditLogRepository } from '../infrastructure/database/repositories/PostgresAuditLogRepository'; // Importamos la implementación del repositorio de auditoría
import { BCryptPasswordHasher } from '../infrastructure/services/BCryptPasswordHasher';
import { JwtAuthTokenGenerator } from '../infrastructure/services/JwtAuthTokenGenerator';
import { InMemoryEventDispatcher } from '../infrastructure/event-dispatcher/InMemoryEventDispatcher';
// Importaciones de Casos de Uso de Aplicación
import { LoginUseCase } from '../application/use-cases/authentication/LoginUseCase';
// Importaciones de Manejadores de Eventos de Aplicación
import { AuditLogEventHandler } from '../application/event-handlers/AuditLogEventHandler'; // Importamos el manejador de auditoría
// Importaciones de Eventos Compartidos
import { IEventDispatcher } from '../shared/events/IEventDispatcher';
import { UserLoggedInEvent } from '../shared/events/authentication/UserLoggedInEvent'; // Importamos los tipos de eventos para suscribirse
import { UserLoginFailedEvent } from '../shared/events/authentication/UserLoginFailedEvent';
// Importamos otros tipos de eventos que el manejador de auditoría deba escuchar


// Configuración de la base de datos
import { pool } from '../infrastructure/database';

// Configuración de servicios de infraestructura
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error('JWT_SECRET is not defined in environment variables.');
    process.exit(1);
}
const passwordHasher: IPasswordHasher = new BCryptPasswordHasher();
const authTokenGenerator = new JwtAuthTokenGenerator(jwtSecret);

// **Configuración del Event Dispatcher**
const eventDispatcher: IEventDispatcher = new InMemoryEventDispatcher();

// **Configuración de repositorios (inyectamos el pool de DB)**
const userRepository: IUserRepository = new PostgresUserRepository(pool);
const auditLogRepository: IAuditLogRepository = new PostgresAuditLogRepository(pool); // Instanciamos el repositorio de auditoría e inyectamos el pool

// **Configuración de Manejadores de Eventos (inyectamos sus dependencias)**
const auditLogEventHandler = new AuditLogEventHandler(auditLogRepository); // Instanciamos el manejador de auditoría e inyectamos el repositorio de auditoría

// **Configurar Suscripciones de Eventos**
// Suscribimos el manejador de auditoría a los eventos relevantes en el dispatcher
eventDispatcher.subscribe(UserLoggedInEvent.type, auditLogEventHandler.handleUserLoggedInEvent.bind(auditLogEventHandler)); // Suscribimos el manejador de login exitoso
eventDispatcher.subscribe(UserLoginFailedEvent.type, auditLogEventHandler.handleUserLoginFailedEvent.bind(auditLogEventHandler)); // Suscribimos el manejador de login fallido
// Suscribe otros manejadores de eventos de auditoría aquí si los creas para otros eventos


// Configuración de casos de uso (inyectamos sus dependencias, incluyendo el dispatcher)
const loginUseCase = new LoginUseCase(userRepository, passwordHasher, authTokenGenerator, eventDispatcher); // Inyectamos el eventDispatcher
// Instancia otros casos de uso aquí e inyéctales el eventDispatcher si necesitan emitir eventos


// Exporta las instancias de los casos de uso para que los resolvers las puedan utilizar
export {
  loginUseCase,
  // ... otros casos de uso que necesiten ser accesibles desde los resolvers
};

// Nota: La conexión a la base de datos se inicia en src/index.ts
