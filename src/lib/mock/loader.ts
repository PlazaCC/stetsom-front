import fs from "node:fs";
import path from "node:path";

const DATA_FILE = path.join(process.cwd(), "src/lib/mock/data.json");

// Module-level cache — populated on first access, survives the process lifetime.
// On Next.js hot reload the module re-evaluates, so the cache resets automatically.
let cache: Record<string, unknown> | null = null;

function store(): Record<string, unknown> {
  if (!cache) {
    cache = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as Record<
      string,
      unknown
    >;
  }
  return cache;
}

/** ["pages", "home", "cms"] → looks up key "pages--home--cms" in data.json */
export function loadMockData(segments: string[]): unknown | null {
  const key = segments.join("--");
  try {
    const s = store();
    return key in s ? s[key] : null;
  } catch {
    return null;
  }
}
