import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { join } from 'path';

import authenticationResolvers from './interfaces/graphql/resolvers/authentication.resolvers';
import { connectDatabase } from './infrastructure/database';

const typeDefs = mergeTypeDefs(
  loadFilesSync(join(__dirname, './interfaces/graphql/schemas'), { extensions: ['graphql'] })
);
const resolvers = mergeResolvers([authenticationResolvers]);

interface MyContext {}

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

async function startServer() {
  await connectDatabase();
  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // tu lógica de autenticación, etc.
        return {};
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startServer();
