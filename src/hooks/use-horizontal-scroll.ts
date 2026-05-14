'use client'

import { useRef } from 'react'

export function useHorizontalScroll(amount = 300) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (direction: 'left' | 'right') => {
    ref.current?.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }
  return { ref, scroll }
}
