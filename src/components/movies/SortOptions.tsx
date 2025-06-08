"use client";

import { useTranslations } from '@/hooks/useTranslations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export type SortKey = 'titleAsc' | 'titleDesc' | 'yearNewest' | 'yearOldest' | 'imdbHighest' | 'imdbLowest';

interface SortOptionsProps {
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
}

export function SortOptions({ sortKey, onSortChange }: SortOptionsProps) {
  const { t } = useTranslations();

  const sortOptionsMap: { value: SortKey; labelKey: string }[] = [
    { value: 'titleAsc', labelKey: 'sortOptions.titleAsc' },
    { value: 'titleDesc', labelKey: 'sortOptions.titleDesc' },
    { value: 'yearNewest', labelKey: 'sortOptions.yearNewest' },
    { value: 'yearOldest', labelKey: 'sortOptions.yearOldest' },
    { value: 'imdbHighest', labelKey: 'sortOptions.imdbHighest' },
    { value: 'imdbLowest', labelKey: 'sortOptions.imdbLowest' },
  ];

  return (
    <div className="flex items-center gap-2 mb-6">
      <Label htmlFor="sort-movies" className="text-sm font-medium">
        {t('sortBy')}:
      </Label>
      <Select value={sortKey} onValueChange={(value) => onSortChange(value as SortKey)}>
        <SelectTrigger id="sort-movies" className="w-auto min-w-[180px] rounded-md border shadow-sm">
          <SelectValue placeholder={t('sortBy')} />
        </SelectTrigger>
        <SelectContent>
          {sortOptionsMap.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {t(option.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
