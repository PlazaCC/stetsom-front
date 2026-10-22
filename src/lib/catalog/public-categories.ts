import { getApiCategories } from "@/api/stetsom/server/categories-public/categories-public";
import type { PublicCategory } from "@/api/stetsom/model";
import { cache } from "react";

export const getPublicCatalogCategories = cache(
  (apiLocale: "pt" | "en" | "es"): Promise<PublicCategory[]> =>
    getApiCategories({ locale: apiLocale }),
);
