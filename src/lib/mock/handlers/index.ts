import { loadMockData } from "../loader";
import { productsHandler } from "./products";

type MockHandler = (
  data: unknown,
  params: URLSearchParams,
  store: (key: string) => unknown,
) => unknown | null;

const HANDLERS: Record<string, MockHandler> = {
  products: productsHandler,
};

export function handleMockRequest(
  segments: string[],
  params: URLSearchParams,
): unknown | null {
  const key = segments.join("--");
  if (key in HANDLERS) {
    const data = loadMockData(segments);
    if (data === null) return null;
    return HANDLERS[key](data, params, (k) => loadMockData(k.split("--")));
  }
  return loadMockData(segments);
}
