import Image from "next/image";

interface LogoProps {
  variant?: "white" | "dark";
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

const LOGO_SRC = {
  white: "/logo-white.png",
  dark: "/logo.png",
} as const;

export function Logo({
  variant = "white",
  width = 158,
  height = 35,
  priority,
  className,
}: LogoProps) {
  return (
    <Image
      src={LOGO_SRC[variant]}
      alt="Stetsom"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
