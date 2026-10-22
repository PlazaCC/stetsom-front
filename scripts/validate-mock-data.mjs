import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_FILE = path.join(ROOT, "src/lib/mock/data.json");

function assert(condition, message) {
  if (!condition) throw new Error(`Invalid mock data: ${message}`);
}

export function validateMockData(data) {
  const categories = data.categories;
  assert(Array.isArray(categories), "categories must be an array");
  for (const category of categories) {
    assert(typeof category.localized_slugs?.pt === "string", "category localized_slugs.pt is required");
    assert(Array.isArray(category.lines), "category lines must be an array");
    for (const line of category.lines) {
      assert(typeof line.localized_slugs?.pt === "string", "line localized_slugs.pt is required");
      assert(Number.isInteger(line.product_count) && line.product_count > 0, "public lines must have products");
      assert("cover_url" in line, "public lines must expose cover_url");
    }
  }

  const catalog = data.products;
  assert(Array.isArray(catalog?.items), "products.items must be an array");
  for (const product of catalog.items) {
    assert(Array.isArray(product.available_locales), "product cards must expose available_locales");
    assert(!("href" in product), "product cards must not expose the removed href field");
  }

  for (const slide of data["banners--active"]?.items ?? []) {
    assert(!("href" in slide), "public banner slides must not expose the removed href field");
    assert(
      slide.product_slug === undefined || slide.link_url === undefined,
      "banner slides cannot expose both product_slug and link_url",
    );
  }
  return data;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validateMockData(JSON.parse(fs.readFileSync(DATA_FILE, "utf8")));
  console.log("Mock data is compatible with the current public contracts.");
}
