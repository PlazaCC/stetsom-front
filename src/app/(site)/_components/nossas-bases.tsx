import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import type { AboutBase } from '@/lib/api/contracts'

interface NossasBasesProps {
  bases: AboutBase[]
}

export default function NossasBases({ bases }: Readonly<NossasBasesProps>) {
  return (
    <section className='bg-off-white py-20'>
      <Container>
        <SectionLabel label='Como Trabalhamos' title='NOSSAS BASES' />

        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 mt-12'>
          {bases.map((base) => (
            <div key={base.id}>
              <div className='w-12 h-1 bg-brand mb-6' />
              <h3 className='font-sans-condensed font-bold text-section-title uppercase text-brand-dark mb-4'>
                {base.title}
              </h3>
              <p className='text-base text-text-subtle leading-[1.7]'>{base.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
