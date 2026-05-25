"use client";

import type {
  CompleteUploadInput,
  LibraryAsset,
  UploadPresignResponse,
} from "@/lib/api/contracts";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
};

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "model/gltf-binary",
  "model/gltf+json",
]);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const IN_PROGRESS_STATUSES: UploadStage[] = [
  "idle",
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

  async function processFile(entry: UploadEntry, file: File): Promise<void> {
    const { id } = entry;

    if (!ALLOWED_MIMES.has(file.type)) {
      patch(id, {
        status: "error",
        error: `Tipo "${file.type}" não permitido.`,
      });
      return;
    }

    try {
      patch(id, { status: "presigning", progress: 10 });

      const presignRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          scope: "library",
        }),
      });

      if (!presignRes.ok) {
        const err = (await presignRes.json()) as {
          error?: { message?: string };
        };
        throw new Error(
          err.error?.message ?? `Presign falhou (${presignRes.status})`,
        );
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

      patch(id, { status: "registering", progress: 85 });

      const dims = await readImageDimensions(file);

      const completeBody: CompleteUploadInput = {
        name: file.name.replace(/\.[^.]+$/, ""),
        file_url: presign.file_url,
        type: presign.assetType,
        size_bytes: file.size,
        ...(dims ?? {}),
      };

      const completeRes = await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeBody),
      });

      if (!completeRes.ok) {
        const err = (await completeRes.json()) as {
          error?: { message?: string };
        };
        throw new Error(
          err.error?.message ??
            `Registro na biblioteca falhou (${completeRes.status})`,
        );
      }

      const { asset } = (await completeRes.json()) as { asset: LibraryAsset };

      patch(id, { status: "done", progress: 100, asset });

      void queryClient.invalidateQueries({ queryKey: ["admin", "library"] });
    } catch (err) {
      patch(id, {
        status: "error",
        error: err instanceof Error ? err.message : "Erro desconhecido.",
      });
    }
  }

  async function upload(files: File[]): Promise<void> {
    if (files.length === 0) return;

    const newEntries: UploadEntry[] = files.map((file) => ({
      id: generateId(),
      fileName: file.name,
      status: "idle" as UploadStage,
      progress: 0,
    }));

    setEntries((prev) => [...prev, ...newEntries]);

    for (let i = 0; i < files.length; i++) {
      await processFile(newEntries[i], files[i]);
    }
  }

  function clearFinished() {
    setEntries((prev) =>
      prev.filter((e) => e.status !== "done" && e.status !== "error"),
    );
  }

  const isUploading = entries.some((e) =>
    IN_PROGRESS_STATUSES.includes(e.status),
  );

  const doneCount = entries.filter((e) => e.status === "done").length;
  const errorCount = entries.filter((e) => e.status === "error").length;

  return {
    upload,
    entries,
    isUploading,
    doneCount,
    errorCount,
    clearFinished,
  };
}
