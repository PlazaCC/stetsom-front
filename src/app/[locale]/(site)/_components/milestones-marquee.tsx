interface MilestonesMarqueeProps {
  items: string[];
}

export function MilestonesMarquee({ items }: Readonly<MilestonesMarqueeProps>) {
  if (items.length === 0) return null;

  return (
    <section className="overflow-hidden border-y border-white/5 bg-brand-dark py-8">
      <div className="marquee-track flex gap-16">
        {[...items, ...items].map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="shrink-0 font-sans-condensed text-2xl font-black uppercase tracking-widest text-white/20"
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
