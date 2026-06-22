import { cn } from "@/lib/utils";

interface AdminPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminPanel({ children, className }: AdminPanelProps) {
  return (
    <div className={cn("relative z-10 border-b", className)}>{children}</div>
  );
}
