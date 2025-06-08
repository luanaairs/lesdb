
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { Logo } from '@/components/shared/Logo';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Info, Lightbulb } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

export function Header() {
  const { t } = useTranslations();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <Logo />
        <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex text-sm">
          <Link href="/about">
            <Info className="mr-2 h-4 w-4" />
            {t('about')}
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex text-sm">
          <Link href="/suggest">
            <Lightbulb className="mr-2 h-4 w-4" />
            {t('suggest')}
          </Link>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild className="md:hidden">
          <Link href="/about" aria-label={t('about')}>
            <Info className="h-5 w-5" />
          </Link>
        </Button>
         <Button variant="outline" size="icon" asChild className="md:hidden">
          <Link href="/suggest" aria-label={t('suggest')}>
            <Lightbulb className="h-5 w-5" />
          </Link>
        </Button>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
