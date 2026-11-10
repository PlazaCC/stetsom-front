"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { RecoveryState } from "@/components/ui/recovery-state";

/** Root fallback for failures above the locale segment. Locale-aware failures
 * are handled by [locale]/error.tsx, where next-intl is available. */
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
      <body>
        <RecoveryState
          eyebrow="Erro inesperado"
          title="Não foi possível carregar a página."
          description="Tente novamente em alguns instantes."
          actionLabel="Tentar novamente"
          onAction={unstable_retry}
        />
      </body>
    </html>
  );
}
