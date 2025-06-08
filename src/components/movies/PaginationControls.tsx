
"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
  const { t } = useTranslations();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  // TMDB API has a hard limit of 500 pages
  const displayTotalPages = Math.min(totalPages, 500);


  if (displayTotalPages <= 1) {
    return null; // Don't render pagination if only one page or no pages
  }

  return (
    <div className="flex items-center justify-center space-x-4 my-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage <= 1}
        aria-label={t('pagination.previousPage')}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <span className="text-sm font-medium text-muted-foreground">
        {t('pagination.pageInfo', { currentPage: currentPage, totalPages: displayTotalPages })}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage >= displayTotalPages}
        aria-label={t('pagination.nextPage')}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
