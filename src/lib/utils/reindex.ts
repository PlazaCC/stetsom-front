export function reindexByOrder<T extends { order: number }>(list: T[]): T[] {
  return list.map((item, i) => ({ ...item, order: i }));
}
