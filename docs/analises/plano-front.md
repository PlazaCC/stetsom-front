# Plano de execução — Frontend (Site + CMS)

> Plano derivado de `backlog-novidades-cadastro-parceiros-cms.md`, cobrindo **apenas o que é entregável neste repositório** (Next.js — Site público + Admin/CMS).
> Contrapartida de backend: `plano-back-cms.md`.
> Investigação de código feita em 2026-08-10.

## Premissas do backlog que a investigação derrubou

Cinco itens estavam classificados como bloqueados por API ou como "não iniciado" e **não estão**. Em todos os casos a favor do projeto — há mais coisa entregável agora do que o levantamento sugeria:

| Item | Backlog dizia | Realidade verificada |
|---|---|---|
| Certificados na página de produto | Bloqueado — "API só expõe `manualFile`" | **Pronto ponta a ponta.** `product.files` é `ProductFile[]` ([product.ts:42](../../src/api/stetsom/model/product.ts#L42)), `CERTIFICATE` é tipo válido, e o CMS **já tem upload de certificados** ([step-files.tsx:30-39](../../src/app/admin/_components/product-wizard/step-files.tsx#L30-L39)). Só falta renderizar no site. |
| Lat/lng do parceiro com busca por CEP | `[BACK][CMS]` — não iniciado | **Backend já entregue.** `postApiPartnerLocationsBody.lat/lng` existe e há `GET /api/geocode/search` aceitando "City name, state, or 8-digit CEP" → `geocodeResult.lat/lng`. O form do CMS ([parceiros-content.tsx](../../src/app/admin/parceiros/_components/parceiros-content.tsx)) tem campos de endereço e CEP mas **nunca captura nem envia lat/lng**. Vira tarefa 100% front. |
| Categoria "OUTROS" na biblioteca | Bloqueado — depende da API | **Não bloqueado.** `LibraryAssetType.OTHER` já existe ([libraryAssetType.ts:22](../../src/api/stetsom/model/libraryAssetType.ts#L22)). |
| Upload manter nome original | Não iniciado | **Já feito no front.** `use-upload.ts` envia `file.name` cru, sem slugify ([:136](../../src/hooks/use-upload.ts#L136), [:202](../../src/hooks/use-upload.ts#L202)). Vira verificação. |
| Combobox de busca de produto no banner | "A verificar se existe endpoint" | **Existe.** `GetApiProductsParams.q?: string` ([getApiProductsParams.ts:23](../../src/api/stetsom/model/getApiProductsParams.ts#L23)). |

Também já existem no repo, prontos para reuso, componentes tratados no backlog como "a construir": editor rich-text (`prosekit` + `LegalEditor`), modal de galeria (`LibraryPickerModal`), combobox composável (`combobox.tsx`) e `ToggleSwitch`.

## Decisões tomadas

1. **Escopo:** só o entregável no front. Itens travados por contrato de API estão em `plano-back-cms.md`, não aqui.
2. **Novidades:** substituição literal — sem header, **sem CTA "Ver todos"**, sem editabilidade no CMS.
3. **Publicação por idioma:** implementar switch e estrutura de validação, com a lista de campos obrigatórios isolada em módulo trocável (regra provisória: nome + descrição) até alinhamento com o backend.

Convenção: um commit por item, direto em `develop`. Portão de qualidade em toda fase: `pnpm lint && pnpm tsc --noEmit && pnpm build`.

---

## Status de execução (atualizado 2026-08-11, pós-merge com o Tiago)

| Fase | Status | Evidência |
|---|---|---|
| 1 — Novidades | ✅ Concluída | Commits `c1f07fe`, `ca8d73c`. Ver `backlog-novidades-cadastro-parceiros-cms.md`. |
| 2 — Descontinuado | ✅ Concluída | Commit `090015b`. Badge não verificado em tela (sem produto `is_discontinued: true` nos mocks). |
| 3 — Biblioteca + shell do admin | ✅ Concluída (itens 1, 2 e 4) · 🟡 item 3 depende de teste com API no ar | Itens 1 (OUTROS) e 2 (remover edição de nome) vieram no merge do Tiago (`22f8122`); item 4 (versão na sidebar) já estava em `090015b`. |
| 4 — Polimento do site público | 🔵 2 de 3 concluídos | Itens 1 (ícones) e 3 (QR code) em `090015b`/`28423d6`. Item 2 (dropdown de certificados) segue bloqueado — todos os 39 arquivos de produto na base têm `type: "PDF"`, nenhum `CERTIFICATE"`; ver achado de regressão em `backlog-novidades-cadastro-parceiros-cms.md` §6. |

---

## Fase 1 — Fechar a migração do bloco Novidades

**Objetivo:** um único bloco na home, zero código morto. Hoje o legado e o novo renderizam **empilhados** em produção — é o item com maior custo de carregamento.

1. [home-page-view.tsx](../../src/app/[locale]/(site)/_components/home-page-view.tsx) — remover o bloco legado (L52-67, incluindo o `EditableSection target="section:featured"`) e o import na L15. Manter a L68 como está.
2. Apagar `featured-products-legacy.tsx` e `featured-tab-strip-legacy.tsx`. Confirmar antes por busca que nada mais os referencia — só se referenciam entre si.
3. [page-blocks.ts:22-23](../../src/lib/page-blocks.ts#L22-L23) — remover o tipo `HomeFeaturedBlockData` inteiro, não só `label`/`title`. Um tipo de bloco que ninguém consome é pior que nenhum.
4. [section-field-spec.ts](../../src/app/admin/paginas/_components/section-field-spec.ts) L124-126 — remover a entrada `featured` por completo, incluindo `spotlightTitle`, que é passado mas **nunca renderizado** (campo morto).
5. [data.json:2666-2670](../../src/lib/mock/data.json#L2666-L2670) — remover o objeto do bloco featured.
6. Unificar `NOVELTIES_PAGE_SIZE`: exportar de [build-novelties-by-category.ts:10](../../src/app/[locale]/(site)/_components/build-novelties-by-category.ts#L10) e importar em `page.tsx`, apagando a duplicata da L18.
7. i18n órfãos: `Catalog.emptyCategory` e `Catalog.allCategories` perdem consumidor. Remover **das três** locales para manter a paridade (hoje 227 chaves idênticas em pt-BR/en/es).

**Efeito colateral a comunicar:** o toggle `hidden` do bloco desaparece — o admin não consegue mais esconder Novidades pelo CMS; a visibilidade passa a depender de haver produtos publicados. Registrar no corpo do commit.

**Verificar:** `/`, `/en`, `/es` com um único bloco e abas vindas dos nomes de categoria da API; `/admin/paginas` sem a seção e sem erro de overlay em `section:featured`.

---

## Fase 2 — Descontinuado: rename + badge

**Objetivo:** fechar os três defeitos do item "fora de linha → descontinuado".

**Decisão de design do badge.** Hoje `ProductCard` tem só `badge?: string | null` com `bg-brand` — o mesmo vermelho de estados ativos — e o comentário na L56 já antecipa que "NOVO" e "DESCONTINUADO" vão coexistir. Adicionar uma prop de tom em vez de sobrecarregar a string:

```ts
badge?: string | null;
badgeTone?: "new" | "discontinued";  // default "new"
```

- `new` → mantém `bg-brand text-white` (sem regressão).
- `discontinued` → `bg-brand-dark text-white`, token `--color-brand-dark` já existente em [globals.css:11](../../src/app/globals.css#L11). Neutro, dentro da marca, inconfundível ao lado do vermelho. Evitar `bg-muted`: é token de superfície de CMS e some sobre foto de produto.

1. [catalog-products-list.tsx](../../src/app/[locale]/(site)/produtos/_components/catalog-products-list.tsx) ~L55 — passar `badge` e `badgeTone`. O componente vive na árvore client de `catalog-content.tsx`, então `useTranslations("Catalog")` funciona direto, sem plumbing server/client. Adicionar `Catalog.discontinued` nas 3 locales, espelhando os valores de `ProductDetail.discontinued`.
2. [product-detail-view.tsx:540](../../src/app/[locale]/(site)/produtos/[slug]/_components/product-detail-view.tsx#L540) — trocar a string `"Discontinued"` hardcoded (inglês num site pt-BR) pela chave `ProductDetail.discontinued`, já presente nas 3 locales.
3. [step-publish.tsx:84-126](../../src/app/admin/_components/product-wizard/step-publish.tsx#L84-L126) — renomear `"Fora de linha"` → `"Descontinuado"`, mantendo `"Em linha"` como antônimo. O admin usa strings PT hardcoded; **não** introduzir i18n no admin agora.
4. Oportunístico (1 linha): [use-catalog-filters.ts](../../src/hooks/use-catalog-filters.ts) — `setShowExport` não reseta `page`, ao contrário de `setSearch` na L71. Corrigir mesmo com o filtro ainda inerte.

**Verificar:** listagem com produto descontinuado exibindo badge; badge continua escondido em modo comparação; PDP em pt/en/es; passo "Publicação" do wizard.

---

## Fase 3 — Biblioteca + shell do admin

**Objetivo:** agrupar quatro itens pequenos e independentes na mesma área.

1. **Categoria OUTROS.** Adicionar `"outros"` à union `Tab` ([lib.ts:15-23](../../src/app/admin/biblioteca/_components/lib.ts#L15-L23)) e a entrada em `UPLOAD_CONFIG` com `libraryType: "OTHER"`. Criar `src/app/admin/biblioteca/outros/page.tsx` espelhando `fotos/page.tsx`. Registrar em [config.ts](../../src/lib/cms/config.ts) (lista de abas L115-164 + entrada por rota ~L166-215) e adicionar o caso em `asset-type-icon.tsx`. A filtragem é genérica, não precisa mexer.
   - `accept` com lista explícita (`.pdf,.doc,.docx,.xls,.xlsx,.zip,.csv,.txt`) em vez de `*/*` — `*/*` convida lixo pro bucket.
2. **Remover edição de nome.** Tirar "Nome do arquivo" de [edit-asset-dialog.tsx:158-168](../../src/app/admin/biblioteca/_components/edit-asset-dialog.tsx#L158-L168), remover `filename` do schema zod (L29-32) e do corpo do PATCH (L77), preservando o PATCH para os demais campos.
3. **Nome original no upload — verificação, não código.** Subir arquivo com espaços/acentos/aspas e confirmar o round-trip do `filename`. Se vier mangled, a normalização é server-side → ver `plano-back-cms.md`.
4. **Versão da release na sidebar.** Renderizar no rodapé de [admin-sidebar.tsx](../../src/app/admin/_components/admin-sidebar.tsx) (L215-225) em `text-2xs`. Fonte: `process.env.NEXT_PUBLIC_APP_VERSION`, injetada em `next.config.ts` a partir do `package.json` — evita passo manual de `.env` e fiação de CI.
   - **Pré-requisito:** subir `package.json` de `0.1.0` para `1.0.0`, que é o que o `CHANGELOG.md` já registra. O rótulo não vale nada exibindo número defasado.

**Verificar:** `/admin/biblioteca/outros` com upload e filtro; diálogo de edição sem campo de nome; versão correta no rodapé.

---

## Fase 4 — Polimento do site público

**Objetivo:** três itens visíveis ao usuário final, independentes entre si.

1. **Ícones do bloco de contato.** [support-contact.tsx:118-119](../../src/app/[locale]/(site)/suporte/_components/support-contact.tsx#L118-L119) — remover o wrapper `bg-brand/10` e adotar o padrão já aplicado em [support-cards.tsx:75-77](../../src/app/[locale]/(site)/suporte/_components/support-cards.tsx#L75-L77) (`strokeWidth={1.5}`, `size={36}`, `text-brand`). O `WhatsappIcon` inline (L9-28) é baseado em `fill` e ignora `strokeWidth` — deixar como está, fica correto sem o círculo tintado.
2. **Dropdown de certificados no produto.** Filtrar `product.files` por `type === "CERTIFICATE" && is_active`. Copiar a estrutura do `DropdownMenu` de download do app ([product-detail-view.tsx:380-426](../../src/app/[locale]/(site)/produtos/[slug]/_components/product-detail-view.tsx#L380-L426)) — estilo Base UI com `render={...}`, `DropdownMenuItem render={<a target="_blank" rel="noopener noreferrer" />}`. Renderizar o gatilho só quando o array filtrado não estiver vazio. Rotular por `filename`, seguindo o precedente de [support-documentation.tsx:32-43](../../src/app/[locale]/(site)/suporte/_components/support-documentation.tsx#L32-L43). Novas chaves em `ProductDetail` nas 3 locales.
3. **QR code do WhatsApp no desktop.** Adicionar `react-qr-code` (≈3 KB, zero dependências, SVG puro, sem canvas, compatível com React 19). Reaproveitar `getContactHref` ([support-contact.tsx:36-49](../../src/app/[locale]/(site)/suporte/_components/support-contact.tsx#L36-L49)) para o valor — não reimplementar o strip de dígitos. Envolver em `<div className="hidden lg:flex">`: não existe hook `useMediaQuery` no repo e a convenção é toggle puro de Tailwind ([our-history.tsx:23,51](../../src/app/[locale]/(site)/_components/our-history.tsx#L23-L51)), o que também evita mismatch de hidratação.

**Verificar:** `/suporte` acima e abaixo de 1024px; PDP com e sem certificados; deep links `tel:`/`mailto:`/`wa.me`.

---

## Fase 5 — Formulários do CMS: ligar campos a recursos que a API já oferece

**Objetivo:** três formulários que improvisam campos apesar de a API já expor o recurso certo. O item 1 é **correção de defeito**, não melhoria.

1. **Picker da biblioteca no banner.** A API espera `desktop_image_library_id: string` e `mobile_image_library_id?: string` ([banner.ts:15-16](../../src/api/stetsom/model/banner.ts#L15-L16)), mas o form usa um `<input type="file">` local com preview via `URL.createObjectURL` ([banner-form.tsx:96-164](../../src/app/admin/banners/_components/banner-form.tsx#L96-L164), L383, L402) — ou seja, produz um `File` onde o contrato pede um id de asset. Remover o `ImageUploadSlot` e montar o `LibraryPickerModal` de [library-asset-picker.tsx:129](../../src/app/admin/_components/crud/library-asset-picker.tsx#L129), que já traz abas Biblioteca/Enviar novo, busca e grid, e devolve o id correto.
2. **Combobox de produto no banner.** Substituir o `Input` de texto livre com ID ([banner-form.tsx:238-246](../../src/app/admin/banners/_components/banner-form.tsx#L238-L246)) por busca real com `useGetApiProducts({ q: debouncedQuery, pageSize: 20 })` e debounce local de ~300ms.
   - O [combobox.tsx](../../src/components/ui/combobox.tsx) é um wrapper **composável** sobre as primitivas do `@base-ui/react` (Trigger, Input, List, Item, Empty), não um componente fechado com prop `options`. A busca assíncrona se resolve por composição — renderizar como itens o resultado da query e desligar a filtragem interna. **Não é necessário alterar o componente compartilhado.**
3. **Lat/lng do parceiro com busca por CEP.** Item reclassificado de backend para frontend. O form ([parceiros-content.tsx](../../src/app/admin/parceiros/_components/parceiros-content.tsx)) tem endereço (L82, L137-138) e CEP (L163) mas nunca captura nem envia coordenadas, apesar de `postApiPartnerLocationsBody.lat/lng` e `patchApiPartnerLocationsIdBody.lat/lng` existirem. Adicionar:
   - botão "Buscar coordenadas" chamando `GET /api/geocode/search` com o CEP ou endereço digitado;
   - campos lat/lng preenchidos pelo retorno, **editáveis manualmente** para ajuste fino;
   - envio no POST/PATCH.

   Sem isso, todo parceiro cadastrado pelo CMS entra sem coordenadas e não aparece no mapa do site.

**Verificar:** criar e editar banner em `/admin/banners`, imagem persistindo após reload e produto salvando o id; cadastrar parceiro com CEP e conferir o pin no mapa em `/onde-comprar` (ou rota equivalente do explorador).

---

## Fase 6 — Switch de publicação por idioma

**Objetivo:** o item de maior risco de design. Fazer isolado, sem outra frente aberta.

O contexto que torna isso delicado: **não existe validação client-side de produto hoje** — sem schema zod, `wizard.tsx` permite navegação livre entre passos e o servidor é o único validador. "Idiomas cadastrados" é texto read-only derivado ([step-publish.tsx:128-131](../../src/app/admin/_components/product-wizard/step-publish.tsx#L128-L131)), e `deriveLocales` ([wizard-store.ts:411-417](../../src/app/admin/_components/product-wizard/wizard-store.ts#L411-L417)) liga en/es automaticamente assim que qualquer campo é digitado.

1. **Módulo de regra trocável** — novo `src/app/admin/_components/product-wizard/locale-publish-rules.ts`:

```ts
export type LocaleFieldRule = {
  key: string;
  label: string;
  isFilled: (s: WizardState, l: Locale) => boolean;
};

// PROVISÓRIO — pendente de definição com o backend (ver plano-back-cms.md)
export const REQUIRED_LOCALE_FIELDS: LocaleFieldRule[] = [ /* nome, descrição */ ];

export function validateLocale(s: WizardState, l: Locale): { ok: boolean; missing: string[] };
```

Um único array é toda a superfície de troca quando o backend definir a lista real. **Não** introduzir zod aqui: criar um schema de produto do zero é scope creep contra uma base onde o servidor valida tudo — o array de regras é mais honesto sobre o estado atual.

2. **Store.** Adicionar `enabledLocales: Locale[]` explícito ao `wizard-store.ts`, semeado na hidratação (`wizard-sync.ts`) a partir do `deriveLocales` atual, para que produtos existentes se comportem exatamente como hoje. `pt` sempre ligado, switch desabilitado.
3. **Persistência sem mudança de contrato.** `buildPayload` ([wizard-store.ts:433-435](../../src/app/admin/_components/product-wizard/wizard-store.ts#L433-L435)) omite `name[l]`/`description[l]` das locales desligadas. É exatamente o inverso do `deriveLocales`, então o round-trip é estável e **não exige nada da API**.
4. **UI.** Substituir o texto read-only por uma linha de `ToggleSwitch` por idioma, reusando [toggle-switch.tsx](../../src/app/admin/_components/product-wizard/toggle-switch.tsx) (o controle próprio do wizard, não o shadcn `ui/switch.tsx`), com chips dos campos faltantes quando `validateLocale` falha.
5. **Comportamento no save**, dado que a navegação entre passos é livre — dois níveis:
   - `deriveStatus` resultando em `DRAFT`: salva normalmente, locales inválidas apenas saem do payload.
   - `PUBLISHED`/`SCHEDULED`: `use-wizard-mutations.ts` bloqueia a mutation e dispara `adminToast.error` nomeando idiomas e campos pendentes.

   É o portão mínimo que impede publicar tradução quebrada sem impor validação a todo o wizard.

**Verificar:** ligar `en` com descrição vazia → publicação bloqueada, rascunho permitido; desligar `es` num produto existente → campos somem após reload; produto antigo abre com os mesmos idiomas de antes.

---

## Itens de front pendentes de decisão (não agendados)

**Descrições textarea → rich-text.** O alvo é ambíguo: o `banner-form.tsx` **não tem campo de descrição algum**. Os `multiline` reais estão em [general-editor.tsx:163](../../src/app/admin/_components/product-wizard/general-editor.tsx#L163) (descrição de produto), `faq-items-field.tsx` e ~15 campos de seções em `section-field-spec.ts`. Definir o alvo antes de agendar.

Dois riscos que essa tarefa carrega:

- Se for a descrição de produto, arrasta mudança acoplada no site público: [product-detail-view.tsx](../../src/app/[locale]/(site)/produtos/[slug]/_components/product-detail-view.tsx) hoje renderiza texto puro e passaria a precisar de HTML **sanitizado** — seguir o `safeHtml` de `blocks/html-block.tsx:21`, **não** o `dangerouslySetInnerHTML` cru de `legal/[slug]/page.tsx:33-36`.
- O `LegalEditor` é **não-controlado** e depende de remount via `key`. Jogá-lo direto dentro do `I18nInput` quebra: trocar aba de idioma exige remount, e qualquer `onChange` com debounce **perde as últimas teclas no unmount**. O caminho é um `i18n-rich-text.tsx` dedicado que (a) comita o HTML a cada mudança, sem debounce, e (b) faz flush explícito no handler de troca de aba, antes do remount. Orçar como tarefa própria, não como "trocar o input".

**Documentos nas páginas legais** depende da Fase 3 (OUTROS). O toolbar do editor **já tem comando de link** ([toolbar.tsx:94-103](../../src/components/editor/legal/toolbar.tsx#L94-L103)), hoje via `window.prompt("URL do link:")` — o trabalho é trocar esse prompt por seleção na biblioteca, não criar o comando.

---

## Verificação geral

Não há test runner configurado. O portão de cada fase é:

```bash
pnpm lint
pnpm tsc --noEmit
pnpm build
```

Mais a verificação manual por fase. Rotas a abrir ao final: `/` (pt/en/es), `/produtos`, um PDP com certificados, `/suporte`, `/admin/paginas`, `/admin/biblioteca/outros`, `/admin/banners`, `/admin/parceiros`, e o wizard de produto no passo Publicação.

## Ordem e dependências

Fases 1–5 são independentes entre si e podem ser reordenadas conforme prioridade de negócio. Três amarrações reais:

- O bump de versão no `package.json` precisa entrar **antes ou junto** do rótulo na sidebar (Fase 3).
- Documentos nas páginas legais dependem da categoria OUTROS (Fase 3).
- A Fase 6 fica por último de propósito: é a única que mexe na store do wizard e a única que introduz um conceito novo (validação client-side) numa base que não tem nenhum.

Nada neste plano depende de entrega do `plano-back-cms.md`. Os dois podem correr em paralelo.
