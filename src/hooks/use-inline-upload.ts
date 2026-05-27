"use client";

import type { UploadSlot } from "@/lib/api/contracts";
import { useState } from "react";

export type InlineUploadEntry = {
  key: string;
  fileName: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
};

export function useInlineUpload() {
  const [entries, setEntries] = useState<InlineUploadEntry[]>([]);

  function initEntries(
    slots: Record<string, UploadSlot>,
    files: Map<string, File>,
  ) {
    const list: InlineUploadEntry[] = [];
    for (const key of Object.keys(slots)) {
      const file = files.get(key);
      if (file) {
        list.push({
          key,
          fileName: file.name,
          status: "pending",
          progress: 0,
        });
      }
    }
    setEntries(list);
    return list;
  }

  function patch(key: string, update: Partial<InlineUploadEntry>) {
    setEntries((prev) =>
      prev.map((e) => (e.key === key ? { ...e, ...update } : e)),
    );
  }

  async function uploadSlot(
    key: string,
    slot: UploadSlot,
    file: File,
  ): Promise<boolean> {
    try {
      patch(key, { status: "uploading", progress: 50 });
      const res = await fetch(slot.uploadUrl, {
        method: "PUT",
        headers: slot.headers,
        body: file,
      });
      if (!res.ok) {
        throw new Error(`Upload falhou (HTTP ${res.status})`);
      }
      patch(key, { status: "done", progress: 100 });
      return true;
    } catch (err) {
      patch(key, {
        status: "error",
        error: err instanceof Error ? err.message : "Erro desconhecido",
      });
      return false;
    }
  }

  async function upload(
    slots: Record<string, UploadSlot>,
    files: Map<string, File>,
  ): Promise<boolean> {
    const list = initEntries(slots, files);
    if (list.length === 0) return true;

    const results = await Promise.all(
      list.map((entry) => {
        const file = files.get(entry.key);
        const slot = slots[entry.key];
        if (!file || !slot) return false;
        return uploadSlot(entry.key, slot, file);
      }),
    );

    return results.every(Boolean);
  }

  const hasErrors = entries.some((e) => e.status === "error");
  const isUploading = entries.some(
    (e) => e.status === "uploading" || e.status === "pending",
  );
  const allDone =
    entries.length > 0 && entries.every((e) => e.status === "done");

  return { upload, entries, hasErrors, isUploading, allDone };
}
