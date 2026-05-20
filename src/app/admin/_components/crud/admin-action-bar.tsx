import { cn } from "@/lib/utils";

interface AdminActionBarProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminActionBar({ children, className }: AdminActionBarProps) {
  return (
    <div className={cn("flex items-center justify-end gap-3", className)}>
      {children}
    </div>
  );
}
