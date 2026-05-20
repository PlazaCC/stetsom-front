import type { ContactMessage } from "@/lib/api/contracts";

export const MOCK_DEPARTMENTS: string[] = [
  "Suporte Técnico",
  "Comercial",
  "Produto",
  "Marketing",
  "Financeiro",
];

export const MOCK_CMS_MESSAGES: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Carlos Almeida",
    email: "carlos.almeida@email.com",
    phone: "(11) 99876-5432",
    subject: "Dúvida sobre garantia do ST-4000EQ",
    message:
      "Olá, comprei o ST-4000EQ há 6 meses e estou com um problema no canal direito. Gostaria de saber como acionar a garantia e qual é o prazo para reparo.",
    department: "Suporte Técnico",
    is_read: false,
    created_at: "2026-05-19T14:32:00.000Z",
  },
  {
    id: "msg-2",
    name: "Fernanda Lima",
    email: "fernanda.lima@autosom.com.br",
    phone: "(21) 3344-5566",
    subject: "Solicitação de catálogo técnico",
    message:
      "Representamos uma rede de lojas de som automotivo e gostaríamos de receber o catálogo técnico 2026 para avaliação. Temos interesse em tornarmos revendedores autorizados.",
    department: "Comercial",
    is_read: false,
    created_at: "2026-05-18T09:15:00.000Z",
  },
  {
    id: "msg-3",
    name: "Roberto Santos",
    email: "roberto.s@gmail.com",
    subject: "Compatibilidade ST-350.4 MINI com subwoofer 4 ohms",
    message:
      "Boa tarde. Tenho um subwoofer de 4 ohms e quero saber se o ST-350.4 MINI funciona bem com ele em modo bridge. Qual a potência esperada?",
    department: "Suporte Técnico",
    is_read: true,
    created_at: "2026-05-16T16:48:00.000Z",
  },
  {
    id: "msg-4",
    name: "Juliana Mendes",
    email: "ju.mendes@hotmail.com",
    phone: "(31) 97654-3210",
    subject: "Onde encontrar posto de serviço em Belo Horizonte",
    message:
      "Procuro um posto de serviço autorizado Stetsom em Belo Horizonte para instalação e configuração do meu sistema de som. Podem me indicar?",
    department: "Suporte Técnico",
    is_read: true,
    created_at: "2026-05-15T11:20:00.000Z",
  },
  {
    id: "msg-5",
    name: "Thiago Pereira",
    email: "thiago.pereira.audio@gmail.com",
    subject: "Sugestão de novo produto",
    message:
      "Seria muito legal se vocês lançassem um amplificador com DSP integrado e controle via aplicativo. Seria um diferencial enorme no mercado.",
    department: "Produto",
    is_read: false,
    created_at: "2026-05-14T20:05:00.000Z",
  },
  {
    id: "msg-6",
    name: "Ana Paula Costa",
    email: "apcosta@sonorizacao.com",
    phone: "(85) 3344-7788",
    subject: "Parceria comercial",
    message:
      "Somos uma empresa de sonorização automotiva no Ceará com 12 anos de mercado. Temos interesse em parceria comercial para distribuição dos produtos Stetsom na região Nordeste.",
    department: "Comercial",
    is_read: true,
    created_at: "2026-05-12T08:30:00.000Z",
  },
  {
    id: "msg-7",
    name: "Marcos Oliveira",
    email: "marcos.oliveira@email.com",
    subject: "Manual ST-2000EQ MONO em PDF",
    message:
      "Preciso do manual completo do ST-2000EQ MONO em PDF. No site não encontrei o link para download. Podem enviar por e-mail?",
    department: "Suporte Técnico",
    is_read: true,
    created_at: "2026-05-10T13:45:00.000Z",
  },
];
