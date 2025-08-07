import { Planet, Species } from '../../types/entities.types';
import { SwapiSpecies } from '../../types/swapi.types';

export function mapToSpecies(speciesData: SwapiSpecies, homeworld: Planet | null = null): Species {
  return {
    name: speciesData.name,
    classification: speciesData.classification,
    designation: speciesData.designation,
    average_height: speciesData.average_height,
    skin_colors: speciesData.skin_colors,
    hair_colors: speciesData.hair_colors,
    eye_colors: speciesData.eye_colors,
    average_lifespan: speciesData.average_lifespan,
    homeworld: homeworld,
    language: speciesData.language,
    people: speciesData.people,
    films: speciesData.films,
    created: speciesData.created,
    edited: speciesData.edited,
    url: speciesData.url
  };
}