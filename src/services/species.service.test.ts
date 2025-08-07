import { SpeciesService } from './species.service';
import { SwapiAdapter } from '../adapters/swapi.adapter';
import { PlanetService } from './planet.service';
import { Planet } from '../types/entities.types';
import { PlanetRepository } from '../repositories/planet.repository';

jest.mock('../adapters/swapi.adapter');
jest.mock('../repositories/planet.repository');
jest.mock('./planet.service');

describe('SpeciesService', () => {
  let speciesService: SpeciesService;
  let mockSwapiAdapter: jest.Mocked<SwapiAdapter>;
  let mockPlanetService: jest.Mocked<PlanetService>;
  let mockPlanetRepository: jest.Mocked<PlanetRepository>;

  const mockPlanet: Planet = {
    name: 'Tatooine',
    rotation_period: '23',
    orbital_period: '304',
    diameter: '10465',
    climate: 'arid',
    gravity: '1 standard',
    terrain: 'desert',
    surface_water: '1',
    population: '200000',
    destroyed: false,
    residents: ['https://swapi.dev/api/people/1/'],
    films: ['https://swapi.dev/api/films/1/'],
    created: '2014-12-09T13:50:49.641000Z',
    edited: '2014-12-20T20:58:18.411000Z',
    url: 'https://swapi.dev/api/planets/1/'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSwapiAdapter = new SwapiAdapter() as jest.Mocked<SwapiAdapter>;
    mockPlanetRepository = new PlanetRepository() as jest.Mocked<PlanetRepository>;
    mockPlanetService = new PlanetService(mockSwapiAdapter, mockPlanetRepository) as jest.Mocked<PlanetService>;

    speciesService = new SpeciesService(mockSwapiAdapter, mockPlanetService);
  });

  describe('getSpeciesById', () => {
    it('should return species with homeworld data when homeworld exists', async () => {
      const mockSpecies = {
        name: 'Human',
        classification: 'mammal',
        designation: 'sentient',
        average_height: '180',
        skin_colors: 'caucasian, black, asian, hispanic',
        hair_colors: 'blonde, brown, black, red',
        eye_colors: 'brown, blue, green, hazel, grey, amber',
        average_lifespan: '120',
        homeworld: 'https://swapi.dev/api/planets/1/',
        language: 'Galactic Basic',
        people: ['https://swapi.dev/api/people/1/'],
        films: ['https://swapi.dev/api/films/1/'],
        created: '2014-12-09T13:50:49.641000Z',
        edited: '2014-12-20T20:58:18.411000Z',
        url: 'https://swapi.dev/api/species/1/'
      };

      mockSwapiAdapter.getSpecies.mockResolvedValue(mockSpecies);
      mockPlanetService.getPlanetById.mockResolvedValue(mockPlanet);

      const result = await speciesService.getSpeciesById('1');

      expect(result).toEqual({
        name: 'Human',
        classification: 'mammal',
        designation: 'sentient',
        average_height: '180',
        skin_colors: 'caucasian, black, asian, hispanic',
        hair_colors: 'blonde, brown, black, red',
        eye_colors: 'brown, blue, green, hazel, grey, amber',
        average_lifespan: '120',
        homeworld: mockPlanet,
        language: 'Galactic Basic',
        people: ['https://swapi.dev/api/people/1/'],
        films: ['https://swapi.dev/api/films/1/'],
        created: '2014-12-09T13:50:49.641000Z',
        edited: '2014-12-20T20:58:18.411000Z',
        url: 'https://swapi.dev/api/species/1/'
      });
      expect(mockSwapiAdapter.getSpecies).toHaveBeenCalledWith('1');
      expect(mockPlanetService.getPlanetById).toHaveBeenCalledWith('1');
    });

    it('should return species with null homeworld when homeworld does not exist', async () => {
      const mockSpecies = {
        name: 'Droid',
        classification: 'artificial',
        designation: 'sentient',
        average_height: 'n/a',
        skin_colors: 'n/a',
        hair_colors: 'n/a',
        eye_colors: 'n/a',
        average_lifespan: 'indefinite',
        homeworld: null,
        language: 'n/a',
        people: ['https://swapi.dev/api/people/2/'],
        films: ['https://swapi.dev/api/films/1/'],
        created: '2014-12-10T15:16:16.259000Z',
        edited: '2014-12-20T21:36:42.139000Z',
        url: 'https://swapi.dev/api/species/2/'
      };

      mockSwapiAdapter.getSpecies.mockResolvedValue(mockSpecies);

      const result = await speciesService.getSpeciesById('2');

      expect(mockSwapiAdapter.getSpecies).toHaveBeenCalledWith('2');
      expect(mockPlanetService.getPlanetById).not.toHaveBeenCalled();
      expect(result).toEqual({
        name: 'Droid',
        classification: 'artificial',
        designation: 'sentient',
        average_height: 'n/a',
        skin_colors: 'n/a',
        hair_colors: 'n/a',
        eye_colors: 'n/a',
        average_lifespan: 'indefinite',
        homeworld: null,
        language: 'n/a',
        people: ['https://swapi.dev/api/people/2/'],
        films: ['https://swapi.dev/api/films/1/'],
        created: '2014-12-10T15:16:16.259000Z',
        edited: '2014-12-20T21:36:42.139000Z',
        url: 'https://swapi.dev/api/species/2/'
      });
    });
  });

  describe('getAllSpecies', () => {
    it('should return all species with homeworld data', async () => {
      const mockSpeciesData = [
        {
          name: 'Human',
          classification: 'mammal',
          designation: 'sentient',
          average_height: '180',
          skin_colors: 'caucasian, black, asian, hispanic',
          hair_colors: 'blonde, brown, black, red',
          eye_colors: 'brown, blue, green, hazel, grey, amber',
          average_lifespan: '120',
          homeworld: 'https://swapi.dev/api/planets/1/',
          language: 'Galactic Basic',
          people: ['https://swapi.dev/api/people/1/'],
          films: ['https://swapi.dev/api/films/1/'],
          created: '2014-12-09T13:50:49.641000Z',
          edited: '2014-12-20T20:58:18.411000Z',
          url: 'https://swapi.dev/api/species/1/'
        }
      ];

      mockSwapiAdapter.getAllSpecies.mockResolvedValue(mockSpeciesData);
      mockPlanetService.getPlanetById.mockResolvedValue(mockPlanet);

      const result = await speciesService.getAllSpecies();

      expect(mockSwapiAdapter.getAllSpecies).toHaveBeenCalled();
      expect(mockPlanetService.getPlanetById).toHaveBeenCalledWith('1');
      expect(result).toEqual([
        {
          name: 'Human',
          classification: 'mammal',
          designation: 'sentient',
          average_height: '180',
          skin_colors: 'caucasian, black, asian, hispanic',
          hair_colors: 'blonde, brown, black, red',
          eye_colors: 'brown, blue, green, hazel, grey, amber',
          average_lifespan: '120',
          homeworld: mockPlanet,
          language: 'Galactic Basic',
          people: ['https://swapi.dev/api/people/1/'],
          films: ['https://swapi.dev/api/films/1/'],
          created: '2014-12-09T13:50:49.641000Z',
          edited: '2014-12-20T20:58:18.411000Z',
          url: 'https://swapi.dev/api/species/1/'
        }
      ]);
    });

    it('should sort species by average height when sort parameter is provided', async () => {
      const mockSpeciesData = [
        {
          name: 'Human',
          classification: 'mammal',
          designation: 'sentient',
          average_height: '180',
          skin_colors: 'caucasian, black, asian, hispanic',
          hair_colors: 'blonde, brown, black, red',
          eye_colors: 'brown, blue, green, hazel, grey, amber',
          average_lifespan: '120',
          homeworld: 'https://swapi.dev/api/planets/1/',
          language: 'Galactic Basic',
          people: ['https://swapi.dev/api/people/1/'],
          films: ['https://swapi.dev/api/films/1/'],
          created: '2014-12-09T13:50:49.641000Z',
          edited: '2014-12-20T20:58:18.411000Z',
          url: 'https://swapi.dev/api/species/1/'
        },
        {
          name: 'Wookie',
          classification: 'mammal',
          designation: 'sentient',
          average_height: '210',
          skin_colors: 'gray',
          hair_colors: 'black, brown',
          eye_colors: 'blue, green, yellow, brown, golden, red',
          average_lifespan: '400',
          homeworld: 'https://swapi.dev/api/planets/1/',
          language: 'Shyriiwook',
          people: ['https://swapi.dev/api/people/13/'],
          films: ['https://swapi.dev/api/films/1/'],
          created: '2014-12-10T16:44:31.486000Z',
          edited: '2014-12-20T21:36:42.142000Z',
          url: 'https://swapi.dev/api/species/3/'
        }
      ];

      mockSwapiAdapter.getAllSpecies.mockResolvedValue(mockSpeciesData);
      mockPlanetService.getPlanetById.mockResolvedValue(mockPlanet);

      // Test ascending order
      const resultAsc = await speciesService.getAllSpecies('average_height', 'asc');

      expect(resultAsc[0].name).toBe('Human'); // 180
      expect(resultAsc[1].name).toBe('Wookie'); // 210

      // Test descending order
      const resultDesc = await speciesService.getAllSpecies('average_height', 'desc');

      expect(resultDesc[0].name).toBe('Wookie'); // 210
      expect(resultDesc[1].name).toBe('Human'); // 180
    });
  });

  describe('sortSpeciesByAverageHeight', () => {
    it('should sort species by average height in ascending order', () => {
      const species = [
        { average_height: '180', name: 'Human' } as any,
        { average_height: '210', name: 'Wookie' } as any,
        { average_height: '66', name: 'Jawa' } as any,
      ];

      const result = speciesService.sortSpeciesByAverageHeight(species, 'asc');

      expect(result[0].name).toBe('Jawa'); // 66
      expect(result[1].name).toBe('Human'); // 180
      expect(result[2].name).toBe('Wookie'); // 210
    });

    it('should sort species by average height in descending order', () => {
      const species = [
        { average_height: '180', name: 'Human' } as any,
        { average_height: '210', name: 'Wookie' } as any,
        { average_height: '66', name: 'Jawa' } as any,
      ];

      const result = speciesService.sortSpeciesByAverageHeight(species, 'desc');

      expect(result[0].name).toBe('Wookie'); // 210
      expect(result[1].name).toBe('Human'); // 180
      expect(result[2].name).toBe('Jawa'); // 66
    });

    it('should place species with non-numeric heights at the end', () => {
      const species = [
        { average_height: '180', name: 'Human' } as any,
        { average_height: 'unknown', name: 'Unknown Species' } as any,
        { average_height: '66', name: 'Jawa' } as any,
      ];

      const result = speciesService.sortSpeciesByAverageHeight(species, 'asc');

      expect(result[0].name).toBe('Jawa'); // 66
      expect(result[1].name).toBe('Human'); // 180
      expect(result[2].name).toBe('Unknown Species'); // unknown
    });
  });
});
