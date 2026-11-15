"use client";

import type { LibraryAssetType } from "@/api/stetsom/model";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  allowedUploadCategories,
  formatBytes,
  inferUploadCategory,
  UPLOAD_CATEGORY_OPTIONS,
} from "./lib";
import { filterAcceptedFiles } from "./library-dropzone";
import type { LibraryUploadItem, UploadEntry } from "@/hooks/use-upload";
import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  FileText,
  Images,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  Video,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

type QueueItem = {
  id: string;
  file: File;
  type: LibraryAssetType;
  previewUrl?: string;
  uploadId?: string;
};

function iconFor(file: File) {
  if (file.type.startsWith("image/")) return Images;
  if (file.type.startsWith("video/")) return Video;
  if (file.name.toLowerCase().endsWith(".zip")) return FileArchive;
  return FileText;
}

function addFiles(
  files: File[],
  preferred: LibraryAssetType | undefined,
  current: QueueItem[],
) {
  const items = files.map((file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
    file,
    type: inferUploadCategory(file, preferred),
    previewUrl: file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : undefined,
  }));
  return [...current, ...items];
}

export function LibraryUploadDialog({
  open,
  initialFiles = [],
  preferredType,
  accept,
  entries,
  isUploading,
  uploadItems,
  onOpenChange,
}: {
  open: boolean;
  initialFiles?: File[];
  preferredType?: LibraryAssetType;
  accept: string;
  entries: UploadEntry[];
  isUploading: boolean;
  uploadItems: (items: LibraryUploadItem[]) => UploadEntry[];
  onOpenChange: (open: boolean) => void;
}) {
  const [items, setItems] = useState<QueueItem[]>(() =>
    addFiles(initialFiles, preferredType, []),
  );
  const [dragging, setDragging] = useState(false);
  const [rejectedCount, setRejectedCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalBytes = useMemo(
    () => items.reduce((total, item) => total + item.file.size, 0),
    [items],
  );
  const uploadEntries = items.map((item) =>
    item.uploadId
      ? entries.find((entry) => entry.id === item.uploadId)
      : undefined,
  );
  const pendingItems = items.filter((item) => !item.uploadId);
  const canSubmit = pendingItems.length > 0 && !isUploading;
  const categories = new Map<LibraryAssetType, number>();
  for (const item of items)
    categories.set(item.type, (categories.get(item.type) ?? 0) + 1);

  function append(files: File[]) {
    const accepted = filterAcceptedFiles(files, accept);
    setRejectedCount((count) => count + files.length - accepted.length);
    if (accepted.length === 0) return;
    setItems((current) => addFiles(accepted, preferredType, current));
  }

  function remove(id: string) {
    setItems((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return current.filter((entry) => entry.id !== id);
    });
  }

  function setType(id: string, type: LibraryAssetType) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, type } : item)),
    );
  }

  function submit() {
    if (!canSubmit) return;
    const created = uploadItems(
      pendingItems.map(({ file, type }) => ({ file, type })),
    );
    setItems((current) =>
      current.map((item) => ({
        ...item,
        uploadId:
          item.uploadId ??
          created[pendingItems.findIndex((pending) => pending.id === item.id)]
            ?.id,
      })),
    );
  }

  function close() {
    if (isUploading) return;
    items.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setItems([]);
    setRejectedCount(0);
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
    >
      <DialogContent className="w-[min(94vw,900px)] p-4">
        <DialogHeader className="-mx-4 -mt-4 border-b bg-muted/20 px-6 py-5">
          <DialogTitle className="font-heading text-xl">
            Enviar conteúdo
          </DialogTitle>
          <DialogDescription>
            Revise os arquivos, escolha a categoria de cada conteúdo e confirme
            o envio.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-5 px-2 py-5">
          {!isUploading && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ")
                  inputRef.current?.click();
              }}
              onDragEnter={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                append(Array.from(event.dataTransfer.files));
              }}
              className={cn(
                "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-7 text-center transition-colors",
                dragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/20 hover:border-primary hover:bg-muted/40",
              )}
            >
              <UploadCloud className="size-8 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Arraste os arquivos para cá
              </p>
              <p className="text-xs text-muted-foreground">
                ou clique para selecionar vários arquivos
              </p>
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple
                hidden
                onChange={(event) => {
                  append(Array.from(event.target.files ?? []));
                  event.target.value = "";
                }}
              />
            </div>
          )}

          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Arquivos selecionados
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {items.length} {items.length === 1 ? "arquivo" : "arquivos"}{" "}
                    · {formatBytes(totalBytes)}
                  </p>
                </div>
                {!isUploading && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                  >
                    <Plus className="size-4" /> Adicionar mais
                  </Button>
                )}
              </div>

              <div className="max-h-[42vh] space-y-2 overflow-y-auto pr-1">
                {items.map((item, index) => {
                  const Icon = iconFor(item.file);
                  const entry = uploadEntries[index];
                  const allowed = allowedUploadCategories(item.file);
                  const isDone = entry?.status === "done";
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border bg-card p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
                          {item.previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.previewUrl}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <Icon className="size-6" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {item.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatBytes(item.file.size)}
                          </p>
                        </div>
                        {!isUploading && !entry && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => remove(item.id)}
                            aria-label={`Remover ${item.file.name}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                        {isDone && (
                          <CheckCircle2
                            className="size-5 text-emerald-600"
                            aria-label="Enviado"
                          />
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Select
                          value={item.type}
                          disabled={Boolean(entry) || isUploading}
                          onValueChange={(value) =>
                            value && setType(item.id, value as LibraryAssetType)
                          }
                        >
                          <SelectTrigger className="h-9 min-w-0 flex-1 text-xs">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {UPLOAD_CATEGORY_OPTIONS.filter((option) =>
                              allowed.includes(option.value),
                            ).map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {entry &&
                          entry.status !== "done" &&
                          entry.status !== "error" && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Loader2 className="size-3.5 animate-spin" />{" "}
                              {entry.progress}%
                            </span>
                          )}
                      </div>
                      {entry?.status === "error" && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="size-3.5" /> {entry.error}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {rejectedCount > 0 && (
            <p className="text-sm text-destructive" role="status">
              {rejectedCount}{" "}
              {rejectedCount === 1
                ? "arquivo foi ignorado"
                : "arquivos foram ignorados"}{" "}
              por não corresponder ao tipo aceito nesta seção.
            </p>
          )}
        </DialogBody>

        <DialogFooter>
          <div className="mr-auto hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            {Array.from(categories.entries()).map(([type, count]) => (
              <span key={type}>
                {count}×{" "}
                {
                  UPLOAD_CATEGORY_OPTIONS.find(
                    (option) => option.value === type,
                  )?.label
                }
              </span>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={isUploading}
          >
            Fechar
          </Button>
          <Button type="button" onClick={submit} disabled={!canSubmit}>
            <UploadCloud className="size-4" />
            {isUploading
              ? "Enviando…"
              : pendingItems.length > 0
                ? "Confirmar envio"
                : "Envio concluído"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
