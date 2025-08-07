import { SwapiAdapter } from '../adapters/swapi.adapter';
import { Species } from '../types/entities.types';
import { mapToSpecies } from './service-mappers/mapToSpecies';
import { PlanetService } from './planet.service';

export class SpeciesService {
  private swapiAdapter: SwapiAdapter;
  private planetService: PlanetService;

  constructor(swapiAdapter: SwapiAdapter, planetService: PlanetService) {
    this.swapiAdapter = swapiAdapter;
    this.planetService = planetService;
  }

  async getSpeciesById(id: string): Promise<Species> {
    const speciesData = await this.swapiAdapter.getSpecies(id);

    if(!speciesData.homeworld) {
      return mapToSpecies(speciesData, null);
    }

    const planetId = this.extractIdFromUrl(speciesData.homeworld);
    const planetData = await this.planetService.getPlanetById(planetId);

    return mapToSpecies(speciesData, planetData);
  }

  async getAllSpecies(sort?: string, order: 'asc' | 'desc' = 'asc'): Promise<Species[]> {
    const allSpeciesData = await this.swapiAdapter.getAllSpecies();

    const enhancedSpecies = await Promise.all(
      allSpeciesData.map(async (speciesData) => {
        if (!speciesData.homeworld) {
          return mapToSpecies(speciesData, null);
        }

        const planetId = this.extractIdFromUrl(speciesData.homeworld);
        const planetData = await this.planetService.getPlanetById(planetId);

        return mapToSpecies(speciesData, planetData);
      })
    );

    if (sort === 'average_height') {
      return this.sortSpeciesByAverageHeight(enhancedSpecies, order);
    }

    return enhancedSpecies;
  }

  sortSpeciesByAverageHeight(species: Species[], order: 'asc' | 'desc'): Species[] {
    return [...species].sort((a, b) => {
      const heightA = this.parseHeight(a.average_height);
      const heightB = this.parseHeight(b.average_height);

      // Always place nulls at the end regardless of sort order
      if (heightA === null) return 1;
      if (heightB === null) return -1;

      return order === 'asc' ? heightA - heightB : heightB - heightA;
    });
  }

  // Parse the height as a number, return null if it's not a number (like "undefined")
  private parseHeight(height: string): number | null {
    const parsed = parseFloat(height);
    return isNaN(parsed) ? null : parsed;
  }

  private extractIdFromUrl(url: string): string {
    // Remove trailing slash if present
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    // Get the last part of the URL which should be the ID
    return cleanUrl.split('/').pop() || '';
  }
}