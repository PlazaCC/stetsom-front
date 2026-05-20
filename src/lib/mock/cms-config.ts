import type { CmsConfig } from "@/lib/api/contracts";

const NOW = "2026-05-12T00:00:00.000Z";

export const MOCK_CMS_CONFIG: CmsConfig = {
  company_name: "Stetsom Eletrônica Ltda.",
  company_email: "contato@stetsom.com.br",
  company_phone: "(11) 4444-5555",
  company_whatsapp: "(11) 99999-8888",
  company_address:
    "Rua das Indústrias, 1234 — Distrito Industrial, São Paulo, SP, 01310-100",
  social_instagram: "https://instagram.com/stetsom",
  social_facebook: "https://facebook.com/stetsom",
  social_youtube: "https://youtube.com/@stetsom",
  updated_at: NOW,
  updated_by: "usr-1",
};
