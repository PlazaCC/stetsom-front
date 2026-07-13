# Security Policy

## Supported Versions

Stetsom Front is a continuously deployed web application, not a versioned library. Only the version currently deployed to production from the `main` branch is supported.

| Version | Supported |
|---------|-----------|
| `main` (production) | Yes |
| Anything else (older commits, forks, PR previews) | No |

There is no historical version support model. Security fixes land on `develop`, go through the normal release process described in `CONTRIBUTING.md`, and reach production on the next release.

## Reporting a Vulnerability

Report security vulnerabilities using GitHub's private vulnerability reporting feature instead of a public issue:

1. Go to the **Security** tab of this repository.
2. Select **Report a vulnerability**.
3. Fill in the details: affected URL or endpoint, steps to reproduce, and potential impact.

This creates a private draft advisory visible only to maintainers, so no vulnerability details become public before a fix ships.

There is no fixed response-time guarantee. The team treats security reports as a priority and aims to acknowledge them promptly.
