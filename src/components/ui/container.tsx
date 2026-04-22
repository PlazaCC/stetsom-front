import { cn } from "@/lib/utils";
import { mergeProps, useRender } from "@base-ui/react";

interface ContainerProps extends useRender.ComponentProps<"div"> {}

export default function Container(props: ContainerProps) {
  const { render, ...rest } = props;

  const element = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      { className: cn("relative w-full max-w-291 px-8") },
      rest,
    ),
  });

  return element;
}
