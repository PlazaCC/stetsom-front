import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import type { SiteAboutPayload } from '@/lib/api/contracts'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface CTATrabalheConoscoProps {
  section: SiteAboutPayload['jobsCta']
}

export default function CTATrabalheConosco({ section }: Readonly<CTATrabalheConoscoProps>) {
  return (
    <section className='bg-white py-20'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Texto Esquerda */}
          <div>
            <SectionLabel label={section.label} title={section.title} />

            <p className='text-base text-text-subtle mt-6 leading-[1.7] mb-8'>{section.description}</p>

            <a href={section.buttonHref} target='_blank' rel='noopener noreferrer'>
              <Button variant='brand' size='md' className='inline-flex items-center gap-2'>
                {section.buttonLabel}
                <ExternalLink size={18} />
              </Button>
            </a>
          </div>

          {/* Imagem Direita */}
          <div className='relative aspect-square w-full rounded-sm bg-muted flex items-center justify-center'>
            <Image src={section.image} alt={section.imageAlt} fill className='object-cover' />
          </div>
        </div>
      </Container>
    </section>
  )
}
