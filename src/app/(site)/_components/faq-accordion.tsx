"use client"

import { useState } from "react"

interface FAQItem {
  q: string
  a: string
}

export default function FaqAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div>
      {items.map(({ q, a }, i) => (
        <div key={i} className="border-b border-zinc-200 py-4">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full justify-between items-center text-left gap-4"
          >
            <span className="font-medium text-[15px] text-brand-dark">{q}</span>
            <span className="text-brand text-lg font-light shrink-0">
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && (
            <p className="text-sm text-[rgb(102,102,102)] mt-2.5 leading-relaxed">{a}</p>
          )}
        </div>
      ))}
    </div>
  )
}
