"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/** Runtime label overrides keyed by the live pathname (e.g. a fetched product name). */
type RouteLabels = Record<string, string>;

interface RouteMetaValue {
  labels: RouteLabels;
  setLabel: (href: string, label: string | undefined) => void;
}

const RouteMetaContext = createContext<RouteMetaValue | null>(null);

/**
 * Holds dynamic label overrides for the shell header. A page can register the
 * label for its own route (e.g. the product name) and the breadcrumb/title use
 * it instead of the static `config` label.
 */
export function AdminRouteMetaProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState<RouteLabels>({});

  const setLabel = useCallback((href: string, label: string | undefined) => {
    setLabels((prev) => {
      if (label === undefined) {
        if (!(href in prev)) return prev;
        const next = { ...prev };
        delete next[href];
        return next;
      }
      if (prev[href] === label) return prev;
      return { ...prev, [href]: label };
    });
  }, []);

  return (
    <RouteMetaContext.Provider value={{ labels, setLabel }}>
      {children}
    </RouteMetaContext.Provider>
  );
}

export function useRouteLabels(): RouteLabels {
  return useContext(RouteMetaContext)?.labels ?? {};
}

/**
 * Register the breadcrumb/title label for the current route. Pass a fetched
 * value (e.g. a product name); the override is cleared on unmount or when the
 * value becomes empty.
 */
export function useRouteLabel(label: string | null | undefined) {
  const ctx = useContext(RouteMetaContext);
  const pathname = usePathname();
  const setLabel = ctx?.setLabel;

  useEffect(() => {
    if (!setLabel) return;
    setLabel(pathname, label || undefined);
    return () => setLabel(pathname, undefined);
  }, [setLabel, pathname, label]);
}

/**
 * Drop-in for Server Components that already resolved a dynamic name. Renders
 * nothing; only registers the label for the current route.
 */
export function SetRouteLabel({ label }: { label: string | null | undefined }) {
  useRouteLabel(label);
  return null;
}
