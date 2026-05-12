# Graph Report - .  (2026-05-12)

## Corpus Check
- 58 files · ~81,635 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 172 nodes · 235 edges · 32 communities (16 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 283,409 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Utilities|Utilities]]
- [[_COMMUNITY_Utilities|Utilities]]
- [[_COMMUNITY_Utilities|Utilities]]
- [[_COMMUNITY_Utilities|Utilities]]
- [[_COMMUNITY_Utilities|Utilities]]
- [[_COMMUNITY_Utilities|Utilities]]
- [[_COMMUNITY_Utilities|Utilities]]
- [[_COMMUNITY_Pages & Routes|Pages & Routes]]
- [[_COMMUNITY_Pages & Routes|Pages & Routes]]
- [[_COMMUNITY_Utilities|Utilities]]
- [[_COMMUNITY_Utilities|Utilities]]
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_Utilities|Utilities]]
- [[_COMMUNITY_Utilities|Utilities]]
- [[_COMMUNITY_Utilities|Utilities]]
- [[_COMMUNITY_Technology Stack|Technology Stack]]
- [[_COMMUNITY_Technology Stack|Technology Stack]]
- [[_COMMUNITY_Pages & Routes|Pages & Routes]]
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_Technology Stack|Technology Stack]]
- [[_COMMUNITY_Technology Stack|Technology Stack]]
- [[_COMMUNITY_Technology Stack|Technology Stack]]
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_Context Providers|Context Providers]]
- [[_COMMUNITY_Technology Stack|Technology Stack]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 41 edges
2. `Button()` - 7 edges
3. `buttonVariants` - 6 edges
4. `NavigationMenuTrigger()` - 4 edges
5. `Faq()` - 3 edges
6. `NossaHistoria()` - 3 edges
7. `Accordion()` - 3 edges
8. `AccordionItem()` - 3 edges
9. `AccordionContent()` - 3 edges
10. `DropdownMenuContent()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Theme Provider` --implements--> `Design Tokens (Color, Typography)`  [INFERRED]
  src/components/theme-provider.tsx → docs/ia/figma/DESIGN_SYSTEM_REFERENCE.md
- `Button Component` --references--> `Tailwind CSS v4`  [EXTRACTED]
  src/components/ui/button.tsx → AGENTS.md
- `HeroCarousel()` --calls--> `cn()`  [EXTRACTED]
  src/app/(site)/_components/hero-carousel.tsx → src/lib/utils.ts
- `AccordionTrigger()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/accordion.tsx → src/lib/utils.ts
- `MenuLink()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/header.tsx → src/lib/utils.ts

## Communities (32 total, 16 thin omitted)

### Community 0 - "Utilities"
Cohesion: 0.17
Nodes (8): Faq(), FAQ_ITEMS, NossaHistoria(), FEATURED_PRODUCTS, Button(), buttonVariants, ContainerProps, SectionLabelProps

### Community 1 - "Utilities"
Cohesion: 0.16
Nodes (14): cn(), Container(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem() (+6 more)

### Community 2 - "Utilities"
Cohesion: 0.18
Nodes (12): MenuLink(), NAV_LINKS, PRODUCTS_CATEGORIES, NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink() (+4 more)

### Community 3 - "Utilities"
Cohesion: 0.13
Nodes (5): MILESTONE_PATTERN, MILESTONES, DEFAULT_TIMELINE_EVENTS, TimelineEvent, TimelineRefactoredProps

### Community 4 - "Utilities"
Cohesion: 0.17
Nodes (11): AppRoutes, LayoutProps, LayoutRoutes, LayoutSlotMap, PageProps, PageRoutes, ParamMap, ParamsOf (+3 more)

### Community 5 - "Utilities"
Cohesion: 0.24
Nodes (6): FAQItem, FAQ_ITEMS, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 6 - "Utilities"
Cohesion: 0.18
Nodes (5): barlow, barlowCondensed, geistMono, metadata, QueryProviderProps

### Community 7 - "Pages & Routes"
Cohesion: 0.29
Nodes (3): ALL_PRODUCTS, CATEGORIES, ProductCardProps

### Community 8 - "Pages & Routes"
Cohesion: 0.29
Nodes (6): AppPageConfig, __Check, handler, __IsExpected, LayoutConfig, __Unused

### Community 10 - "Utilities"
Cohesion: 0.5
Nodes (3): HeroBannerSlide, HeroCarousel(), STUB_BANNERS

### Community 11 - "UI Components"
Cohesion: 0.5
Nodes (4): FAQ Component, Hero Carousel, Home Page, Suporte Page

## Knowledge Gaps
- **66 isolated node(s):** `eslintConfig`, `nextConfig`, `config`, `barlow`, `barlowCondensed` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Utilities` to `Utilities`, `Utilities`, `Utilities`, `Utilities`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **Why does `Button()` connect `Utilities` to `Utilities`, `Utilities`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `NavigationMenuTrigger()` connect `Utilities` to `Utilities`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `config` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Utilities` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._