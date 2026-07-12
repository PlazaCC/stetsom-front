"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useGetApiProducts } from "@/api/stetsom/endpoints/products-public/products-public";
import type { ProductCardItem } from "@/api/stetsom/model";
import { toApiLocale } from "@/lib/api/i18n-utils";

/** Minimum characters before we hit the API. */
export const MIN_QUERY_LENGTH = 2;
/** Product suggestions rendered in the dropdown. */
const MAX_SUGGESTIONS = 3;
/** Debounce window between keystrokes and the API request. */
const DEBOUNCE_MS = 300;

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export interface SearchSuggestionsResult {
  /** Up to 3 products matching the query (by name or SKU). */
  suggestions: ProductCardItem[];
  /** Total matches reported by the API (may exceed the 3 shown). */
  total: number;
  /** Matches beyond the 3 shown — drives the "view +N results" row. */
  remaining: number;
  /** True while a request for the current query is in flight. */
  isLoading: boolean;
  /** True once a query is long enough to have triggered a search. */
  isActive: boolean;
}

/**
 * Typeahead search for the header. Debounces the input, queries the public
 * products endpoint (name + SKU match, server-side), and returns at most 3
 * suggestions plus the remaining count for the "view more" affordance.
 */
export function useSearchSuggestions(query: string): SearchSuggestionsResult {
  const locale = useLocale();
  const debounced = useDebouncedValue(query.trim(), DEBOUNCE_MS);
  const isActive = debounced.length >= MIN_QUERY_LENGTH;

  const { data, isFetching } = useGetApiProducts(
    {
      q: debounced,
      pageSize: MAX_SUGGESTIONS + 1,
      status: "PUBLISHED",
      locale: toApiLocale(locale),
    },
    { query: { enabled: isActive } },
  );

  const total = data?.total ?? 0;

  return {
    suggestions: data?.items.slice(0, MAX_SUGGESTIONS) ?? [],
    total,
    remaining: Math.max(0, total - MAX_SUGGESTIONS),
    isLoading: isActive && isFetching,
    isActive,
  };
}
