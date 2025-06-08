
"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import { MovieFilters } from '@/components/movies/MovieFilters'; // For sidebar consistency
import { useTranslations } from '@/hooks/useTranslations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  const { t } = useTranslations();

  // Dummy filters for layout consistency, not used on this page
  const dummyFilters = {
    searchTerm: '',
    releaseYear: '',
    country: '',
    language: '',
    tags: [],
    includeExplicit: true,
  };

  const sidebar = (
    <MovieFilters
      movies={[]} // Pass empty array for movies
      filters={dummyFilters}
      onFiltersChange={() => {}}
      onResetFilters={() => {}}
    />
  );
  
  return (
    <AppLayout sidebarContent={sidebar}>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary text-center">
              {t('aboutPageTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg leading-relaxed text-foreground/90">
            <p>
              {t('aboutPageParagraph1')}
            </p>
            <p>
              {t('aboutPageParagraph2')}
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
