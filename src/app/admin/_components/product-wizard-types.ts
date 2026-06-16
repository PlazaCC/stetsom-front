import type { I18nString, LibraryAssetType } from "@/api/stetsom/model";

export interface WizardProductSpec {
  id: string;
  /** Reference to a global attribute (attributes collection). */
  attribute_id: string;
  /** Cached attribute name for display. */
  attribute_name?: I18nString;
  /** Multilingual technical value, e.g. { pt: "8000W RMS" }. */
  value: I18nString;
  order: number;
  /** Highlighted in the product header — limited to 3 across the variant. */
  highlighted: boolean;
}

export interface WizardProductVariation {
  id: string;
  label: string;
  order: number;
  specs: WizardProductSpec[];
}

export interface WizardProductImage {
  id: string;
  /** Present for images already persisted on the product. */
  image_id?: string;
  /** Present for newly added images pending upload. */
  file?: File;
  /** Object URL (new) or remote URL (existing) for preview. */
  preview_url: string;
  order: number;
}

export interface WizardProductFile {
  id: string;
  library_id: string;
  file_url: string;
  type: LibraryAssetType;
  locale?: string;
  is_active: boolean;
  name?: string;
}
