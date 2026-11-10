"use client";

import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { RecoveryState } from "@/components/ui/recovery-state";

export default function LocaleError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("GlobalError");

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <RecoveryState
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      actionLabel={t("retry")}
      onAction={unstable_retry}
    />
  );
}
