'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { useHorizontalScroll } from '@/hooks/use-horizontal-scroll'
import type { SocialFeedSection } from '@/lib/api/contracts'

interface MidiasSociaisProps {
  section: SocialFeedSection
}

export default function MidiasSociais({ section }: Readonly<MidiasSociaisProps>) {
  const { ref: scrollRef, scroll } = useHorizontalScroll()

  return (
    <section className='flex justify-center bg-off-white py-12'>
      <Container>
        <div className='flex justify-between items-end mb-8'>
          <SectionLabel label={section.handle} title={section.title} subtitle={section.subtitle} />
          <div className='flex items-center gap-4'>
            <Link
              href={section.ctaHref}
              className='font-sans-condensed font-black text-base text-brand hover:text-brand/80 transition-colors'>
              {section.ctaLabel} ›
            </Link>
            <div className='flex gap-2'>
              <button
                onClick={() => scroll('left')}
                className='p-2 hover:bg-muted rounded-sm transition-colors'
                aria-label='Scroll left'>
                <ChevronLeft size={20} className='text-brand-dark' />
              </button>
              <button
                onClick={() => scroll('right')}
                className='p-2 hover:bg-muted rounded-sm transition-colors'
                aria-label='Scroll right'>
                <ChevronRight size={20} className='text-brand-dark' />
              </button>
            </div>
          </div>
        </div>
        <div ref={scrollRef} className='flex gap-6 overflow-x-auto pb-1 scroll-smooth'>
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
