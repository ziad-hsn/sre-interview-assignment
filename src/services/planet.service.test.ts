import { PlanetService } from './planet.service';
import { SwapiAdapter } from '../adapters/swapi.adapter';
import { PlanetRepository } from '../repositories/planet.repository';
import { SwapiPlanet } from '../types/swapi.types';

jest.mock('../adapters/swapi.adapter');
jest.mock('../repositories/planet.repository');

describe('PlanetService', () => {
  let planetService: PlanetService;
  let mockSwapiAdapter: jest.Mocked<SwapiAdapter>;
  let mockPlanetRepository: jest.Mocked<PlanetRepository>;

  const mockSwapiPlanet: SwapiPlanet = {
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

  beforeEach(() => {
    jest.clearAllMocks();

    mockSwapiAdapter = new SwapiAdapter() as jest.Mocked<SwapiAdapter>;
    mockPlanetRepository = new PlanetRepository() as jest.Mocked<PlanetRepository>;

    planetService = new PlanetService(mockSwapiAdapter, mockPlanetRepository);
  });

  describe('getPlanetById', () => {
    it('should return planet data with destruction status false when planet exists in DB and is not destroyed', async () => {
      mockSwapiAdapter.getPlanet.mockResolvedValue(mockSwapiPlanet);
      mockPlanetRepository.getPlanetDestructionStatus.mockResolvedValue(false);

      const result = await planetService.getPlanetById('1');

      expect(result).toEqual({
        ...mockSwapiPlanet,
        destroyed: false
      });
      expect(mockSwapiAdapter.getPlanet).toHaveBeenCalledWith('1');
      expect(mockPlanetRepository.getPlanetDestructionStatus).toHaveBeenCalledWith('1');
    });

    it('should return planet data with destruction status true when planet exists in DB and is destroyed', async () => {
      mockSwapiAdapter.getPlanet.mockResolvedValue(mockSwapiPlanet);
      mockPlanetRepository.getPlanetDestructionStatus.mockResolvedValue(true);

      const result = await planetService.getPlanetById('1');

      expect(result).toEqual({
        ...mockSwapiPlanet,
        destroyed: true
      });
    });

    it('should return planet data with destruction status false when planet does not exist in DB', async () => {
      mockSwapiAdapter.getPlanet.mockResolvedValue(mockSwapiPlanet);
      mockPlanetRepository.getPlanetDestructionStatus.mockResolvedValue(null);

      const result = await planetService.getPlanetById('1');

      expect(result).toEqual({
        ...mockSwapiPlanet,
        destroyed: false
      });
    });

    it('should not swallow errors from SWAPI', async () => {
      const error = new Error('SWAPI error');
      mockSwapiAdapter.getPlanet.mockRejectedValue(error);

      await expect(planetService.getPlanetById('1')).rejects.toThrow(error);
    });

    it('should not swallow errors from repository', async () => {
      mockSwapiAdapter.getPlanet.mockResolvedValue(mockSwapiPlanet);

      const error = new Error('Repository error');
      mockPlanetRepository.getPlanetDestructionStatus.mockRejectedValue(error);

      await expect(planetService.getPlanetById('1')).rejects.toThrow(error);
    });
  });

  describe('updatePlanetDestructionStatus', () => {
    it('should update planet destruction status and return updated planet', async () => {
      mockPlanetRepository.upsertPlanetDestructionStatus.mockResolvedValue(undefined);
      mockSwapiAdapter.getPlanet.mockResolvedValue(mockSwapiPlanet);
      mockPlanetRepository.getPlanetDestructionStatus.mockResolvedValue(true);

      const result = await planetService.upsertPlanetDestructionStatus('1', true);

      expect(result).toEqual({
        ...mockSwapiPlanet,
        destroyed: true
      });

      expect(mockPlanetRepository.upsertPlanetDestructionStatus).toHaveBeenCalledWith('1', true);
      expect(mockSwapiAdapter.getPlanet).toHaveBeenCalledWith('1');
      expect(mockPlanetRepository.getPlanetDestructionStatus).toHaveBeenCalledWith('1');
    });

    it('should not swallow errors from repository during update', async () => {
      const error = new Error('Update error');
      mockPlanetRepository.upsertPlanetDestructionStatus.mockRejectedValue(error);

      await expect(planetService.upsertPlanetDestructionStatus('1', true)).rejects.toThrow(error);
    });
  });
}); 