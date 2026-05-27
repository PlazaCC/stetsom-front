interface AdminFieldErrorProps {
  message?: string | null;
}

export function AdminFieldError({ message }: AdminFieldErrorProps) {
  if (!message) return null;
  return (
    <p
      role="alert"
      aria-live="polite"
      className="mt-1 text-xs text-destructive"
    >
      {message}
    </p>
  );
}
