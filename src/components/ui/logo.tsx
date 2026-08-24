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
  width = 239,
  height = 48,
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
      style={{ width: "auto", height: `${height}px` }}
      unoptimized
    />
  );
}
