import { SwapiAdapter } from '../adapters/swapi.adapter';
import { Planet } from '../types/entities.types';
import { mapToPlanet } from './service-mappers/mapToPlanet';
import { PlanetRepository } from '../repositories/planet.repository';

export class PlanetService {
  private swapiAdapter: SwapiAdapter;
  private planetRepository: PlanetRepository;

  constructor(swapiAdapter: SwapiAdapter, planetRepository: PlanetRepository) {
    this.swapiAdapter = swapiAdapter;
    this.planetRepository = planetRepository;
  }

  async getPlanetById(id: string): Promise<Planet> {
    const planetData = await this.swapiAdapter.getPlanet(id);
    const planetStatus = await this.planetRepository.getPlanetDestructionStatus(id);

    // If planet is not in the database, consider it not destroyed
    const destroyed = planetStatus !== null ? planetStatus : false;

    return mapToPlanet(planetData, destroyed);
  }

  async upsertPlanetDestructionStatus(id: string, destroyed: boolean): Promise<Planet> {
    await this.planetRepository.upsertPlanetDestructionStatus(id, destroyed);

    return this.getPlanetById(id);
  }
}