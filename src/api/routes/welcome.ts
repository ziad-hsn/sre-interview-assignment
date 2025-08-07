import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async (instance: FastifyInstance) => {
  instance.get(
    '/welcome',
    async (_: FastifyRequest, reply: FastifyReply) => {
      return reply.code(200).send({
        message: 'Welcome to the Float Services Team - Interview Assignment! 🚀🚀🚀'
      });
    },
  );
};
