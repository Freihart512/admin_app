import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { AppErrorMapper } from '@shared/services/app-error-mapper.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, '..', 'schema.gql'),
    }),
    UserModule,
  ],
  controllers: [],
  providers: [AppErrorMapper],
  exports: [AppErrorMapper],
})
export class AppModule {}
