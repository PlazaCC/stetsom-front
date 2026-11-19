import assert from "node:assert/strict";
import test from "node:test";
import { productsHandler } from "./products.ts";

const items = [
  {
    id: "4",
    slug: "a1",
    name: "A1",
    category: "A",
    line: null,
    status: "PUBLISHED",
    is_discontinued: false,
    is_export: false,
  },
  {
    id: "3",
    slug: "b1",
    name: "B1",
    category: "B",
    line: null,
    status: "PUBLISHED",
    is_discontinued: false,
    is_export: false,
  },
  {
    id: "2",
    slug: "a2",
    name: "A2",
    category: "A",
    line: null,
    status: "PUBLISHED",
    is_discontinued: false,
    is_export: false,
  },
  {
    id: "1",
    slug: "b2",
    name: "B2",
    category: "B",
    line: null,
    status: "PUBLISHED",
    is_discontinued: false,
    is_export: false,
  },
];

function slugs(query: string) {
  return productsHandler(
    { items },
    new URLSearchParams(query),
    () => [],
  ).items.map((p) => p.slug);
}

test("prioritizes the selected category before pagination", () => {
  assert.deepEqual(slugs("priority_product=b1&pageSize=3"), ["b1", "b2", "a1"]);
  assert.deepEqual(slugs("priority_product=b1&pageSize=3&page=2"), ["a2"]);
  assert.deepEqual(slugs("priority_product=b1&sort=newest"), [
    "b1",
    "b2",
    "a1",
    "a2",
  ]);
});

test("preserves order without a known priority", () => {
  assert.deepEqual(slugs(""), ["a1", "b1", "a2", "b2"]);
  assert.deepEqual(slugs("priority_product=unknown"), slugs(""));
});
