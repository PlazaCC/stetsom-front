interface AdminFieldErrorProps {
  message?: string | null;
  id?: string;
}

export function AdminFieldError({ message, id }: AdminFieldErrorProps) {
  if (!message) return null;
  return (
    <p
      role="alert"
      aria-live="polite"
      id={id}
      className="mt-1 block w-full min-w-0 text-xs leading-4 break-words text-destructive"
    >
      {message}
    </p>
  );
}
