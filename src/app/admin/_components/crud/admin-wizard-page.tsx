import { cn } from "@/lib/utils";
import { AdminStepIndicator, type AdminStep } from "./admin-step-indicator";

interface AdminWizardPageProps {
  steps: AdminStep[];
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
  onStepClick?: (index: number) => void;
}

export function AdminWizardPage({
  steps,
  children,
  aside,
  className,
  onStepClick,
}: AdminWizardPageProps) {
  return (
    <div className={cn("flex flex-col gap-0", className)}>
      <AdminStepIndicator steps={steps} onStepClick={onStepClick} />
      <div className="flex gap-5 pt-1">
        <div className="min-w-0 flex-1 space-y-4">{children}</div>
        {aside && (
          <aside className="sticky top-4 w-97 shrink-0 self-start">
            {aside}
          </aside>
        )}
      </div>
    </div>
  );
}
