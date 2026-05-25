"use client";

import type {
  CompleteUploadInput,
  LibraryAsset,
  UploadPresignResponse,
} from "@/lib/api/contracts";
import { INTERNAL_API_ENDPOINTS } from "@/lib/api/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// ── Tipos ──────────────────────────────────────────────────────────────────────

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
  progress: number; // 0-100
  error?: string;
  asset?: LibraryAsset;
};

// Mimes aceitos pelo backend — espelhado de upload-validator.ts
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

// ── Utilitários ────────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Lê dimensões de imagem no browser sem servidor */
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

// ── Hook ───────────────────────────────────────────────────────────────────────

/**
 * Orquestra o upload de 3 etapas para a biblioteca de mídia:
 *
 * 1. POST /api/upload          → obter URL pré-assinada do S3 (via BFF)
 * 2. PUT  {uploadUrl}          → enviar binário direto ao S3 pelo browser
 * 3. POST /api/upload/complete → registrar metadados na biblioteca (via BFF)
 *
 * Requisito: bucket S3 com CORS configurado (AllowedMethods: PUT).
 * O backend gera URLs com ContentType assinado (X-Amz-SignedHeaders=content-type;host).
 */
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

    // Validação cliente antes de chamar o servidor
    if (!ALLOWED_MIMES.has(file.type)) {
      patch(id, {
        status: "error",
        error: `Tipo "${file.type}" não permitido.`,
      });
      return;
    }

    try {
      // Etapa 1 — Presign
      patch(id, { status: "presigning", progress: 10 });

      const presignRes = await fetch(INTERNAL_API_ENDPOINTS.upload, {
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

      // Etapa 2 — PUT direto ao S3 pelo browser
      patch(id, { status: "uploading", progress: 40 });

      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        // Content-Type está incluso em X-Amz-SignedHeaders — deve ser enviado
        headers: presign.headers,
        body: file,
      });

      if (!putRes.ok) {
        const errBody = await putRes.text().catch(() => "");
        console.error("[use-upload] S3 PUT falhou:", putRes.status, errBody);
        throw new Error(`Upload para o storage falhou (HTTP ${putRes.status})`);
      }

      patch(id, { progress: 80 });

      // Etapa 3 — Registrar na biblioteca
      patch(id, { status: "registering", progress: 85 });

      const dims = await readImageDimensions(file);

      const completeBody: CompleteUploadInput = {
        name: file.name.replace(/\.[^.]+$/, ""),
        file_url: presign.file_url,
        type: presign.assetType,
        size_bytes: file.size,
        ...(dims ?? {}),
      };

      const completeRes = await fetch(INTERNAL_API_ENDPOINTS.uploadComplete, {
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

      // Invalida cache da biblioteca para refletir o novo asset
      void queryClient.invalidateQueries({ queryKey: ["admin", "library"] });
    } catch (err) {
      patch(id, {
        status: "error",
        error: err instanceof Error ? err.message : "Erro desconhecido.",
      });
    }
  }

  /** Inicia o upload de uma lista de arquivos (sequencial para evitar rate limit) */
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

  /** Remove entradas concluídas (done ou error) */
  function clearFinished() {
    setEntries((prev) =>
      prev.filter((e) => e.status !== "done" && e.status !== "error"),
    );
  }

  const isUploading = entries.some((e) =>
    (
      ["idle", "presigning", "uploading", "registering"] as UploadStage[]
    ).includes(e.status),
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
