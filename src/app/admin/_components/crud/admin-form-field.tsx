import { AdminFieldError } from "./admin-field-error";
import { cn } from "@/lib/utils";

interface AdminFormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminFormField({
  label,
  required,
  error,
  description,
  children,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-xs font-medium text-muted-foreground">
        {label}{" "}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {description && !error ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
      <AdminFieldError message={error} />
    </div>
  );
}
