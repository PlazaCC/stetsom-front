import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt-BR', 'en', 'es'],
  defaultLocale: 'pt-BR',
  localePrefix: 'always',
  localeDetection: true,
})

export type Locale = (typeof routing.locales)[number]
