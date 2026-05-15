import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import type { SiteAboutPayload } from '@/lib/api/contracts'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

const FACTORY_IMAGE = '/figma-assets/raw/fill_OJJ5Q1_b3596ec5.png'
const MAP_IMAGE = '/figma-assets/raw/fill_SXY62B_51d05531.png'

interface OurFactoryProps {
  jobsCta?: SiteAboutPayload['jobsCta']
}

export default function OurFactory({ jobsCta }: OurFactoryProps) {
  return (
    <section className='relative bg-brand-dark overflow-hidden'>
      <Image src={FACTORY_IMAGE} alt='Fábrica Stetsom' fill className='object-cover' priority />
      <div
        className='absolute inset-0'
        style={{ background: 'radial-gradient(circle at 99% 114%, rgba(27,26,44,1) 0%, rgba(22,16,16,1) 100%)' }}
      />
      <Container className='relative z-10 py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div>
            {jobsCta ? (
              <>
                <SectionLabel label={jobsCta.label} title={jobsCta.title} dark />
                <p className='text-base text-text-subtle-dark mt-6 leading-[1.7] mb-8'>{jobsCta.description}</p>
                <a href={jobsCta.buttonHref} target='_blank' rel='noopener noreferrer'>
                  <Button variant='brand' size='md' className='inline-flex items-center gap-2'>
                    {jobsCta.buttonLabel}
                    <ExternalLink size={18} />
                  </Button>
                </a>
              </>
            ) : (
              <div>
                <p className='font-sans-condensed font-black text-sm uppercase text-brand mb-2'>Localização</p>
                <h2 className='font-sans-condensed font-black text-display-xl uppercase leading-tight text-white'>
                  Nossa Fábrica
                </h2>
                <p className='font-sans text-base text-text-subtle-dark leading-relaxed mt-6'>
                  Localizada no coração de São Paulo, nossa fábrica é equipada com tecnologia de ponta para a manufatura
                  de amplificadores de classe mundial.
                </p>
                <div className='flex flex-col gap-2 pt-6'>
                  <div className='flex items-start gap-3'>
                    <div className='w-1 h-4 bg-brand mt-0.5 shrink-0' />
                    <p className='font-sans text-sm text-text-subtle-dark'>
                      Av. Industrial Stetsom, 100 — São Paulo, SP 09850-000
                    </p>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='w-1 h-4 bg-brand mt-0.5 shrink-0' />
                    <p className='font-sans text-sm text-text-subtle-dark'>
                      +55 (11) 3000-0000 | suporte@stetsom.com.br
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className='relative h-72 lg:h-96 rounded-sm overflow-hidden bg-surface-elevated'>
            <Image
              src={MAP_IMAGE}
              alt='Localização Stetsom'
              fill
              className='object-cover'
              sizes='(max-width: 1024px) 100vw, 560px'
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
