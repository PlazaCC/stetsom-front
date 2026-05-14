'use client'

import { Container } from '@/components/ui/container'
import type { TimelineEvent } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

interface TimelineRefactoredProps {
  events: TimelineEvent[]
  label?: string
  title?: string
  description?: string
  initialActiveIndex?: number
}

export default function TimelineRefactored({
  events,
  label = 'Nossa História',
  title = '35 ANOS DE\nHISTÓRIA',
  description = 'Uma empresa de inovação constante que transformou a Stetsom na maior referência de amplificação automotiva do Brasil.',
  initialActiveIndex = 0,
}: TimelineRefactoredProps) {
  const safeInitialIndex = Math.min(Math.max(initialActiveIndex, 0), Math.max(events.length - 1, 0))
  const [activeIndex, setActiveIndex] = useState(safeInitialIndex)

  const handlePrevious = useCallback(() => {
    if (!events.length) return
    setActiveIndex((prev) => (prev - 1 + events.length) % events.length)
  }, [events.length])

  const handleNext = useCallback(() => {
    if (!events.length) return
    setActiveIndex((prev) => (prev + 1) % events.length)
  }, [events.length])

  const handleCheckpointClick = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!events.length) {
        return
      }

      if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrevious, events.length])

  if (!events.length) {
    return null
  }

  const selectedIndex = Math.min(activeIndex, events.length - 1)
  const activeEvent = events[selectedIndex]
  const progressPercent = events.length <= 1 ? 0 : (selectedIndex / (events.length - 1)) * 100

  return (
    <section className='bg-brand-dark py-20'>
      <Container>
        <div className='space-y-12'>
          {/* BOX 1: HEADER - Título + Descrição + Setas */}
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8'>
            <div className='flex-1'>
              <div className='mb-2 font-sans-condensed text-sm font-black uppercase tracking-wide text-brand'>
                {label}
              </div>
              <h2 className='font-sans-condensed text-5xl font-black leading-none text-white lg:text-display-lg'>
                {title.split('\n').map((line) => (
                  <span key={line} className='block'>
                    {line}
                  </span>
                ))}
              </h2>
              <p className='mt-4 max-w-md text-sm leading-[1.6] text-text-subtle-dark lg:text-base'>{description}</p>
            </div>

            {/* Setas de Controle */}
            <div className='flex gap-3'>
              <button
                onClick={handlePrevious}
                className='flex h-12 w-12 items-center justify-center rounded-full border border-brand text-brand transition-all hover:bg-brand hover:text-white'
                aria-label='Previous event'>
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className='flex h-12 w-12 items-center justify-center rounded-full border border-brand text-brand transition-all hover:bg-brand hover:text-white'
                aria-label='Next event'>
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* BOX 2: TIMELINE LINE + CHECKPOINTS + LABELS */}
          <div className='space-y-6'>
            <div className='relative h-20'>
              {/* Background Line (centered vertically) */}
              <div className='absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 z-0'>
                <svg
                  width='100%'
                  height='100%'
                  viewBox='0 0 100 4'
                  preserveAspectRatio='none'
                  className='absolute left-0 top-0 w-full h-full'>
                  <rect width='100%' height='100%' fill='rgb(80,80,80)' />
                  <rect
                    width={`${progressPercent}%`}
                    height='100%'
                    fill='rgb(232,19,42)'
                    style={{ transition: 'width 0.6s ease-out' }}
                  />
                </svg>
              </div>

              <div className='relative w-full h-full'>
                {events.map((event, index) => {
                  const leftPercent = events.length === 1 ? 50 : (index / (events.length - 1)) * 100
                  return (
                    <div
                      key={event.id}
                      style={{ left: `${leftPercent}%` }}
                      className='absolute top-1/2 z-10 cursor-pointer'>
                      <button
                        onClick={() => handleCheckpointClick(index)}
                        className={cn(
                          'absolute left-1/2 top-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300',
                          index === activeIndex
                            ? 'bg-brand border-2 border-brand z-30'
                            : 'bg-brand-dark border-2 border-zinc-600 hover:border-brand z-20',
                        )}
                        aria-label={`Go to ${event.title}`}
                      />

                      <div className='absolute left-1/2 top-4.5 flex min-w-max -translate-x-1/2 flex-col items-center gap-1 text-center'>
                        <span
                          className={cn(
                            'font-sans-condensed font-black transition-all duration-300',
                            index === activeIndex ? 'text-sm text-brand' : 'text-xs text-text-subtle',
                          )}>
                          {event.year}
                        </span>

                        <span
                          className={cn(
                            'font-sans-condensed font-black uppercase text-center leading-tight transition-all duration-300 text-xs',
                            index === activeIndex ? 'text-white' : 'text-text-subtle',
                          )}>
                          {event.shortTitle}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* BOX 3: EVENT DETAILS - Imagem + Data + Título + Descrição */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Imagem */}
            <div className='relative w-full aspect-video bg-surface-elevated rounded-sm overflow-hidden'>
              <Image
                src={activeEvent.image}
                alt={activeEvent.title}
                fill
                className='object-cover transition-opacity duration-500'
              />
            </div>

            {/* Texto */}
            <div className='transition-all duration-500 space-y-4'>
              <div>
                <h3 className='font-sans-condensed font-black text-display-xl lg:text-display-2xl text-brand leading-none mb-2'>
                  {activeEvent.year}
                </h3>
                <h4 className='font-sans-condensed font-black text-[28px] lg:text-[32px] text-white uppercase'>
                  {activeEvent.title}
                </h4>
              </div>

              <p className='text-base text-text-subtle-dark leading-[1.7]'>{activeEvent.description}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
