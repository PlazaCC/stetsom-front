import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps extends ComponentPropsWithoutRef<'nav'> {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label='Breadcrumb' className={className} {...props}>
      <ol className='flex flex-row flex-wrap items-center gap-1 px-5 py-2'>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className='inline-flex items-center gap-1'
            >
              {index > 0 && (
                <ChevronRight
                  className='h-3.5 w-3.5 text-muted-foreground'
                  aria-hidden='true'
                />
              )}
              {isCurrent || !item.href ? (
                <span
                  className='text-xs font-medium uppercase text-brand-dark'
                  aria-current='page'
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'text-xs font-medium uppercase text-muted-foreground transition-colors hover:text-brand-dark',
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
