"use client";

import { patchApiLibraryId } from "@/api/stetsom";
import type { LibraryAsset } from "@/api/stetsom/model";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { AssetRedirectsTab } from "./asset-redirects-tab";
import { AssetTypeIcon } from "./asset-type-icon";
import { AssetVersionsTab } from "./asset-versions-tab";
import { assetAltText, getCurrentVersionUrl, isImageAsset } from "./lib";

const formSchema = z.object({
  filename: z
    .string()
    .min(1, "Informe o nome do arquivo")
    .max(255, "Máximo de 255 caracteres"),
  alt: z.object({
    pt: z.string(),
    en: z.string().optional(),
    es: z.string().optional(),
  }),
  tags: z.string(),
  redirect_paths: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

interface EditAssetDialogProps {
  asset: LibraryAsset;
  onClose: () => void;
  /** Called after a successful save or new version so the list can refresh. */
  onSaved: () => void;
}

export function EditAssetDialog({
  asset,
  onClose,
  onSaved,
}: EditAssetDialogProps) {
  const [tab, setTab] = useState<"data" | "versions" | "redirects">("data");
  const toast = useAdminToast();

  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      filename: asset.filename,
      alt: asset.alt ?? { pt: "" },
      tags: asset.tags.join(", "),
      redirect_paths: asset.redirect_paths ?? [],
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const alt: { pt: string; en?: string; es?: string } = {
        pt: values.alt.pt,
      };
      if (values.alt.en) alt.en = values.alt.en;
      if (values.alt.es) alt.es = values.alt.es;
      const hasAnyAlt = Object.values(alt).some((v) => v.length > 0);
      return patchApiLibraryId(asset.id, {
        filename: values.filename.trim(),
        alt: hasAnyAlt ? alt : undefined,
        tags: values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        redirect_paths: values.redirect_paths
          .map((p) => p.trim())
          .filter(Boolean),
      });
    },
    onSuccess: () => {
      toast.success("Asset atualizado");
      onSaved();
    },
    onError: (e) => toast.apiError(e, "Não foi possível salvar o asset"),
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  const previewUrl = getCurrentVersionUrl(asset);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton
        className="max-h-[85vh] w-[95vw] overflow-hidden p-0 md:h-[70vh] md:w-[60vw] md:max-w-none"
      >
        <div className="grid md:h-full md:grid-cols-[1fr_380px]">
          {/* Preview */}
          <div className="flex min-h-60 items-center justify-center overflow-hidden bg-muted p-4 md:min-h-0">
            {isImageAsset(asset) && previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={assetAltText(asset)}
                className="max-h-[60vh] w-full object-contain md:max-h-full"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <AssetTypeIcon type={asset.type} className="size-20" />
                <span className="max-w-full truncate px-4 text-sm">
                  {asset.filename}
                </span>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="flex min-h-0 flex-col border-t md:border-t-0 md:border-l">
            <DialogHeader className="border-b p-4">
              <DialogTitle className="truncate pr-8">
                {asset.filename}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
              <Tabs
                value={tab}
                onValueChange={(v) => setTab(v as "data" | "versions")}
                className="min-h-0 flex-1 gap-0"
              >
                <TabsList className="mx-5 mt-4">
                  <TabsTrigger value="data">Dados</TabsTrigger>
                  <TabsTrigger value="versions">
                    Versões ({asset.versions.length})
                  </TabsTrigger>
                  <TabsTrigger value="redirects">
                    Redirecionamentos ({(asset.redirect_paths ?? []).length})
                  </TabsTrigger>
                </TabsList>

                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <TabsContent value="data" className="flex flex-col gap-4">
                    <Field data-invalid={!!form.formState.errors.filename}>
                      <FieldLabel htmlFor="asset-filename">
                        Nome do arquivo
                      </FieldLabel>
                      <Input
                        id="asset-filename"
                        maxLength={255}
                        placeholder="exemplo.png"
                        aria-invalid={!!form.formState.errors.filename}
                        {...form.register("filename")}
                      />
                      <FieldError errors={[form.formState.errors.filename]} />
                    </Field>

                    <Controller
                      control={form.control}
                      name="alt"
                      render={({ field }) => (
                        <I18nInput
                          label="Texto alternativo (alt)"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />

                    <Field>
                      <FieldLabel htmlFor="asset-tags">
                        Tags (separadas por vírgula)
                      </FieldLabel>
                      <Input
                        id="asset-tags"
                        placeholder="hero, amplificador, 2024"
                        {...form.register("tags")}
                      />
                    </Field>
                  </TabsContent>

                  <TabsContent value="versions">
                    <AssetVersionsTab asset={asset} onUploaded={onSaved} />
                  </TabsContent>

                  <TabsContent value="redirects">
                    <Controller
                      control={form.control}
                      name="redirect_paths"
                      render={({ field }) => (
                        <AssetRedirectsTab
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </TabsContent>
                </div>
              </Tabs>

              <DialogFooter className="mx-0 mb-0 rounded-none">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Salvando…" : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
