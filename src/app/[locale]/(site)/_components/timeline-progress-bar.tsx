interface TimelineProgressBarProps {
  progressPercent: number;
}

export function TimelineProgressBar({
  progressPercent,
}: TimelineProgressBarProps) {
  return (
    <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 z-0">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 4"
        preserveAspectRatio="none"
        className="absolute left-0 top-0 w-full h-full"
      >
        <rect width="100%" height="100%" className="fill-zinc-600" />
        <rect
          width={`${progressPercent}%`}
          height="100%"
          className="fill-brand"
          style={{ transition: "width 0.6s ease-out" }}
        />
      </svg>
    </div>
  );
}
