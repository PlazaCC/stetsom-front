"use client";

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AdminTopbarProps {
  onMenuClick?: () => void;
}

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-card px-4 lg:hidden",
        "transition-colors duration-200 ease-in-out",
      )}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="flex size-10 items-center justify-center rounded-md text-foreground hover:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
        aria-label="Abrir menu"
      >
        <Menu className="size-5" />
      </button>

      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Stetsom"
          width={100}
          height={34}
          className="h-6 w-auto"
        />
        <span className="text-sm font-bold text-foreground uppercase">
          CMS Stetsom
        </span>
      </div>
    </header>
  );
}
