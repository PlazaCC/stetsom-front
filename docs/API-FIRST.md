# API-First Pattern

## Princípios

1. **Back-end é fonte de verdade** - Se API aceita, front não bloqueia
2. **Orval é o contrato** - Usar tipos gerados, nunca criar tipos locais equivalentes
3. **Figma é wireframe** - Usabilidade/styles, não modelo de dados
4. **Zero transformação de dados** - Passar payloads direto da API

## Regras

### Tipos

```typescript
// ❌ ERRADO - criar tipos locais que duplicam API
interface LocalProductStatus {
  status: "ACTIVE" | "INACTIVE";
}

// ✅ CERTO - usar tipo gerado pelo Orval
import type { ProductStatus } from "@/api/stetsom/model/productStatus";
```

### Enums

```typescript
// ❌ ERRADO - transformar valores
function mapStatusToApi(status: string): ProductStatus {
  if (status === "ACTIVE") return "PUBLISHED";
  return "DRAFT";
}

// ✅ CERTO - usar valores direto
const payload = { status: formStatus }; // já é ProductStatus
```

### Null/Undefined

```typescript
// ❌ ERRADO - inventar validação cliente
if (!form.name.pt) {
  toast.error("Nome é obrigatório");
  return;
}

// ✅ CERTO - deixar API validar
try {
  await createProduct.mutateAsync(payload);
} catch (error) {
  // API retorna erro estruturado
  toast.error(error.message);
}
```

## Estrutura de Arquivos

```
src/
├── api/stetsom/          # Orval-generated (NÃO EDITAR)
│   ├── model/            # Tipos
│   └── endpoints/        # Hooks
├── lib/cms/
│   ├── constants.ts      # Constantes que espelham backend
│   └── api-payload.ts    # Helpers de conversão (opcional)
└── app/admin/
    └── _components/
        └── *-wizard.tsx  # Forms usam tipos da API
```

## Status de Entidades

| Entidade | API Status | Campos Separados |
|----------|------------|-------------------|
| Products | `PUBLISHED \| DRAFT \| SCHEDULED` | `is_discontinued: boolean` |
| Banners | `ACTIVE \| INACTIVE \| SCHEDULED` | — |
| Users | `SUPER_ADMIN \| ADMIN \| EDITOR` | `is_active: boolean` |

## Constantes

```typescript
// lib/cms/constants.ts - espelha backend
export const CMS_UPLOAD_MAX_SIZES = {
  IMAGE: 10 * 1024 * 1024,    // 10 MB (backend: upload-validator.ts)
  VIDEO: 200 * 1024 * 1024,  // 200 MB
  PDF: 50 * 1024 * 1024,     // 50 MB
  MODEL3D: 100 * 1024 * 1024 // 100 MB
};
```

## Checklist de Implementação

- [ ] Usar tipos Orval (import de `@/api/stetsom/model`)
- [ ] Não criar interfaces que duplicam tipos API
- [ ] Não transformar valores de enum
- [ ] Remover validação cliente que duplica API
- [ ] Usar constantes de `lib/cms/constants.ts`

## Exceções Conhecidas

### Pages (PAGE_SECTIONS)

**Problema**: O catálogo de seções de páginas (`PAGE_SECTIONS`) é hardcoded em `src/app/admin/paginas/_components/section-field-spec.ts`.

**Motivo**: A API não expõe schemas de blocos dinâmicos. O `PageBlockType` enum define tipos mas não a estrutura de campos.

**Solução Temporária**: Manter `FieldSpec` e `SectionDef` como tipos locais até que:
1. Backend forneça endpoint com schemas de blocos, OU
2. Backend use JSON Schema para descrever blocos

**Risco**: Seções adicionadas no backend requerem atualização manual no frontend.

### Helpers Permitidos

- `slugify()` - helper de UX, não substitui validação backend
- `toApiLocale()` - converte display locale (pt-BR) para API locale (pt)
- `toDisplayLocale()` - converte API locale para display locale
