import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import type { AboutValue } from '@/lib/api/contracts'
import { Rocket, ShieldCheck, Zap } from 'lucide-react'
import Image from 'next/image'

const ICONS = {
  zap: Zap,
  'shield-check': ShieldCheck,
  rocket: Rocket,
} as const

interface QualitySectionData {
  label: string
  title: string
  description: string
  image: string
  imageAlt: string
}

interface QualitySectionProps {
  section: QualitySectionData
  values: AboutValue[]
  foundingLabel?: string
}

export function QualitySection({ section, values, foundingLabel }: Readonly<QualitySectionProps>) {
  return (
    <section className='bg-off-white py-20'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-start'>
          <div className='relative aspect-square w-full rounded-sm bg-muted flex items-center justify-center overflow-hidden'>
            <Image src={section.image} alt={section.imageAlt} fill className='object-cover' />
            <div className='absolute bottom-5 left-5 flex flex-col gap-2'>
              <div className='flex h-15 w-15 items-center justify-center bg-brand'>
                <span className='font-sans-condensed text-xl font-black uppercase leading-none text-white'>1989</span>
              </div>
              <span className='font-sans-condensed text-xs font-black uppercase tracking-widest text-white drop-shadow-md'>
                {foundingLabel}
              </span>
            </div>
          </div>

          <div>
            <SectionLabel label={section.label} title={section.title} />

            <p className='text-base text-text-subtle mt-6 leading-[1.7]'>{section.description}</p>

            <div className='grid grid-cols-1 gap-6 mt-10'>
              {values.map((value) => {
                const Icon = ICONS[value.icon]

                return (
                  <div key={value.id} className='flex gap-4'>
                    <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold'>
                      <Icon className='h-4 w-4 text-brand' aria-hidden='true' />
                    </div>
                    <div>
                      <h3 className='font-sans-condensed font-black text-base uppercase text-brand-dark mb-2'>
                        {value.title}
                      </h3>
                      <p className='text-sm text-text-subtle leading-relaxed'>{value.description}</p>
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
