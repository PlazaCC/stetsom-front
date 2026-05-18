"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQItem } from "@/lib/api/contracts";

export function FaqAccordion({ items }: { items: FAQItem[] }) {
  return (
    <Accordion>
      {items.map(({ id, q, a }) => (
        <AccordionItem key={id} value={id} className="border-border">
          <AccordionTrigger className="py-4 text-base text-brand-dark">
            <span className="font-medium">{q}</span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm leading-relaxed text-text-subtle">{a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
