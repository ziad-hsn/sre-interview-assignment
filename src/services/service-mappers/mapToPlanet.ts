import { Planet } from '../../types/entities.types';
import { SwapiPlanet } from '../../types/swapi.types';

export function mapToPlanet(planetData: SwapiPlanet, destroyed: boolean): Planet {
  return {
    name: planetData.name,
    rotation_period: planetData.rotation_period,
    orbital_period: planetData.orbital_period,
    diameter: planetData.diameter,
    climate: planetData.climate,
    gravity: planetData.gravity,
    terrain: planetData.terrain,
    surface_water: planetData.surface_water,
    population: planetData.population,
    destroyed,
    residents: planetData.residents,
    films: planetData.films,
    created: planetData.created,
    edited: planetData.edited,
    url: planetData.url,
  };
}