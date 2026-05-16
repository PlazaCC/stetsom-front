import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import type { SupportPayload } from '@/lib/api/contracts'
import { MapPin } from 'lucide-react'
import Image from 'next/image'

interface SupportServiceCentersProps {
  serviceCenters: NonNullable<SupportPayload['serviceCenters']>
  mapImage: SupportPayload['mapImage']
}

export function SupportServiceCenters({ serviceCenters, mapImage }: Readonly<SupportServiceCentersProps>) {
  return (
    <section className='w-full bg-white py-12'>
      <Container>
        <SectionLabel label='Rede Autorizada' title='POSTOS AUTORIZADOS' />
        <p className='mt-2 text-sm text-text-subtle'>
          Informe seu CEP ou cidade para encontrarmos as assistências técnicas autorizadas Stetsom mais próximas de você.
        </p>
        <div className='mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8'>
          {/* Lista de postos */}
          <div className='flex flex-col gap-3 lg:w-86'>
            <div className='flex gap-2'>
              <div className='flex flex-1 h-10 items-center gap-2 border border-border bg-white px-3'>
                <MapPin size={14} className='shrink-0 text-icon-muted' />
                <input
                  type='text'
                  placeholder='Digite seu CEP ou cidade...'
                  className='flex-1 border-none bg-transparent text-sm outline-none placeholder:text-icon-muted'
                />
              </div>
              <button
                type='button'
                className='h-10 shrink-0 bg-brand px-4 font-sans text-2xs font-bold uppercase tracking-[0.6px] text-white transition-colors hover:bg-brand/90'>
                Buscar
              </button>
            </div>
            <div className='flex flex-col gap-2'>
              {serviceCenters.map((posto) => (
                <div key={posto.id} className='flex flex-col gap-0.5 border border-border bg-white px-4 py-3'>
                  <p className='font-sans text-sm font-semibold text-brand-dark'>{posto.name}</p>
                  <p className='font-sans text-xs text-text-subtle'>{posto.address}</p>
                  <div className='flex items-center gap-3'>
                    <p className='font-sans text-xs text-brand'>{posto.phone}</p>
                    {posto.phone2 && <p className='font-sans text-xs text-text-subtle'>{posto.phone2}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mapa placeholder */}
          <div className='relative flex-1 overflow-hidden rounded-2xl bg-muted lg:min-h-114.25'>
            <Image
              src={mapImage}
              alt='Mapa de postos autorizados'
              fill
              className='object-cover opacity-60'
              sizes='(max-width: 1024px) 100vw, 60vw'
            />
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='rounded-full bg-brand p-3 shadow-lg'>
                <MapPin size={24} className='text-white' />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
