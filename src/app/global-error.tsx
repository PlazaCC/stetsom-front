"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <main className="max-w-lg text-center">
          <p className="mb-3 text-sm font-semibold tracking-[0.24em] text-red-500 uppercase">
            Erro inesperado
          </p>
          <h1 className="text-3xl font-bold">
            Não foi possível carregar a página.
          </h1>
          <p className="mt-4 text-white/70">
            Tente novamente em alguns instantes.
          </p>
          <button
            type="button"
            onClick={unstable_retry}
            className="mt-8 rounded-md bg-red-600 px-5 py-3 font-semibold transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            Tentar novamente
          </button>
        </main>
      </body>
    </html>
  );
}
