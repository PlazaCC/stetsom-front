import { cn } from "@/lib/utils";

type AdminTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface AdminLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const inputBase =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60";

const labelBase = "mb-1 block text-xs font-medium text-muted-foreground";

export function AdminTextarea({ className, ...props }: AdminTextareaProps) {
  return (
    <textarea className={cn(inputBase, "resize-none", className)} {...props} />
  );
}

export function AdminLabel({ className, children, ...props }: AdminLabelProps) {
  return (
    <label className={cn(labelBase, className)} {...props}>
      {children}
    </label>
  );
}
