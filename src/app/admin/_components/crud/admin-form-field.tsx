import { AdminFieldError } from "./admin-field-error";
import { cn } from "@/lib/utils";

interface AdminFormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  htmlFor?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminFormField({
  label,
  required,
  error,
  errorId,
  htmlFor,
  description,
  children,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium text-muted-foreground"
      >
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
      <AdminFieldError id={errorId} message={error} />
    </div>
  );
}
