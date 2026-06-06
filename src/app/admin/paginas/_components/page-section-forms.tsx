"use client";

import {
  AdminInput,
  AdminLabel,
} from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { LibraryAssetPicker } from "@/app/admin/_components/crud/library-asset-picker";
import type { I18nString } from "@/api/stetsom/model";
import { Globe, Plus, Trash2 } from "lucide-react";

export interface PageSectionFormProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

type Item = Record<string, unknown>;

function i18n(v: unknown): I18nString {
  return v && typeof v === "object" ? (v as I18nString) : { pt: "" };
}
function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/** Generic repeater for list-based sections (timeline, faq, cards…). */
function Repeater({
  data,
  onChange,
  addLabel,
  renderItem,
}: PageSectionFormProps & {
  addLabel: string;
  renderItem: (item: Item, patch: (p: Item) => void) => React.ReactNode;
}) {
  const items: Item[] = Array.isArray(data.items) ? (data.items as Item[]) : [];

  function set(next: Item[]) {
    onChange({ ...data, items: next });
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="space-y-3 rounded-md border border-border bg-card p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              #{i + 1}
            </span>
            <button
              type="button"
              aria-label="Remover"
              onClick={() => set(items.filter((_, j) => j !== i))}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          {renderItem(item, (p) =>
            set(items.map((it, j) => (j === i ? { ...it, ...p } : it))),
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => set([...items, {}])}
        className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
      >
        <Plus className="size-4" />
        {addLabel}
      </button>
    </div>
  );
}

const HeroForm = ({ data, onChange }: PageSectionFormProps) => (
  <div className="space-y-4">
    <I18nInput
      label="Título"
      value={i18n(data.title)}
      onChange={(title) => onChange({ ...data, title })}
    />
    <I18nInput
      label="Subtítulo"
      value={i18n(data.subtitle)}
      onChange={(subtitle) => onChange({ ...data, subtitle })}
    />
    <LibraryAssetPicker
      label="Imagem"
      type="IMAGE"
      variant="image"
      value={{
        library_id: str(data.library_id),
        file_url: str(data.file_url),
      }}
      onChange={(a) =>
        onChange({
          ...data,
          library_id: a?.library_id ?? "",
          file_url: a?.file_url ?? "",
        })
      }
    />
  </div>
);

const TextForm = ({ data, onChange }: PageSectionFormProps) => (
  <div className="space-y-4">
    <I18nInput
      label="Título"
      value={i18n(data.title)}
      onChange={(title) => onChange({ ...data, title })}
    />
    <I18nInput
      label="Conteúdo"
      multiline
      value={i18n(data.content)}
      onChange={(content) => onChange({ ...data, content })}
    />
  </div>
);

const TimelineForm = (props: PageSectionFormProps) => (
  <Repeater
    {...props}
    addLabel="Adicionar marco"
    renderItem={(item, patch) => (
      <div className="space-y-3">
        <div>
          <AdminLabel>Ano</AdminLabel>
          <AdminInput
            value={str(item.year)}
            onChange={(e) => patch({ year: e.target.value })}
            placeholder="1989"
          />
        </div>
        <I18nInput
          label="Título"
          value={i18n(item.title)}
          onChange={(title) => patch({ title })}
        />
        <I18nInput
          label="Descrição"
          multiline
          value={i18n(item.description)}
          onChange={(description) => patch({ description })}
        />
      </div>
    )}
  />
);

const TestimonialsForm = (props: PageSectionFormProps) => (
  <Repeater
    {...props}
    addLabel="Adicionar depoimento"
    renderItem={(item, patch) => (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <AdminLabel>Autor</AdminLabel>
            <AdminInput
              value={str(item.author)}
              onChange={(e) => patch({ author: e.target.value })}
            />
          </div>
          <div>
            <AdminLabel>Cargo / cidade</AdminLabel>
            <AdminInput
              value={str(item.role)}
              onChange={(e) => patch({ role: e.target.value })}
            />
          </div>
        </div>
        <I18nInput
          label="Depoimento"
          multiline
          value={i18n(item.quote)}
          onChange={(quote) => patch({ quote })}
        />
      </div>
    )}
  />
);

const FaqForm = (props: PageSectionFormProps) => (
  <Repeater
    {...props}
    addLabel="Adicionar pergunta"
    renderItem={(item, patch) => (
      <div className="space-y-3">
        <I18nInput
          label="Pergunta"
          value={i18n(item.question)}
          onChange={(question) => patch({ question })}
        />
        <I18nInput
          label="Resposta"
          multiline
          value={i18n(item.answer)}
          onChange={(answer) => patch({ answer })}
        />
      </div>
    )}
  />
);

const ValuesForm = (props: PageSectionFormProps) => (
  <Repeater
    {...props}
    addLabel="Adicionar card"
    renderItem={(item, patch) => (
      <div className="space-y-3">
        <I18nInput
          label="Título"
          value={i18n(item.title)}
          onChange={(title) => patch({ title })}
        />
        <I18nInput
          label="Descrição"
          multiline
          value={i18n(item.description)}
          onChange={(description) => patch({ description })}
        />
      </div>
    )}
  />
);

const GalleryForm = ({ data, onChange }: PageSectionFormProps) => {
  const images = Array.isArray(data.images)
    ? (data.images as { library_id: string; file_url?: string }[])
    : [];
  return (
    <div className="space-y-2">
      {images.map((img, i) => (
        <LibraryAssetPicker
          key={i}
          type="IMAGE"
          variant="image"
          value={img}
          onChange={(a) => {
            const next = [...images];
            if (a) next[i] = { library_id: a.library_id, file_url: a.file_url };
            else next.splice(i, 1);
            onChange({ ...data, images: next });
          }}
        />
      ))}
      <LibraryAssetPicker
        type="IMAGE"
        variant="image"
        value={null}
        onChange={(a) => {
          if (a)
            onChange({
              ...data,
              images: [
                ...images,
                { library_id: a.library_id, file_url: a.file_url },
              ],
            });
        }}
      />
    </div>
  );
};

const VideoForm = ({ data, onChange }: PageSectionFormProps) => (
  <div className="space-y-4">
    <div>
      <AdminLabel>URL do vídeo</AdminLabel>
      <AdminInput
        value={str(data.url)}
        onChange={(e) => onChange({ ...data, url: e.target.value })}
        placeholder="https://www.youtube.com/watch?v=..."
      />
    </div>
    <I18nInput
      label="Título"
      value={i18n(data.title)}
      onChange={(title) => onChange({ ...data, title })}
    />
  </div>
);

const ReferenceForm = () => (
  <div className="flex items-start gap-3 rounded-md border border-border bg-muted/40 px-4 py-3">
    <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
    <p className="text-sm text-muted-foreground">
      Esta seção é alimentada automaticamente (feed do Instagram). Aqui você
      apenas controla a posição e a visibilidade na página.
    </p>
  </div>
);

/** Section editor forms keyed by the semantic section_id. */
export const PAGE_SECTION_FORMS: Record<
  string,
  (props: PageSectionFormProps) => React.ReactNode
> = {
  hero: HeroForm,
  text: TextForm,
  timeline: TimelineForm,
  testimonials: TestimonialsForm,
  faq: FaqForm,
  values: ValuesForm,
  gallery: GalleryForm,
  video: VideoForm,
  "social-feed": ReferenceForm,
};
