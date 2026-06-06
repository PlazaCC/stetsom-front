"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQItem = { id: string; q: string; a: string };

export function FaqAccordion({ items }: { items: FAQItem[] }) {
  return (
    <Accordion>
      {items.map(({ id, q, a }, index) => (
        <AccordionItem
          key={id ?? index}
          value={id ?? String(index)}
          className="border-border"
        >
          <AccordionTrigger className="py-4 text-base text-brand-dark">
            <span className="font-medium">{q}</span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-text-subtle">{a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
