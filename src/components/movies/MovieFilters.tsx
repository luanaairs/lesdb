
"use client";

import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, RotateCcw } from 'lucide-react';
import type { Movie, Filters as AppFilters } from '@/types';

const AVAILABILITY_COUNTRY_OPTIONS = [
  { value: 'BR', labelKey: 'countries.BR' },
  { value: 'US', labelKey: 'countries.US' },
  { value: 'GB', labelKey: 'countries.GB' },
  { value: 'CA', labelKey: 'countries.CA' },
  { value: 'AU', labelKey: 'countries.AU' },
  // Add more as needed
];

interface MovieFiltersProps {
  movies: Movie[];
  filters: AppFilters;
  onFiltersChange: (newFilters: AppFilters) => void;
  onResetFilters: () => void;
}

const ALL_VALUE = "_all_";

const getUniqueOptions = (movies: Movie[] | undefined, key: keyof Movie): {value: string, labelKey: string}[] => {
  if (!movies || !Array.isArray(movies) || movies.length === 0) {
    return [];
  }
  const allValues = new Set<string>();
  movies.forEach(movie => {
    const value = movie[key];
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (typeof item === 'string' && item && item.toLowerCase() !== "explicit") allValues.add(item);
      });
    } else if (typeof value === 'string' && value && value.toLowerCase() !== "explicit") {
      allValues.add(value);
    } else if (typeof value === 'number' && key === 'releaseYear') {
      allValues.add(String(value));
    }
  });
  return Array.from(allValues).sort().map(val => ({ value: val, labelKey: val }));
};


export function MovieFilters({ movies, filters, onFiltersChange, onResetFilters }: MovieFiltersProps) {
  const { t } = useTranslations();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: keyof Omit<AppFilters, 'tags' | 'includeExplicit' | 'availabilityCountry'> | 'availabilityCountry') => (value: string) => {
    onFiltersChange({ ...filters, [name]: value === ALL_VALUE ? (name === 'availabilityCountry' ? 'BR' : '') : value });
  };


  const handleTagChange = (tagValue: string) => {
    const newTags = filters.tags.includes(tagValue)
      ? filters.tags.filter(t => t !== tagValue)
      : [...filters.tags, tagValue];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const handleExplicitChange = (checked: boolean | 'indeterminate') => {
     if (typeof checked === 'boolean') {
        onFiltersChange({ ...filters, includeExplicit: checked });
     }
  };

  const availableCountries = React.useMemo(() => getUniqueOptions(movies, 'countries'), [movies]);
  const availableLanguages = React.useMemo(() => getUniqueOptions(movies, 'languages'), [movies]);
  const availableTags = React.useMemo(() => getUniqueOptions(movies, 'tags'), [movies]);

  return (
    <div className="p-4 space-y-6 flex flex-col"> {/* Removed h-full */}
      <div className="space-y-2">
        <Label htmlFor="searchTerm" className="font-semibold">{t('searchPlaceholder').split(' ')[0]}</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="searchTerm"
            name="searchTerm"
            type="search"
            placeholder={t('searchPlaceholder')}
            value={filters.searchTerm}
            onChange={handleInputChange}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="availabilityCountry" className="font-semibold">{t('availabilityCountry')}</Label>
        <Select
          name="availabilityCountry"
          value={filters.availabilityCountry}
          onValueChange={handleSelectChange('availabilityCountry')}
        >
          <SelectTrigger id="availabilityCountry">
            <SelectValue placeholder={t('availabilityCountry')} />
          </SelectTrigger>
          <SelectContent>
            {AVAILABILITY_COUNTRY_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{t(opt.labelKey, opt.value)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="releaseYear" className="font-semibold">{t('releaseYear')}</Label>
        <Input
          id="releaseYear"
          name="releaseYear"
          type="number"
          placeholder="YYYY"
          value={filters.releaseYear}
          onChange={handleInputChange}
          min="1900"
          max={new Date().getFullYear() + 5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country" className="font-semibold">{t('country')}</Label> {/* Movie production country */}
        <Select
          name="country"
          value={filters.country === '' ? ALL_VALUE : filters.country}
          onValueChange={handleSelectChange('country')}
        >
          <SelectTrigger id="country">
            <SelectValue placeholder={t('allCountries')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>{t('allCountries')}</SelectItem>
            {availableCountries.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{t(`countries.${opt.labelKey.toUpperCase()}`, opt.labelKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language" className="font-semibold">{t('language')}</Label>
        <Select
          name="language"
          value={filters.language === '' ? ALL_VALUE : filters.language}
          onValueChange={handleSelectChange('language')}
        >
          <SelectTrigger id="language">
            <SelectValue placeholder={t('allLanguages')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>{t('allLanguages')}</SelectItem>
            {availableLanguages.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{t(`languages.${opt.labelKey.toUpperCase()}`, opt.labelKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
            <Checkbox
                id="includeExplicit"
                checked={filters.includeExplicit}
                onCheckedChange={handleExplicitChange}
            />
            <Label htmlFor="includeExplicit" className="text-sm font-normal cursor-pointer">
                {t('includeExplicitContent')}
            </Label>
        </div>
      </div>

      <div className="space-y-2 flex-grow flex flex-col min-h-0">
        <Label className="font-semibold">{t('tags')}</Label>
        <ScrollArea className="h-40 rounded-md border p-2">
          <div className="space-y-2">
          {availableTags.filter(tag => tag.value.toLowerCase() !== 'explicit').map(tag => ( // Exclude 'Explicit' from general tags
            <div key={tag.value} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag.value}`}
                checked={filters.tags.includes(tag.value)}
                onCheckedChange={() => handleTagChange(tag.value)}
              />
              <Label htmlFor={`tag-${tag.value}`} className="text-sm font-normal cursor-pointer">
                {t(`movieTags.${tag.labelKey}`, tag.labelKey)}
              </Label>
            </div>
          ))}
          </div>
        </ScrollArea>
      </div>

      <Button onClick={onResetFilters} variant="outline" className="w-full mt-auto">
        <RotateCcw className="mr-2 h-4 w-4" />
        {t('resetFilters')}
      </Button>
    </div>
  );
}
