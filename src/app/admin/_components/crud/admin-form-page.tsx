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
    <div className={cn("flex flex-col gap-5 xl:flex-row", className)}>
      <div className="min-w-0 flex-1 space-y-4">{children}</div>
      {aside && (
        <aside className="w-full space-y-4 xl:w-97 xl:shrink-0">{aside}</aside>
      )}
    </div>
  );
}
