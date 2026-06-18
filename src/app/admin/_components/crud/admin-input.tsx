import { cn } from "@/lib/utils";

type AdminInputProps = React.InputHTMLAttributes<HTMLInputElement>;

type AdminTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

interface AdminLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const inputBase =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60";

const labelBase = "mb-1 block text-xs font-medium text-muted-foreground";

export function AdminInput({ className, ...props }: AdminInputProps) {
  return <input className={cn(inputBase, className)} {...props} />;
}

export function AdminTextarea({ className, ...props }: AdminTextareaProps) {
  return (
    <textarea className={cn(inputBase, "resize-none", className)} {...props} />
  );
}

export function AdminSelect({
  className,
  children,
  ...props
}: AdminSelectProps) {
  return (
    <select className={cn(inputBase, className)} {...props}>
      {children}
    </select>
  );
}

export function AdminLabel({ className, children, ...props }: AdminLabelProps) {
  return (
    <label className={cn(labelBase, className)} {...props}>
      {children}
    </label>
  );
}
