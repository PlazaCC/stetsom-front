"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/page-blocks";
import { decodeHtmlEntities } from "@/lib/utils/plain-text";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
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
            <p className="text-sm whitespace-pre-line text-text-subtle">
              {decodeHtmlEntities(a)}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
