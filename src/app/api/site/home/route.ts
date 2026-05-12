import { toErrorResponse } from '@/lib/api/route-utils'
import { getSiteHomePayload } from '@/lib/api/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getSiteHomePayload()
    return NextResponse.json(payload)
  } catch (error) {
    return toErrorResponse(error)
  }
}
