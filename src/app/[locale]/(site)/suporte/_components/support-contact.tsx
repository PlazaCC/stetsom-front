import { Container } from '@/components/ui/container';
import { SectionLabel } from '@/components/ui/section-label';
import type { SupportPayload } from '@/lib/api/contracts';
import { Mail, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ContactForm } from './contact-form';

const CONTACT_INFO_ICONS = {
  phone: Phone,
  email: Mail,
  whatsapp: Phone,
} as const;

interface SupportContactProps {
  contact: SupportPayload['contact'];
  contactInfo?: SupportPayload['contactInfo'];
}

export async function SupportContact({
  contact,
  contactInfo,
}: Readonly<SupportContactProps>) {
  const t = await getTranslations('Support.contact');

  const infoItems = contactInfo
    ? ([
        {
          key: 'phone',
          label: t('contactInfoPhone'),
          value: contactInfo.phone,
        },
        {
          key: 'email',
          label: t('contactInfoEmail'),
          value: contactInfo.email,
        },
        {
          key: 'whatsapp',
          label: t('contactInfoWhatsapp'),
          value: contactInfo.whatsapp,
        },
      ] as const)
    : [];

  return (
    <section className='w-full bg-white py-12'>
      <Container>
        <div className='flex flex-col lg:flex-row lg:items-start lg:gap-16'>
          <div className='flex shrink-0 flex-col gap-6 lg:w-90'>
            <SectionLabel label={contact.label} title={contact.title} />
            <p className='text-base text-text-subtle'>{contact.description}</p>

            {infoItems.length > 0 && (
              <div className='flex flex-col gap-3'>
                {infoItems.map(({ key, label, value }) => {
                  const Icon = CONTACT_INFO_ICONS[key];
                  return (
                    <div
                      key={key}
                      className='flex items-center gap-4 border border-border px-4 py-3'
                    >
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center bg-brand/10'>
                        <Icon size={18} className='text-brand' />
                      </div>
                      <div>
                        <p className='font-sans text-xs font-medium uppercase tracking-wide text-text-subtle'>
                          {label}
                        </p>
                        <p className='font-sans text-sm font-semibold text-brand-dark'>
                          {value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className='mt-8 flex-1 lg:mt-0'>
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
