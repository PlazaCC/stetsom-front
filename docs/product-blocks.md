# Blocos de Produto

Referência dos blocos de página de produto: tipos, campos de conteúdo, estilização universal e tipagens.

Fonte no código:

- Editor CMS: `src/app/admin/_components/crud/product-block-registry.tsx`
- Renderização pública: `src/app/[locale]/(site)/produtos/[slug]/_components/blocks/`
- Helpers e tipos: `src/lib/utils/product.ts`
- Modelos da API: `@/api/stetsom/model` (`ProductBlock`, `ProductBlockType`, `ProductBlockData`)

A decisão de escopar o CSS customizado por instância de bloco está registrada em [ADR 0006](adrs/0006-scoped-css-per-block-instance.md).

## Envelope do bloco

Todo bloco compartilha a mesma estrutura. Apenas `data` varia por tipo.

```ts
interface ProductBlock {
  block_id: string; // id estável, gerado automaticamente
  type: ProductBlockType;
  order: number; // renderização por ordem ascendente
  data: ProductBlockData; // conteúdo do tipo + style opcional
}

type ProductBlockType =
  | "TEXT"
  | "IMAGE"
  | "VIDEO"
  | "HTML"
  | "MODEL3D"
  | "GALLERY";

// Record aberto. Cada tipo usa um subconjunto das chaves.
type ProductBlockData = { [key: string]: unknown };
```

`data.style` é opcional e funciona em qualquer tipo. Ver [Estilização universal](#estilização-universal).

## Tipos de bloco

Cada tabela lista o que o CMS grava em `data`. A coluna Obrigatório marca o que o bloco precisa para renderizar.

### TEXT — Texto

Título opcional, corpo de texto rico e alinhamento.

| Campo     | Tipo                            | Obrigatório | Descrição                                                                               |
| --------- | ------------------------------- | ----------- | --------------------------------------------------------------------------------------- |
| `title`   | `string`                        | Não         | Título do bloco. Renderiza em `h2.blockText__title`.                                    |
| `content` | `string`                        | Sim         | Corpo de texto. Renderiza em `p.blockText__paragraph`.                                  |
| `align`   | `"left" \| "center" \| "right"` | Não         | Alinhamento do bloco. Padrão `left`. Aplicado na raiz e herdado por título e parágrafo. |

O bloco não renderiza quando `title` e `content` estão vazios.

### IMAGE — Imagem

Imagem única com cabeçalho e legenda opcionais.

| Campo         | Tipo     | Obrigatório | Descrição                                              |
| ------------- | -------- | ----------- | ------------------------------------------------------ |
| `title`       | `string` | Não         | Título acima da imagem. Renderiza em `BlockHeader`.    |
| `description` | `string` | Não         | Descrição acima da imagem. Renderiza em `BlockHeader`. |
| `library_id`  | `string` | Sim         | Id do asset na biblioteca.                             |
| `file_url`    | `string` | Não         | URL do asset. Preenchido pelo seletor de biblioteca.   |
| `caption`     | `string` | Não         | Legenda abaixo da imagem. Resolvida pela API pública.  |

A API pública resolve o asset para `images: string[]`. Sem imagem, o bloco usa a thumbnail do produto como fallback.

### VIDEO — Vídeo

Vídeo do YouTube embedado, com cabeçalho opcional.

| Campo         | Tipo     | Obrigatório | Descrição                                                             |
| ------------- | -------- | ----------- | --------------------------------------------------------------------- |
| `title`       | `string` | Não         | Título do bloco. Cai em um texto padrão quando vazio.                 |
| `description` | `string` | Não         | Descrição do bloco. Cai em um texto padrão quando vazio.              |
| `url`         | `string` | Sim         | URL do YouTube. Aceita formatos watch, youtu.be, embed, shorts e /v/. |

Sem embed válido, o bloco mostra um link para o vídeo. A leitura pública aceita `url` ou `video_url`.

### HTML — HTML customizado

Conteúdo HTML livre, sanitizado na renderização.

| Campo     | Tipo     | Obrigatório | Descrição                                                                          |
| --------- | -------- | ----------- | ---------------------------------------------------------------------------------- |
| `content` | `string` | Sim         | HTML do bloco. A API pública resolve para `html` e o front sanitiza com DOMPurify. |

Não aceita título, descrição nem estilização BEM. Aceita o objeto `style` universal.

### MODEL3D — Modelo 3D

Arquivo `.glb` interativo com fundo de cena próprio.

| Campo                | Tipo     | Obrigatório | Descrição                                             |
| -------------------- | -------- | ----------- | ----------------------------------------------------- |
| `modelFile`          | `string` | Sim         | Id do `.glb` na biblioteca.                           |
| `file_url`           | `string` | Não         | URL do `.glb`. Preenchido pelo seletor de biblioteca. |
| `backgroundColor`    | `string` | Não         | Cor de fundo da cena 3D. Formato hex.                 |
| `backgroundImage`    | `string` | Não         | Id da imagem de fundo da cena.                        |
| `backgroundImageUrl` | `string` | Não         | URL da imagem de fundo da cena.                       |

`backgroundColor` e `backgroundImageUrl` aqui alimentam o canvas 3D. São distintos do fundo do wrapper em `style`. O bloco não renderiza sem `file_url`.

### GALLERY — Galeria

Grade de imagens com cabeçalho opcional.

| Campo         | Tipo                                          | Obrigatório | Descrição                                             |
| ------------- | --------------------------------------------- | ----------- | ----------------------------------------------------- |
| `title`       | `string`                                      | Não         | Título acima da grade. Renderiza em `BlockHeader`.    |
| `description` | `string`                                      | Não         | Descrição acima da grade. Renderiza em `BlockHeader`. |
| `images`      | `{ library_id: string; file_url?: string }[]` | Sim         | Imagens da galeria.                                   |

A leitura pública aceita cada item como string ou como objeto com `file_url`. O bloco não renderiza com a lista vazia.

## Estilização universal

Editada na aba Estilização e disponível em todos os tipos. Fica em `data.style`.

```ts
type BlockStyle = {
  fullWidth?: boolean;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  customId?: string;
  customCss?: string;
};
```

| Campo                | Tipo      | Descrição                                                                                                                                     |
| -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `fullWidth`          | `boolean` | Rompe o `Container` da página e ocupa a largura total. Padrão `false`, com o conteúdo dentro do `Container` (`max-w-360`, `px-5 lg:px-42.5`). |
| `backgroundColor`    | `string`  | Cor de fundo do `<article>` raiz. Formato hex ou cor CSS.                                                                                     |
| `backgroundImageUrl` | `string`  | URL da imagem de fundo do wrapper. Aplicada com `cover` e centralizada.                                                                       |
| `customId`           | `string`  | Sobrescreve o id automático no atributo `id` e no escopo do CSS. O id automático nunca é removido.                                            |
| `customCss`          | `string`  | CSS escopado a esta instância do bloco. Cada seletor recebe o prefixo `[data-block-scope="<id>"]`.                                            |

O CMS também grava `backgroundImage` com o `library_id` da imagem de fundo. O front usa só `backgroundImageUrl`.

### Identificador e escopo

A raiz de cada bloco é um `<article>` com `id` e `data-block-scope`. O valor é `customId` quando preenchido, senão o `block_id` automático.

```html
<article id="meu-id" data-block-scope="meu-id" class="blockText ...">
  <h2 class="blockText__title ...">...</h2>
  <p class="blockText__paragraph ...">...</p>
</article>
```

### CSS escopado

O autor escreve CSS normal mirando as classes BEM do bloco. Cada seletor é prefixado com o escopo na renderização, então a regra afeta apenas aquela instância. Regras `@media`, `@supports` e `@container` são escopadas recursivamente. `@keyframes` e `@font-face` passam intactas.

```css
/* Escrito na aba Estilização */
.blockText__paragraph {
  color: #e8132a;
}

/* Injetado na página */
[data-block-scope="meu-id"] .blockText__paragraph {
  color: #e8132a;
}
```

## Contrato tipado e validação

Esta seção prepara o terreno para uma união discriminada por `type`, compartilhada entre back e front. O discriminante é `type`, no nível do bloco. Cada membro carrega seu próprio `data`.

### Estilo compartilhado

Reusado por todos os tipos dentro de `data.style`.

```ts
interface BlockStyle {
  fullWidth?: boolean;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  customId?: string;
  customCss?: string;
}
```

### Tipagens de `data` por bloco

Forma de autoria. É o que o CMS grava e o que o backend valida na escrita. `WithStyle` anexa o estilo universal opcional a qualquer `data`.

```ts
type WithStyle<T> = T & { style?: BlockStyle };

interface TextBlockData {
  title?: string;
  content: string;
  align?: "left" | "center" | "right";
}

interface ImageBlockData {
  title?: string;
  description?: string;
  library_id: string;
  file_url?: string;
  caption?: string;
}

interface VideoBlockData {
  title?: string;
  description?: string;
  url: string;
}

interface HtmlBlockData {
  content: string;
}

interface Model3dBlockData {
  modelFile: string;
  file_url?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundImageUrl?: string;
}

interface GalleryBlockData {
  title?: string;
  description?: string;
  images: { library_id: string; file_url?: string }[];
}
```

### União discriminada

```ts
interface BlockBase {
  block_id: string;
  order: number;
}

type ProductBlock =
  | (BlockBase & { type: "TEXT"; data: WithStyle<TextBlockData> })
  | (BlockBase & { type: "IMAGE"; data: WithStyle<ImageBlockData> })
  | (BlockBase & { type: "VIDEO"; data: WithStyle<VideoBlockData> })
  | (BlockBase & { type: "HTML"; data: WithStyle<HtmlBlockData> })
  | (BlockBase & { type: "MODEL3D"; data: WithStyle<Model3dBlockData> })
  | (BlockBase & { type: "GALLERY"; data: WithStyle<GalleryBlockData> });
```

### Validação com Zod

Schema único, derivável tanto no backend quanto no front. `blockEnvelope` monta cada membro com o `type` literal e seu `data`.

```ts
import { z } from "zod";

const BlockStyleSchema = z.object({
  fullWidth: z.boolean().optional(),
  backgroundColor: z.string().optional(),
  backgroundImageUrl: z.string().optional(),
  customId: z.string().optional(),
  customCss: z.string().optional(),
});

const withStyle = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).extend({ style: BlockStyleSchema.optional() });

const TextBlockDataSchema = withStyle({
  title: z.string().optional(),
  content: z.string(),
  align: z.enum(["left", "center", "right"]).default("left"),
});

const ImageBlockDataSchema = withStyle({
  title: z.string().optional(),
  description: z.string().optional(),
  library_id: z.string(),
  file_url: z.string().optional(),
  caption: z.string().optional(),
});

const VideoBlockDataSchema = withStyle({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url(),
});

const HtmlBlockDataSchema = withStyle({ content: z.string() });

const Model3dBlockDataSchema = withStyle({
  modelFile: z.string(),
  file_url: z.string().optional(),
  backgroundColor: z.string().optional(),
  backgroundImage: z.string().optional(),
  backgroundImageUrl: z.string().optional(),
});

const GalleryBlockDataSchema = withStyle({
  title: z.string().optional(),
  description: z.string().optional(),
  images: z.array(
    z.object({ library_id: z.string(), file_url: z.string().optional() }),
  ),
});

const blockEnvelope = <T extends z.ZodTypeAny>(type: string, data: T) =>
  z.object({
    block_id: z.string(),
    order: z.number().int(),
    type: z.literal(type),
    data,
  });

export const ProductBlockSchema = z.discriminatedUnion("type", [
  blockEnvelope("TEXT", TextBlockDataSchema),
  blockEnvelope("IMAGE", ImageBlockDataSchema),
  blockEnvelope("VIDEO", VideoBlockDataSchema),
  blockEnvelope("HTML", HtmlBlockDataSchema),
  blockEnvelope("MODEL3D", Model3dBlockDataSchema),
  blockEnvelope("GALLERY", GalleryBlockDataSchema),
]);
```

### Autoria versus resolvido

A forma de autoria acima é o contrato de escrita. A API pública resolve referências de asset antes de entregar ao front. A união pública diverge em dois pontos. Trate ambos quando o schema for compartilhado.

| Tipo  | Campo de autoria         | Campo resolvido no público     |
| ----- | ------------------------ | ------------------------------ |
| IMAGE | `library_id`, `file_url` | `images: string[]`, `caption?` |
| HTML  | `content`                | `html`                         |

Os demais tipos têm a mesma forma nos dois contextos. MODEL3D mantém `file_url` e resolve apenas o valor da URL.

## Classes BEM por bloco

Classes embutidas na estrutura HTML. São os alvos do `customCss`. Definidas em `BLOCK_BEM_CLASSES` em `src/lib/utils/product.ts`.

| Tipo    | Base           | Elementos                                                                                                             |
| ------- | -------------- | --------------------------------------------------------------------------------------------------------------------- |
| TEXT    | `blockText`    | `blockText__title`, `blockText__paragraph`                                                                            |
| IMAGE   | `blockImage`   | `blockImage__title`, `blockImage__description`, `blockImage__item`, `blockImage__image`, `blockImage__caption`        |
| VIDEO   | `blockVideo`   | `blockVideo__label`, `blockVideo__title`, `blockVideo__description`, `blockVideo__embed`, `blockVideo__link`          |
| HTML    | `blockHtml`    | —                                                                                                                     |
| MODEL3D | `blockModel3d` | —                                                                                                                     |
| GALLERY | `blockGallery` | `blockGallery__title`, `blockGallery__description`, `blockGallery__grid`, `blockGallery__item`, `blockGallery__image` |

O cabeçalho compartilhado de IMAGE e GALLERY também expõe `<prefixo>__header`.

## Pipeline de renderização

1. `BlockRenderer` lê `data.style`, resolve o escopo e injeta o `<style>` escopado quando há `customCss`.
2. Sem `fullWidth`, o bloco é envolvido em `Container`. Com `fullWidth`, renderiza direto na largura total.
3. `BlockRenderer` passa `rootProps` e `fullWidth` ao componente do tipo.
4. `BlockArticle` monta o `<article>` raiz com `id`, `data-block-scope`, classe BEM base e fundo.

## Helpers de leitura

Convertem o `data` aberto em formas tipadas. Em `src/lib/utils/product.ts`.

| Helper               | Retorno                                        |
| -------------------- | ---------------------------------------------- |
| `toTextBlockData`    | `{ title?, content?, align? }`                 |
| `toBlockHeading`     | `{ title?, description? }`                     |
| `toImageBlockData`   | `{ images?, caption? }`                        |
| `toGalleryBlockData` | `{ images }`                                   |
| `toModel3dBlockData` | `{ url?, backgroundColor?, backgroundImage? }` |
| `toBlockStyle`       | `BlockStyle`                                   |
| `scopeBlockCss`      | `string` com os seletores escopados            |
