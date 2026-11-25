import type { PageIconOptionName } from "@/api/stetsom/model";
import {
  ArrowUpRight,
  FileText,
  MapPin,
  MessageCircleMore,
  Rocket,
  ShieldCheck,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/** The generated API enum makes a missing registered component a type error. */
const PAGE_ICONS: Record<PageIconOptionName, LucideIcon> = {
  zap: Zap,
  "shield-check": ShieldCheck,
  rocket: Rocket,
  "file-text": FileText,
  "map-pin": MapPin,
  "message-circle-more": MessageCircleMore,
  "arrow-up-right": ArrowUpRight,
};

export function PageIcon({
  name,
  fallback = "arrow-up-right",
  ...props
}: LucideProps & { name?: string; fallback?: PageIconOptionName }) {
  const Icon =
    name && Object.hasOwn(PAGE_ICONS, name)
      ? PAGE_ICONS[name as PageIconOptionName]
      : PAGE_ICONS[fallback];
  return <Icon aria-hidden="true" {...props} />;
}
