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

export type CompareBlockReason = "different-category" | null;

export interface CompareContextValue {
  mode: CompareMode;
  selectedSlugs: string[];
  selectedCategory: string | null;
  blockedReason: CompareBlockReason;
  enterCompareMode: (preselectSlug?: string) => void;
  exitCompareMode: () => void;
  selectProduct: (slug: string, category: string) => void;
  removeProduct: (slug: string) => void;
  isProductSelected: (slug: string) => boolean;
  clearBlocked: () => void;
  setSelectedCategory: (category: string | null) => void;
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

  const [mode, setMode] = useState<CompareMode>(
    initialSlug ? "selecting" : "idle",
  );
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    initialSlug ? [initialSlug] : [],
  );
  // Category name anchoring the comparison (same-category rule). Set when the
  // first product is selected; reset when the selection empties.
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [blockedReason, setBlockedReason] = useState<CompareBlockReason>(null);

  const enterCompareMode = useCallback((preselectSlug?: string) => {
    setSelectedSlugs(preselectSlug ? [preselectSlug] : []);
    setSelectedCategory(null);
    setBlockedReason(null);
    setMode("selecting");
  }, []);

  const exitCompareMode = useCallback(() => {
    setMode("idle");
    setSelectedSlugs([]);
    setSelectedCategory(null);
    setBlockedReason(null);
  }, []);

  const selectProduct = useCallback(
    (slug: string, category: string) => {
      if (selectedSlugs.includes(slug)) {
        // Deselect
        const next = selectedSlugs.filter((s) => s !== slug);
        setSelectedSlugs(next);
        if (next.length === 0) {
          setSelectedCategory(null);
        }
        setBlockedReason(null);
        return;
      }
      if (selectedSlugs.length >= 2) return;
      if (selectedCategory && selectedCategory !== category) {
        // Same-category rule: reject and surface a transient notice.
        setBlockedReason("different-category");
        return;
      }
      const next = [...selectedSlugs, slug];
      setSelectedSlugs(next);
      setBlockedReason(null);
      if (next.length === 1) {
        setSelectedCategory(category);
      }
      if (next.length === 2) {
        setMode("comparing");
      }
    },
    [selectedSlugs, selectedCategory],
  );

  const removeProduct = useCallback(
    (slug: string) => {
      const next = selectedSlugs.filter((s) => s !== slug);
      setSelectedSlugs(next);
      if (next.length === 0) {
        setSelectedCategory(null);
      }
      setMode("selecting");
      setBlockedReason(null);
    },
    [selectedSlugs],
  );

  const isProductSelected = useCallback(
    (slug: string) => selectedSlugs.includes(slug),
    [selectedSlugs],
  );

  const clearBlocked = useCallback(() => setBlockedReason(null), []);

  const value = useMemo<CompareContextValue>(
    () => ({
      mode,
      selectedSlugs,
      selectedCategory,
      blockedReason,
      enterCompareMode,
      exitCompareMode,
      selectProduct,
      removeProduct,
      isProductSelected,
      clearBlocked,
      setSelectedCategory,
    }),
    [
      mode,
      selectedSlugs,
      selectedCategory,
      blockedReason,
      enterCompareMode,
      exitCompareMode,
      selectProduct,
      removeProduct,
      isProductSelected,
      clearBlocked,
      setSelectedCategory,
    ],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}
