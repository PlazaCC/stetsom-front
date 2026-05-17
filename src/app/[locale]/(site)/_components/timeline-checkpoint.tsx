'use client'

import type { TimelineEvent } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'

interface TimelineCheckpointProps {
  event: TimelineEvent
  index: number
  isActive: boolean
  leftPercent: number
  onClick: (index: number) => void
}

export function TimelineCheckpoint({ event, index, isActive, leftPercent, onClick }: TimelineCheckpointProps) {
  return (
    <div style={{ left: `${leftPercent}%` }} className='absolute top-1/2 z-10 cursor-pointer'>
      <button
        onClick={() => onClick(index)}
        className={cn(
          'absolute left-1/2 top-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300',
          isActive
            ? 'bg-brand border-2 border-brand z-30'
            : 'bg-brand-dark border-2 border-zinc-600 hover:border-brand z-20',
        )}
        aria-label={`Go to ${event.title}`}
      />
      <div className='absolute left-1/2 top-4.5 flex min-w-max -translate-x-1/2 flex-col items-center gap-1 text-center'>
        <span
          className={cn(
            'font-sans-condensed font-black transition-all duration-300',
            isActive ? 'text-sm text-brand' : 'text-xs text-text-subtle',
          )}>
          {event.year}
        </span>
        <span
          className={cn(
            'font-sans-condensed font-black uppercase text-center leading-tight transition-all duration-300 text-xs',
            isActive ? 'text-white' : 'text-text-subtle',
          )}>
          {event.shortTitle}
        </span>
      </div>
    </div>
  )
}
