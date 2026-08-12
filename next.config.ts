import { readFileSync } from 'node:fs'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'
import pkg from './package.json' with { type: 'json' }

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const storageHostname = process.env.STORAGE_PUBLIC_HOSTNAME?.trim()

/**
 * Release version shown in the CMS.
 *
 * The changelog's top heading is the closest thing this project has to a release
 * marker — `package.json` is not bumped on release. Falls back to the package
 * version when the changelog is absent or has no heading yet.
 */
function resolveReleaseVersion(): string {
  try {
    // Heading depth varies by release type (`#` major, `##` minor/patch) and the
    // version may be wrapped in a compare link, so both are tolerated.
    const heading = readFileSync('./CHANGELOG.md', 'utf8').match(
      /^#{1,3}\s*\[?(\d+\.\d+\.\d+)/m,
    )
    if (heading?.[1]) return heading[1]
  } catch {
    // No changelog in this checkout — fall through.
  }
  return pkg.version
}

/** Identifies the exact build. Set by Vercel and GitHub Actions respectively. */
const commitSha = (
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  ''
).slice(0, 7)

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: resolveReleaseVersion(),
    NEXT_PUBLIC_APP_COMMIT: commitSha,
  },
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
