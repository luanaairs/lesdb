
"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MovieList } from '@/components/movies/MovieList';
import { MovieFilters, type Filters } from '@/components/movies/MovieFilters';
import { SortOptions, type SortKey } from '@/components/movies/SortOptions';
import { sampleMovies } from '@/data/movies';
import type { Movie } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { fetchTmdbMoviesByIds } from '@/ai/flows/fetch-tmdb-movies-flow';
import { Skeleton } from '@/components/ui/skeleton';

const initialFilters: Filters = {
  searchTerm: '',
  releaseYear: '',
  country: '',
  language: '',
  tags: [],
  includeExplicit: true,
  availabilityCountry: 'BR', // Default to Brazil
};

const MOVIE_IDS_TO_FETCH = [
  860159, 762968, 20770, 1544, 1146591, 884139, 1067298, 1093974, 619154, 1019545,
  1311657, 1152092, 531122, 19994, 520172, 426613, 48650, 290098, 370663, 947891,
  948549, 531428, 419743, 1167366, 641, 9303, 641934, 957304, 258480, 1633,
  540, 9382, 568467, 741011, 597219, 273153, 766798, 475888, 1272890, 506281,
  606625, 434714, 294, 535356, 972435, 37636, 971699, 73939, 19316, 330544,
  821390, 19344, 653572, 352498, 687156
];

const MovieCardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[300px] w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sortKey, setSortKey] = useState<SortKey>('yearNewest');
  const { getLocalized, locale, t } = useTranslations();

  const loadMovies = useCallback(async (countryCode: string) => {
    console.log(`[HomePage] loadMovies triggered for country: ${countryCode}.`);
    try {
      setIsLoading(true);
      setError(null);
      console.log(`[HomePage] Attempting to load movies for ${MOVIE_IDS_TO_FETCH.length} TMDB IDs, availability country: ${countryCode}.`);

      const { movies: fetchedMovies } = await fetchTmdbMoviesByIds({
        tmdbMovieIds: MOVIE_IDS_TO_FETCH,
        availabilityCountryCode: countryCode,
      });

      console.log(`[HomePage] Fetched from flow: ${fetchedMovies.length} movies.`);
      if (fetchedMovies.length > 0) {
        setMovies(fetchedMovies);
      } else {
        setError(t('noMoviesFoundForIDs'));
        setMovies(sampleMovies); // Fallback to sample movies if flow returns none
        console.warn("[HomePage] Flow returned 0 movies. Displaying sample movies as fallback.");
      }
    } catch (err) {
      console.error("[HomePage] Failed to fetch movies from TMDB flow. Error object:", err);
      let displayMessage = t('tmdbError');
      if (err instanceof Error && err.message) {
        // displayMessage += `: ${err.message}`; // Avoid showing raw error messages directly
         console.error("[HomePage] Error message:", err.message);
      } else if (typeof err === 'string') {
        // displayMessage += `: ${err}`;
        console.error("[HomePage] Error string:", err);
      }
      setError(displayMessage);
      setMovies(sampleMovies.filter(m => m.title && m.posterUrl));
    } finally {
      setIsLoading(false);
      console.log("[HomePage] loadMovies finished.");
    }
  }, [t]);

  useEffect(() => {
    console.log(`[HomePage] Initial useEffect. Calling loadMovies with country: ${filters.availabilityCountry}`);
    loadMovies(filters.availabilityCountry);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.availabilityCountry, loadMovies]); // Re-fetch when availabilityCountry changes. Removed 'loadMovies' from deps to avoid potential loops if loadMovies itself changed.

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleResetFilters = useCallback(() => {
    const defaultCountry = 'BR'; // Ensure this matches your initial/default logic
    setFilters(initialFilters);
    if (filters.availabilityCountry !== defaultCountry) {
        loadMovies(defaultCountry);
    }
  }, [filters.availabilityCountry, loadMovies]);

  const handleSortChange = useCallback((newSortKey: SortKey) => {
    setSortKey(newSortKey);
  }, []);


  const filteredAndSortedMovies = useMemo(() => {
    let processedMovies: Movie[] = [...movies];

    if (!filters.includeExplicit) {
      processedMovies = processedMovies.filter(movie => 
        !(movie.tags || []).map(tag => tag.toLowerCase()).includes('explicit')
      );
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      processedMovies = processedMovies.filter(movie =>
        getLocalized(movie.title).toLowerCase().includes(term) ||
        (movie.director && getLocalized(movie.director).toLowerCase().includes(term)) ||
        (movie.actors && movie.actors.some(actor => getLocalized(actor).toLowerCase().includes(term)))
      );
    }
    if (filters.releaseYear) {
      processedMovies = processedMovies.filter(movie => movie.releaseYear.toString() === filters.releaseYear);
    }
    if (filters.country) {
      processedMovies = processedMovies.filter(movie => movie.countries.includes(filters.country.toUpperCase()));
    }
    if (filters.language) {
      processedMovies = processedMovies.filter(movie => movie.languages.map(l => l.toUpperCase()).includes(filters.language.toUpperCase()));
    }
    if (filters.tags.length > 0) {
      processedMovies = processedMovies.filter(movie =>
        filters.tags.every(tag => (movie.tags || []).includes(tag))
      );
    }

    processedMovies.sort((a, b) => {
      switch (sortKey) {
        case 'titleAsc':
          return getLocalized(a.title).localeCompare(getLocalized(b.title), locale);
        case 'titleDesc':
          return getLocalized(b.title).localeCompare(getLocalized(a.title), locale);
        case 'yearNewest':
          return b.releaseYear - a.releaseYear;
        case 'yearOldest':
          return a.releaseYear - b.releaseYear;
        case 'imdbHighest':
          return (b.imdbRating ?? 0) - (a.imdbRating ?? 0);
        case 'imdbLowest':
          return (a.imdbRating ?? 0) - (b.imdbRating ?? 0);
        default:
          return 0;
      }
    });
    console.log(`[HomePage] Filtered and sorted ${processedMovies.length} movies. Filters:`, JSON.stringify(filters));
    return processedMovies;
  }, [movies, filters, sortKey, getLocalized, locale]);

  const sidebar = (
    <MovieFilters
      movies={movies} // Pass all fetched movies for filter options
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onResetFilters={handleResetFilters}
    />
  );

  const renderContent = () => {
    if (isLoading && movies.length === 0) {
      console.log("[HomePage] Rendering initial loading skeletons.");
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: Math.min(MOVIE_IDS_TO_FETCH.length, 12) }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error && movies === sampleMovies) { // Checks if fallback to sampleMovies occurred due to error
      console.log(`[HomePage] Rendering error state (fallback to sample): ${error}`);
      return (
        <div className="text-center py-10">
          <p className="text-destructive text-lg mb-2" dangerouslySetInnerHTML={{ __html: error }} />
          <p className="text-muted-foreground mb-4">{t('tmdbErrorSuggestion')}</p>
          <MovieList movies={sampleMovies.filter(m => m.title && m.posterUrl)} />
        </div>
      );
    }
    
    if (!isLoading && movies.length === 0 && !error) { // No movies fetched, no error, not loading.
        console.log("[HomePage] Rendering 'No movies found for IDs' (flow returned 0).");
        return (
             <div className="flex flex-col items-center justify-center h-64 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mb-4 text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" /><rect width="7" height="7" x="7" y="7" rx="1" /><path d="M3 7h2" /><path d="M3 12h2" /><path d="M3 17h2" /><path d="M19 7h2" /><path d="M19 12h2" /><path d="M19 17h2" /><path d="M7 3v2" /><path d="M7 19v2" /><path d="M17 3v2" /><path d="M17 19v2" /></svg>
                 <p className="text-xl font-semibold text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('noMoviesFoundForIDs')}} />
            </div>
        )
    }


    if (!isLoading && filteredAndSortedMovies.length === 0 && movies.length > 0) { // Movies were fetched, but current filters yield no results.
        console.log("[HomePage] Rendering 'No movies found for current filters' message.");
        return (
             <div className="flex flex-col items-center justify-center h-64 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mb-4 text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" /><rect width="7" height="7" x="7" y="7" rx="1" /><path d="M3 7h2" /><path d="M3 12h2" /><path d="M3 17h2" /><path d="M19 7h2" /><path d="M19 12h2" /><path d="M19 17h2" /><path d="M7 3v2" /><path d="M7 19v2" /><path d="M17 3v2" /><path d="M17 19v2" /></svg>
                <p className="text-xl font-semibold text-muted-foreground">{t('noMoviesFound')}</p>
                 {error && <p className="text-sm text-muted-foreground mt-2" dangerouslySetInnerHTML={{ __html: error }} />}
            </div>
        )
    }
    
    console.log(`[HomePage] Rendering MovieList with ${filteredAndSortedMovies.length} movies.`);
    return <MovieList movies={filteredAndSortedMovies} />;
  };

  return (
    <AppLayout sidebarContent={sidebar}>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <SortOptions sortKey={sortKey} onSortChange={handleSortChange} />
      </div>
      {isLoading && movies.length > 0 && movies !== sampleMovies && <div className="text-center py-4">{t('loadingMovies')}</div>}
      {renderContent()}
    </AppLayout>
  );
}

    