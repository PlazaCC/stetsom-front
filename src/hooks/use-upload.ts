"use client";

import type {
  CompleteUploadInput,
  LibraryAsset,
  LibraryAssetType,
  UploadPresignResponse,
} from "@/api/stetsom/model";
import {
  getGetApiLibraryQueryKey,
  postApiLibraryIdVersions,
} from "@/api/stetsom";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export type UploadStage =
  | "idle"
  | "presigning"
  | "uploading"
  | "registering"
  | "done"
  | "error";

export type UploadEntry = {
  id: string;
  fileName: string;
  status: UploadStage;
  progress: number;
  error?: string;
  asset?: LibraryAsset;
  /** Local object URL for an image preview while the upload is in flight. */
  previewUrl?: string;
};

/** Object URL for image files (for an optimistic preview); `undefined` otherwise. */
function makePreviewUrl(file: File): string | undefined {
  return file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
}

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "model/gltf-binary",
  "model/gltf+json",
  "application/zip",
  "application/x-zip-compressed",
]);

/** Fallback MIME by file extension — browsers don't recognize some types
 *  (notably `.glb`/`.gltf`/`.zip`) and leave `file.type` empty. */
const EXTENSION_MIME: Record<string, string> = {
  glb: "model/gltf-binary",
  gltf: "model/gltf+json",
  zip: "application/zip",
};

/** The browser's MIME, or one inferred from the extension when it's missing. */
function resolveMimeType(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return (ext && EXTENSION_MIME[ext]) || "";
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Statuses that indicate an active upload operation.
 * "idle" is excluded intentionally — it represents entries queued but not yet
 * started, and should not block new `upload()` calls.
 */
const ACTIVE_STATUSES: UploadStage[] = [
  "presigning",
  "uploading",
  "registering",
];

async function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) return null;

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };

    img.src = objectUrl;
  });
}

export function useLibraryUpload() {
  const queryClient = useQueryClient();
  const [entries, setEntries] = useState<UploadEntry[]>([]);

  function patch(id: string, update: Partial<Omit<UploadEntry, "id">>) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...update } : e)),
    );
  }

  /** Steps 1–2 of the upload flow: presign + PUT to storage. Shared by the
   *  "create asset" and "add version" paths. */
  async function presignAndPut(
    id: string,
    file: File,
  ): Promise<{
    presign: UploadPresignResponse;
    dims: { width: number; height: number } | null;
  }> {
    patch(id, { status: "presigning", progress: 10 });

    const presignRes = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: resolveMimeType(file),
        sizeBytes: file.size,
        scope: "library",
      }),
    });

    if (!presignRes.ok) {
      let errorMessage: string;
      try {
        const err = (await presignRes.json()) as {
          error?: { message?: string };
        };
        errorMessage =
          err.error?.message ?? `Presign falhou (${presignRes.status})`;
      } catch {
        errorMessage = `Presign falhou (${presignRes.status})`;
      }
      throw new Error(errorMessage);
    }

    const presign = (await presignRes.json()) as UploadPresignResponse;

    patch(id, { status: "uploading", progress: 40 });

    const putRes = await fetch(presign.uploadUrl, {
      method: "PUT",
      headers: presign.headers,
      body: file,
    });

    if (!putRes.ok) {
      throw new Error(`Upload para o storage falhou (HTTP ${putRes.status})`);
    }

    patch(id, { progress: 80 });

    const dims = await readImageDimensions(file);
    return { presign, dims };
  }

  /** Full flow ending in a brand-new library asset (step 3 = /upload/complete).
   *  Pass `type` to pin the asset type (e.g. MANUAL vs CATALOG vs CERTIFICATE,
   *  all `application/pdf`); otherwise the backend infers it from the MIME. */
  async function processFile(
    entry: UploadEntry,
    file: File,
    type?: LibraryAssetType,
  ): Promise<boolean> {
    const { id } = entry;

    const mimeType = resolveMimeType(file);
    if (!ALLOWED_MIMES.has(mimeType)) {
      patch(id, {
        status: "error",
        error: `Tipo "${mimeType}" não permitido.`,
      });
      return false;
    }

    try {
      const { presign, dims } = await presignAndPut(id, file);

      patch(id, { status: "registering", progress: 85 });

      const completeBody: CompleteUploadInput = {
        filename: file.name,
        file_url: presign.file_url,
        type: type ?? presign.assetType,
        size_bytes: file.size,
        ...(dims ?? {}),
      };

      const completeRes = await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeBody),
      });

      if (!completeRes.ok) {
        let errorMessage: string;
        try {
          const err = (await completeRes.json()) as {
            error?: { message?: string };
          };
          errorMessage =
            err.error?.message ??
            `Registro na biblioteca falhou (${completeRes.status})`;
        } catch {
          errorMessage = `Registro na biblioteca falhou (${completeRes.status})`;
        }
        throw new Error(errorMessage);
      }

      const { asset } = (await completeRes.json()) as { asset: LibraryAsset };

      patch(id, { status: "done", progress: 100, asset });
      return true;
    } catch (err) {
      patch(id, {
        status: "error",
        error: err instanceof Error ? err.message : "Erro desconhecido.",
      });
      return false;
    }
  }

  /** Full flow ending in a new version on an existing asset
   *  (step 3 = POST /api/library/:id/versions). */
  async function processVersionFile(
    entry: UploadEntry,
    file: File,
    assetId: string,
  ): Promise<boolean> {
    const { id } = entry;

    const mimeType = resolveMimeType(file);
    if (!ALLOWED_MIMES.has(mimeType)) {
      patch(id, {
        status: "error",
        error: `Tipo "${mimeType}" não permitido.`,
      });
      return false;
    }

    try {
      const { presign, dims } = await presignAndPut(id, file);

      patch(id, { status: "registering", progress: 85 });

      await postApiLibraryIdVersions(assetId, {
        file_url: presign.file_url,
        size_bytes: file.size,
        ...(dims ?? {}),
      });

      patch(id, { status: "done", progress: 100 });
      return true;
    } catch (err) {
      patch(id, {
        status: "error",
        error: err instanceof Error ? err.message : "Erro desconhecido.",
      });
      return false;
    }
  }

  async function upload(files: File[], type?: LibraryAssetType): Promise<void> {
    if (files.length === 0) return;

    const newEntries: UploadEntry[] = files.map((file) => ({
      id: generateId(),
      fileName: file.name,
      status: "idle" as UploadStage,
      progress: 0,
      previewUrl: makePreviewUrl(file),
    }));

    setEntries((prev) => [...prev, ...newEntries]);

    // Run uploads with limited concurrency to improve throughput and UX.
    const CONCURRENCY = 3;
    let idx = 0;

    let anySuccess = false;
    const workers = new Array(Math.min(CONCURRENCY, files.length))
      .fill(0)
      .map(async () => {
        while (true) {
          const i = idx++;
          if (i >= files.length) return false;
          const file = files[i];
          const entry = newEntries[i];
          if (!file || !entry) continue;
          // Await each file processing to keep per-file error handling linear
          const success = await processFile(entry, file, type);
          if (success) anySuccess = true;
        }
      });

    await Promise.all(workers);
    if (anySuccess) {
      void queryClient.invalidateQueries({
        queryKey: getGetApiLibraryQueryKey(),
      });
    }
  }

  /** Upload a new version for an existing asset and refresh the library. */
  async function uploadVersion(assetId: string, file: File): Promise<boolean> {
    const entry: UploadEntry = {
      id: generateId(),
      fileName: file.name,
      status: "idle",
      progress: 0,
      previewUrl: makePreviewUrl(file),
    };
    setEntries((prev) => [...prev, entry]);

    const success = await processVersionFile(entry, file, assetId);
    if (success) {
      void queryClient.invalidateQueries({
        queryKey: getGetApiLibraryQueryKey(),
      });
    }
    return success;
  }

  const clearFinished = useCallback(() => {
    setEntries((prev) => {
      prev.forEach((e) => {
        if ((e.status === "done" || e.status === "error") && e.previewUrl) {
          URL.revokeObjectURL(e.previewUrl);
        }
      });
      return prev.filter((e) => e.status !== "done" && e.status !== "error");
    });
  }, []);

  /** Remove only successfully-completed entries; keeps errored ones visible. */
  const clearDone = useCallback(() => {
    setEntries((prev) => {
      prev.forEach((e) => {
        if (e.status === "done" && e.previewUrl) {
          URL.revokeObjectURL(e.previewUrl);
        }
      });
      return prev.filter((e) => e.status !== "done");
    });
  }, []);

  const isUploading = entries.some((e) => ACTIVE_STATUSES.includes(e.status));

  const doneCount = entries.filter((e) => e.status === "done").length;
  const errorCount = entries.filter((e) => e.status === "error").length;

  return {
    upload,
    uploadVersion,
    entries,
    isUploading,
    doneCount,
    errorCount,
    clearFinished,
    clearDone,
  };
}
