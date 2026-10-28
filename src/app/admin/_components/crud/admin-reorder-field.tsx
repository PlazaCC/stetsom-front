"use client";

import { Button } from "@/components/ui/button";
import { ListOrdered } from "lucide-react";
import { useState } from "react";
import { AdminFormField } from "./admin-form-field";
import {
  AdminReorderDialog,
  type AdminReorderDialogProps,
} from "./admin-reorder-dialog";

interface AdminReorderFieldProps<T> extends Pick<
  AdminReorderDialogProps<T>,
  "items" | "getId" | "renderItem" | "onSave"
> {
  label: string;
  description?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  currentItemId: string;
  disabled?: boolean;
}

/** Form field that shows one item's relative position and opens a reorder dialog. */
export function AdminReorderField<T>({
  label,
  description,
  dialogTitle = "Alterar posição",
  dialogDescription = "Arraste o item destacado ou use as setas para alterar sua posição.",
  items,
  currentItemId,
  getId,
  renderItem,
  onSave,
  disabled = false,
}: AdminReorderFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const currentIndex = items.findIndex((item) => getId(item) === currentItemId);
  const hasPosition = currentIndex >= 0;

  return (
    <>
      <AdminFormField label={label} description={description}>
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-11 w-full justify-between px-3 py-2"
          disabled={disabled || !hasPosition || items.length < 2}
          onClick={() => setOpen(true)}
        >
          <span className="flex items-center gap-2 text-muted-foreground">
            <ListOrdered className="size-4" />
            {hasPosition
              ? `${currentIndex + 1} de ${items.length}`
              : "Posição indisponível"}
          </span>
          <span className="text-foreground">Alterar posição</span>
        </Button>
      </AdminFormField>

      <AdminReorderDialog
        open={open}
        onOpenChange={setOpen}
        title={dialogTitle}
        description={dialogDescription}
        items={items}
        getId={getId}
        movableItemId={currentItemId}
        renderItem={renderItem}
        onSave={onSave}
        saveLabel="Salvar posição"
      />
    </>
  );
}

export type { AdminReorderFieldProps };
