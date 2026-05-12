import { Button } from '@/components/ui/button'
import SectionLabel from '@/components/ui/section-label'
import type { SiteAboutPayload } from '@/lib/api/contracts'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface CTATrabalheConoscoProps {
  section: SiteAboutPayload['jobsCta']
}

export default function CTATrabalheConosco({ section }: Readonly<CTATrabalheConoscoProps>) {
  return (
    <section className='bg-white py-20'>
      <div className='px-8 lg:px-[170px] max-w-[1440px] mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Texto Esquerda */}
          <div>
            <SectionLabel label={section.label} title={section.title} />

            <p className='text-base text-[rgb(102,102,102)] mt-6 leading-[1.7] mb-8'>{section.description}</p>

            <a href={section.buttonHref} target='_blank' rel='noopener noreferrer'>
              <Button className='bg-brand hover:bg-brand/90 text-white font-sans-condensed uppercase font-bold inline-flex items-center gap-2'>
                {section.buttonLabel}
                <ExternalLink size={18} />
              </Button>
            </a>
          </div>

          {/* Imagem Direita */}
          <div className='relative w-full aspect-square bg-[rgb(240,240,240)] rounded-sm flex items-center justify-center'>
            <Image src={section.image} alt={section.imageAlt} fill className='object-cover' />
          </div>
        </div>
      </div>
    </section>
  )
}
