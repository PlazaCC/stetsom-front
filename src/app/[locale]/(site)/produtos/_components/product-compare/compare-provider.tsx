"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { toApiLocale } from "@/i18n/locale";
import { getApiProductsSlug } from "@/api/stetsom/endpoints/products-public/products-public";
import type { ProductCardItem } from "@/api/stetsom/model";

export type ComparePreview = Pick<
  ProductCardItem,
  "slug" | "name" | "category" | "thumbnail_url"
>;

export type CompareMode = "idle" | "selecting" | "comparing";

export type CompareBlockReason = "different-category" | null;

export interface CompareContextValue {
  mode: CompareMode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedSlugs: string[];
  selectedCategory: string | null;
  selectedItems: ComparePreview[];
  resolvingFirst: boolean;
  firstLoadError: boolean;
  blockedReason: CompareBlockReason;
  enterCompareMode: (preselectSlug?: string) => void;
  exitCompareMode: () => void;
  selectProduct: (product: ComparePreview) => void;
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
  const locale = toApiLocale(useLocale());

  // URL bridge: initialize state synchronously from URL params so there's no
  // flash of the "idle" UI when deep-linking from the product detail page.
  const [initialSlug] = useState(() =>
    searchParams.get("first_comparation_product_slug"),
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [mode, setMode] = useState<CompareMode>(
    initialSlug ? "selecting" : "idle",
  );
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    initialSlug ? [initialSlug] : [],
  );
  // Category name anchoring the comparison (same-category rule). Set when the
  // first product is selected; reset when the selection empties.
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<ComparePreview[]>([]);
  const firstQuery = useQuery({
    queryKey: ["compare-product", initialSlug, locale],
    queryFn: ({ signal }) =>
      getApiProductsSlug(initialSlug!, { locale }, signal),
    enabled:
      !!initialSlug &&
      selectedSlugs.includes(initialSlug) &&
      !selectedItems.some((item) => item.slug === initialSlug),
    retry: false,
  });
  const firstDetail = firstQuery.data;
  const items = useMemo(() => {
    if (
      !initialSlug ||
      !selectedSlugs.includes(initialSlug) ||
      !firstDetail?.product ||
      !firstDetail.category?.name ||
      selectedItems.some((item) => item.slug === initialSlug)
    )
      return selectedItems;
    return [
      ...selectedItems,
      {
        slug: initialSlug,
        name: firstDetail.product.name,
        category: firstDetail.category.name,
        thumbnail_url:
          [...(firstDetail.product.images ?? [])].sort(
            (a, b) => a.order - b.order,
          )[0]?.image_url ?? null,
      },
    ];
  }, [initialSlug, selectedSlugs, selectedItems, firstDetail]);
  const category =
    selectedCategory ??
    (selectedSlugs.length
      ? (items.find((item) => item.slug === selectedSlugs[0])?.category ?? null)
      : null);
  const resolvingFirst =
    !!initialSlug &&
    selectedSlugs.includes(initialSlug) &&
    !category &&
    firstQuery.isPending;
  const firstLoadError =
    !!initialSlug &&
    selectedSlugs.includes(initialSlug) &&
    !category &&
    !firstQuery.isPending;
  const [blockedReason, setBlockedReason] = useState<CompareBlockReason>(null);

  const enterCompareMode = useCallback((preselectSlug?: string) => {
    setSelectedSlugs(preselectSlug ? [preselectSlug] : []);
    setSelectedItems([]);
    setSelectedCategory(null);
    setBlockedReason(null);
    setMode("selecting");
  }, []);

  const exitCompareMode = useCallback(() => {
    setMode("idle");
    setSelectedSlugs([]);
    setSelectedItems([]);
    setSelectedCategory(null);
    setBlockedReason(null);
  }, []);

  const selectProduct = useCallback(
    (product: ComparePreview) => {
      const { slug, category: productCategory } = product;
      if (selectedSlugs.includes(slug)) {
        // Deselect
        const next = selectedSlugs.filter((s) => s !== slug);
        setSelectedSlugs(next);
        setSelectedItems(items.filter((item) => item.slug !== slug));
        if (next.length === 0) {
          setSelectedCategory(null);
        }
        setBlockedReason(null);
        return;
      }
      if (selectedSlugs.length >= 2 || (selectedSlugs.length > 0 && !category))
        return;
      if (category && category !== productCategory) {
        // Same-category rule: reject and surface a transient notice.
        setBlockedReason("different-category");
        return;
      }
      const next = [...selectedSlugs, slug];
      setSelectedSlugs(next);
      setSelectedItems([...items, product]);
      setBlockedReason(null);
      if (next.length === 1) {
        setSelectedCategory(productCategory);
      }
      if (next.length === 2) {
        setMode("comparing");
      }
    },
    [selectedSlugs, category, items],
  );

  const removeProduct = useCallback(
    (slug: string) => {
      const next = selectedSlugs.filter((s) => s !== slug);
      setSelectedSlugs(next);
      setSelectedItems(items.filter((item) => item.slug !== slug));
      if (next.length === 0) {
        setSelectedCategory(null);
      }
      setMode("selecting");
      setBlockedReason(null);
    },
    [selectedSlugs, items],
  );

  const isProductSelected = useCallback(
    (slug: string) => selectedSlugs.includes(slug),
    [selectedSlugs],
  );

  const clearBlocked = useCallback(() => setBlockedReason(null), []);

  const value = useMemo<CompareContextValue>(
    () => ({
      mode,
      sidebarOpen,
      setSidebarOpen,
      selectedSlugs,
      selectedCategory: category,
      selectedItems: items,
      resolvingFirst,
      firstLoadError,
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
      sidebarOpen,
      selectedSlugs,
      category,
      items,
      resolvingFirst,
      firstLoadError,
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
