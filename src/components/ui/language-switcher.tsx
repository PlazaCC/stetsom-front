'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale, routing } from '@/i18n/routing';
import { LocaleFlag } from './flag-icons';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const LOCALE_CODES: Record<Locale, string> = {
  'pt-BR': 'PT',
  en: 'EN',
  es: 'ES',
};

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

export function LanguageSwitcher({ variant = 'light' }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LanguageSwitcher');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function switchLocale(next: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  const isLight = variant === 'light';

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        aria-label={t('label')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition-colors',
          isLight
            ? 'border-border text-muted-foreground hover:border-brand hover:text-brand-dark'
            : 'border-white/20 text-text-subtle-dark hover:border-brand hover:text-white',
        )}
      >
        <LocaleFlag locale={locale} />
        <span className='font-sans font-semibold uppercase tracking-wide'>
          {LOCALE_CODES[locale]}
        </span>
        <ChevronDown
          size={12}
          className={cn(
            'transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            'absolute right-0 top-full mt-1.5 z-50 min-w-32 rounded border shadow-md overflow-hidden',
            isLight
              ? 'bg-white border-border'
              : 'bg-brand-dark border-white/10',
          )}
        >
          {routing.locales.map((loc) => (
            <button
              key={loc}
              type='button'
              onClick={() => switchLocale(loc)}
              className={cn(
                'flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors',
                loc === locale
                  ? isLight
                    ? 'text-brand bg-brand/5'
                    : 'text-brand bg-white/5'
                  : isLight
                    ? 'text-muted-foreground hover:bg-muted hover:text-brand-dark'
                    : 'text-text-subtle-dark hover:bg-white/5 hover:text-white',
              )}
            >
              <LocaleFlag locale={loc as Locale} />
              <span className='font-sans font-semibold uppercase tracking-wide'>
                {LOCALE_CODES[loc as Locale]}
              </span>
              <span className='ml-auto font-sans text-[11px] normal-case tracking-normal opacity-70'>
                {t(loc)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
