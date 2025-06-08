"use client";

import type { Movie } from '@/types';
import { MovieCard } from './MovieCard';
import { useTranslations } from '@/hooks/useTranslations';

interface MovieListProps {
  movies: Movie[];
}

export function MovieList({ movies }: MovieListProps) {
  const { t } = useTranslations();

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <FilmIcon className="w-16 h-16 mb-4 text-muted-foreground" />
        <p className="text-xl font-semibold text-muted-foreground">{t('noMoviesFound')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

function FilmIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <rect width="7" height="7" x="7" y="7" rx="1" />
      <path d="M3 7h2" />
      <path d="M3 12h2" />
      <path d="M3 17h2" />
      <path d="M19 7h2" />
      <path d="M19 12h2" />
      <path d="M19 17h2" />
      <path d="M7 3v2" />
      <path d="M7 19v2" />
      <path d="M17 3v2" />
      <path d="M17 19v2" />
    </svg>
  )
}
