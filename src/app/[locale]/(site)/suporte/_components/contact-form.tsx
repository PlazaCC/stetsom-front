"use client";

import type { PostApiContactBodyDepartment } from "@/api/stetsom/model";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { submitContact } from "./actions";

const DEPARTMENT_MAP: Record<string, PostApiContactBodyDepartment> = {
  technical: "suporte_tecnico",
  warranty: "produto",
  commercial: "comercial",
  partnerships: "parcerias",
  other: "outro",
};

const SECTOR_KEYS = [
  "technical",
  "warranty",
  "commercial",
  "partnerships",
  "other",
] as const;

export function ContactForm() {
  const t = useTranslations("Support.contact");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const sector = (data.get("setor") as string) || "other";
    const department = DEPARTMENT_MAP[sector] ?? "outro";
    const name = (data.get("name") as string) || "";

    try {
      await submitContact({
        name,
        email: (data.get("email") as string) || "",
        phone: (data.get("phone") as string) || undefined,
        subject: `Contato via site - ${name}`,
        message: (data.get("message") as string) || "",
        department,
      });
      setSent(true);
    } catch {
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="max-w-120 rounded border border-border bg-off-white p-8 text-center">
        <p className="font-sans-condensed text-section-title font-black uppercase text-brand-dark">
          {t("successTitle")}
        </p>
        <p className="mt-2 text-sm text-text-subtle">
          {t("successDescription")}
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 font-sans text-sm text-brand underline underline-offset-2"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="setor"
          className="mb-1.5 block font-sans text-2xs font-bold uppercase tracking-widest text-muted-foreground"
        >
          {t("sectorLabel")}
        </label>
        <select
          id="setor"
          name="setor"
          required
          className="w-full border border-border bg-white px-4 py-3 font-sans text-sm text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand"
        >
          <option value="">{t("sectorPlaceholder")}</option>
          {SECTOR_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(`sectors.${key}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block font-sans text-2xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            {t("nameLabel")}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder={t("namePlaceholder")}
            className="w-full border border-border bg-white px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-icon-muted focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block font-sans text-2xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            {t("phoneLabel")}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder={t("phonePlaceholder")}
            className="w-full border border-border bg-white px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-icon-muted focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block font-sans text-2xs font-bold uppercase tracking-widest text-muted-foreground"
        >
          {t("emailLabel")}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder={t("emailPlaceholder")}
          className="w-full border border-border bg-white px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-icon-muted focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block font-sans text-2xs font-bold uppercase tracking-widest text-muted-foreground"
        >
          {t("messageLabel")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={t("messagePlaceholder")}
          className="w-full resize-none border border-border bg-white px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-icon-muted focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="privacy"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
        />
        <span className="font-sans text-xs text-text-subtle leading-relaxed">
          {t.rich("privacyText", {
            privacyLink: (chunks) => (
              <a
                href="#"
                className="font-medium text-brand underline underline-offset-2 hover:text-brand/80"
              >
                {chunks}
              </a>
            ),
          })}
        </span>
      </label>

      <button
        type="submit"
        disabled={sending}
        className="flex w-full items-center justify-center gap-2 bg-brand px-6 py-3.5 font-sans text-button-md font-bold uppercase tracking-[0.8px] text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
      >
        {sending ? t("sending") : t("submit")}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </form>
  );
}
