# Fontes locais

Esta pasta hospeda as fontes auto-hospedadas do projeto (via `next/font/local`).

## Satoshi

A pasta contém apenas a versão **variable** da fonte **Satoshi** (cobre todos os pesos):

| Arquivo | Uso |
| --- | --- |
| `Satoshi-Variable.woff2` | Texto normal (pesos 300–900) |
| `Satoshi-VariableItalic.woff2` | Texto em itálico (pesos 300–900) |

> Não adicione pesos estáticos (Light/Regular/Bold/etc.) — o variable cobre o range inteiro e mantém a pasta enxuta.

## Como foi aplicada

A Satoshi já está em uso em todo o site público (títulos + parágrafos):

- `src/app/layout.tsx` — carregada via `next/font/local` (arquivo variable) com `variable: "--font-satoshi"`
- `src/app/globals.css` — `--font-sans` (parágrafos) e `--font-sans-condensed` (títulos) apontam para `var(--font-satoshi)`

O CMS/admin continua usando Geist (`--font-geist`) e Geist Mono (`--font-mono`), intencionalmente.
