import { cn } from "@/lib/utils";

interface AdminPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminPanel({ children, className }: AdminPanelProps) {
  return (
    <div
      className={cn("rounded-[16px] border border-border bg-card", className)}
    >
      {children}
    </div>
  );
}
