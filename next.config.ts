import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const storageHostname = process.env.STORAGE_PUBLIC_HOSTNAME?.trim()

const nextConfig: NextConfig = {
  images: {
    ...(storageHostname
      ? {
          remotePatterns: [
            {
              protocol: 'https' as const,
              hostname: storageHostname,
              port: '',
              pathname: '/**',
            },
          ],
        }
      : {}),
    // Logos may be uploaded as SVG. next/image blocks SVG optimization by
    // default (XSS risk from untrusted SVG markup) — the CSP below neuters
    // scripts in the served SVG so it's safe to opt back in.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default withNextIntl(nextConfig)
