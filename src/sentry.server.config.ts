import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    sampleRate: 1,
    tracesSampleRate: 0.1,
    enableLogs: true,
    enableMetrics: false,
    // Links traces from every server-side call to stetsom-api (BFF proxy,
    // auth/upload routes, RSC server functions) into the request that
    // triggered them, instead of showing up as disconnected spans.
    tracePropagationTargets: [process.env.CMS_API_BASE_URL!],
    integrations: [
      Sentry.consoleLoggingIntegration({ levels: ["warn", "error"] }),
    ],
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: { request: false, response: false },
      httpBodies: [],
      queryParams: false,
      genAI: { inputs: false, outputs: false },
      stackFrameVariables: false,
    },
  });
}
