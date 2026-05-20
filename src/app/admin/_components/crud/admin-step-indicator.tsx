import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface AdminStep {
  label: string;
  status: "done" | "active" | "pending";
}

interface AdminStepIndicatorProps {
  steps: AdminStep[];
  className?: string;
}

export function AdminStepIndicator({
  steps,
  className,
}: AdminStepIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-4 px-2 py-4", className)}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center gap-2.5 rounded-full px-3 py-2.5 transition-opacity",
            step.status === "pending" && "opacity-70",
          )}
          style={{
            backgroundColor:
              step.status === "pending"
                ? "var(--cms-step-pending)"
                : step.status === "done"
                  ? "oklch(0.97 0.05 162)"
                  : "var(--cms-active-item)",
          }}
        >
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-sm font-semibold",
              step.status === "done"
                ? "bg-cms-step-done text-white"
                : step.status === "active"
                  ? "bg-brand text-white"
                  : "bg-cms-step-pending text-muted-foreground",
            )}
          >
            {step.status === "done" ? (
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
        </div>
      ))}
    </div>
  );
}
