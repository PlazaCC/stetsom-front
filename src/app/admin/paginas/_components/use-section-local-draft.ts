"use client";

import type { PageBlock } from "@/api/stetsom/model";
import {
  clearLocalDraft,
  draftSignature,
  useAutosaveDraft,
  useOpeningDraft,
} from "@/hooks/use-local-draft";
import { useMemo } from "react";

type SectionData = Record<string, unknown>;

export function sectionDraftKey(pageId: string, blockId: string): string {
  return `page:${pageId}:${blockId}`;
}

function isSectionData(value: unknown): value is SectionData {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/**
 * Keeps the unsaved edits of the selected section in a local draft. Leaving a
 * section, closing the tab or losing the session keeps them; coming back to
 * the section offers them again. Clear it with `sectionDraftKey` once saved.
 */
export function useSectionLocalDraft(
  pageId: string,
  block: PageBlock | undefined,
  sectionDraft: SectionData | null,
  setSectionDraft: (data: SectionData) => void,
) {
  const key = block ? sectionDraftKey(pageId, block.block_id) : null;
  const baseline = useMemo(
    () => draftSignature(block?.data ?? {}),
    [block?.data],
  );

  const opening = useOpeningDraft<SectionData>(key);
  // A draft identical to the saved section has nothing to give back.
  const offered =
    opening.draft &&
    isSectionData(opening.draft.value) &&
    draftSignature(opening.draft.value) !== baseline
      ? opening.draft
      : null;

  useAutosaveDraft(key, sectionDraft, {
    enabled: !!sectionDraft && !offered,
    base: baseline,
  });

  return {
    draft: offered,
    /** The section was saved again after the draft was written. */
    changedSince: !!offered?.base && offered.base !== baseline,
    restore() {
      if (!offered) return;
      setSectionDraft(offered.value);
      opening.resolve();
    },
    discard() {
      if (key) clearLocalDraft(key);
      opening.resolve();
    },
  };
}
