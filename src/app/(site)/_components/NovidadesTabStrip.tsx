'use client'

import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface NovidadesTabStripProps {
  tabs: string[]
  activeTab: string
  onSelect: (tab: string) => void
  ctaHref: string
  ctaLabel: string
}

export function NovidadesTabStrip({ tabs, activeTab, onSelect, ctaHref, ctaLabel }: NovidadesTabStripProps) {
  return (
    <>
      <div
        role='tablist'
        className='inline-flex items-center gap-0 overflow-x-auto pb-0 pr-0 sm:gap-0 lg:pr-0 border-b border-zinc-200'>
        {tabs.map((tab) => (
          <button
            type='button'
            key={tab}
            role='tab'
            onClick={() => onSelect(tab)}
            aria-selected={activeTab === tab}
            className={cn(
              'shrink-0 px-3 py-3 transition-colors text-lg font-medium leading-5 font-sans text-center border-b-2',
              activeTab === tab
                ? 'border-brand text-brand-dark'
                : 'border-transparent text-muted-foreground hover:text-brand-dark',
            )}>
            {tab}
          </button>
        ))}
      </div>
      <Link
        href={ctaHref}
        className='ml-4 inline-flex items-center gap-2 px-2 text-sm font-sans-condensed font-black text-brand'>
        <span>{ctaLabel}</span>
        <ArrowRight className='size-4 inline-block' strokeWidth={2.5} />
      </Link>
    </>
  )
}
