"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

/**
 * Local drafts for CMS editors: what an editor typed survives a closed tab, a
 * crash or an expired session, and is offered back the next time the same
 * record is opened.
 *
 * Drafts live in localStorage under `stetsom:cms-draft:<key>`. Storage can be
 * full, blocked or absent (private windows), so every access is best effort:
 * the editor works the same without it, it just cannot restore.
 */
const PREFIX = "stetsom:cms-draft:";

export interface LocalDraft<T> {
  /** ISO time of the last autosave. */
  savedAt: string;
  value: T;
  /**
   * Signature of the server state the draft was edited from, so the restore
   * prompt can say when the record changed since.
   */
  base?: string;
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function writeLocalDraft<T>(key: string, draft: LocalDraft<T>): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(draft));
  } catch {
    // Quota or blocked storage: autosave is a safety net, not a guarantee.
  }
}

export function clearLocalDraft(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}

/**
 * Short fingerprint of a value, to tell whether a draft differs from what is
 * saved without storing the saved state twice.
 */
export function draftSignature(value: unknown): string {
  const text = JSON.stringify(value) ?? "";
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
  }
  return `${text.length}:${(hash >>> 0).toString(36)}`;
}

function parse<T>(raw: string | null): LocalDraft<T> | null {
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw) as LocalDraft<T>;
    return draft && typeof draft.savedAt === "string" && "value" in draft
      ? draft
      : null;
  } catch {
    return null;
  }
}

/**
 * The draft as it was when the editor opened. Frozen per key while the editor
 * is mounted, so the editor's own autosaves never show up as something to
 * restore.
 */
const openingDrafts = new Map<string, string | null>();
const noopSubscribe = () => () => {};

/**
 * The draft left from an earlier session for `key`, if any, and a `resolve`
 * to call once the editor restored or discarded it. Null on the server and
 * during hydration.
 */
export function useOpeningDraft<T>(key: string | null) {
  // An answer holds for the key it was given on; opening another record (or
  // coming back to this one) asks again.
  const [answered, setAnswered] = useState({ key, done: false });
  if (answered.key !== key) setAnswered({ key, done: false });

  const raw = useSyncExternalStore(
    noopSubscribe,
    () => {
      if (!key) return null;
      if (!openingDrafts.has(key)) openingDrafts.set(key, read(key));
      return openingDrafts.get(key) ?? null;
    },
    () => null,
  );

  useEffect(() => {
    if (!key) return;
    return () => {
      openingDrafts.delete(key);
    };
  }, [key]);

  const draft = useMemo(() => parse<T>(raw), [raw]);
  const resolve = useCallback(() => setAnswered({ key, done: true }), [key]);

  return {
    draft: answered.key === key && answered.done ? null : draft,
    resolve,
  };
}

/**
 * Saves `value` under `key` a moment after it stops changing. Pass
 * `enabled: false` while there is nothing worth keeping (no edits yet, or an
 * earlier draft still waiting for the editor's answer).
 */
export function useAutosaveDraft<T>(
  key: string | null,
  value: T,
  {
    enabled,
    base,
    delayMs = 800,
  }: { enabled: boolean; base?: string; delayMs?: number },
): void {
  useEffect(() => {
    if (!key || !enabled) return;
    const timer = window.setTimeout(() => {
      writeLocalDraft(key, { savedAt: new Date().toISOString(), value, base });
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [key, value, enabled, base, delayMs]);
}
