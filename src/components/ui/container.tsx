import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

type ContainerProps = ComponentPropsWithoutRef<'div'>;

export function Container({ className, ...rest }: ContainerProps) {
  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-360 px-5 lg:px-42.5',
        className,
      )}
      {...rest}
    />
  );
}
