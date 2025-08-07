import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { SwapiAdapter } from '../../adapters/swapi.adapter';
import { SpeciesService } from '../../services/species.service';
import { PlanetRepository } from '../../repositories/planet.repository';
import { PlanetService } from '../../services/planet.service';
import { sanitizeId, sanitizeOrder, sanitizeSort } from '../../utils/sanitize';

const speciesRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const swapiAdapter = new SwapiAdapter();
  const planetRepository = new PlanetRepository();
  const planetService = new PlanetService(swapiAdapter, planetRepository);
  const speciesService = new SpeciesService(swapiAdapter, planetService);

  fastify.get('/species', async (request, reply) => {
    const query = request.query as { sort?: string; order?: string };

    const sort = sanitizeSort(query.sort);
    const order = sanitizeOrder(query.order);

    const species = await speciesService.getAllSpecies(sort, order);
    return { species };
  });

  fastify.get('/species/:id', async (request, reply) => {
    const params = request.params as { id: string };

    const id = sanitizeId(params.id);
    if (!id) {
      reply.code(400);
      return { error: 'Invalid species ID' };
    }

    const species = await speciesService.getSpeciesById(id);
    return { species };
  });
};

export default speciesRoutes;