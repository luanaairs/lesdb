
'use server';
/**
 * @fileOverview Fetches movie details from TMDB for a given list of TMDB IDs.
 * Includes fetching actual IMDb rating from OMDb if an imdb_id is available.
 * Also classifies if content is explicit using an AI flow.
 *
 * - fetchTmdbMoviesByIds - A function to fetch movies by their TMDB IDs.
 * - FetchTmdbMoviesByIdsInput - Input type for fetching movies by IDs.
 * - FetchTmdbMoviesByIdsOutput - Output type for fetching movies by IDs.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Movie as AppMovieType, LocalizedString as AppLocalizedString, MovieAvailability } from '@/types';
import { classifyExplicitContent } from './classify-explicit-content-flow';

const FetchTmdbMoviesByIdsInputSchema = z.object({
  tmdbMovieIds: z.array(z.number()).describe('A list of TMDB movie IDs to fetch details for.'),
  availabilityCountryCode: z.string().optional().default('BR').describe('ISO 3166-1 country code for fetching watch provider availability (e.g., BR, US). Defaults to BR.'),
});
export type FetchTmdbMoviesByIdsInput = z.infer<typeof FetchTmdbMoviesByIdsInputSchema>;

const LocalizedStringSchema = z.object({
  en: z.string().optional(),
  pt: z.string().optional(),
}).transform(val => ({ en: val.en || '', pt: val.pt || val.en || '' }));


const AvailabilitySchema = z.object({
  platformName: z.string(),
  watchUrl: z.string().optional(),
});

const MovieSchema = z.object({
  id: z.string(),
  title: LocalizedStringSchema,
  posterUrl: z.string(),
  releaseYear: z.number(),
  countries: z.array(z.string()),
  languages: z.array(z.string()),
  tags: z.array(z.string()),
  director: LocalizedStringSchema.optional(),
  actors: z.array(LocalizedStringSchema).optional(),
  description: LocalizedStringSchema,
  availability: z.array(AvailabilitySchema),
  imdbRating: z.number().optional(),
  letterboxdUrl: z.string().optional(),
  tmdbId: z.number().optional(),
});

const FetchTmdbMoviesByIdsOutputSchema = z.object({
  movies: z.array(MovieSchema),
});
export type FetchTmdbMoviesByIdsOutput = z.infer<typeof FetchTmdbMoviesByIdsOutputSchema>;


export async function fetchTmdbMoviesByIds(input: FetchTmdbMoviesByIdsInput): Promise<FetchTmdbMoviesByIdsOutput> {
  try {
    return await internalFetchTmdbMoviesByIdsFlow(input);
  } catch (error) {
    console.error(`[fetchTmdbMoviesByIds - EXPORTED WRAPPER] Unhandled error. Message: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error && error.stack) {
        console.error(`[fetchTmdbMoviesByIds - EXPORTED WRAPPER] Stack: ${error.stack}`);
    }
    // Return empty movies list as a graceful fallback
    return { movies: [] };
  }
}

const internalFetchTmdbMoviesByIdsFlow = ai.defineFlow(
  {
    name: 'internalFetchTmdbMoviesByIdsFlow',
    inputSchema: FetchTmdbMoviesByIdsInputSchema,
    outputSchema: FetchTmdbMoviesByIdsOutputSchema,
  },
  async (input) => {
    const tmdbApiKey = process.env.TMDB_API_KEY?.trim();
    if (!tmdbApiKey) {
      const errorMsg = 'TMDB_API_KEY is not set or is empty in environment variables. Please configure it correctly in .env or .env.local and restart the server.';
      console.error(`[${internalFetchTmdbMoviesByIdsFlow.name}] ${errorMsg}`);
      return { movies: [] }; 
    }
    console.log(`[${internalFetchTmdbMoviesByIdsFlow.name}] TMDB_API_KEY is present. Availability Country: ${input.availabilityCountryCode}`);

    const omdbApiKey = process.env.OMDB_API_KEY?.trim();
    if (!omdbApiKey) {
      console.warn(`[${internalFetchTmdbMoviesByIdsFlow.name}] OMDB_API_KEY is not set. Actual IMDb ratings will not be fetched. TMDB vote_average will be used as a fallback if available, or imdbRating will be undefined.`);
    }

    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    const fetchedMovies: AppMovieType[] = [];

    for (const movieId of input.tmdbMovieIds) {
      const tmdbUrl = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${tmdbApiKey}&language=en-US&append_to_response=credits,translations,watch/providers`;
      // console.log(`[${internalFetchTmdbMoviesByIdsFlow.name}] Fetching TMDB URL for movie ID ${movieId}:`, tmdbUrl);

      try {
        const tmdbResponse = await fetch(tmdbUrl);
        const rawTMDbDataText = await tmdbResponse.text();

        if (!tmdbResponse.ok) {
          console.error(`[${internalFetchTmdbMoviesByIdsFlow.name}] Failed to fetch movie ID ${movieId} from TMDB. Status: ${tmdbResponse.status} ${tmdbResponse.statusText}. TMDB Response: ${rawTMDbDataText}`);
          continue;
        }

        const tmdbMovie = JSON.parse(rawTMDbDataText);
        // console.log(`[${internalFetchTmdbMoviesByIdsFlow.name}] Movie ID ${movieId} - Title: ${tmdbMovie.title}, Original TMDB Adult Flag: ${tmdbMovie.adult}`);

        if (!tmdbMovie.poster_path || !tmdbMovie.title || !tmdbMovie.release_date) {
            console.warn(`[${internalFetchTmdbMoviesByIdsFlow.name}] Movie ID ${movieId} (${tmdbMovie.title || 'No Title'}) missing essential data (poster, title, or release_date). Skipping.`);
            continue;
        }

        const releaseYear = parseInt(tmdbMovie.release_date.substring(0, 4));

        const ptTranslation = tmdbMovie.translations?.translations?.find((t: any) => t.iso_639_1 === 'pt' && t.data?.title && t.data?.overview);
        const enTitle = tmdbMovie.title || 'Title not available';
        const ptTitle = ptTranslation?.data?.title || enTitle;
        const enOverview = tmdbMovie.overview || 'Overview not available';
        const ptOverview = ptTranslation?.data?.overview || enOverview;

        const title: AppLocalizedString = {
          en: enTitle,
          pt: ptTitle,
        };
        const description: AppLocalizedString = {
          en: enOverview,
          pt: ptOverview,
        };

        let movieTags: string[] = tmdbMovie.genres?.map((genre: any) => genre.name) || [];

        // AI Explicit Classification
        const aiInputTitle = enTitle; 
        const aiInputOverview = enOverview;
        let isExplicitByAI = false;

        if (aiInputTitle && aiInputOverview && aiInputTitle !== 'Title not available' && aiInputOverview !== 'Overview not available') {
          try {
            const explicitClassification = await classifyExplicitContent({
              title: aiInputTitle,
              description: aiInputOverview,
            });
            isExplicitByAI = explicitClassification.isExplicit;
            // console.log(`[${internalFetchTmdbMoviesByIdsFlow.name}] Movie ID ${movieId} (${aiInputTitle}) - AI explicitClassification.isExplicit: ${isExplicitByAI}`);
          } catch (aiError) {
            console.error(`[${internalFetchTmdbMoviesByIdsFlow.name}] Error during AI explicit classification for movie ID ${movieId} (${aiInputTitle}). Message: ${aiError instanceof Error ? aiError.message : String(aiError)}`);
             if (aiError instanceof Error && aiError.stack) {
                console.error(`[${internalFetchTmdbMoviesByIdsFlow.name}] AI Classification Stack: ${aiError.stack}`);
            }
            if (tmdbMovie.adult === true) {
                // console.warn(`[${internalFetchTmdbMoviesByIdsFlow.name}] AI explicit classification failed for ${aiInputTitle}. Using TMDB adult flag: true.`);
                isExplicitByAI = true; 
            }
          }
        } else {
            // console.warn(`[${internalFetchTmdbMoviesByIdsFlow.name}] Movie ID ${movieId} missing English title or overview for AI explicit classification. Using TMDB adult flag for explicit check.`);
            if (tmdbMovie.adult === true) {
                isExplicitByAI = true;
            }
        }
        
        if (isExplicitByAI) {
          movieTags.push("Explicit");
        }
        movieTags = [...new Set(movieTags)];

        const directorData = tmdbMovie.credits?.crew?.find((person: any) => person.job === 'Director');
        const director: AppLocalizedString | undefined = directorData ? {
            en: directorData.name,
            pt: directorData.name
        } : undefined;

        const actors: AppLocalizedString[] = (tmdbMovie.credits?.cast || [])
            .slice(0, 5)
            .map((actor: any) => ({
                en: actor.name,
                pt: actor.name
            }));

        const availability: MovieAvailability[] = [];
        const countryCodeForProviders = input.availabilityCountryCode.toUpperCase();
        const providersData = tmdbMovie['watch/providers']?.results?.[countryCodeForProviders];
        
        // console.log(`[${internalFetchTmdbMoviesByIdsFlow.name}] Movie ID ${movieId} - Providers for ${countryCodeForProviders} - Raw TMDB 'watch/providers':`, JSON.stringify(tmdbMovie['watch/providers']?.results));
        // console.log(`[${internalFetchTmdbMoviesByIdsFlow.name}] Movie ID ${movieId} - Raw flatrate providers for ${countryCodeForProviders} BEFORE de-dup:`, JSON.stringify(providersData?.flatrate));


        if (providersData && providersData.flatrate) {
            const watchUrl = providersData.link; 
            providersData.flatrate.forEach((provider: any) => {
                if (provider.provider_name && typeof provider.provider_name === 'string' && provider.provider_name.trim() !== '') {
                    availability.push({
                        platformName: provider.provider_name.trim(), 
                        watchUrl: watchUrl
                    });
                } else {
                    // console.warn(`[${internalFetchTmdbMoviesByIdsFlow.name}] Movie ID ${movieId} - Invalid or empty provider_name found in flatrate providers for ${countryCodeForProviders}:`, provider.provider_name);
                }
            });
        } else {
            // console.log(`[${internalFetchTmdbMoviesByIdsFlow.name}] No watch provider data or flatrate providers for movie ID ${movieId} in country ${countryCodeForProviders}.`);
        }
        
        const uniqueAvailability = Array.from(new Map(availability.map(item => [item.platformName, item])).values());
        // console.log(`[${internalFetchTmdbMoviesByIdsFlow.name}] Movie ID ${movieId} - Unique availability for ${countryCodeForProviders} AFTER de-duplication:`, JSON.stringify(uniqueAvailability));


        let actualImdbRating: number | undefined = undefined;
        if (omdbApiKey && tmdbMovie.imdb_id) {
          try {
            const omdbUrl = `https://www.omdbapi.com/?i=${tmdbMovie.imdb_id}&apikey=${omdbApiKey}`;
            const omdbResponse = await fetch(omdbUrl);
            if (omdbResponse.ok) {
              const omdbData = await omdbResponse.json();
              if (omdbData.Response === "True" && omdbData.imdbRating && omdbData.imdbRating !== "N/A") {
                const rating = parseFloat(omdbData.imdbRating);
                if (!isNaN(rating)) {
                  actualImdbRating = rating;
                }
              } else if (omdbData.Response === "False") {
                // console.warn(`[${internalFetchTmdbMoviesByIdsFlow.name}] OMDb API error for ${tmdbMovie.imdb_id}: ${omdbData.Error}`);
              }
            } else {
                // console.warn(`[${internalFetchTmdbMoviesByIdsFlow.name}] OMDb request failed for ${tmdbMovie.imdb_id}. Status: ${omdbResponse.status}`);
            }
          } catch (omdbError) {
            console.error(`[${internalFetchTmdbMoviesByIdsFlow.name}] Error fetching/processing OMDb data for ${tmdbMovie.imdb_id}. Message: ${omdbError instanceof Error ? omdbError.message : String(omdbError)}`);
             if (omdbError instanceof Error && omdbError.stack) {
                console.error(`[${internalFetchTmdbMoviesByIdsFlow.name}] OMDb Stack: ${omdbError.stack}`);
            }
          }
        }

        const movieToAdd: AppMovieType = {
          id: String(tmdbMovie.id),
          tmdbId: tmdbMovie.id,
          title,
          posterUrl: `${POSTER_BASE_URL}${tmdbMovie.poster_path}`,
          releaseYear,
          countries: tmdbMovie.production_countries?.map((c: any) => c.iso_3166_1.toUpperCase()) || [],
          languages: tmdbMovie.spoken_languages?.map((l: any) => l.iso_639_1.toUpperCase()) || [tmdbMovie.original_language?.toUpperCase()].filter(Boolean),
          tags: movieTags,
          director,
          actors,
          description,
          availability: uniqueAvailability,
          imdbRating: actualImdbRating,
          letterboxdUrl: tmdbMovie.imdb_id ? `https://letterboxd.com/imdb/${tmdbMovie.imdb_id}/` : undefined,
        };
        fetchedMovies.push(movieToAdd);

      } catch (error) {
        console.error(`[${internalFetchTmdbMoviesByIdsFlow.name}] Error processing movie ID ${movieId}. Message: ${error instanceof Error ? error.message : String(error)}`);
        if (error instanceof Error && error.stack) {
            console.error(`[${internalFetchTmdbMoviesByIdsFlow.name}] Processing Stack for ${movieId}: ${error.stack}`);
        }
      }
    }

    // console.log(`[${internalFetchTmdbMoviesByIdsFlow.name}] Processed ${fetchedMovies.length} movies from the provided IDs.`);
    return { movies: fetchedMovies };
  }
);

