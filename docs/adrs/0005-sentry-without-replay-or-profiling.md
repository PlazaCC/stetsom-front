# 0005: Sentry without Session Replay or Profiling

Status: Accepted

## Context

Sentry's Next.js integration offers Session Replay and Profiling as add-ons alongside error, trace, and log telemetry. Both come with costs beyond the base plan that are disproportionate to what this project needs from observability.

## Decision

Session Replay and Profiling are not enabled anywhere in this project. Only error tracking, tracing, and logs are collected, and only in Vercel Production. Without `NEXT_PUBLIC_SENTRY_DSN`, the client, Node.js, and Edge SDKs do not initialize, so local development and Preview deployments send no telemetry at all.

Reasons:

- Replay's free quota is 50 sessions per month, and it captures session and DOM content, a larger sensitive-data surface than error, trace, and log telemetry.
- Profiling requires pay-as-you-go pricing on every Sentry plan tier, including Free.

Automatic collection of user identity, cookies, headers, bodies, query parameters, and stack-frame variables is also disabled. `sentry.server.config.ts` sets `tracePropagationTargets` to `CMS_API_BASE_URL` so sampled traces link the full `browser → Next.js/BFF → stetsom-api` request path into one trace.

## Consequences

Debugging a production issue relies on error reports, trace spans, and logs, not a session recording. Unhandled failures become Sentry Issues. Recovered upstream failures use `warn`/`error` logs, and expected responses such as `404` are not reported. If deeper session-level debugging is ever needed, enabling Replay requires accepting its quota and privacy trade-offs explicitly, not turning it on by default.
