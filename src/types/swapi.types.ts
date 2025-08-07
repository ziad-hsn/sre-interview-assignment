export interface SwapiSpecies {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: string | null; // URL
  language: string;
  people: string[]; // URLs
  films: string[]; // URLs
  created: string;
  edited: string;
  url: string;
}

export interface SwapiPlanet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[]; // URLs
  films: string[]; // URLs
  created: string;
  edited: string;
  url: string;
}

export interface SwapiPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}