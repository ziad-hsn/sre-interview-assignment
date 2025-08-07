import { SwapiAdapter } from './swapi.adapter';
import { SwapiSpecies, SwapiPlanet, SwapiPaginatedResponse } from '../types/swapi.types';

global.fetch = jest.fn();

describe('SwapiAdapter', () => {
  let swapiAdapter: SwapiAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    swapiAdapter = new SwapiAdapter();
  });

  describe('getSpecies', () => {
    test('should fetch species data successfully', async () => {
      const mockSpecies: SwapiSpecies = {
        name: 'Human',
        classification: 'mammal',
        designation: 'sentient',
        average_height: '180',
        skin_colors: 'caucasian, black, asian, hispanic',
        hair_colors: 'blonde, brown, black, red',
        eye_colors: 'brown, blue, green, hazel, grey, amber',
        average_lifespan: '120',
        homeworld: 'https://swapi.dev/api/planets/9/',
        language: 'Galactic Basic',
        people: ['https://swapi.dev/api/people/1/'],
        films: ['https://swapi.dev/api/films/1/'],
        created: '2014-12-10T13:52:11.567000Z',
        edited: '2014-12-20T21:36:42.136000Z',
        url: 'https://swapi.dev/api/species/1/'
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSpecies)
      });

      const result = await swapiAdapter.getSpecies('1');

      expect(result).toEqual(mockSpecies);
      expect(global.fetch).toHaveBeenCalledWith('https://swapi.dev/api/species/1');
    });

    test('should throw error when species not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const resultPromise = swapiAdapter.getSpecies('999');

      await expect(resultPromise).rejects.toThrow(/^Species with ID 999 not found$/);
      expect(global.fetch).toHaveBeenCalledWith('https://swapi.dev/api/species/999');
    });

    test('should throw error for server errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const resultPromise = swapiAdapter.getSpecies('1');

      await expect(resultPromise).rejects.toThrow(/^Error fetching species: Internal Server Error$/);
      expect(global.fetch).toHaveBeenCalledWith('https://swapi.dev/api/species/1');
    });

    test('should throw error when network fails', async () => {
      const networkError = new Error('Failed to fetch');
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      const resultPromise = swapiAdapter.getSpecies('1');

      await expect(resultPromise).rejects.toThrow(/^Failed to fetch$/);
    });
  });

  describe('getAllSpecies', () => {
    it('should fetch all species across multiple pages', async () => {
      const mockSpecies1 = {
        name: 'Human',
        classification: 'mammal',
        designation: 'sentient',
        average_height: '180',
        skin_colors: 'caucasian, black, asian, hispanic',
        hair_colors: 'blonde, brown, black, red',
        eye_colors: 'brown, blue, green, hazel, grey, amber',
        average_lifespan: '120',
        homeworld: 'https://swapi.dev/api/planets/9/',
        language: 'Galactic Basic',
        people: ['https://swapi.dev/api/people/1/'],
        films: ['https://swapi.dev/api/films/1/'],
        created: '2014-12-10T13:52:11.567000Z',
        edited: '2014-12-20T21:36:42.136000Z',
        url: 'https://swapi.dev/api/species/1/'
      };

      const mockSpecies2 = {
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

      const mockSpecies3 = {
        name: 'Wookie',
        classification: 'mammal',
        designation: 'sentient',
        average_height: '210',
        skin_colors: 'gray',
        hair_colors: 'black, brown',
        eye_colors: 'blue, green, yellow, brown, golden, red',
        average_lifespan: '400',
        homeworld: 'https://swapi.dev/api/planets/14/',
        language: 'Shyriiwook',
        people: ['https://swapi.dev/api/people/13/'],
        films: ['https://swapi.dev/api/films/1/'],
        created: '2014-12-10T16:44:31.486000Z',
        edited: '2014-12-20T21:36:42.142000Z',
        url: 'https://swapi.dev/api/species/3/'
      };

      const mockPage1: SwapiPaginatedResponse<SwapiSpecies> = {
        count: 3,
        next: 'https://swapi.dev/api/species/?page=2',
        previous: null,
        results: [mockSpecies1, mockSpecies2]
      };

      const mockPage2: SwapiPaginatedResponse<SwapiSpecies> = {
        count: 3,
        next: null,
        previous: 'https://swapi.dev/api/species/?page=1',
        results: [mockSpecies3]
      };

      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('page=1')) {
          return Promise.resolve({
            ok: true,
            json: jest.fn().mockResolvedValue(mockPage1)
          });
        } else if (url.includes('page=2')) {
          return Promise.resolve({
            ok: true,
            json: jest.fn().mockResolvedValue(mockPage2)
          });
        } else {
          return Promise.resolve({
            ok: false,
            status: 404,
            statusText: 'Not Found'
          });
        }
      });

      const result = await swapiAdapter.getAllSpecies();

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith('https://swapi.dev/api/species/?page=1');
      expect(global.fetch).toHaveBeenCalledWith('https://swapi.dev/api/species/?page=2');

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Human');
      expect(result[1].name).toBe('Droid');
      expect(result[2].name).toBe('Wookie');
    });

    it('should handle errors during fetching all species', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(swapiAdapter.getAllSpecies()).rejects.toThrow('Error fetching species page: Internal Server Error');

      expect(global.fetch).toHaveBeenCalledWith('https://swapi.dev/api/species/?page=1');
    });

    it('should handle case where there is only one page', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          count: 2,
          next: null,
          previous: null,
          results: [
            { name: 'Human' },
            { name: 'Droid' }
          ]
        })
      });

      const result = await swapiAdapter.getAllSpecies();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('https://swapi.dev/api/species/?page=1');

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Human');
      expect(result[1].name).toBe('Droid');
    });
  });

  describe('getPlanet', () => {
    test('should fetch planet data successfully', async () => {
      const mockPlanet: SwapiPlanet = {
        name: 'Tatooine',
        rotation_period: '23',
        orbital_period: '304',
        diameter: '10465',
        climate: 'arid',
        gravity: '1 standard',
        terrain: 'desert',
        surface_water: '1',
        population: '200000',
        residents: ['https://swapi.dev/api/people/1/'],
        films: ['https://swapi.dev/api/films/1/'],
        created: '2014-12-09T13:50:49.641000Z',
        edited: '2014-12-20T20:58:18.411000Z',
        url: 'https://swapi.dev/api/planets/1/'
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPlanet)
      });

      const result = await swapiAdapter.getPlanet('1');

      expect(result).toEqual(mockPlanet);
      expect(global.fetch).toHaveBeenCalledWith('https://swapi.dev/api/planets/1');
    });

    test('should throw error when planet not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const resultPromise = swapiAdapter.getPlanet('999');

      await expect(resultPromise).rejects.toThrow(/^Planet with ID 999 not found$/);
      expect(global.fetch).toHaveBeenCalledWith('https://swapi.dev/api/planets/999');
    });

    test('should throw error for server errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const resultPromise = swapiAdapter.getPlanet('1');

      await expect(resultPromise).rejects.toThrow(/^Error fetching planet: Internal Server Error$/);
      expect(global.fetch).toHaveBeenCalledWith('https://swapi.dev/api/planets/1');
    });

    test('should throw error when network fails', async () => {
      const networkError = new Error('Failed to fetch');
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      const resultPromise = swapiAdapter.getPlanet('1');

      await expect(resultPromise).rejects.toThrow(/^Failed to fetch$/);
    });
  });
});