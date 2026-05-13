import Image from 'next/image'

import { Container } from '@/components/ui/container'

const FACTORY_IMAGE = '/figma-assets/raw/fill_OJJ5Q1_b3596ec5.png'

export default function NossaFabrica() {
  return (
    <section className='relative bg-brand-dark py-12 overflow-hidden'>
      {/* Factory Image with Radial Overlay */}
      <div className='relative w-full h-96'>
        <Image
          src={FACTORY_IMAGE}
          alt='Fábrica Stetsom'
          fill
          className='object-cover'
          priority
        />
        {/* Radial Gradient Overlay */}
        <div
          className='absolute inset-0'
          style={{
            background:
              'radial-gradient(circle at 99% 114%, rgba(27,26,44,1) 0%, rgba(22,16,16,1) 100%)',
          }}
        />
      </div>

      {/* Content Section */}
      <Container className='py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Text Content */}
          <div className='text-white space-y-6'>
            <div>
              <p className='font-sans-condensed font-medium text-sm uppercase text-brand mb-2'>
                Localização
              </p>
              <h2 className='font-sans-condensed font-black text-display-xl uppercase leading-tight'>
                Nossa Fábrica
              </h2>
            </div>
            <p className='font-sans text-base text-text-subtle-dark leading-relaxed'>
              Localizada no coração de São Paulo, nossa fábrica é equipada com tecnologia de ponta
              para a manufatura de amplificadores de classe mundial. Aqui, cada detalhe é
              meticulosamente verificado para garantir a máxima qualidade e desempenho.
            </p>
            <div className='pt-4'>
              <p className='font-sans text-sm text-text-subtle-dark'>
                <strong>Endereço:</strong> Rua Exemplo, 123 — São Paulo, SP
              </p>
              <p className='font-sans text-sm text-text-subtle-dark mt-2'>
                <strong>Telefone:</strong> (11) 3000-0000
              </p>
            </div>
          </div>

          {/* Map or Additional Content Placeholder */}
          <div className='hidden lg:flex items-center justify-center h-96 bg-surface-elevated rounded-lg text-text-subtle-dark'>
            Mapa ou conteúdo adicional
          </div>
        </div>
      </Container>
    </section>
  )
}
