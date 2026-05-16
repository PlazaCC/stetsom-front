type TextBlockData = { title?: string; content?: string; align?: string }
type ImageBlockData = { images?: string[]; caption?: string }

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((i) => typeof i === 'string' && i.length > 0)
}

export function toTextBlockData(data: Record<string, unknown>): TextBlockData {
  return {
    title: typeof data.title === 'string' ? data.title : undefined,
    content: typeof data.content === 'string' ? data.content : undefined,
    align: typeof data.align === 'string' ? data.align : undefined,
  }
}

export function toImageBlockData(data: Record<string, unknown>): ImageBlockData {
  return {
    images: isStringArray(data.images) ? data.images : undefined,
    caption: typeof data.caption === 'string' ? data.caption : undefined,
  }
}

export function resolveTextAlignClass(align: string | undefined): string {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

export function formatSpecKey(key: string): string {
  return key.replace(/_/g, ' ')
}
