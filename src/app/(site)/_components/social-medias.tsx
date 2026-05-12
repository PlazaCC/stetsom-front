import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import type { SocialFeedSection } from '@/lib/api/contracts'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MidiasSociaisProps {
  section: SocialFeedSection
}

export default function MidiasSociais({ section }: Readonly<MidiasSociaisProps>) {
  return (
    <section className='flex justify-center bg-off-white py-12'>
      <Container>
        <div className='flex justify-between items-end mb-8'>
          <SectionLabel label={section.handle} title={section.title} subtitle={section.subtitle} />
          <span className='font-sans-condensed font-medium text-base text-brand cursor-pointer hover:text-brand/80 transition-colors'>
            {section.ctaLabel} ›
          </span>
        </div>
        <div className='flex gap-6 overflow-x-auto pb-1'>
          {section.posts.map((post) => (
            <div
              key={post.id}
              className='w-62.5 h-62.5 shrink-0 rounded-sm bg-cover bg-center'
              style={{
                backgroundImage: `url('${post.image}')`,
                opacity: post.opacity ?? 1,
              }}
            />
          ))}
        </div>
        <div className='flex justify-end gap-2'>
          <Button size='icon' variant='ghost' className='cursor-pointer'>
            <ChevronLeft />
          </Button>
          <Button size='icon' variant='ghost' className='cursor-pointer'>
            <ChevronRight />
          </Button>
        </div>
      </Container>
    </section>
  )
}
