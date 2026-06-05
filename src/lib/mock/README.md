# Mock API Layer

Este diretório contém os dados e funções que simulam o backend Fastify enquanto ele não está disponível. Os mocks **não são um atalho** — eles foram construídos para respeitar o mesmo contrato OpenAPI que o backend irá expor, garantindo que o frontend possa evoluir de forma independente sem quebrar a integração futura.

---

## Por que os mocks existem

O backend (Fastify, repositório separado) ainda está em desenvolvimento. Para não bloquear o frontend, os mocks simulam as respostas que a API real retornará, usando as mesmas estruturas de dados definidas em `src/lib/api/contracts.ts`.

Isso permite:
- Desenvolver e testar todas as telas sem depender de nenhum servidor externo
- Validar o contrato de dados antes de qualquer integração real
- Garantir consistência entre o que o frontend espera e o que o backend vai entregar

---

## Estrutura dos arquivos

```
src/lib/mock/
  catalog.ts          → fixtures de produtos, categorias e subcategorias (pt-BR, fonte de verdade)
  catalog-i18n.ts     → versões localizadas de categorias, produtos e blocos (EN / ES)
  site.ts             → fixtures de home, sobre e navegação (pt-BR, fonte de verdade)
  site-i18n.ts        → versões localizadas de hero, timeline, FAQs, etc.
  support.ts          → fixtures de suporte, FAQ e postos (pt-BR, fonte de verdade)
  support-i18n.ts     → versões localizadas do payload de suporte
  navigation.ts       → menu de navegação e categorias do header
  admin-cms.ts        → dashboard, métricas e produtos do CMS admin
  cms-users.ts        → usuários admin e senha de mock (MOCK ONLY)
  cms-banners.ts      → banners do site institucional
  cms-config.ts       → configurações gerais do CMS
  cms-library.ts      → biblioteca de assets (imagens, documentos)
  cms-messages.ts     → mensagens de contato recebidas
  cms-audit.ts        → log de auditoria de ações no CMS
```

Os arquivos `*.ts` (sem sufixo `-i18n`) contêm os dados brutos em **pt-BR como fonte de verdade**. Os arquivos `*-i18n.ts` expõem funções `get*ForLocale(locale?)` que derivam variantes EN/ES a partir dessa base.

---

## Como o mock se encaixa na arquitetura

```
src/lib/api/
  contracts.ts          ← tipos TypeScript (espelho do OpenAPI do Fastify)
  provider-contract.ts  ← interface CmsProvider (contrato de métodos)
  provider.ts           ← seleciona mock ou remote via CMS_API_BASE_URL
  providers/
    mock-provider.ts    ← implementação usando os fixtures deste diretório
    remote-provider.ts  ← implementação real (chama o Fastify diretamente)
```

O `provider.ts` escolhe qual implementação usar:

```ts
// Comportamento automático:
// - Se CMS_API_BASE_URL estiver definida → usa remote-provider.ts
// - Se não → usa mock-provider.ts (padrão, sem rede)

// Para forçar o remote mesmo sem CMS_API_BASE_URL (testes):
// CMS_FORCE_BFF=1
```

O frontend nunca importa os mocks diretamente — tudo passa pela interface `CmsProvider`. Trocar de mock para real é definir a variável `CMS_API_BASE_URL`.

---

## Relação com o Orval

Quando o backend Fastify estiver pronto, ele irá expor um spec OpenAPI em `/docs/yaml`. O `orval.config.ts` na raiz do projeto está configurado para ler esse spec e gerar automaticamente os tipos TypeScript e funções de cliente.

O fluxo de integração será:

```
1. Backend publica spec OpenAPI (openapi.yaml ou /docs/yaml)
2. Frontend roda:  pnpm api:generate
3. Orval gera os tipos → comparar e sincronizar com contracts.ts
4. Orval gera o cliente HTTP → usar como base para remote-provider.ts
5. Definir CMS_API_BASE_URL em produção
6. Os mocks continuam existindo para desenvolvimento local e testes
```

`contracts.ts` hoje é escrito à mão e representa o **mesmo contrato** que o Fastify irá formalizar no OpenAPI. Qualquer divergência encontrada ao rodar o orval indica uma discrepância que precisa ser resolvida entre as equipes de front e back.

---

## Regras para manter os mocks

- Dados em `contracts.ts` são a fonte de verdade de tipos — nunca invente shapes aqui que não existam lá
- UUIDs, datas ISO 8601, slugs URL-safe e URLs absolutas/relativas à raiz do site
- Cada produto deve ter ao menos um `ProductBlock` com `order` sequencial e único
- Não hardcode lógica de negócio nos fixtures — ela fica no `mock-provider.ts`
- Se o schema mudar, atualize `contracts.ts` primeiro, depois os fixtures
