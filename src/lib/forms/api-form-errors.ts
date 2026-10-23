import { useCallback, useState } from "react";
import { getApiError } from "@/lib/api/error-utils";

export function useApiFormErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const capture = useCallback((error: unknown) => {
    const apiError = getApiError(error);
    setErrors(apiError.fields);
    const firstPath = Object.keys(apiError.fields)[0];
    if (firstPath && typeof window !== "undefined") {
      window.setTimeout(() => {
        const [name] = firstPath.split(".");
        const element = document.querySelector<HTMLElement>(
          `[name="${CSS.escape(firstPath)}"], [name="${CSS.escape(name)}"], [data-field-path="${CSS.escape(firstPath)}"]`,
        );
        element?.focus();
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
    }
    return apiError;
  }, []);

  const clear = useCallback((path?: string) => {
    if (!path) {
      setErrors({});
      return;
    }
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(next)) {
        if (key === path || key.startsWith(`${path}.`)) delete next[key];
      }
      return next;
    });
  }, []);

  const focusFirst = useCallback(() => {
    const path = Object.keys(errors)[0];
    if (!path || typeof document === "undefined") return;
    const [name] = path.split(".");
    const element = document.querySelector<HTMLElement>(
      `[name="${CSS.escape(path)}"], [name="${CSS.escape(name)}"], [data-field-path="${CSS.escape(path)}"]`,
    );
    element?.focus();
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [errors]);

  return {
    errors,
    capture,
    clear,
    focusFirst,
    get: (path: string) => errors[path],
  };
}
