
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import type { Locale, Translations } from '@/types';
import { en } from '@/locales/en';
import { pt } from '@/locales/pt';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Locale, Translations> = { en, pt };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Locale;
    if (['en', 'pt'].includes(browserLang)) {
      setLocaleState(browserLang);
    } else {
      setLocaleState('en'); // Default to English if browser lang is not supported
    }
  }, []);
  
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keyParts = key.split('.');
    let currentResult: any = translations[locale];

    for (const part of keyParts) {
      currentResult = currentResult?.[part];
      if (currentResult === undefined) {
        // Translation not found in current locale, try fallback to English
        currentResult = translations.en; // Reset to base of English translations
        for (const fallbackPart of keyParts) { // Iterate through original key parts for English
          currentResult = currentResult?.[fallbackPart];
          if (currentResult === undefined) {
            // Not found in English either, return the original key
            return key;
          }
        }
        // Found in English, break from the loop examining current locale parts
        break; 
      }
    }
    
    if (typeof currentResult === 'string' && params) {
      return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
        return str.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
      }, currentResult);
    }

    return typeof currentResult === 'string' ? currentResult : key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
