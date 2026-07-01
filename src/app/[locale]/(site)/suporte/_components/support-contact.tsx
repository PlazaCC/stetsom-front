import type { PublicDepartmentItem } from "@/api/stetsom/model";
import { getApiContactDepartments } from "@/api/stetsom/server/contact/contact";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "./contact-form";

const CONTACT_INFO_ICONS = {
  phone: Phone,
  email: Mail,
  whatsapp: Phone,
} as const;

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
}

export async function SupportContact({
  contact,
  contactInfo,
}: Readonly<SupportContactProps>) {
  const t = await getTranslations("Support.contact");

  const departments = await getApiContactDepartments().catch(
    () => [] as PublicDepartmentItem[],
  );

  const infoItems = contactInfo
    ? ([
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
      ] as const)
    : [];

  return (
    <section id="contact" className="w-full scroll-mt-24 bg-white py-12">
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
                    <div
                      key={key}
                      className="flex items-center gap-4 border border-border px-4 py-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-brand/10">
                        <Icon size={18} className="text-brand" />
                      </div>
                      <div>
                        <p className="font-sans text-xs font-medium tracking-wide text-text-subtle uppercase">
                          {label}
                        </p>
                        <p className="font-sans text-sm font-semibold text-brand-dark">
                          {value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
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
