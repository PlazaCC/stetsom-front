import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import type { AboutValue, SiteAboutPayload } from '@/lib/api/contracts'
import { Rocket, ShieldCheck, Zap } from 'lucide-react'
import Image from 'next/image'

const ICONS = {
  zap: Zap,
  'shield-check': ShieldCheck,
  rocket: Rocket,
} as const

interface QualidadeInovadoraProps {
  section: SiteAboutPayload['quality']
  values: AboutValue[]
}

export default function QualidadeInovadora({
  section,
  values,
}: Readonly<QualidadeInovadoraProps>) {
  return (
    <section className='bg-white py-20'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-start'>
          {/* Imagem Esquerda */}
          <div className='relative aspect-square w-full rounded-sm bg-[rgb(240,240,240)] flex items-center justify-center'>
            <Image src={section.image} alt={section.imageAlt} fill className='object-cover' />
          </div>

          {/* Texto + Cards Direita */}
          <div>
            <SectionLabel label={section.label} title={section.title} />

            <p className='text-base text-[rgb(102,102,102)] mt-6 leading-[1.7]'>
              {section.description}
            </p>

            {/* 3 Value Cards */}
            <div className='grid grid-cols-1 gap-6 mt-10'>
              {values.map((value) => {
                const Icon = ICONS[value.icon]

                return (
                  <div key={value.id} className='flex gap-4'>
                    <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-white'>
                      <Icon className='h-4 w-4 text-brand' aria-hidden='true' />
                    </div>
                    <div>
                      <h3 className='font-sans-condensed font-bold text-base uppercase text-brand-dark mb-2'>
                        {value.title}
                      </h3>
                      <p className='text-sm text-[rgb(102,102,102)] leading-relaxed'>
                        {value.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
