# Plano de execução — Backend / API (CMS)

> Plano derivado de `backlog-novidades-cadastro-parceiros-cms.md`, cobrindo **o que depende do repositório da API**.
> Contrapartida de frontend: `plano-front.md`.
> Levantamento feito a partir do cliente gerado (`src/api/stetsom/`) e do consumo real no front, em 2026-08-10.

**Escopo e limitação.** Este documento foi escrito de dentro do repositório de frontend. Ele descreve **o que o front precisa e por quê**, com contrato proposto — não a implementação no backend. Onde o comportamento atual da API não pôde ser verificado daqui, o item está marcado como *a confirmar* em vez de afirmado.

---

## Antes de começar: cinco itens do backlog que **não** precisam de backend

O levantamento original atribuiu ao backend trabalho que já está entregue. Confirmar antes de abrir ticket:

| Item do backlog | Situação real |
|---|---|
| Expor certificados vinculados ao produto | **Já existe.** `product.files` é `ProductFile[]` com `type: "CERTIFICATE"` válido, e o CMS já sobe certificados. Falta só o dropdown no site — está no plano de front. |
| Lat/lng no cadastro de parceiro com busca por CEP | **Já existe.** `postApiPartnerLocationsBody.lat/lng`, `patchApiPartnerLocationsIdBody.lat/lng` e `GET /api/geocode/search` (aceita cidade, estado ou CEP de 8 dígitos) → `geocodeResult.lat/lng`. O que falta é o formulário do CMS usar — está no plano de front. |
| Tipo "OUTROS" no schema da biblioteca | **Já existe** no enum: `LibraryAssetType.OTHER`. Resta apenas confirmar que os endpoints de listagem/upload aceitam e filtram por esse valor (ver item 6 abaixo). |
| Endpoint de busca de produto para o combobox do banner | **Já existe.** `GET /api/products` aceita `q?: string`. |
| Upload manter o nome original | O front **já envia `file.name` cru**, sem slugify. Se o nome chega mangled, a normalização é server-side (ver item 4). |

---

## 1. Produto de exportação — campo novo no schema

**Bloqueia:** filtro "produtos de exportação" na listagem do site.

Hoje o front tem o toggle pronto e funcional na UI (sidebar desktop e bottom sheet mobile), mas ele é decorativo: `use-catalog-filters.ts:97-107` grava `export=1` na URL e o comentário no código registra que *"no export-line concept exists in the product schema yet"*. O filtro muda a URL e não muda nada no resultado.

**Contrato proposto**

- Campo booleano no produto — sugestão `is_export: boolean`, para casar com o `is_discontinued` que já existe.
- Exposto tanto no `Product` (detalhe) quanto no `ProductCardItem` (listagem), como já acontece com `is_discontinued`.
- Parâmetro de filtro em `GET /api/products` — sugestão `export?: boolean`, seguindo a convenção do `discontinued` atual.
- Editável no CMS pelo wizard de produto.

**Decisão pendente do negócio:** "produto de exportação" é uma flag simples ou uma lista de países/mercados? O front assumiu flag booleana. Se for lista, o contrato muda e o toggle vira multi-select.

---

## 2. Atributo com tipo Matrix | Text

~~**Bloqueia:** exibição condicional de atributos (matrix como tabela aninhada, text normal).~~

**Resolvido no front sem esperar este contrato (2026-08-11, commit `6a8db56`).** Em vez do campo `display_type` proposto abaixo, a solução adotada foi por **convenção**: um atributo listado mais de uma vez na mesma variante (mesmo `attribute_id`, `order` diferente) é tratado como matriz e as linhas são empilhadas; listado uma única vez, é exibido como texto simples. Ver `src/lib/specs/matrix.ts` e `spec-value.tsx`. O mesmo commit também acrescentou `description` opcional ao atributo (`VariantAttrDescription`/`VariantAttrInputDescription` no schema), então o texto menor abaixo de cada linha já é dado real da API, não front sozinho.

Este item **pode sair do backlog de backend** — não é mais bloqueador. Fica como nota histórica caso a convenção por repetição se mostre frágil em uso real e a equipe decida migrar para um campo explícito:

<details>
<summary>Contrato original proposto (não implementado, mantido para referência)</summary>

- Campo `display_type: "TEXT" | "MATRIX"` no schema de atributo (ou no template de atributos, se a decisão for por template e não por atributo).
- Default `"TEXT"` para todo atributo existente, garantindo que nada mude de comportamento na migração.
- Editável no CMS na tela de atributos.

</details>

---

## 3. Versionamento de arquivos — o maior bloco de pendências

**Bloqueia:** três dos cinco sub-itens de "Biblioteca de arquivos e versionamento".

A tela `asset-versions-tab.tsx` já tem upload de nova versão e histórico marcando qual é a atual. O comentário no próprio arquivo (L17-20) registra o bloqueio: *"There is no API to promote an older version, so the list only marks which one is current."*

### 3.1 Promover uma versão anterior

Sem isso não há rollback: se a versão nova sai errada, a única saída é subir de novo o arquivo antigo como versão ainda mais nova.

**Contrato proposto:** `POST /api/library/{id}/versions/{versionId}/promote` → devolve o asset com a versão promovida marcada como atual.

### 3.2 Apagar uma versão específica

~~**Contrato proposto:** `DELETE /api/library/{id}/versions/{versionId}`.~~

**Entregue (2026-08-11, commit `22f8122`).** O endpoint existe e está integrado — `asset-versions-tab.tsx` chama `deleteApiLibraryIdVersionsVersionId`, e os modelos `orval` foram regenerados a partir do novo contrato (`deleteApiLibraryIdVersionsVersionId200`). **Ainda em aberto:** confirmar a regra de borda no servidor — a UI já bloqueia apagar a versão atual (botão só aparece nas outras), mas não é possível confirmar daqui se a API também rejeita com 409 para quem chamar o endpoint direto. Recomendação original mantida: rejeitar, exigindo promoção explícita antes.

### 3.3 Depreciar/renomear o arquivo anterior no bucket

**100% backend, sem contrato de API envolvido.** Ao subir nova versão, o arquivo anterior é renomeado no storage com sufixo datado (ex.: `produto-x-09-07-2026-v1`) e o arquivo novo mantém o nome limpo. O objetivo é que a URL "limpa" sempre aponte para a versão corrente.

**Atenção:** se URLs de versões antigas já estiverem publicadas em algum lugar (páginas legais, e-mails, site antigo), o rename as quebra. Confirmar a política de permalink antes de implementar.

---

## 4. Upload — preservação do nome original

**Verificação antes de virar tarefa.**

O front já envia `file.name` cru para o presign e como `filename` do asset, sem slugify, uuid ou timestamp. Portanto:

- Se o nome exibido no CMS chega correto → **item já está resolvido**, fechar sem trabalho.
- Se chega normalizado/mangled → a normalização acontece no backend e é lá que precisa ser removida ou ajustada.

**Teste sugerido:** subir `Caixa Selada 12".pdf` (espaços, acento, aspas) e conferir o `filename` retornado.

**Decisão a alinhar:** o nome de **exibição** e o nome de **objeto no bucket** podem divergir — é comum e desejável guardar o original como metadado e usar uma chave sanitizada no storage. Definir qual dos dois o pedido "manter o nome original" se refere.

---

## 5. Importação de parceiros via planilha

**Bloqueia:** cadastro em lote de parceiros.

Não há endpoint de import conhecido. É funcionalidade nova, ponta a ponta: endpoint no backend + tela de upload no CMS.

**Contrato proposto**

- `POST /api/partner-locations/import` recebendo CSV ou XLSX.
- Resposta com relatório por linha: total processado, criados, atualizados e a lista de erros com número da linha e motivo — sem isso a tela de upload não tem o que mostrar quando falha parcialmente.
- Definir a chave de deduplicação (CNPJ? nome + cidade?) para decidir entre criar e atualizar.
- **Geocodificação no import:** as linhas provavelmente virão com endereço e sem coordenadas. Aproveitar o `GET /api/geocode/search` que já existe para preencher lat/lng durante o import, e reportar as linhas que não geocodificaram.

**Precedência:** este item só faz sentido depois que o cadastro individual estiver gravando lat/lng corretamente (Fase 5 do plano de front).

---

## 6. Biblioteca — confirmar suporte à categoria OUTROS

~~**Provavelmente já pronto, confirmar.**~~

**Confirmado (2026-08-11, commit `22f8122`).** O front já está no ar com a aba OUTROS (`/admin/biblioteca/outros`, `UPLOAD_CONFIG.others` em `lib.ts`) consumindo o endpoint de listagem existente — se o filtro por tipo ou o upload não aceitassem `OTHER`, a tela não teria como ter sido entregue funcional nesta rodada. Sem acesso ao repositório da API para confirmar 100% via código, mas o uso end-to-end do front é evidência forte de que fecha sem trabalho adicional de backend.

---

## 7. Publicação por idioma — definir os campos obrigatórios

**Não bloqueia o front, mas define a regra final.**

O front vai implementar o switch por idioma com a validação isolada num módulo trocável (`locale-publish-rules.ts`), usando **nome + descrição** como regra provisória. A persistência foi desenhada para **não exigir mudança de contrato**: idiomas desligados simplesmente saem do payload, que é exatamente o inverso da derivação atual.

**O que o backend precisa definir:**

- Qual é a lista real de campos obrigatórios por idioma para um produto ser publicável naquele idioma. Nome e descrição são o mínimo — entram também specs/atributos traduzidos? SEO/meta?
- Se a validação deve ser espelhada no servidor. Hoje o servidor é o único validador de produto, então uma regra só no front é contornável por chamada direta à API.

**Decisão de arquitetura pendente:** publicação por idioma continua sendo *derivada* da presença de campos, ou vira **estado explícito** no schema (ex.: `published_locales: string[]`)? A abordagem derivada não exige nada da API; a explícita é mais previsível mas precisa de campo novo. O front está sendo construído para funcionar nos dois cenários.

---

## 8. Rich-text — formato de persistência

**Pendente de decisão conjunta, antes de qualquer código.**

O front já tem editor rich-text (`prosekit`), usado hoje nas páginas legais, que persistem **HTML**. Se os campos de descrição migrarem de textarea para rich-text, é preciso decidir:

- O campo salvo passa de string simples para **HTML** (consistente com as páginas legais) ou **JSON estruturado**? Recomendação: HTML, por consistência com o que já existe e por não exigir renderizador próprio.
- **Sanitização é responsabilidade de quem?** Hoje o site tem os dois padrões convivendo: `blocks/html-block.tsx` sanitiza antes de renderizar, `legal/[slug]/page.tsx` faz `dangerouslySetInnerHTML` cru no que vem da API. Recomendação: sanitizar **na escrita, no backend**, e manter a sanitização no front como segunda camada.
- Migração dos valores existentes: texto puro vira `<p>texto</p>` automaticamente ou fica como está?

---

## 9. Bloco "Novidades" — limpeza no schema de seções

**Baixa prioridade, cosmético.**

O front removeu `label` e `title` do editor de seções e está removendo o bloco `featured` por completo da home. Consequências no lado da API:

- Se o backend ainda persiste/retorna o bloco `featured` com `label`, `title` e `spotlightTitle`, esses campos passam a ser ignorados pelo front. Não quebra nada, mas vira dado morto.
- Registros existentes mantêm valores obsoletos que ninguém mais edita nem lê. Limpar quando for conveniente.

Não há urgência nem risco em deixar como está.

---

## 10. Dashboard — descoberta de métricas via Analytics

**Tarefa de investigação e especificação, não de implementação.**

O `/admin` hoje é um dashboard interno de CRUD (contadores, atividade recente) via `useGetApiDashboard`. Não há nenhuma referência a Google Analytics/GA4 em todo o admin.

**A decidir antes de dividir em front/back:**

1. **Quais métricas** o negócio quer ver — produtos mais visitados, origem de tráfego, conversão de contato, downloads de manual/certificado?
2. **Qual a fonte** — GA4? O próprio backend instrumentando eventos?
3. **Qual o caminho dos dados** — front consultando a API do GA4 diretamente (expõe credencial, exige OAuth no browser) ou **backend como proxy** (recomendado: mantém credencial no servidor, permite cache e agregação)?

A recomendação é proxy pelo backend com um endpoint agregador (`GET /api/dashboard/analytics`), porque a alternativa coloca credencial de GA4 no cliente.

---

## Resumo por prioridade

| # | Item | Tipo | Desbloqueia | Status |
|---|---|---|---|---|
| 3.1 | Promover versão de arquivo | Endpoint novo | Rollback de arquivo — sem isso não há como reverter | ⬜ Pendente — maior prioridade agora |
| 1 | Campo de produto de exportação | Campo novo | Filtro já pronto na UI, hoje inerte | ⬜ Pendente |
| 5 | Import de parceiros via planilha | Feature nova | Cadastro em lote | ⬜ Pendente |
| 3.3 | Rename/depreciação no bucket | Storage | Higiene do bucket | ⬜ Pendente |
| 7 | Definir obrigatórios por idioma | Decisão | Regra final do switch (front não fica bloqueado) | ⬜ Pendente |
| 8 | Formato do rich-text | Decisão | Migração das descrições | ⬜ Pendente |
| 4 | Nome original no upload | Verificação | Pode fechar sem trabalho | 🟡 Front já preserva, falta round-trip com API no ar |
| 10 | Métricas de Analytics | Descoberta | Dashboard | ⬜ Pendente |
| 9 | Limpar schema do bloco featured | Cosmético | Nada | ⬜ Pendente (baixa prioridade) |
| 3.2 | Apagar versão específica | Endpoint novo | Botão de exclusão no CMS | ✅ Entregue (commit `22f8122`) |
| 2 | Tipo Matrix \| Text no atributo | Campo novo | Exibição de ficha técnica | ✅ Resolvido por convenção no front (commit `6a8db56`), sem precisar do campo |
| 6 | Confirmar OUTROS na biblioteca | Verificação | Pode fechar sem trabalho | ✅ Confirmado em uso (commit `22f8122`) |

## Observação sobre paralelismo

Nenhum item do `plano-front.md` depende de entrega deste plano. Os dois times podem correr em paralelo, com três pontos de contato:

- **Item 7** define a regra final do switch de idioma, mas o front já entrega com regra provisória isolada.
- **Item 8** precisa estar decidido antes de o front começar a migração de rich-text.
- **Item 5** (import) só faz sentido depois que o cadastro individual de parceiro gravar lat/lng — que é entrega do front.
