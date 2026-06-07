/**
 * Exports seeded API data into src/lib/mock/data.json.
 * Merges with existing keys so previously dumped data is never lost.
 *
 * Usage:
 *   pnpm mock:dump                   # public endpoints only
 *   MOCK_DUMP_EMAIL=... MOCK_DUMP_PASSWORD=... pnpm mock:dump
 *
 * After running, set USE_MOCK_DATA=1 in .env.local and restart: pnpm dev
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as dotenv } from "dotenv";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv({ path: path.join(ROOT, ".env.local"), quiet: true });

const BASE = (process.env.CMS_API_BASE_URL ?? "http://localhost:3333").replace(/\/$/, "");
const EMAIL = process.env.MOCK_DUMP_EMAIL;
const PASSWORD = process.env.MOCK_DUMP_PASSWORD;
const DATA_FILE = path.join(ROOT, "src/lib/mock/data.json");

// Load existing store to preserve previously dumped keys
const store = fs.existsSync(DATA_FILE)
  ? JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
  : {};

/** "/api/products/admin" → "products--admin" */
function key(apiPath) {
  return apiPath.replace(/^\/api\//, "").replace(/\//g, "--");
}

async function dump(apiPath, { token = null, params = {} } = {}) {
  const url = new URL(`${BASE}${apiPath}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  process.stdout.write(`  → GET ${url.pathname}${url.search} … `);
  let res;
  try {
    res = await fetch(url, { headers });
  } catch (e) {
    console.log(`✗ ${e.message}`);
    return null;
  }

  if (!res.ok) {
    console.log(`✗ ${res.status}`);
    return null;
  }

  const data = await res.json();
  store[key(apiPath)] = data;
  console.log(`✓`);
  return data;
}

function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  console.log(`\n  📦 data.json — ${Object.keys(store).length} keys, ${(fs.statSync(DATA_FILE).size / 1024).toFixed(1)} KB`);
}

async function main() {
  console.log(`\n🎯  Dumping mock data from ${BASE}\n`);

  // ── Public ────────────────────────────────────────────────────────────────
  console.log("📦  Public:");
  await dump("/api/categories");
  await dump("/api/partner-locations");
  await dump("/api/banners/active");
  await dump("/api/pages/home");
  await dump("/api/pages/about");
  await dump("/api/pages/catalog");
  await dump("/api/pages/support");

  const catalog = await dump("/api/products", { params: { pageSize: 100, page: 1 } });
  if (catalog?.items?.length) {
    console.log(`\n  📄  ${catalog.items.length} product detail pages:`);
    for (const item of catalog.items) {
      const slug = typeof item.slug === "object" ? item.slug.pt : item.slug;
      if (slug) await dump(`/api/products/${slug}`);
    }
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  if (!EMAIL || !PASSWORD) {
    console.log("\n⚠️   MOCK_DUMP_EMAIL / MOCK_DUMP_PASSWORD not set — skipping admin endpoints.");
    save();
    printDone();
    return;
  }

  console.log("\n🔐  Authenticating …");
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!loginRes.ok) {
    console.error(`  ✗  Login failed (${loginRes.status}) — skipping admin endpoints.`);
    save();
    printDone();
    return;
  }

  const { accessToken: token } = await loginRes.json();
  console.log("  ✓  Authenticated\n");

  console.log("🛡️   Admin:");
  await dump("/api/dashboard", { token });
  await dump("/api/products/admin", { token, params: { pageSize: 100 } });
  await dump("/api/banners", { token, params: { limit: 100 } });
  await dump("/api/library", { token, params: { limit: 100 } });
  await dump("/api/messages", { token, params: { limit: 100 } });
  await dump("/api/attributes", { token });
  await dump("/api/templates", { token });
  await dump("/api/config", { token });
  await dump("/api/audit", { token, params: { limit: 50 } });
  await dump("/api/users", { token, params: { limit: 50 } });

  // CMS page payloads
  for (const slug of ["home", "about", "catalog", "support"]) {
    await dump(`/api/pages/${slug}/cms`, { token });
  }

  // Admin product details (by id)
  const adminCatalog = store["products--admin"];
  if (adminCatalog?.items?.length) {
    console.log(`\n  📄  ${adminCatalog.items.length} admin product detail pages:`);
    for (const item of adminCatalog.items) {
      if (item.id) await dump(`/api/products/admin/${item.id}`, { token });
    }
  }

  save();
  printDone();
}

function printDone() {
  console.log("\n✅  Done! Set USE_MOCK_DATA=1 in .env.local and restart: pnpm dev\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
