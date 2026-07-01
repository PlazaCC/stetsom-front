"use client";

import { AdminSuccessPage } from "@/app/admin/_components/crud/admin-success-page";
interface CmsProductMutationResult {
  status: string;
  slug: string;
}
import { CheckCircle2, FilePen } from "lucide-react";

interface ProductWizardStepSuccessProps {
  result: CmsProductMutationResult;
  mode: "create" | "edit";
  onContinueEditing: () => void;
}

export function ProductWizardStepSuccess({
  result,
  mode,
  onContinueEditing,
}: ProductWizardStepSuccessProps) {
  const isDraft = result.status === "DRAFT";

  const title = isDraft
    ? "Produto salvo como rascunho"
    : mode === "create"
      ? "Produto publicado com sucesso!"
      : "Produto atualizado com sucesso!";

  const subtitle = isDraft
    ? "Os dados foram preservados. Complete o nome, categoria e imagem de capa para publicar."
    : "O produto já está disponível no catálogo público do site.";

  return (
    <AdminSuccessPage
      icon={isDraft ? FilePen : CheckCircle2}
      title={title}
      subtitle={subtitle}
      actions={[
        ...(result.status === "PUBLISHED"
          ? [
              {
                label: "Abrir página atualizada",
                href: `/produtos/${result.slug}`,
                variant: "secondary" as const,
                external: true,
              },
            ]
          : []),
        {
          label: "Continuar editando",
          onClick: onContinueEditing,
          variant: "outline" as const,
        },
        {
          label: "Novo produto",
          href: "/admin/produtos/novo",
          variant: "outline" as const,
        },
        {
          label: "Voltar à lista",
          href: "/admin/produtos",
          variant: "ghost" as const,
        },
      ]}
    />
  );
}
