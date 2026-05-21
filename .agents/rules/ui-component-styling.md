---
description: 'Use when writing or reviewing component styles, Tailwind classes, gradients, spacing, line-height, or deciding between style={{}} and className. Covers leading scale, gradient unification, static vs dynamic principle, section spacing, CVA variants, and icon sizes.'
applyTo: 'src/**/*.{ts,tsx,css}'
---

# UI Component Styling Principles

Complementa `styling-practices.md`, `tailwind-v4.md` e `tailwind-canonical.md`. Não repetir o que já está nessas rules — ler também elas ao estilizar.

---

## Princípio: Estático vs Dinâmico

A regra mais importante para decidir entre `className` e `style={{}}`:

| Tipo | Critério | Como estilizar |
|---|---|---|
| **Estático** | Valor fixo, não depende de props/state/dados | Sempre classe Tailwind + token |
| **Dinâmico** | Deriva de prop, state, ou resposta de API | `style={{}}` — correto e obrigatório |
| **Semi-estático** | Mesmo valor fixo aparece em 2+ lugares | Criar token em `globals.css` |

**Exemplos legítimos de `style={{}}`:**
```tsx
style={{ left: `${leftPercent}%` }}       // posição calculada
style={{ opacity: post.opacity ?? 1 }}    // valor vindo de dados
style={{ backgroundImage: `url(${img})` }} // asset dinâmico
style={{ color: statusColorMap[status] }} // cor derivada de estado
```

**Nunca `style={{}}` para valores estáticos:**
```tsx
// ❌
style={{ color: '#E8132A' }}
style={{ padding: '40px' }}

// ✅
className="text-brand"
className="p-10"
```

---

## Leading (line-height) — Escala Canônica

Nunca usar `leading-[1.6]`, `leading-[1.7]` ou outros arbitrários decimais — usar o canônico equivalente:

| Uso | Classe | Valor |
|---|---|---|
| Headings compactos | `leading-tight` | 1.25 |
| Headings normais | `leading-snug` | 1.375 |
| Corpo padrão | `leading-normal` | 1.5 |
| Texto descritivo / long-form | `leading-relaxed` | 1.625 |
| Texto espaçado | `leading-loose` | 2.0 |

```tsx
// ❌ Inconsistente
<p className="leading-[1.7]">...</p>
<p className="leading-[1.6]">...</p>

// ✅ Canônico
<p className="leading-relaxed">...</p>
```

---

## Gradients — Padrão Único

Escolha **um** padrão por contexto — nunca misturar os dois:

**Padrão canônico (preferido):** Tailwind `bg-linear-to-*` com `from-*/to-*`
```tsx
// ✅ Tailwind — legível, tokens nativos
<div className="bg-linear-to-t from-black/65 to-transparent" />
<div className="bg-linear-to-b from-black/0 to-black" />
```

**Exceção legítima para `style={{}}`:** quando o gradiente é dinâmico ou radial complexo sem suporte nativo no Tailwind
```tsx
// ✅ Apenas quando não há equivalente Tailwind direto
<div style={{ background: 'radial-gradient(circle at 30% 50%, ...)' }} />
```

**Classes CSS customizadas** (`bg-radial-dark-alt`, `bg-gradient-dark-overlay`): permitidas, mas devem estar definidas em `globals.css` com comentário identificando o uso.

**Nunca:** o mesmo efeito visual como `style` inline em um componente e como classe Tailwind em outro.

---

## Vertical Spacing — Escala de Seções

Escala prescritiva para seções de página. Escolher o nível mais próximo do design:

| Nível | Classes | Quando usar |
|---|---|---|
| Card / gap interno | `py-4` / `py-6` | Padding interno de card, separador leve |
| Seção pequena | `py-8` / `py-10` | Blocos de suporte, rodapés de seção |
| Seção padrão | `py-16` | A maioria das seções de conteúdo |
| Seção principal / hero | `py-20` / `py-24` | Hero, seções de destaque com muito respiro |

**Evitar** `py-12` e `py-14` — são a "zona cinza": se o design pede entre pequeno e padrão, usar `py-10` ou `py-16`.

---

## CVA para Componentes Multi-Variante

Quando um componente tem 2 ou mais variantes visuais (visual variant, size, estado), usar `cva` de `class-variance-authority`:

```tsx
// ✅ CVA — declarativo e type-safe
const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold", {
  variants: {
    variant: {
      default: "bg-brand text-white",
      outline: "border border-brand text-brand",
    },
  },
  defaultVariants: { variant: "default" },
})
```

**Referência canônica:** `src/components/ui/button.tsx`

```tsx
// ❌ Ternários aninhados — frágil e ilegível
<span className={`${variant === 'default' ? 'bg-brand text-white' : variant === 'outline' ? 'border border-brand text-brand' : ''}`}>
```

---

## Icon Sizes — Escala por Contexto

| Contexto | Classe | Exemplo |
|---|---|---|
| Inline (botão, badge, tag) | `size-4` | Ícone ao lado de label de botão |
| Navigation / header | `size-5` | Ícone em link de nav |
| Card / feature icon | `size-6` / `size-8` | Ícone de benefício, feature card |
| Decorativo / hero / spotlight | `size-16` ou maior | Ícone visual de destaque |

Sempre importar ícones de `lucide-react`. Nunca importar SVG inline para ícones que existam no Lucide.
