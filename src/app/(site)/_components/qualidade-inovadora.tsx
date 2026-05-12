import SectionLabel from '@/components/ui/section-label'
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

export default function QualidadeInovadora({ section, values }: Readonly<QualidadeInovadoraProps>) {
  return (
    <section className='bg-white py-20'>
      <div className='px-8 lg:px-42.5 max-w-360 mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-start'>
          {/* Imagem Esquerda */}
          <div className='relative w-full aspect-square bg-[rgb(240,240,240)] rounded-sm flex items-center justify-center'>
            <Image src={section.image} alt={section.imageAlt} fill className='object-cover' />
          </div>

          {/* Texto + Cards Direita */}
          <div>
            <SectionLabel label={section.label} title={section.title} />

            <p className='text-base text-[rgb(102,102,102)] mt-6 leading-[1.7]'>{section.description}</p>

            {/* 3 Value Cards */}
            <div className='grid grid-cols-1 gap-6 mt-10'>
              {values.map((value) => {
                const Icon = ICONS[value.icon]

                return (
                  <div key={value.id} className='flex gap-4'>
                    <div className='w-8 h-8 rounded-full  flex items-center justify-center text-white font-bold shrink-0'>
                      <Icon className='w-4 h-4 text-brand' aria-hidden='true' />
                    </div>
                    <div>
                      <h3 className='font-sans-condensed font-bold text-base uppercase text-brand-dark mb-2'>
                        {value.title}
                      </h3>
                      <p className='text-sm text-[rgb(102,102,102)] leading-relaxed'>{value.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
