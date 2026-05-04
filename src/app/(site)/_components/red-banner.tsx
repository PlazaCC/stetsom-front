import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MILESTONE_PATTERN = [
  "POTÊNCIA",
  "QUALIDADE",
  "INOVAÇÃO",
  "FEITO NO BRASIL",
  "DESDE 1989",
];

// Repeat the pattern enough times to fill the space
const MILESTONES = Array(4)
  .fill(null)
  .flatMap(() => MILESTONE_PATTERN);

export default function RedBanner() {
  return (
    <section className="bg-brand py-4">
      <div className="w-full px-8">
        <div className="flex items-center gap-6">
          {MILESTONES.map((milestone, i) => (
            <div key={i} className="flex items-center gap-6 shrink-0">
              <span className="text-white font-sans-condensed font-medium text-[18px] uppercase whitespace-nowrap">
                {milestone}
              </span>
              {i < MILESTONES.length - 1 && (
                <div className="w-2 h-2 rounded-full bg-white shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
