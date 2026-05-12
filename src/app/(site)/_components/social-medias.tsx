import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import type { SocialFeedSection } from '@/lib/api/contracts'

interface MidiasSociaisProps {
  section: SocialFeedSection
}

export default function MidiasSociais({ section }: Readonly<MidiasSociaisProps>) {
  return (
    <section className='flex justify-center bg-off-white py-12'>
      <Container>
        <div className='flex justify-between items-end mb-8'>
          <SectionLabel label={section.handle} title={section.title} subtitle={section.subtitle} />
          <Link
            href={section.ctaHref}
            className='font-sans-condensed font-medium text-base text-brand hover:text-brand/80 transition-colors'>
            {section.ctaLabel} ›
          </Link>
        </div>
        <div className='flex gap-6 overflow-x-auto pb-1'>
          {section.posts.map((post) => (
            <Link
              key={post.id}
              href={post.href}
              className='relative w-62.5 h-62.5 shrink-0 rounded-sm overflow-hidden block'>
              <Image
                src={post.image}
                alt={post.alt ?? ''}
                fill
                className='object-cover'
                style={{ opacity: post.opacity ?? 1 }}
              />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
