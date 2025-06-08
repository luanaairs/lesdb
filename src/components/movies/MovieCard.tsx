
"use client";

import Image from 'next/image';
import type { Movie } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CalendarDays, Globe, LanguagesIcon, TagsIcon, UserCircle, Star, Tv } from 'lucide-react';
import { Separator } from '../ui/separator';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { t, getLocalized } = useTranslations();

  const getTranslatedList = (items: string[] = [], category: 'countries' | 'languages' | 'movieTags'): string => {
    if (!items || items.length === 0) return '';
    return items.map(itemKey => {
      const translationKey = `${category}.${itemKey}`;
      // Attempt to translate. If the key itself is returned, it means no translation was found.
      // In such cases, use the original itemKey (e.g., an untranslated genre from TMDB).
      let translatedValue = t(translationKey, itemKey); // Pass itemKey as fallback
      if (translatedValue === translationKey || translatedValue === itemKey && category === 'movieTags' && !Object.keys(t('movieTags', {})).includes(itemKey) ) {
        // If translation is the key itself, or for movieTags, if itemKey is not a defined tag key, use itemKey
        return itemKey;
      }
      return translatedValue;
    }).join(', ');
  };

  const platformNameToKey = (platformNameInput: string | undefined | null): string => {
    if (typeof platformNameInput !== 'string' || !platformNameInput.trim()) {
      // console.warn(`[MovieCard] platformNameToKey received invalid platformName: ${platformNameInput}. Defaulting to "Other".`);
      return "Other";
    }
    const platformName = platformNameInput.trim();
    const normalizedName = platformName.toLowerCase().replace(/\s+/g, '').replace('+', 'plus');

    // This mapping should contain lowercase, spaceless, plus-replaced TMDB provider names
    // mapped to the exact keys used in the locale files' `platforms` object.
    const mapping: { [key: string]: string } = {
      "netflix": "Netflix",
      "amazonprimevideo": "PrimeVideo",
      "primevideo": "PrimeVideo",
      "appletvplus": "AppleTV",
      "appletv": "AppleTV",
      "disneyplus": "DisneyPlus",
      "hbomax": "Max", // HBO Max is now Max
      "max": "Max",
      "paramountplus": "ParamountPlus",
      "hulu": "Hulu",
      "mubi": "Mubi",
      "peacock": "Peacock",
      "peacockpremium": "Peacock",
      "globoplay": "Globoplay",
      "starplus": "StarPlus",
      "clarovideo": "ClaroVideo",
      "looke": "Looke",
      "telecineplay": "Telecine",
      "telecine": "Telecine",
      // Add more mappings as you discover TMDB provider names
    };

    if (mapping[normalizedName]) {
      return mapping[normalizedName];
    }
    
    // A more generic attempt to match keys directly if they exist in translations
    // This is less reliable and should ideally be covered by the mapping above
    const directKeyAttempt = Object.keys(t('platforms', {}) as object).find(
        k => k.toLowerCase() === normalizedName
    );
    if (directKeyAttempt) {
        return directKeyAttempt;
    }

    // console.log(`[MovieCard] No specific mapping for platform: "${platformName}" (Normalized: "${normalizedName}"). Defaulting to "Other".`);
    return "Other";
  };


  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl h-full">
      <CardHeader className="p-0">
        <div className="relative h-60 w-full md:h-72">
          <Image
            src={movie.posterUrl}
            alt={getLocalized(movie.title)}
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint="movie poster"
            className="transition-transform duration-300 group-hover:scale-105"
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-3">
        <CardTitle className="font-headline text-xl leading-tight">
          {getLocalized(movie.title)}
        </CardTitle>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>{t('movieCard.year')}: {movie.releaseYear}</span>
          </div>
          {movie.director && (
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-primary" />
              <span>{t('movieCard.director')}: {getLocalized(movie.director)}</span>
            </div>
          )}
          {movie.countries && movie.countries.length > 0 && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>{t('movieCard.countries')}: {getTranslatedList(movie.countries, 'countries')}</span>
            </div>
          )}
          {movie.languages && movie.languages.length > 0 && (
            <div className="flex items-center gap-2">
              <LanguagesIcon className="h-4 w-4 text-primary" />
              <span>{t('movieCard.languages')}: {getTranslatedList(movie.languages, 'languages')}</span>
            </div>
          )}
          {movie.imdbRating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span>IMDb: {movie.imdbRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <CardDescription className="text-sm line-clamp-3">
          {getLocalized(movie.description)}
        </CardDescription>

        {movie.tags && movie.tags.length > 0 && (
          <div className="flex items-start gap-2 pt-2">
            <TagsIcon className="h-4 w-4 text-primary mt-1 shrink-0" />
            <div className="flex flex-wrap gap-1.5">
              {movie.tags.map((tag) => (
                <Badge key={tag} variant={tag.toLowerCase() === "explicit" ? "destructive" : "secondary"} className="text-xs">
                  {t(`movieTags.${tag}`, tag)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-3 border-t p-4 mt-auto">
        {movie.availability && movie.availability.length > 0 && (
          <div className="w-full">
            <h4 className="text-sm font-medium text-foreground mb-1.5">{t('availability')}:</h4>
            <div className="flex flex-wrap gap-2">
              {movie.availability.map((link, index) => {
                const platformKey = platformNameToKey(link.platformName);
                const translatedPlatformName = t(`platforms.${platformKey}`, link.platformName || "Other");
                // console.log(`[MovieCard] Movie: ${getLocalized(movie.title)}, Raw Platform: "${link.platformName}", Key: "${platformKey}", Translated: "${translatedPlatformName}"`);
                return (
                  <Button key={`${link.platformName || 'unknown'}-${index}-${movie.id}`} variant="outline" size="sm" asChild>
                    <a href={link.watchUrl} target="_blank" rel="noopener noreferrer" title={`${t('watchOn')} ${translatedPlatformName}`}>
                      <Tv className="mr-2 h-4 w-4" />
                      {translatedPlatformName}
                    </a>
                  </Button>
                )
              })}
            </div>
             {(movie.letterboxdUrl || movie.tmdbId) && movie.availability.length > 0 && <Separator className="my-3" />}
          </div>
        )}

        <div className="w-full flex flex-col space-y-2">
            {movie.letterboxdUrl && (
              <Button variant="outline" size="sm" asChild className="w-full">
                <a href={movie.letterboxdUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Letterboxd
                </a>
              </Button>
            )}
            {movie.tmdbId && (
              <Button variant="outline" size="sm" asChild className="w-full">
                <a href={`https://www.themoviedb.org/movie/${movie.tmdbId}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  TMDB
                </a>
              </Button>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}


    