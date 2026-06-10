# RFC 001: Arquitetura de Sistema Stetsom

**Autores:** Plaza Creative Collective
**Data:** 10/04/2026
**Status:** Superseded

> As decisões de stack e arquitetura descritas aqui foram revisadas durante o desenvolvimento. Para a arquitetura atual, consulte `docs/ARCHITECTURE.md` (front) e `stetsom-api/docs/ARCHITECTURE.md` (API).

---

## 1. Resumo

Este documento estabelece a base técnica para o MVP da Stetsom. A arquitetura centraliza a lógica de negócio em uma API própria para garantir autonomia e facilitar a futura expansão para o sistema de operações (BOS). O modelo adotado foca em alta performance e separação clara de responsabilidades.

## 2. Motivação

A escolha de uma arquitetura tradicional moderna visa evitar o engessamento de serviços prontos. Com um backend dedicado, a Stetsom ganha soberania sobre seus dados e processos, permitindo integrações customizadas com ERPs e sistemas de logística no futuro, sem necessidade de refatoração.

## 3. Proposta Técnica (Decisões e Alternativas)

Abaixo, detalhamos as frameworks e bibliotecas escolhidas e as opções descartadas durante o processo de design.

### Front-end: Next.js 15

- **Decisão:** Escolhido por unir o melhor de dois mundos: performance de site estático para o institucional e dinamismo de aplicação para o CMS.
- **Alternativa:** **Remix**. Embora excelente, o ecossistema Next.js oferece integração mais fluida com a infraestrutura de deploy atual e maior facilidade em renderização híbrida.

### Estilização do Site: Tailwind CSS

- **Decisão:** Garante agilidade no desenvolvimento e fidelidade visual ao Figma da marca.
- **Alternativa:** **Styled Components**. Descartado devido ao maior custo de performance no lado do servidor e maior tempo de escrita de código.

### UI do Painel Administrativo: Mantine UI

- **Decisão:** Uma biblioteca de componentes rica em recursos de tabelas e formulários complexos, ideal para ferramentas internas.
- **Alternativa:** **Shadcn UI**. Embora elegante, exige mais esforço manual para criar componentes densos de dados como os necessários no CMS da Stetsom.

### API Backend: Fastify

- **Decisão:** Framework Node.js focado em altíssima velocidade e baixo consumo de memória.
- **Alternativa:** **Express.js**. Apesar de popular, o Express é mais lento e não possui suporte nativo a validações e tipagem de forma tão moderna quanto o Fastify.

### ORM: Prisma

- **Decisão:** Oferece uma excelente experiência de desenvolvimento com tipagem automática e migrações simplificadas do banco de dados.
- **Alternativa:** **Drizzle ORM**. Embora mais leve, o Prisma possui uma comunidade mais madura e ferramentas de visualização de dados que auxiliam na fase de MVP.

### Armazenamento: Cloudflare R2

- **Decisão:** Armazenamento de objetos com custo zero de transferência de dados, ideal para o alto volume de fotos e manuais da Stetsom.
- **Alternativa:** **Amazon S3**. Possui custos de saída de dados que podem se tornar elevados conforme o tráfego do site aumenta.

## 4. Alternativas de Arquitetura Geral

Além da stack eleita, avaliamos modelos diferentes de infraestrutura:

- **Supabase como BaaS:** Facilitaria o início rápido com banco e autenticação automáticos, mas limitaria a criação de rotas de negócio personalizadas no backend.
- **Headless CMS (Payload / Strapi):** Entregaria o painel pronto, mas dificultaria a implementação da taxonomia específica de três níveis da marca.
- **Arquitetura BFF (Backend for Frontend):** Criaria uma camada extra para traduzir dados entre o banco e o site, porém adicionaria uma complexidade de manutenção desnecessária para o tamanho atual do projeto.
- **Hono com Edge Computing:** Permitiria rodar o código muito perto do usuário, mas traz limitações de bibliotecas que poderiam travar integrações futuras com o legado da empresa.

## 5. Prós e Contras da Proposta Eleita

### Benefícios

- **Propriedade Intelectual:** Todo o código do backend é um ativo da empresa, sem dependência de plataformas proprietárias.
- **Preparação para o BOS:** A base em Fastify e Prisma é o alicerce perfeito para módulos de gestão que virão na fase 2.
- **Custo Operacional:** Uso de ferramentas com planos gratuitos generosos e cobrança baseada apenas em uso real.

### Riscos

- **Prazo de Setup:** O tempo inicial de configuração é superior ao de uma solução pronta, exigindo foco total nas primeiras duas semanas.
- **Configuração de Infra:** Requer o gerenciamento de logs e monitoramento da API para garantir que o serviço esteja sempre disponível.

---

Documento oficial para validação da arquitetura Stetsom MVP.

Plaza Creative Collective
