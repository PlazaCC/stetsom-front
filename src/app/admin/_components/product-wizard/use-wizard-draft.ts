"use client";

import {
  clearLocalDraft,
  draftSignature,
  useAutosaveDraft,
  useOpeningDraft,
} from "@/hooks/use-local-draft";
import { useEffect, useMemo, useState, type Dispatch } from "react";
import {
  draftOf,
  type WizardAction,
  type WizardDraft,
  type WizardState,
} from "./wizard-store";

function draftKey(productId: string | null): string {
  return `product:${productId ?? "new"}`;
}

/** Drafts written by an older editor may lack fields this one reads. */
function isWizardDraft(value: unknown): value is WizardDraft {
  const draft = value as Partial<WizardDraft> | null;
  return (
    !!draft &&
    typeof draft.name?.pt === "string" &&
    Array.isArray(draft.images) &&
    Array.isArray(draft.variations) &&
    Array.isArray(draft.blocks) &&
    Array.isArray(draft.files)
  );
}

/**
 * Keeps the product editor's unsaved work in a local draft, so a closed tab
 * or an expired session does not lose it, and offers it back when the same
 * product (or a new one) is opened again.
 */
export function useWizardDraft(
  state: WizardState,
  dispatch: Dispatch<WizardAction>,
  { deleted }: { deleted: boolean },
) {
  const key = draftKey(state.productId);
  const value = useMemo(() => draftOf(state), [state]);
  const signature = useMemo(() => draftSignature(value), [value]);

  // The product as last loaded or saved. The editor is clean only then, and
  // any edit makes it dirty, so this follows each save.
  const [baseline, setBaseline] = useState(signature);
  if (!state.isDirty && baseline !== signature) setBaseline(signature);

  const opening = useOpeningDraft<WizardDraft>(key);
  // A draft identical to what is saved has nothing to give back.
  const offered =
    opening.draft &&
    isWizardDraft(opening.draft.value) &&
    draftSignature(opening.draft.value) !== baseline
      ? opening.draft
      : null;

  // While a draft is offered, autosaving would overwrite it before the editor
  // answers.
  useAutosaveDraft(key, value, {
    enabled: !offered && signature !== baseline,
    base: baseline,
  });

  // Clean after a save: the product holds the work now. Before the first
  // save of a new product it is clean too, but has no id yet.
  useEffect(() => {
    if (!state.isDirty && state.productId) {
      clearLocalDraft(draftKey(state.productId));
    }
  }, [state.isDirty, state.productId]);

  // Once a new product is created its draft follows the product's own key.
  useEffect(() => {
    if (state.mode === "create" && state.productId) {
      clearLocalDraft(draftKey(null));
    }
  }, [state.mode, state.productId]);

  useEffect(() => {
    if (deleted) clearLocalDraft(key);
  }, [deleted, key]);

  return {
    draft: offered,
    /** The product was saved again after the draft was written. */
    changedSince: !!offered?.base && offered.base !== baseline,
    restore() {
      if (!offered) return;
      dispatch({ type: "restore_draft", draft: offered.value });
      opening.resolve();
    },
    discard() {
      clearLocalDraft(key);
      opening.resolve();
    },
  };
}
