import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { SwapiAdapter } from '../../adapters/swapi.adapter';
import { PlanetService } from '../../services/planet.service';
import { PlanetRepository } from '../../repositories/planet.repository';
import { sanitizeId } from '../../utils/sanitize';

const planetRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const swapiAdapter = new SwapiAdapter();
  const planetRepository = new PlanetRepository();
  const planetService = new PlanetService(swapiAdapter, planetRepository);

  fastify.put('/planets/:id/destruction', async (request, reply) => {
    const params = request.params as { id: string };
    const body = request.body as { destroyed?: boolean };

    const id = sanitizeId(params.id);
    if (!id) {
      reply.code(400);
      return { error: 'Invalid planet ID' };
    }

    if (typeof body.destroyed !== 'boolean') {
      reply.code(400);
      return { error: 'The "destroyed" field must be a boolean value' };
    }

    const planet = await planetService.upsertPlanetDestructionStatus(id, body.destroyed);
    return { planet };
  });
};

export default planetRoutes;