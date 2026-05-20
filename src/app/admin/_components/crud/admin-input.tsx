import { cn } from "@/lib/utils";

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  children: React.ReactNode;
}

interface AdminLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  children: React.ReactNode;
}

const inputBase =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-60";

const labelBase = "mb-1.5 block text-sm font-medium text-foreground";

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
