import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../domain/services/IPasswordHasher';
import { IAuditLogRepository } from '../domain/repositories/IAuditLogRepository';

import { PostgresUserRepository } from '../infrastructure/database/repositories/PostgresUserRepository';
import { PostgresAuditLogRepository } from '../infrastructure/database/repositories/PostgresAuditLogRepository';
import { BCryptPasswordHasher } from '../infrastructure/services/BCryptPasswordHasher';
import { JwtAuthTokenGenerator } from '../infrastructure/services/JwtAuthTokenGenerator';
import { InMemoryEventDispatcher } from '../infrastructure/event-dispatcher/InMemoryEventDispatcher';

import { LoginUseCase } from '../application/use-cases/authentication/LoginUseCase';

import { AuditLogEventHandler } from '../application/event-handlers/AuditLogEventHandler';

import { IEventDispatcher } from '../shared/events/IEventDispatcher';
import { UserLoggedInEvent } from '../shared/events/authentication/UserLoggedInEvent';
import { UserLoginFailedEvent } from '../shared/events/authentication/UserLoginFailedEvent';

import { HandlerExecutionFailedEvent } from '../shared/events/application/HandlerExecutionFailedEvent';

import { pool } from '../infrastructure/database';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}
const passwordHasher: IPasswordHasher = new BCryptPasswordHasher();
const authTokenGenerator = new JwtAuthTokenGenerator(jwtSecret);

const eventDispatcher: IEventDispatcher = new InMemoryEventDispatcher();

const userRepository: IUserRepository = new PostgresUserRepository(pool);
const auditLogRepository: IAuditLogRepository = new PostgresAuditLogRepository(pool);

const auditLogEventHandler = new AuditLogEventHandler(auditLogRepository);

eventDispatcher.subscribe(
  UserLoggedInEvent.type,
  auditLogEventHandler.handleUserLoggedInEvent.bind(auditLogEventHandler)
);
eventDispatcher.subscribe(
  UserLoginFailedEvent.type,
  auditLogEventHandler.handleUserLoginFailedEvent.bind(auditLogEventHandler)
);

eventDispatcher.subscribe(
  HandlerExecutionFailedEvent.type,
  auditLogEventHandler.handleHandlerExecutionFailedEvent.bind(auditLogEventHandler)
);

const loginUseCase = new LoginUseCase(
  userRepository,
  passwordHasher,
  authTokenGenerator,
  eventDispatcher
);

export { loginUseCase };
