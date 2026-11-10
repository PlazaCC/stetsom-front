import { Link } from "@/i18n/navigation";

interface RecoveryStateProps {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function RecoveryState({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
}: RecoveryStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-dark px-6 text-white">
      <section className="max-w-lg text-center">
        <p className="mb-3 text-sm font-semibold tracking-[0.24em] text-brand uppercase">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-4 text-text-subtle-dark">{description}</p>
        <button
          type="button"
          onClick={onAction}
          className="mt-8 rounded-md bg-brand px-5 py-3 font-semibold transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {actionLabel}
        </button>
      </section>
    </main>
  );
}

interface NotFoundStateProps {
  title: string;
  description: string;
  actionLabel: string;
  compact?: boolean;
  nested?: boolean;
}

export function NotFoundState({
  title,
  description,
  actionLabel,
  compact = false,
  nested = false,
}: NotFoundStateProps) {
  const Container = nested ? "section" : "main";
  return (
    <Container
      className={`relative flex ${compact ? "min-h-149" : "min-h-screen"} flex-col items-center justify-center overflow-hidden bg-off-white px-5 py-12 ${compact ? "lg:px-42.5" : ""}`}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute text-watermark-text opacity-[0.08] select-none"
        width="626"
        height="301"
        viewBox="0 0 626 301"
      >
        <text
          x="50%"
          y="80%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-sans-condensed font-black"
          fontSize="300"
          fill="currentColor"
        >
          404
        </text>
      </svg>
      <div className="relative z-10 flex max-w-175 flex-col items-center gap-6 text-center">
        <h1 className="font-sans-condensed text-5xl leading-tight font-black text-brand-dark uppercase">
          {title}
        </h1>
        <p className="font-sans text-xl text-text-subtle-dark">{description}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {actionLabel}
        </Link>
      </div>
    </Container>
  );
}
