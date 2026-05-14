import Image from 'next/image'

import { Container } from '@/components/ui/container'

const FACTORY_IMAGE = '/figma-assets/raw/fill_OJJ5Q1_b3596ec5.png'
const MAP_IMAGE = '/figma-assets/raw/fill_SXY62B_51d05531.png'
const FACTORY_OVERLAY_GRADIENT = 'radial-gradient(circle at 99% 114%, rgba(27,26,44,1) 0%, rgba(22,16,16,1) 100%)'

export default function OurFactory() {
  return (
    <section className='relative bg-brand-dark overflow-hidden'>
      {/* Factory Image with Radial Overlay */}
      <div className='relative w-full h-96'>
        <Image src={FACTORY_IMAGE} alt='Fábrica Stetsom' fill className='object-cover' priority />
        <div
          className='absolute inset-0'
          style={{ background: FACTORY_OVERLAY_GRADIENT }}
        />
      </div>

      {/* Content Section */}
      <Container className='py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
          {/* Text Content */}
          <div className='text-white space-y-6'>
            <div>
              <p className='font-sans-condensed font-black text-sm uppercase text-brand mb-2'>Localização</p>
              <h2 className='font-sans-condensed font-black text-display-xl uppercase leading-tight'>Nossa Fábrica</h2>
            </div>
            <p className='font-sans text-base text-text-subtle-dark leading-relaxed'>
              Localizada no coração de São Paulo, nossa fábrica é equipada com tecnologia de ponta para a manufatura de
              amplificadores de classe mundial. Cada detalhe é meticulosamente verificado para garantir a máxima
              qualidade e desempenho.
            </p>
            <div className='flex flex-col gap-2 pt-2'>
              <div className='flex items-start gap-3'>
                <div className='w-1 h-4 bg-brand mt-0.5 shrink-0' />
                <p className='font-sans text-sm text-text-subtle-dark'>Av. Industrial Stetsom, 100 — São Paulo, SP 09850-000</p>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-1 h-4 bg-brand mt-0.5 shrink-0' />
                <p className='font-sans text-sm text-text-subtle-dark'>+55 (11) 3000-0000 | suporte@stetsom.com.br</p>
              </div>
            </div>
          </div>

          {/* Map */}
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
