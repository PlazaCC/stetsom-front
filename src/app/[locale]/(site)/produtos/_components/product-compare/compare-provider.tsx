"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

export type CompareMode = "idle" | "selecting" | "comparing";

export interface CompareContextValue {
  mode: CompareMode;
  selectedSlugs: string[];
  selectedCategory: string | null;
  enterCompareMode: (preselectSlug?: string) => void;
  exitCompareMode: () => void;
  selectProduct: (slug: string) => void;
  removeProduct: (slug: string) => void;
  isProductSelected: (slug: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function useCompareContext(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompareContext must be used within a CompareProvider");
  }
  return ctx;
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  // URL bridge: initialize state synchronously from URL params so there's no
  // flash of the "idle" UI when deep-linking from the product detail page.
  const initialSlug = searchParams.get("first_comparation_product_slug");
  const initialCategory = searchParams.get("category");

  const [mode, setMode] = useState<CompareMode>(
    initialSlug ? "selecting" : "idle",
  );
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    initialSlug ? [initialSlug] : [],
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory ?? null,
  );

  const enterCompareMode = useCallback((preselectSlug?: string) => {
    setSelectedSlugs(preselectSlug ? [preselectSlug] : []);
    setSelectedCategory(null);
    setMode("selecting");
  }, []);

  const exitCompareMode = useCallback(() => {
    setMode("idle");
    setSelectedSlugs([]);
    setSelectedCategory(null);
  }, []);

  const selectProduct = useCallback(
    (slug: string) => {
      if (selectedSlugs.includes(slug)) {
        // Deselect
        const next = selectedSlugs.filter((s) => s !== slug);
        setSelectedSlugs(next);
        if (next.length === 0) {
          setSelectedCategory(null);
        }
        return;
      }
      if (selectedSlugs.length >= 2) return;
      const next = [...selectedSlugs, slug];
      setSelectedSlugs(next);
      if (next.length === 2) {
        setMode("comparing");
      }
    },
    [selectedSlugs],
  );

  const removeProduct = useCallback((slug: string) => {
    setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
    setMode("selecting");
  }, []);

  const isProductSelected = useCallback(
    (slug: string) => selectedSlugs.includes(slug),
    [selectedSlugs],
  );

  const value = useMemo<CompareContextValue>(
    () => ({
      mode,
      selectedSlugs,
      selectedCategory,
      enterCompareMode,
      exitCompareMode,
      selectProduct,
      removeProduct,
      isProductSelected,
    }),
    [
      mode,
      selectedSlugs,
      selectedCategory,
      enterCompareMode,
      exitCompareMode,
      selectProduct,
      removeProduct,
      isProductSelected,
    ],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}
