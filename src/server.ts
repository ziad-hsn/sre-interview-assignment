import config from 'config';
import { fastify as Fastify, FastifyInstance } from 'fastify';

import api from './api';
import { initDatabase, closeConnection } from './db/connection';

const INTERFACE: string = config.get('http.interface');
const PORT: number = config.get('http.port');

export const build = () => {
  // Instantiate Fastify
  const server: FastifyInstance = Fastify({
    ajv: {
      customOptions: {
        strict: false,
      },
    },
    logger: true
  });

  server.addHook('onClose', async () => {
    // Close the database connection when the server shuts down
    await closeConnection();
  });

  // Register the API scaffolding plugin.
  server.register(api());

  return server;
};

export const start = async (server: FastifyInstance): Promise<FastifyInstance> => {
  try {
    // Initialize the database
    await initDatabase();

    await server.listen({ port: PORT, host: INTERFACE });
  } catch (err) {
    if (err) {
      server.log.error({ err }, 'Server startup error');
      process.exit(1);
    }
  }

  return server;
};

export default (): Promise<FastifyInstance> => {
  return start(build());
};
