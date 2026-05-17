import { toErrorResponse } from '@/lib/api/route-utils'
import { getCatalogPagePayload } from '@/lib/api/server'
import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const locale = request.nextUrl.searchParams.get('locale') ?? undefined
    const payload = await getCatalogPagePayload(locale)
    return NextResponse.json(payload)
  } catch (error) {
    return toErrorResponse(error)
  }
}
