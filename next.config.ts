import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const storageHostname = process.env.STORAGE_PUBLIC_HOSTNAME?.trim()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(storageHostname
        ? [
            {
              protocol: 'https' as const,
              hostname: storageHostname,
              port: '',
              pathname: '/**',
            },
          ]
        : []),
      // Instagram CDN images (social feed)
      {
        protocol: 'https' as const,
        hostname: '*.cdninstagram.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Logos may be uploaded as SVG. next/image blocks SVG optimization by
    // default (XSS risk from untrusted SVG markup) — the CSP below neuters
    // scripts in the served SVG so it's safe to opt back in.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  telemetry: false,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },
  errorHandler(error) {
    console.warn('[sentry] source map upload failed:', error.message)
  },
})
