import { CTAButton } from '@/components/ui/cta-button';
import { SectionLabel } from '@/components/ui/section-label';
import type { SiteHomePayload } from '@/lib/api/contracts';
import Image from 'next/image';

interface OurHistoryProps {
  section: SiteHomePayload['history'];
}

export function OurHistory({ section }: Readonly<OurHistoryProps>) {
  return (
    <section className='bg-brand-dark'>
      {/* Mobile: image on top, content below */}
      <div className='lg:hidden'>
        <div className='relative aspect-16/11 w-full overflow-hidden'>
          <Image
            src={section.image}
            alt={section.imageAlt}
            fill
            className='object-cover'
            sizes='100vw'
          />
        </div>
        <div className='px-5 py-10 sm:px-8 sm:py-12'>
          <SectionLabel
            label={section.label}
            title={section.title}
            subtitle={section.subtitle}
            dark
          />
          <CTAButton
            href={section.ctaHref}
            label={section.ctaLabel}
            variant='brand'
            size='sm'
            className='mt-4'
          />
        </div>
      </div>

      {/* Desktop: image flush-left (no left padding), content padded right */}
      <div className='hidden lg:flex lg:min-h-132'>
        <div className='flex mx-auto'>
          <div className='relative w-182.75 shrink-0 self-stretch overflow-hidden'>
            <Image
              src={section.image}
              alt={section.imageAlt}
              fill
              className='object-cover'
              sizes='731px'
            />
          </div>
          <div className='flex flex-1 items-center py-16 pl-22.75 pr-42.5'>
            <div className='w-full max-w-122'>
              <SectionLabel
                label={section.label}
                title={section.title}
                subtitle={section.subtitle}
                dark
              />
              <CTAButton
                href={section.ctaHref}
                label={section.ctaLabel}
                variant='brand'
                size='sm'
                className='mt-5'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
