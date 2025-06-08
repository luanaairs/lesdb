
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppLayout } from '@/components/layout/AppLayout';
import { MovieFilters } from '@/components/movies/MovieFilters'; // For sidebar consistency
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

export default function SuggestFilmPage() {
  const { t } = useTranslations();
  const { toast } = useToast();

  const SuggestionFormSchema = z.object({
    movieName: z.string().min(1, { message: t('suggestForm.movieNamePlaceholder') }), // Using placeholder as error for simplicity
    links: z.string().optional(),
    tmdbId: z.string().optional().refine(val => !val || /^\d+$/.test(val), {
      message: "TMDB ID must be a number.",
    }),
    reason: z.string().optional(),
  });

  type SuggestionFormValues = z.infer<typeof SuggestionFormSchema>;

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(SuggestionFormSchema),
    defaultValues: {
      movieName: "",
      links: "",
      tmdbId: "",
      reason: "",
    },
  });

  async function onSubmit(data: SuggestionFormValues) {
    console.log("Film Suggestion Submitted:", data);
    // Here you would typically send the data to a backend API
    // For now, we'll just show a success toast
    toast({
      title: t('suggestForm.suggestionThanksTitle'),
      description: t('suggestForm.suggestionThanksDescription'),
    });
    form.reset(); // Reset form after submission
  }

  // Dummy filters for layout consistency
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
      movies={[]} // No movies needed for filter options on this page
      filters={dummyFilters}
      onFiltersChange={() => {}}
      onResetFilters={() => {}}
    />
  );
  
  return (
    <AppLayout sidebarContent={sidebar}>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary text-center">
              {t('suggestFilmPageTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="movieName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('suggestForm.movieNameLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('suggestForm.movieNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tmdbId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('suggestForm.tmdbIdLabel')}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={t('suggestForm.tmdbIdPlaceholder')} {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="links"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('suggestForm.linksLabel')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('suggestForm.linksPlaceholder')}
                          className="resize-y min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Enter one URL per line for Letterboxd, IMDb, Wikipedia, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('suggestForm.reasonLabel')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('suggestForm.reasonPlaceholder')}
                          className="resize-y min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full sm:w-auto">
                  {t('suggestForm.submitButton')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
