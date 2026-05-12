import { cn } from '@/lib/utils'
import { mergeProps, useRender } from '@base-ui/react'

type ContainerProps = useRender.ComponentProps<'div'>

export function Container(props: ContainerProps) {
  const { render, ...rest } = props

  const element = useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: cn(
          'relative mx-auto w-full max-w-[1440px] px-8 lg:px-[170px]',
        ),
      },
      rest,
    ),
  })

  return element
}
