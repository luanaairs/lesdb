
export type Locale = 'en' | 'pt';

export interface LocalizedString {
  en: string;
  pt: string;
}

export interface MovieAvailability {
  platformName: string;
  watchUrl?: string;
}

export interface Movie {
  id: string;
  title: LocalizedString;
  posterUrl: string;
  releaseYear: number;
  countries: string[];
  languages: string[];
  tags: string[]; // "Explicit" will be one of these tags if AI deems it so
  director?: LocalizedString;
  actors?: LocalizedString[];
  description: LocalizedString;
  availability: MovieAvailability[];
  imdbRating?: number;
  letterboxdUrl?: string;
  tmdbId?: number;
}

export interface Translations {
  [key: string]: string | { [nestedKey: string]: string | { [deeperKey: string]: string } };
}

export interface FilterOption {
  value: string;
  label: string;
}

// Add availabilityCountry to Filters
export interface Filters {
  searchTerm: string;
  releaseYear: string;
  country: string;
  language: string;
  tags: string[];
  includeExplicit: boolean;
  availabilityCountry: string; // e.g., 'BR', 'US', 'GB'
}
