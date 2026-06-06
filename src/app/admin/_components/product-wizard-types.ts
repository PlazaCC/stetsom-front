import type { LibraryAssetType } from "@/api/stetsom/model";

export type WizardProductStatus = "ACTIVE" | "DISCONTINUED" | "DRAFT";

export interface WizardProductSpec {
  id: string;
  attribute: string;
  value: string;
  order: number;
}

export interface WizardProductVariation {
  id: string;
  label: string;
  order: number;
  specs: WizardProductSpec[];
}

export interface WizardProductFile {
  id: string;
  file_url: string;
  type: LibraryAssetType;
  version: number;
  is_active: boolean;
  name?: string;
}
