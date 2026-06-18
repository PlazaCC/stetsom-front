import { cn } from "@/lib/utils";

interface AdminWizardPageProps {
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}

export function AdminWizardPage({
  children,
  aside,
  className,
}: AdminWizardPageProps) {
  return (
    <div
      className={cn(
        "flex flex-1 gap-5 overflow-hidden px-4 py-5 lg:px-11.75",
        className,
      )}
    >
      {children}
      {aside && (
        <aside className="h-full w-97 shrink-0 space-y-4">{aside}</aside>
      )}
    </div>
  );
}
