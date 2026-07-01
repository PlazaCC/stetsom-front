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

/**
 * Stateful tab bar contributed by a page (e.g. the product wizard steps).
 * Unlike the route-based tabs in `config`, these switch in-page state instead
 * of navigating, so the page owns the active index and the select handler.
 */
export interface HeaderStepTabs {
  steps: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

interface RouteMetaValue {
  labels: RouteLabels;
  setLabel: (href: string, label: string | undefined) => void;
  stepTabs: HeaderStepTabs | null;
  setStepTabs: (value: HeaderStepTabs | null) => void;
}

const RouteMetaContext = createContext<RouteMetaValue | null>(null);

/**
 * Holds dynamic label overrides for the shell header. A page can register the
 * label for its own route (e.g. the product name) and the breadcrumb/title use
 * it instead of the static `config` label.
 */
export function AdminRouteMetaProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState<RouteLabels>({});
  const [stepTabs, setStepTabs] = useState<HeaderStepTabs | null>(null);

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
    <RouteMetaContext.Provider
      value={{ labels, setLabel, stepTabs, setStepTabs }}
    >
      {children}
    </RouteMetaContext.Provider>
  );
}

export function useRouteLabels(): RouteLabels {
  return useContext(RouteMetaContext)?.labels ?? {};
}

export function useHeaderStepTabs(): HeaderStepTabs | null {
  return useContext(RouteMetaContext)?.stepTabs ?? null;
}

/**
 * Register a stateful tab bar for the shell header. Pass a memoized value
 * (stable `steps`/`onSelect`, `activeIndex` derived from page state) so the
 * effect only re-runs when the active tab changes. Cleared on unmount.
 */
export function useRegisterStepTabs(value: HeaderStepTabs | null) {
  const ctx = useContext(RouteMetaContext);
  const setStepTabs = ctx?.setStepTabs;

  useEffect(() => {
    if (!setStepTabs) return;
    setStepTabs(value);
    return () => setStepTabs(null);
  }, [setStepTabs, value]);
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
