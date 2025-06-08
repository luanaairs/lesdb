"use client";

import { useLanguage } from '@/contexts/LanguageProvider';
import type { LocalizedString, Locale } from '@/types';

export const useTranslations = () => {
  const { t, locale } = useLanguage();
  
  const getLocalized = (localizedString?: LocalizedString): string => {
    if (!localizedString) return '';
    return localizedString[locale] || localizedString.en;
  };

  return { t, locale, getLocalized };
};
