"use client";

import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, Table2, Upload } from "lucide-react";
import type { ViewMode } from "./lib";

interface LibraryContentHeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  total: number;
  uploadLabel: string;
  searchPlaceholder: string;
  onUploadRequest: () => void;
  disabled?: boolean;
}

/**
 * Fixed content header (outside the scroll area): search on the left, and the
 * grid/table view switch + system file-picker upload button on the right.
 */
export function LibraryContentHeader({
  query,
  onQueryChange,
  viewMode,
  onViewModeChange,
  total,
  uploadLabel,
  searchPlaceholder,
  onUploadRequest,
  disabled,
}: LibraryContentHeaderProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-3 border-b bg-card px-5 py-3">
      <AdminSearchInput
        value={query}
        onChange={onQueryChange}
        placeholder={searchPlaceholder}
        className="w-full max-w-64"
      />
      <span className="text-xs text-muted-foreground">
        {total} {total === 1 ? "arquivo" : "arquivos"}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <ToggleGroup
          value={[viewMode]}
          onValueChange={(value: string[]) => {
            const next = value[0] as ViewMode | undefined;
            if (next) onViewModeChange(next);
          }}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="grid" aria-label="Visualizar em grade">
            <LayoutGrid />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Visualizar em tabela">
            <Table2 />
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          type="button"
          size="sm"
          onClick={onUploadRequest}
          disabled={disabled}
        >
          <Upload />
          {uploadLabel}
        </Button>
      </div>
    </div>
  );
}
