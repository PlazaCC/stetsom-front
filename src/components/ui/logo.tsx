import Image from "next/image";

interface LogoProps {
  src: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function Logo({
  src,
  width = 158,
  height = 35,
  priority,
  className,
}: LogoProps) {
  return (
    <Image
      src={src}
      alt="Stetsom"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
