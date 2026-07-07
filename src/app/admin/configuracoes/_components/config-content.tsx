"use client";

import { useGetApiConfig } from "@/api/stetsom";
import { patchApiConfig } from "@/api/stetsom/endpoints/config/config";
import type {
  CmsConfig,
  I18nString,
  PatchApiConfigBody,
} from "@/api/stetsom/model";
import {
  AdminFormSection,
  AdminFormSectionContent,
  AdminFormSectionTitle,
} from "@/app/admin/_components/crud/admin-form-section";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import { LibraryAssetPicker } from "@/app/admin/_components/crud/library-asset-picker";
import type { LibraryUrlOnlyRef } from "@/app/admin/_components/crud/library-asset-ref";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api/error-utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export type ConfigTab = "identidade-visual" | "empresa" | "redes-sociais";

type LogoField = "logo_dark" | "logo_white";
type LogoLocale = keyof I18nString;

type CompanyLogoAsset = LibraryUrlOnlyRef;

function logoRef(url?: string): CompanyLogoAsset {
  return { file_url: url };
}

function ConfigForm({
  activeTab,
  initialConfig,
}: {
  activeTab: ConfigTab;
  initialConfig: CmsConfig;
}) {
  const [config, setConfig] = useState<CmsConfig>(initialConfig);
  const { mutate: updateConfig, isPending } = useMutation({
    mutationFn: (body: PatchApiConfigBody) => patchApiConfig(body),
  });

  function handleChange(key: keyof CmsConfig, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function handleLogoChange(
    field: LogoField,
    locale: LogoLocale,
    value: string,
  ) {
    setConfig((prev) => ({
      ...prev,
      [field]: { ...(prev[field] ?? { pt: "" }), [locale]: value },
    }));
  }

  function handleSave() {
    const body: PatchApiConfigBody = {
      company_name: config.company_name,
      company_email: config.company_email,
      company_phone: config.company_phone,
      company_whatsapp: config.company_whatsapp,
      company_address: config.company_address,
      social_instagram: config.social_instagram || undefined,
      social_facebook: config.social_facebook || undefined,
      social_youtube: config.social_youtube || undefined,
      social_linkedin: config.social_linkedin || undefined,
      logo_dark: config.logo_dark,
      logo_white: config.logo_white,
    };
    updateConfig(body, {
      onSuccess: () => toast.success("Configurações salvas com sucesso"),
      onError: (err) =>
        toast.error("Erro ao salvar configurações", {
          description: getApiErrorMessage(err, "Tente novamente."),
        }),
    });
  }

  return (
    <AdminPageLayout
      footer={
        <EditorFooter
          onPrimary={handleSave}
          primaryLabel="Salvar configurações"
          isPrimaryLoading={isPending}
        />
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-5"
      >
        {activeTab === "identidade-visual" && (
          <AdminFormSection
            title="Identidade Visual"
            description="Logo exibida no cabeçalho e rodapé do site, por idioma."
            raw
          >
            <AdminFormSectionContent>
              <AdminFormSectionTitle
                title="Logo para fundo claro"
                description="Usada no cabeçalho quando a página está rolada e no rodapé."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <LibraryAssetPicker
                  label="Português"
                  type="IMAGE"
                  variant="image"
                  value={logoRef(config.logo_dark?.pt)}
                  onChange={(asset) =>
                    handleLogoChange("logo_dark", "pt", asset?.file_url ?? "")
                  }
                />
                <LibraryAssetPicker
                  label="Inglês"
                  type="IMAGE"
                  variant="image"
                  value={logoRef(config.logo_dark?.en)}
                  onChange={(asset) =>
                    handleLogoChange("logo_dark", "en", asset?.file_url ?? "")
                  }
                />
                <LibraryAssetPicker
                  label="Espanhol"
                  type="IMAGE"
                  variant="image"
                  value={logoRef(config.logo_dark?.es)}
                  onChange={(asset) =>
                    handleLogoChange("logo_dark", "es", asset?.file_url ?? "")
                  }
                />
              </div>
            </AdminFormSectionContent>

            <AdminFormSectionTitle
              title="Logo para fundo escuro"
              description="Usada no cabeçalho transparente, sobre imagens e fundos escuros."
              className="border-t"
            />
            <AdminFormSectionContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <LibraryAssetPicker
                  label="Português"
                  type="IMAGE"
                  variant="image"
                  value={logoRef(config.logo_white?.pt)}
                  onChange={(asset) =>
                    handleLogoChange("logo_white", "pt", asset?.file_url ?? "")
                  }
                />
                <LibraryAssetPicker
                  label="Inglês"
                  type="IMAGE"
                  variant="image"
                  value={logoRef(config.logo_white?.en)}
                  onChange={(asset) =>
                    handleLogoChange("logo_white", "en", asset?.file_url ?? "")
                  }
                />
                <LibraryAssetPicker
                  label="Espanhol"
                  type="IMAGE"
                  variant="image"
                  value={logoRef(config.logo_white?.es)}
                  onChange={(asset) =>
                    handleLogoChange("logo_white", "es", asset?.file_url ?? "")
                  }
                />
              </div>
            </AdminFormSectionContent>
          </AdminFormSection>
        )}

        {activeTab === "empresa" && (
          <AdminFormSection
            title="Informações da Empresa"
            description="Dados de contato e identificação exibidos no site."
            raw
          >
            <AdminFormSectionContent>
              <div>
                <AdminLabel>Nome da empresa</AdminLabel>
                <Input
                  value={config.company_name}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <AdminLabel>E-mail</AdminLabel>
                  <Input
                    type="email"
                    value={config.company_email}
                    onChange={(e) =>
                      handleChange("company_email", e.target.value)
                    }
                  />
                </div>
                <div>
                  <AdminLabel>Telefone</AdminLabel>
                  <Input
                    value={config.company_phone}
                    onChange={(e) =>
                      handleChange("company_phone", e.target.value)
                    }
                  />
                </div>
              </div>
              <div>
                <AdminLabel>WhatsApp</AdminLabel>
                <Input
                  value={config.company_whatsapp}
                  onChange={(e) =>
                    handleChange("company_whatsapp", e.target.value)
                  }
                />
              </div>
              <div>
                <AdminLabel>Endereço</AdminLabel>
                <Input
                  value={config.company_address}
                  onChange={(e) =>
                    handleChange("company_address", e.target.value)
                  }
                />
              </div>
            </AdminFormSectionContent>
          </AdminFormSection>
        )}

        {activeTab === "redes-sociais" && (
          <AdminFormSection
            title="Redes Sociais"
            description="URLs completas dos perfis oficiais."
            raw
          >
            <AdminFormSectionContent>
              <div>
                <AdminLabel>Instagram</AdminLabel>
                <Input
                  type="url"
                  value={config.social_instagram ?? ""}
                  onChange={(e) =>
                    handleChange("social_instagram", e.target.value)
                  }
                  placeholder="https://instagram.com/stetsom"
                />
              </div>
              <div>
                <AdminLabel>Facebook</AdminLabel>
                <Input
                  type="url"
                  value={config.social_facebook ?? ""}
                  onChange={(e) =>
                    handleChange("social_facebook", e.target.value)
                  }
                  placeholder="https://facebook.com/stetsom"
                />
              </div>
              <div>
                <AdminLabel>YouTube</AdminLabel>
                <Input
                  type="url"
                  value={config.social_youtube ?? ""}
                  onChange={(e) =>
                    handleChange("social_youtube", e.target.value)
                  }
                  placeholder="https://youtube.com/@stetsom"
                />
              </div>
              <div>
                <AdminLabel>LinkedIn</AdminLabel>
                <Input
                  type="url"
                  value={config.social_linkedin ?? ""}
                  onChange={(e) =>
                    handleChange("social_linkedin", e.target.value)
                  }
                  placeholder="https://linkedin.com/company/stetsom"
                />
              </div>
            </AdminFormSectionContent>
          </AdminFormSection>
        )}
      </form>
    </AdminPageLayout>
  );
}

export function ConfigContent({ activeTab }: { activeTab: ConfigTab }) {
  const configQuery = useGetApiConfig();

  if (configQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!configQuery.data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
        <p className="text-sm font-medium text-destructive">
          Erro ao carregar configurações.
        </p>
        <button
          type="button"
          onClick={() => configQuery.refetch()}
          className="text-sm text-primary underline underline-offset-4"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <ConfigForm
      key="config-form"
      activeTab={activeTab}
      initialConfig={configQuery.data}
    />
  );
}
