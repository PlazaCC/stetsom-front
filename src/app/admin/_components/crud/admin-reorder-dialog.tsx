"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AdminActionDialog } from "./admin-action-dialog";
import {
  AdminReorderList,
  type AdminReorderItemMeta,
} from "./admin-reorder-list";

interface AdminReorderDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  items: T[];
  getId: (item: T) => string;
  renderItem: (item: T, meta: AdminReorderItemMeta) => React.ReactNode;
  onSave: (items: T[]) => Promise<void>;
  movableItemId?: string;
  saveLabel?: string;
}

/** API-agnostic reorder workflow with draft, cancel and async save states. */
export function AdminReorderDialog<T>({
  open,
  onOpenChange,
  title,
  description,
  items,
  getId,
  renderItem,
  onSave,
  movableItemId,
  saveLabel = "Salvar ordem",
}: AdminReorderDialogProps<T>) {
  const [draftItems, setDraftItems] = useState(items);
  const [isSaving, setIsSaving] = useState(false);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) setDraftItems(items);
    wasOpen.current = open;
  }, [items, open]);

  const initialIds = useMemo(() => items.map(getId).join("|"), [getId, items]);
  const draftIds = draftItems.map(getId).join("|");
  const isDirty = initialIds !== draftIds;

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(draftItems);
      onOpenChange(false);
    } catch {
      // The feature callback owns user-facing error feedback.
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="lg"
      cancelAction={{
        label: "Cancelar",
        variant: "outline",
        disabled: isSaving,
        onClick: () => onOpenChange(false),
      }}
      primaryAction={{
        label: saveLabel,
        loadingLabel: "Salvando...",
        isLoading: isSaving,
        disabled: !isDirty,
        onClick: () => void handleSave(),
      }}
    >
      <AdminReorderList
        items={draftItems}
        getId={getId}
        movableItemId={movableItemId}
        disabled={isSaving}
        onReorder={setDraftItems}
        renderItem={renderItem}
      />
    </AdminActionDialog>
  );
}

export type { AdminReorderDialogProps };
