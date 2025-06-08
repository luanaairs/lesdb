import Link from 'next/link';
import { Film } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

export function Logo() {
  const { t } = useTranslations();
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Film className="h-7 w-7 text-primary transition-transform group-hover:rotate-[-15deg] group-hover:scale-110" />
      <span className="font-headline text-2xl font-bold text-primary">
        {t('appName')}
      </span>
    </Link>
  );
}
