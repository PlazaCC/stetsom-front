'use client'

import type { FeaturedTab } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

interface FeaturedTabStripProps {
  tabs: FeaturedTab[]
  activeTab: FeaturedTab
  onSelect: (tab: FeaturedTab) => void
  ctaHref: string
  ctaLabel: string
}

export function FeaturedTabStrip({ tabs, activeTab, onSelect, ctaHref, ctaLabel }: FeaturedTabStripProps) {
  return (
    <>
      <div role='tablist' className='inline-flex items-center gap-0 overflow-x-auto bg-muted rounded-lg p-1'>
        {tabs.map((tab) => (
          <button
            type='button'
            key={tab.id}
            role='tab'
            onClick={() => onSelect(tab)}
            aria-selected={activeTab.id === tab.id}
            className={cn(
              'shrink-0 px-3 py-1.5 transition-all text-sm leading-5 font-medium font-sans text-center rounded-md',
              activeTab.id === tab.id
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}>
            {tab.label}
          </button>
        ))}
      </div>
      <Link
        href={ctaHref}
        className='ml-4 inline-flex items-center gap-2 px-2 text-base font-sans-condensed font-medium text-brand'>
        <span>{ctaLabel}</span>
        <ArrowRight className='size-4 inline-block' strokeWidth={2.5} />
      </Link>
    </>
  )
}
