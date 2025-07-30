import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugins/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { join } from 'path';

// Importar la instancia de los resolvers de autenticación
import authenticationResolvers from './interfaces/graphql/resolvers/authentication.resolvers';

// Importar la función para conectar la base de datos
import { connectDatabase } from './infrastructure/database'; // <-- Descomentamos la importación


// Cargar y combinar TypeDefs (schemas)
const typeDefs = mergeTypeDefs(loadFilesSync(join(__dirname, './interfaces/graphql/schemas'), { extensions: ['graphql'] }));

// Cargar y combinar Resolvers
const resolvers = mergeResolvers([
  authenticationResolvers,
  // Añade otros objetos de resolvers aquí
]);


// Configurar Apollo Server
interface MyContext {
  // Define la estructura del objeto de contexto
}

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  //plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Asegurarse de que la base de datos esté conectada antes de iniciar el server
async function startServer() {
  try {
    // Probar la conexión a la base de datos (opcional pero recomendado)
    await connectDatabase(); // <-- Descomentamos la llamada
    console.log('Database connection is ready.');

    // Iniciar el servidor Apollo
    await server.start();
    console.log('Apollo Server started.');

    // Aplicar middleware de Apollo Server a Express
    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      bodyParser.json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
           return {}; // Contexto vacío por ahora
        },
      }),
    );

    // Iniciar el servidor HTTP
    const PORT = process.env.PORT || 4000;
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Salir del proceso si hay un error crítico
  }
}

// Iniciar el servidor
startServer();
