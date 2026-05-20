import { cn } from "@/lib/utils";

interface AdminFormPageProps {
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}

export function AdminFormPage({
  children,
  aside,
  className,
}: AdminFormPageProps) {
  return (
    <div className={cn("flex gap-5", className)}>
      <div className="min-w-0 flex-1 space-y-4">{children}</div>
      {aside && <aside className="w-[388px] shrink-0 space-y-4">{aside}</aside>}
    </div>
  );
}
