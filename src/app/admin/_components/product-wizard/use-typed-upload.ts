"use client";

import type {
  CompleteUploadInput,
  LibraryAsset,
  LibraryAssetType,
  UploadPresignResponse,
} from "@/api/stetsom/model";
import { useState } from "react";

export type TypedUploadEntry = {
  id: string;
  fileName: string;
  status: "uploading" | "done" | "error";
  error?: string;
};

export interface UploadedAsset {
  library_id: string;
  file_url: string;
  filename: string;
}

function currentUrl(asset: LibraryAsset): string {
  const v =
    asset.versions.find((x) => x.version_id === asset.current_version_id) ??
    asset.versions[0];
  return v?.file_url ?? "";
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Uploads a library asset with an explicit `type` (e.g. MANUAL, CERTIFICATE).
 * The shared `useLibraryUpload` infers the asset type from the MIME, which can't
 * tell a manual from a certificate. The public product page filters downloads by
 * `type`, so the wizard must register each file under the right type here.
 */
export function useTypedUpload() {
  const [entries, setEntries] = useState<TypedUploadEntry[]>([]);

  function patch(id: string, update: Partial<Omit<TypedUploadEntry, "id">>) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...update } : e)),
    );
  }

  async function upload(
    file: File,
    type: LibraryAssetType,
  ): Promise<UploadedAsset | null> {
    const id = generateId();
    setEntries((prev) => [
      ...prev,
      { id, fileName: file.name, status: "uploading" },
    ]);

    try {
      const presignRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type || "application/pdf",
          sizeBytes: file.size,
          scope: "library",
        }),
      });
      if (!presignRes.ok) throw new Error("Falha ao preparar o upload.");
      const presign = (await presignRes.json()) as UploadPresignResponse;

      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: presign.headers,
        body: file,
      });
      if (!putRes.ok) throw new Error("Falha ao enviar o arquivo.");

      const completeBody: CompleteUploadInput = {
        filename: file.name,
        file_url: presign.file_url,
        type,
        size_bytes: file.size,
      };
      const completeRes = await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeBody),
      });
      if (!completeRes.ok) throw new Error("Falha ao registrar na biblioteca.");

      const { asset } = (await completeRes.json()) as { asset: LibraryAsset };
      patch(id, { status: "done" });
      return {
        library_id: asset.id,
        file_url: currentUrl(asset),
        filename: asset.filename,
      };
    } catch (err) {
      patch(id, {
        status: "error",
        error: err instanceof Error ? err.message : "Erro desconhecido.",
      });
      return null;
    }
  }

  const isUploading = entries.some((e) => e.status === "uploading");

  return { upload, entries, isUploading, clear: () => setEntries([]) };
}
