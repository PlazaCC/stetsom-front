import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface AdminStep {
  label: string;
  status: "done" | "active" | "pending";
}

interface AdminStepIndicatorProps {
  steps: AdminStep[];
  className?: string;
  /** When set, done/active pills become clickable for back navigation. */
  onStepClick?: (index: number) => void;
}

export function AdminStepIndicator({
  steps,
  className,
  onStepClick,
}: AdminStepIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-4 px-2 py-4", className)}>
      {steps.map((step, index) => {
        const clickable = !!onStepClick && step.status !== "pending";
        return (
          <button
            key={index}
            type="button"
            disabled={!clickable}
            onClick={clickable ? () => onStepClick(index) : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-full px-3 py-2.5 transition-opacity",
              step.status === "pending" && "opacity-70",
              step.status === "pending"
                ? "bg-cms-step-pending"
                : "bg-cms-active-item",
              clickable ? "cursor-pointer" : "cursor-default",
            )}
          >
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-sm font-semibold",
                step.status === "done" || step.status === "active"
                  ? "bg-cms-step-done text-white"
                  : "bg-cms-step-pending text-muted-foreground",
              )}
            >
              {step.status === "done" || step.status === "active" ? (
                <Check className="size-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                step.status === "pending"
                  ? "text-muted-foreground"
                  : "text-foreground",
              )}
            >
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
