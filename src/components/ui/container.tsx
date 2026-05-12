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
        className: cn('relative mx-auto w-full max-w-360 px-8 lg:px-42.5'),
      },
      rest,
    ),
  })

  return element
}
