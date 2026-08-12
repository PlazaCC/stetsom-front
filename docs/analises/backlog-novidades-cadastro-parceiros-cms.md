# Backlog — Site & CMS (divisão Frontend / API)

> Levantamento das tarefas repassadas, divididas entre o que cabe a **este repositório** (frontend Next.js — Site + Admin/CMS) e o que depende do **repositório da API** (backend).
> Status verificado no código em 2026-08-06 · atualizado em 2026-08-11 com a rodada de implementação · **revisado em 2026-08-11 21:44 após o merge de `develop` com o trabalho do Tiago (biblioteca/versionamento e atributos).**
> Planos de execução: `plano-front.md` e `plano-back-cms.md`.

**Verificação pós-merge (2026-08-11, commit `9cbdc99`, merge de `090015b` com `22f8122`)**

- Sem marcadores de conflito remanescentes no repositório (`git grep` por `<<<<<<<`/`=======`/`>>>>>>>` limpo).
- `pnpm tsc --noEmit` e `pnpm lint` limpos após o merge — nada quebrou na combinação dos dois trabalhos.
- Os dois commits do Tiago (`22f8122` versão/OUTROS, `6a8db56` atributos/matrix) persistiram intactos no merge e trouxeram mudanças reais de contrato da API (modelos `orval` regenerados: `filename` saiu do `PATCH /api/library/{id}`, `DELETE /api/library/{id}/versions/{versionId}` passou a existir) — não são apenas código de tela, o backend já entregou os endpoints correspondentes.
- Revisão de segurança dos diffs: nenhum `dangerouslySetInnerHTML` novo, upload de documentos usa allowlist de MIME espelhando o backend (comentário explícito em `use-upload.ts`), token da API segue anexado só no servidor (`orval-server.ts`) — cliente nunca vê o bearer. Único ponto de atenção (já mapeado no backlog de backend, não é regressão desta rodada): a regra "não apagar a versão atual" só está garantida na UI — falta confirmar se a API também rejeita com 409.

**Legenda de status**

- ✅ **Feito** — implementado, commitado e funcional
- 🔵 **Em revisão** — código escrito nesta rodada, aguardando revisão/merge
- 🟡 **Parcial** — código existe mas incompleto, ou sem o dado do backend
- ⬜ **Não iniciado** — nada encontrado no código

---

## Resumo rápido

| Área | Itens | Feito | Em revisão | Parcial | Não iniciado |
|---|---|---|---|---|---|
| Home — Novidades e Listagem | 4 | 1 | 2 | 1 | 0 |
| Cadastro de produtos (atributos, status e publicação) | 4 | 1 | 2 | 0 | 1 |
| Mapa e cadastro de parceiros | 4 | 2 | 0 | 0 | 2 |
| Biblioteca de arquivos e versionamento | 6 | 0 | 3 | 2 | 1 |
| Editor de banner e admin geral | 4 | 0 | 1 | 0 | 3 |
| Contato, produto e páginas legais | 6 | 2 | 2 | 0 | 2 |
| Dashboard Analytics | 1 | 0 | 0 | 0 | 1 |
| **Total** | **29** | **6** | **10** | **3** | **10** |

*(3 itens migraram de "Não iniciado" para "Em revisão" nesta revisão: os dois de biblioteca entregues no merge do Tiago, e o de atributos Matrix\|Text, resolvido por convenção no front sem precisar do campo novo na API.)*

---

## 1. [Site] — Home: Novidades e Listagem de produtos

### Frontend (este repo)

| Tarefa | Status | Evidência |
|---|---|---|
| Remover headlines e título do bloco Novidades | 🔵 Em revisão | Bloco legado removido de `home-page-view.tsx` junto com o `EditableSection target="section:featured"`. Limpeza em cascata: tipo `HomeFeaturedBlockData` (`page-blocks.ts`), entrada `featured` em `section-field-spec.ts` (incluindo o `spotlightTitle`, que era passado e nunca renderizado), bloco no `data.json` e a chave i18n órfã `Catalog.emptyCategory`. |
| Refatorar bloco Novidades para funcionar só com abas (padrão TCL) | 🔵 Em revisão | `featured-products-legacy.tsx` e `featured-tab-strip-legacy.tsx` apagados; o bloco novo (`featured-products.tsx` + `featured-tab-strip.tsx` + `featured-product-card.tsx` + `build-novelties-by-category.ts`) é o único na home. `NOVELTIES_PAGE_SIZE` deduplicado — agora exportado do builder e importado por `page.tsx`. |
| Filtros da listagem no mobile em bottom sheet | ✅ Feito | `catalog-mobile-filter-sheet.tsx:66-71` usa `<Sheet side="bottom">`. Commit `697f81d`. |
| Lógica de produtos de exportação na listagem (parte de UI) | 🟡 Parcial | Toggle existe no sheet mobile e na sidebar, mas segue decorativo: `use-catalog-filters.ts` tem `// TODO(backend): no export-line concept exists in the product schema yet`. Sem efeito real até a API expor o campo. *(Corrigido nesta rodada: o toggle não resetava a paginação — mesmo bug do `setShowDiscontinued`, que **funciona** e podia deixar o usuário numa página fora do intervalo.)* |

> ⚠️ **Perda de capacidade no CMS:** com a remoção do bloco legado, o toggle `hidden` de Novidades deixou de existir. Não é mais possível esconder a seção pelo admin — a visibilidade passa a depender de haver produtos publicados. Decisão consciente ("substituição literal"), mas precisa ser comunicada a quem opera o CMS.

### Backend (repo da API)

| Tarefa | Status | Evidência |
|---|---|---|
| Remover headline/título do bloco Novidades no schema do CMS | ⬜ Baixa prioridade | O front deixou de ler o bloco `featured` por completo. Se a API ainda persiste `label`/`title`/`spotlightTitle`, viram dado morto — limpar quando conveniente. Não quebra nada. |
| Expor conceito de "produto de exportação" no schema de produto | ⬜ Não iniciado | Sugestão de contrato: `is_export: boolean` no produto e no card, + filtro `export?: boolean` em `GET /api/products`. **Decisão pendente:** é flag booleana ou lista de países/mercados? |

---

## 2. [Site] — Cadastro de produtos: atributos, status e publicação multilíngue

### Frontend (este repo)

| Tarefa | Status | Evidência |
|---|---|---|
| Filtrar template de atributos por categoria | ✅ Feito | `category-templates-section.tsx:16-18` filtra `templates.filter(t => t.category_id === categoryId)`. |
| Corrigir e renomear "fora de linha" → "descontinuado" | 🔵 Em revisão | Três defeitos fechados: (1) rótulo do wizard `step-publish.tsx` agora é "Descontinuado"; (2) `catalog-products-list.tsx` passa o badge, que antes era descartado apesar de `is_discontinued` já existir no `ProductCardItem`; (3) `product-detail-view.tsx:540` não usa mais a string `"Discontinued"` hardcoded em inglês. Somado: `ProductCard` ganhou `badgeTone` (`bg-brand-dark` para descontinuado, distinguindo do futuro "NOVO" em `bg-brand`) e a chave pt-BR `Catalog.showDiscontinued` foi de "Exibir fora de linha" para "Exibir descontinuados". **Não verificado visualmente** — não há produto com `is_discontinued: true` nos mocks. |
| Atributo com tipo Matrix \| Text — exibição condicional | 🔵 Em revisão | **Resolvido sem esperar o campo novo na API.** Commit `6a8db56` (Tiago): `src/lib/specs/matrix.ts` trata a repetição do mesmo `attribute_id` na variante como a própria matriz — não existe flag de tipo, quem lista o atributo mais de uma vez "empilha" as linhas. `SpecValue` (`spec-value.tsx`) renderiza uma linha só como texto simples e duas ou mais como células empilhadas com título + descrição menor. Também trouxe `VariantAttrDescription`/`VariantAttrInputDescription` novos no schema da API (`variantAttr.ts`), então o campo `description` por atributo já existe de verdade, não é só front. |
| Campo de publicação por país: switch com os 3 idiomas | ⬜ Não iniciado | `deriveLocales()` (`wizard-store.ts:411-417`) ativa idiomas automaticamente quando algum campo é preenchido — sem switch manual nem validação. Desenho definido no `plano-front.md` (Fase 6): módulo `locale-publish-rules.ts` com a regra isolada e trocável. Não é bloqueado por API; é grande e mexe na store do wizard. |

### Backend (repo da API)

| Tarefa | Status | Evidência |
|---|---|---|
| Adicionar campo "tipo" (Matrix \| Text) no schema de atributo | ⬜ Não iniciado | Pré-requisito para o front renderizar condicionalmente. **Decisão pendente:** o tipo pertence ao atributo ou ao template de categoria? |
| Definir os campos obrigatórios por idioma para publicação | ⬜ Não iniciado | Não bloqueia o front (regra provisória: nome + descrição, isolada em módulo trocável). Definir a lista real e se a validação deve ser espelhada no servidor. |

---

## 3. [Site] — Mapa e cadastro de parceiros

### Frontend (este repo)

| Tarefa | Status | Evidência |
|---|---|---|
| Lista da esquerda do mapa deve refletir os itens exibidos à direita | ✅ Feito | `service-centers-explorer.tsx:208-219` — `visibleFiltered` filtra pelos bounds do mapa. |
| Revisar comportamento da geolocalização e mobile | ✅ Feito | `service-centers-explorer.tsx:81-92` — `getCurrentPosition` + botão "usar minha localização". *(Validar com quem reportou se "revisar" pede algo além do que já existe.)* |
| **Gravar lat/lng no cadastro de parceiro, com busca via CEP/endereço** | ⬜ Não iniciado | **Reclassificado de backend para frontend.** A API já entrega tudo: `postApiPartnerLocationsBody.lat/lng`, `patchApiPartnerLocationsIdBody.lat/lng` e `GET /api/geocode/search` (aceita cidade, estado ou CEP de 8 dígitos) → `geocodeResult.lat/lng`. O form (`parceiros-content.tsx`) tem endereço e CEP mas **nunca captura nem envia coordenadas** — todo parceiro cadastrado pelo CMS entra sem pin no mapa. |

### Backend (repo da API)

| Tarefa | Status | Evidência |
|---|---|---|
| ~~Adicionar campos de latitude/longitude com busca via CEP~~ | ✅ Já entregue | Campos e endpoint de geocode já existem. Não abrir ticket — ver linha reclassificada acima. |
| Automatizar cadastro de parceiros via planilha (import em lote) | ⬜ Não iniciado | Sugestão: `POST /api/partner-locations/import` (CSV/XLSX) com relatório por linha. Definir chave de deduplicação e aproveitar o geocode existente para preencher lat/lng no import. Só faz sentido depois do cadastro individual gravar coordenadas. |

---

## 4. [CMS] — Biblioteca de arquivos e versionamento

### Frontend (este repo)

| Tarefa | Status | Evidência |
|---|---|---|
| Remover opção de editar nome do arquivo | 🔵 Em revisão | Campo "Nome do arquivo" removido de `edit-asset-dialog.tsx`, junto com o `filename` do schema zod e do corpo do PATCH. O nome segue visível no título do diálogo, então nada de informação se perde. |
| Upload deve manter o nome original do arquivo | 🟡 Parcial | **O front já preserva** — `use-upload.ts` envia `file.name` cru para o presign e como `filename`, sem slugify/uuid/timestamp. Falta o teste de round-trip contra a API (subir algo como `Caixa Selada 12".pdf`); se voltar mangled, a normalização é server-side. |
| Adicionar tipo "OUTROS" na galeria de imagens/arquivos | 🔵 Em revisão | **Entregue no merge do Tiago (commit `22f8122`).** `Tab` em `lib.ts` ganhou `"others"`, com `UPLOAD_CONFIG.others` (accept de `.doc/.docx/.xls/.xlsx/.txt/.csv`, ícone `Paperclip`) e a rota `src/app/admin/biblioteca/outros/page.tsx`. `use-upload.ts` espelha o allowlist de MIME de documentos com o comentário "Must mirror ALLOWED_MIME_TYPES in the API". Segue valendo o aviso: aba sobe vazia até haver upload ou reclassificação de assets existentes. |
| Corrigir criação de novas versões de arquivo | 🟡 Parcial | `asset-versions-tab.tsx` já tem upload de nova versão e histórico marcando "Atual", mas o comentário nas linhas 19-24 registra que **não há API para promover uma versão antiga** — só a exclusão foi resolvida nesta rodada (linha abaixo), promoção continua bloqueada pelo contrato. |
| Permitir apagar uma versão específica de um arquivo | 🔵 Em revisão | **Entregue no merge do Tiago (commit `22f8122`).** Botão de lixeira por versão em `asset-versions-tab.tsx`, chamando `deleteApiLibraryIdVersionsVersionId` — novo na API (`DELETE /api/library/{id}/versions/{versionId}`, endpoint e tipo de resposta regenerados via orval, não é só front). Botão só aparece para versões que não são a atual e quando há mais de uma versão, então a versão em uso nunca some da lista pela UI. |

### Backend (repo da API)

| Tarefa | Status | Evidência |
|---|---|---|
| Endpoint para **promover** uma versão anterior | ⬜ Não iniciado | **Agora a maior prioridade do backlog de backend** (o item de apagar, abaixo, já saiu da lista). Sem isso não existe rollback: se a versão nova sai errada, a única saída é subir o arquivo antigo de novo. Sugestão: `POST /api/library/{id}/versions/{versionId}/promote`. |
| ~~Endpoint para apagar uma versão específica~~ | ✅ Já entregue | `DELETE /api/library/{id}/versions/{versionId}` existe e está integrado (commit `22f8122`, modelos `orval` regenerados). **Falta confirmar a borda:** apagar a versão atual responde 409 no servidor, ou só a UI impede? A UI já bloqueia, mas a regra precisa valer também para quem chamar a API direto. |
| Nova versão deve depreciar/renomear arquivo anterior no bucket | ⬜ Não iniciado | 100% storage. **Atenção:** se URLs de versões antigas já foram publicadas em algum lugar, o rename as quebra — confirmar a política de permalink antes. |
| ~~Adicionar tipo "OUTROS" no schema de biblioteca~~ | ✅ Já entregue | `LibraryAssetType.OTHER` existe. Resta só confirmar que listagem e upload aceitam/filtram esse valor. |
| Upload manter o nome original (persistência) | 🟡 A confirmar | O front já não normaliza. Definir se "nome original" se refere ao nome de exibição ou à chave no bucket — divergir os dois é prática comum e desejável. |

---

## 5. [CMS] — Editor de banner e melhorias gerais do admin

### Frontend (este repo)

| Tarefa | Status | Evidência |
|---|---|---|
| Campo no menu exibindo a versão da release atual | 🔵 Em revisão | Rótulo no rodapé de `admin-sidebar.tsx`, alimentado por `NEXT_PUBLIC_APP_VERSION` injetado em `next.config.ts` a partir do `package.json` (env var explícita tem precedência). Incluiu o bump de `0.1.0` → `1.0.0`, que estava defasado frente ao `CHANGELOG.md`. |
| Wizard de galeria no picker de imagem do banner | ⬜ Não iniciado | **É correção de defeito, não melhoria.** A API espera `desktop_image_library_id: string` / `mobile_image_library_id?: string` (`banner.ts:15-16`), mas o `ImageUploadSlot` (`banner-form.tsx:96-164`) é um `<input type="file">` local com preview via `URL.createObjectURL` — produz um `File` onde o contrato pede um id de asset. O `LibraryPickerModal` (`crud/library-asset-picker.tsx:129`) já existe e devolve o id certo. |
| Combobox com busca de produto para associar produto ao banner | ⬜ Não iniciado | `banner-form.tsx:238-246` é um `<Input>` de texto com o ID. **Não precisa de endpoint novo** (`GetApiProductsParams.q` existe) nem de alterar o componente compartilhado: `combobox.tsx` é um wrapper composável sobre as primitivas do `@base-ui/react`, então busca assíncrona se resolve por composição. |
| Campos de descrição migram de textarea para rich-text | ⬜ Alvo indefinido | **Premissa a esclarecer:** o `banner-form.tsx` **não tem campo de descrição algum**. Os `multiline` reais estão em `general-editor.tsx:163` (descrição de produto), `faq-items-field.tsx` e ~15 campos em `section-field-spec.ts`. Definir o alvo antes de agendar. |

### Backend (repo da API)

| Tarefa | Status | Evidência |
|---|---|---|
| ~~Endpoint de busca de produto para o combobox~~ | ✅ Já entregue | `GET /api/products` aceita `q?: string`. |
| Campos de descrição em rich-text — formato de persistência | ⬜ A definir | HTML (consistente com as páginas legais, que já usam `prosekit`) ou JSON estruturado? Recomendação: HTML. Definir também **quem sanitiza** — hoje o site tem os dois padrões convivendo (`html-block.tsx` sanitiza, `legal/[slug]/page.tsx` não). |

---

## 6. [Site] — Contato, Página de produto e Páginas legais

### Frontend (este repo)

| Tarefa | Status | Evidência |
|---|---|---|
| Telefone, email e WhatsApp clicáveis com deep link correto | ✅ Feito | `support-contact.tsx:36-49` gera `tel:`, `mailto:`, `https://wa.me/{digits}`. |
| Corrigir header transparente / respiro nas páginas legais | ✅ Feito | `header.tsx:75-85` — `isLegal` força header branco e `sticky` nas páginas `/legal/*`. |
| Remover fundo dos ícones dos cards iniciais de contato | 🔵 Em revisão | `bg-brand/10` removido do wrapper em `support-contact.tsx:118`, alinhando com o padrão já aplicado nos cards de navegação (`support-cards.tsx:75`, commit `cb9636f`). |
| QR code para abrir WhatsApp no celular quando acessado via desktop | 🔵 Em revisão | Bloco `hidden lg:flex` em `support-contact.tsx` usando `react-qr-code` (~3 KB, SVG puro, sem dependências), reaproveitando o `getContactHref` existente para gerar o valor. Sem hook de media query — segue a convenção de toggle puro do Tailwind usada no resto do site. Nova chave i18n `whatsappQrHint` nas 3 locales. |
| Dropdown na página de produto para download de certificados | ⬜ Bloqueado por dados | **Não é bloqueio de schema — é de classificação.** O código filtra `f.type === "CERTIFICATE"`, e `product.files` já suporta esse tipo, mas **todos os 39 arquivos de produto na base têm `type: "PDF"`**. O dropdown renderizaria vazio. Ver o achado abaixo. |
| Categoria OUTROS da biblioteca para documentos + links nas páginas legais | ⬜ Não iniciado | Depende da categoria OUTROS (item 4). O toolbar do editor **já tem comando de link** (`editor/legal/toolbar.tsx:94-103`), hoje via `window.prompt` — o trabalho é trocar o prompt por seleção na biblioteca, não criar o comando. |

> 🔴 **Achado novo — regressão silenciosa em produção.** O mesmo filtro por tipo semântico que impede o dropdown de certificados **já quebrou o que existia**: `product-detail-view.tsx:193-198` procura `type === "MANUAL"` e `type === "IMAGE_PACK"`, e nenhum arquivo migrado tem esses tipos. **O link de manual e o de pack de imagens não renderizam para nenhum produto do catálogo migrado.** Uploads novos feitos pelo CMS gravam o tipo correto (`step-files.tsx:33`), então o problema é exclusivo do acervo migrado. *(Verificado no snapshot de mock dumpado da API de develop — confirmar se produção tem a mesma distribuição.)*

### Backend (repo da API)

| Tarefa | Status | Evidência |
|---|---|---|
| **Reclassificar tipos de arquivo do acervo migrado** | ⬜ Não iniciado · **alta prioridade** | Migração de `type: "PDF"` para `MANUAL` / `CERTIFICATE` / `CATALOG`. Heurística de nome como ponto de partida (`manual_*` → MANUAL, `*DoC*` / `*certificad*` → CERTIFICATE) + revisão manual do resto. Desbloqueia o dropdown de certificados **e** restaura os downloads de manual e pack de imagens. |
| ~~Expor schema de certificados vinculados a produto~~ | ✅ Já entregue | `product.files` é `ProductFile[]` com `CERTIFICATE` válido, e o CMS já sobe certificados (`step-files.tsx:30-39`). |
| ~~Suporte a upload com categoria "OUTROS"~~ | ✅ Já entregue | Mesmo item do backlog de biblioteca — enum já contempla. |

---

## 7. [CMS] — Dashboard: descoberta de métricas via Analytics

| Tarefa | Repo | Status | Evidência |
|---|---|---|---|
| Descoberta/definição de quais métricas trazer do Analytics | Ambos (discovery) | ⬜ Não iniciado | `admin/page.tsx` usa `useGetApiDashboard`, mas é um dashboard interno de CRUD. Nenhuma referência a GA4 em todo `src/app/admin`. Decidir **quais métricas**, **qual fonte** e **qual caminho dos dados** — recomendação: proxy pelo backend (`GET /api/dashboard/analytics`), porque a alternativa coloca credencial de GA4 no cliente. |

---

## Observações gerais

- **Dez tarefas estão em revisão** após o merge com o trabalho do Tiago (sete desta rodada + três que vieram prontas no merge: OUTROS na biblioteca, apagar versão, e Matrix\|Text em atributos), todas verificadas com `pnpm lint` e `pnpm tsc --noEmit` limpos no estado pós-merge. Duas ressalvas de verificação seguem de pé: o badge de descontinuado não pôde ser visto em tela (nenhum produto com `is_discontinued: true` nos mocks) e o round-trip de nome de arquivo no upload precisa da API no ar.
- **Sincronização com o ClickUp (quadro Stetsom):** duas tarefas que já estavam prontas no código mas seguiam em "em progresso" foram movidas para "em revisão" — *QR code do WhatsApp* e *Remover headlines/título do bloco Novidades*. Uma terceira (*Campo no menu com a versão da release*, também já implementada em `admin-sidebar.tsx` via `NEXT_PUBLIC_APP_VERSION`) **não pôde ser movida** — a API do ClickUp bloqueou por rate limit (~159 min de espera a partir de 2026-08-11 21:5x). Mover manualmente ou repetir a sincronização depois desse horário. As tarefas de biblioteca/atributos vindas do merge do Tiago **já estavam corretamente em "em revisão" no quadro** antes desta revisão — nada a corrigir ali.
- **Cinco itens atribuídos ao backend já estavam entregues** e foram marcados como tal: certificados de produto, lat/lng de parceiro com geocode por CEP, enum `OTHER` na biblioteca, busca de produto por `q`, e preservação do nome no upload. Vale conferir antes de abrir ticket na API.
- **A maior descoberta desta rodada não estava no backlog:** a classificação de tipos de arquivo. Ela derruba a premissa de que certificados eram "só renderizar" e revela que manual e pack de imagens já estão quebrados no catálogo migrado. Entrou como item de alta prioridade no backend.
- **Escrita não funciona em modo mock** — `USE_MOCK_DATA=1` serve leitura, mas toda mutation é no-op (`api/bff/[...path]/route.ts:57-58`). Tarefas de formulário do CMS (picker de banner, combobox de produto, lat/lng de parceiro) podem ser codificadas offline, mas só fecham com a API de develop no ar.
- A biblioteca de arquivos segue como a área mais dependente de backend: 3 dos 6 sub-itens precisam de endpoint novo, e "promover versão" é o bloqueador mais crítico do backlog inteiro.
- Seção 2 foi corrigida numa revisão anterior: eram 4 tarefas distintas, não 3 linhas duplicadas de uma só.
