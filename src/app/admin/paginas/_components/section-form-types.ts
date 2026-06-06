export interface PageSection {
  id: string;
  type: string;
  order: number;
  data: Record<string, unknown>;
  block_id?: string;
}
