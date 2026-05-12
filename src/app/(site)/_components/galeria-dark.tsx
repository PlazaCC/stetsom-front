import { Container } from '@/components/ui/container'

export default function GaleriaDark() {
  const galleryItems = Array(6).fill(null)

  return (
    <section className='relative bg-brand-dark py-12 overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-b from-[rgba(27,26,44,0.5)] to-[rgba(22,16,16,0.5)]' />
      <Container className='z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {galleryItems.map((_, i) => (
            <div
              key={i}
              className='bg-zinc-800 aspect-square rounded-lg overflow-hidden'
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
