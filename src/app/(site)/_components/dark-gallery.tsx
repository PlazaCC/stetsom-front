import { Container } from '@/components/ui/container'
import Image from 'next/image'

const GALLERY_IMAGES = [
  { src: '/figma-assets/raw/fill_SXY62B_51d05531.png', alt: 'Stetsom comunidade' },
  { src: '/figma-assets/raw/fill_VC6PCG_79e9d64e.png', alt: 'Stetsom evento' },
  { src: '/figma-assets/raw/fill_KULSWW_74ec6dcf.png', alt: 'Stetsom produto' },
  { src: '/figma-assets/raw/fill_DNYKPI_76d259b6.png', alt: 'Stetsom instalação' },
  { src: '/figma-assets/raw/fill_3OI1TK_c5edb822.png', alt: 'Stetsom performance' },
  { src: '/figma-assets/raw/fill_OJJ5Q1_b3596ec5.png', alt: 'Stetsom fábrica' },
] as const

export default function DarkGallery() {
  return (
    <section className='relative bg-brand-dark py-12 overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-dark-overlay' />
      <Container className='z-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6'>
          {GALLERY_IMAGES.map((item) => (
            <div key={item.src} className='relative aspect-square overflow-hidden rounded-sm bg-surface-elevated'>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 360px'
                className='object-cover transition-transform duration-500 hover:scale-105'
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
