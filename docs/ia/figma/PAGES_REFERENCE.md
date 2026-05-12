# Stetsom — Pages Reference (Figma Node Map)

Fonte: Figma file `huD41oTL0FAa7xsNEK8tAM`, seção `Website` (node `1200:4302`).
Extraído em: 2026-05-12. Para encontrar IDs atualizados, consulte `meta.json`.

> **Regra:** use os `nodeId` abaixo para chamar `get_figma_data` ou `get_design_context`
> diretamente ao inspecionar uma seção específica — em vez de baixar o arquivo inteiro.

---

## Layout Containers Globais

| Token         | Tailwind Equivalente                          | Uso                          |
| ------------- | --------------------------------------------- | ---------------------------- |
| Desktop page  | `w-full max-w-[1440px] mx-auto px-[170px]`    | Todas as páginas desktop     |
| Mobile page   | `w-[375px] px-5`                              | Todas as páginas mobile      |
| Desktop inner | `px-[170px] py-12`                            | Seções de conteúdo desktop   |
| Mobile inner  | `px-0 py-9`                                   | Seções de conteúdo mobile    |
| Footer desk   | `px-[100px] py-6 flex flex-row flex-wrap gap-[36px_164px]` | Footer desktop |
| Footer mobile | `px-5 py-6 flex flex-col gap-9`               | Footer mobile                |

---

## Home (`/`)

**Desktop:** `1200:4584` (1440px) | **Mobile:** `1200:4304` (375px)

| # | Node (Desktop)  | Node (Mobile)   | Nome / Seção               | Background            | Componentes-chave            |
|---|-----------------|-----------------|----------------------------|-----------------------|------------------------------|
| 1 | `1200:4585`     | `1200:4305`     | Header / Nav               | `#FFFFFF`             | Logo, nav links, Button      |
| 2 | `1200:4592`     | `1200:4310`     | Hero Carousel              | Imagem + gradiente    | Imagem fullscreen, gradiente |
| 3 | `1200:4600`     | `1200:4318`     | Novidades / Cards          | `#FFFFFF`             | SectionLabel, ProductCard    |
| 4 | `1200:4630`     | `1200:4445`     | Qualidade Inovadora        | `#121212`             | Texto impacto, imagem        |
| 5 | `1200:4654`     | `1200:4469`     | Nossas Bases / Diferenciais| `#FFFFFF`             | Stats ou cards               |
| 6 | `1200:4702`     | `1200:4517`     | Social Medias / CTA        | `#F5F4F2`             | Ícones sociais, CTA          |
| 7 | `1200:4713`     | `1200:4526`     | Footer                     | `#111111`             | 4 colunas, copyright         |

**Imagem do Hero:** `imageRef: e95c6db48356b62dbb7aefdd2d4cfb3624c95d59`
(local: ver `assets-manifest.json` por `fill_QPGB3Q` / `fill_RT307M`)

---

## Produtos (`/produtos`)

**Desktop:** `1200:4982` (1440px) | **Mobile:** `1200:4766` (375px)

| # | Node (Desktop)  | Node (Mobile)   | Nome / Seção               | Background                        | Componentes-chave               |
|---|-----------------|-----------------|----------------------------|-----------------------------------|---------------------------------|
| 1 | `1200:4983`     | `1200:4767`     | Header / Nav               | `#FFFFFF`                         | Logo, nav links, Button         |
| 2 | `1200:4990`     | `1200:4772`     | Hero Banner                | Dark radial + img (1440×336)      | Título da seção, gradiente      |
| 3 | `1200:4999`     | `1200:4780`     | Filtros / Categorias       | `#FFFFFF` c/ borda `#565656`      | Tabs/filtros de categoria       |
| 4 | `1200:5026`     | `1200:4808`     | Grade de Produtos          | `#FFFFFF`                         | ProductCard (grid)              |
| 5 | `1200:5338`     | `1200:4922`     | Footer                     | `#111111`                         | 4 colunas, copyright            |

**Imagem do Hero:** `imageRef: 6a0a1876e7a45ba7189675a049ad45fe670394d2`
(local: ver `assets-manifest.json` por `fill_QDUJ2M` / `fill_M5AJUV`)

---

## Produto Selecionado (`/produtos/[slug]`)

**Desktop:** `1200:5666` (1440px) | **Mobile:** `1200:5391` (375px)

| # | Node (Desktop)  | Node (Mobile)   | Nome / Seção               | Background                    | Componentes-chave                  |
|---|-----------------|-----------------|----------------------------|-------------------------------|------------------------------------|
| 1 | `1200:5667`     | `1200:5392`     | Header / Nav               | `#FFFFFF`                     | Logo, nav links, Button            |
| 2 | `1200:5674`     | `1200:5397`     | Breadcrumb + Info produto  | `#F8F8F8`                     | Breadcrumb, nome, badges RMS       |
| 3 | `1200:5721`     | `1200:5412`     | Especificações             | `#FFFFFF` c/ borda `#E3E3E3`  | Tabela de specs                    |
| 4 | `1200:5739`     | `1200:5450`     | Destaque visual (amp hero) | Radial vermelho/preto         | Gradiente radial `#EE0800 → #000`  |
| 5 | —               | `1200:5456`     | Imagem produto principal   | `#010001` (preto)             | Imagem 375×299                     |
| 6 | —               | `1200:5459`     | Foto ambiente               | Imagem + gradiente overlay    | Imagem 375×215                     |
| 7 | `1200:5805`     | `1200:5461`     | Blocos de conteúdo         | variável                      | ProductBlock (TEXT, IMAGE, VIDEO)  |
| 8 | `1200:5891`     | `1200:5522`     | Produtos relacionados      | variável                      | ProductCard (novidades)            |
| 9 | —               | `1200:5608`     | Footer                     | `#111111`                     | 4 colunas, copyright               |

**Imagem produto (Mobile):** `imageRef: 935c60d8affac67c4de0490e01942f71b20a85f8`

---

## Sobre (`/sobre`)

**Desktop:** `1200:6180` (1440px) | **Mobile:** `1200:5944` (375px)

| # | Node (Desktop)  | Node (Mobile)   | Nome / Seção               | Background                      | Componentes-chave            |
|---|-----------------|-----------------|----------------------------|---------------------------------|------------------------------|
| 1 | `1200:6181`     | `1200:5945`     | Header / Nav               | `#FFFFFF`                       | Logo, nav links, Button      |
| 2 | `1200:6188`     | `1200:5950`     | Hero Banner                | Dark radial (1440×439 / 375×?)  | Título institucional         |
| 3 | `1200:6215`     | `1200:5976`     | Nossas Bases (Stats bar)   | `#DC2626` (vermelho)            | 3-4 números/stats            |
| 4 | `1200:6237`     | `1200:5998`     | Timeline / História        | `#FFFFFF`                       | Timeline, datas, texto       |
| 5 | `1200:6271`     | `1200:6033`     | Galeria / Qualidade        | `#121212` + dark radial         | Grid de imagens              |
| 6 | `1200:6322`     | `1200:6061`     | Social Medias / Redes      | `#F5F4F2`                       | Ícones sociais, seguidores   |
| 7 | `1200:6346`     | `1200:6091`     | Seção complementar         | `#FFFFFF`                       | Conteúdo extra               |
| 8 | `1200:6390`     | `1200:6112`     | Foto / Mapa / Localização  | Imagem + dark radial            | Foto fabrica, mapa           |
| 9 | `1200:6401`     | `1200:6122`     | Footer                     | `#111111`                       | 4 colunas, copyright         |

**Imagem fábrica/mapa:** `imageRef: b3596ec5433f770d4d9fd82c2a7c2631bbf56674`

---

## Suporte (`/suporte`)

**Desktop:** `1200:6454` (1440px) | **Mobile:** `1200:6785` (375px)

| # | Node (Desktop)  | Node (Mobile)   | Nome / Seção               | Background               | Componentes-chave                  |
|---|-----------------|-----------------|----------------------------|--------------------------|------------------------------------|
| 1 | `1200:6455`     | `1200:6786`     | Header / Nav               | `#FFFFFF`                | Logo, nav links, Btn "Garantia"    |
| 2 | `1200:6462`     | `1200:6791`     | Hero Banner                | Dark radial + img        | Título "SOS" bg, texto descritivo  |
| 3 | `1200:6471`     | `1200:6800`     | Cards de suporte           | `#F5F4F2`                | 3 cards (Central ajuda, Garantia…) |
| 4 | `1200:6495`     | `1200:6822`     | Documentação / Categorias  | `#FFFFFF`                | Tabs/filtros, lista docs           |
| 5 | `1200:6592`     | `1200:6889`     | Busca + Filtros FAQ        | `#F5F4F2`                | Input busca, Tabs categorias       |
| 6 | `1200:6646`     | `1200:6947`     | Contato / Download materiais | `#FFFFFF`              | Form, Button "Enviar mensagem"     |
| 7 | `1200:6722`     | `1200:7018`     | FAQ Accordion              | `#F5F4F2`                | Accordion, Button "Falar suporte"  |
| 8 | `1200:6733`     | `1200:7027`     | Footer                     | `#111111`                | 4 colunas, copyright               |

**Hero "SOS" texto:** Barlow Condensed Black 900, ~263px desktop / ~151px mobile, UPPERCASE, `#B9B9B9`, opacidade 8%
**Barra vermelha decorativa:** `#DC2626`, width: 14px (mobile hero) / variável

---

## 404 (`/not-found`)

**Desktop apenas:** `1200:7086` (1440px) | **Mobile:** `1200:7151` (375px)

| # | Node (Desktop)  | Node (Mobile)   | Nome / Seção               | Background   | Componentes-chave          |
|---|-----------------|-----------------|----------------------------|--------------|----------------------------|
| 1 | `1200:7087`     | `1200:7152`     | Header / Nav               | `#FFFFFF`    | Logo, nav links, Button    |
| 2 | `1200:7094`     | `1200:7157`-`1200:7188` | 404 Content   | `#F5F4F2`    | Título, subtítulo, SVG 404 |
| 3 | `1200:7099`     | `1200:7393`     | Footer                     | `#111111`    | 4 colunas, copyright       |

**404 Content:**
- Título: "página não encontrada" — Barlow Condensed Black 900, 50px, UPPERCASE
- Subtítulo: "Parece que a pagina que você tentou acessar não existe" — Barlow Medium 500, 20px, `#B8B8B8`
- SVG "404": opacidade 8%, `#878787`, 626×301px

---

## Componentes Reutilizados em Todas as Páginas

| Componente         | Figma ID           | Uso                              |
|--------------------|--------------------|----------------------------------|
| Button (md)        | `21:212`           | CTA principal, "Garantia"        |
| Button (sm)        | `21:211`           | Ações menores, "Falar suporte"   |
| Breadcrumb         | `74:11593`         | Produto selecionado              |
| Accordion          | `890:10459`        | FAQ (Suporte + outros)           |
| Lucide / search    | `23:3956`          | Header mobile                    |
| Lucide / arrow-right | `45:12956`       | Botões com ícone trailing        |
| Lucide / chevron-down | `23:4093`       | Dropdown/accordion               |
| Badge (RMS, normal)| `1036:9869/9870`   | Produto selecionado              |

---

## Paleta de Backgrounds por Seção

| Cor Figma                | Tailwind / CSS var | Uso típico                                   |
|--------------------------|--------------------|----------------------------------------------|
| `#FFFFFF`                | `bg-white`         | Header, cards, conteúdo principal            |
| `#F5F4F2`                | `bg-off-white`     | Seções alternadas claras (FAQ, social, etc.) |
| `#F8F8F8`                | `bg-gray-50`       | Área de info do produto selecionado          |
| `#121212`                | `bg-brand-dark`    | Seção "Qualidade Inovadora" (home)           |
| `#111111`                | `bg-[#111111]`     | Footer                                       |
| `#DC2626`                | `bg-brand` (≈)     | Barra de nossas bases/stats                  |
| `#E8132A`                | `bg-brand`         | CTA primário, brand red                      |
| Dark radial gradient     | Gradiente custom   | Heroes de página (Produtos, Suporte, Sobre)  |
