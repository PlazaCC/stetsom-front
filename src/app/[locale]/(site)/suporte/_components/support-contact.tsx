import type { PublicDepartmentItem } from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { PublicEmptyState } from "@/components/ui/public-empty-state";
import { SectionLabel } from "@/components/ui/section-label";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cn } from "@/lib/utils";
import { Mail, MessagesSquare, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import QRCode from "react-qr-code";
import { ContactForm } from "./contact-form";

const CONTACT_INFO_ICONS = {
  phone: Phone,
  email: Mail,
  whatsapp: WhatsAppIcon,
} as const;

function getContactHref(key: string, value: string): string {
  switch (key) {
    case "email":
      return `mailto:${value}`;
    case "phone":
      return `tel:${value}`;
    case "whatsapp": {
      const digits = value.replace(/\D/g, "");
      return `https://wa.me/${digits}`;
    }
    default:
      return "#";
  }
}

type SupportContactData = {
  label?: string;
  title?: string;
  description?: string;
};

type ContactInfoData = {
  phone?: string;
  email?: string;
  whatsapp?: string;
};

interface SupportContactProps {
  contact: SupportContactData;
  contactInfo?: ContactInfoData;
  departments: PublicDepartmentItem[];
}

export function SupportContact({
  contact,
  contactInfo,
  departments,
}: Readonly<SupportContactProps>) {
  const t = useTranslations("Support.contact");

  const infoItems = contactInfo
    ? (
        [
          {
            key: "phone",
            label: t("contactInfoPhone"),
            value: contactInfo.phone,
          },
          {
            key: "email",
            label: t("contactInfoEmail"),
            value: contactInfo.email,
          },
          {
            key: "whatsapp",
            label: t("contactInfoWhatsapp"),
            value: contactInfo.whatsapp,
          },
        ] as const
      ).filter(({ value }) => value?.trim())
    : [];

  return (
    <section id="contact" className="w-full scroll-mt-header bg-white py-12">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">
          <div className="flex shrink-0 flex-col gap-6 lg:w-90">
            <SectionLabel
              label={contact.label ?? ""}
              title={contact.title ?? ""}
            />
            <p className="text-base text-text-subtle">{contact.description}</p>

            {infoItems.length > 0 && (
              <div className="flex flex-col gap-3">
                {infoItems.map(({ key, label, value }) => {
                  const Icon = CONTACT_INFO_ICONS[key];
                  return (
                    <a
                      key={key}
                      href={getContactHref(key, value ?? "")}
                      target={key === "whatsapp" ? "_blank" : undefined}
                      rel={
                        key === "whatsapp" ? "noopener noreferrer" : undefined
                      }
                      className={cn(
                        "group relative flex items-center gap-4 border border-border bg-white px-4 py-3",
                        "transition-colors duration-200",
                      )}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                        <Icon size={26} className="text-brand" />
                      </div>
                      <div>
                        <p className="font-sans text-xs font-medium tracking-wide text-text-subtle uppercase">
                          {label}
                        </p>
                        <p className="font-sans text-sm font-semibold text-brand-dark transition-colors duration-200 group-hover:text-brand">
                          {value}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-center scale-x-0 bg-brand transition-transform duration-200 group-hover:scale-x-100"
                      />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Desktop-only: scanning the code hands the chat off to the phone,
                where wa.me actually opens the app. */}
            {contactInfo?.whatsapp?.trim() && (
              <div className="hidden items-center gap-4 border border-border p-4 lg:flex">
                <div className="shrink-0 bg-white">
                  <QRCode
                    value={getContactHref("whatsapp", contactInfo.whatsapp)}
                    size={96}
                    bgColor="#ffffff"
                    fgColor="#121212"
                  />
                </div>
                <p className="text-sm text-text-subtle">
                  {t("whatsappQrHint")}
                </p>
              </div>
            )}

            {infoItems.length === 0 && (
              <PublicEmptyState
                icon={MessagesSquare}
                title={t("emptyInfoTitle")}
                description={t("emptyInfoDescription")}
                className="min-h-52 py-6"
              />
            )}
          </div>
          <div className="mt-8 flex-1 lg:mt-0">
            <ContactForm departments={departments} />
          </div>
        </div>
      </Container>
    </section>
  );
}
