import { toErrorResponse } from '@/lib/api/route-utils'
import { getSupportPayload } from '@/lib/api/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getSupportPayload()
    return NextResponse.json(payload)
  } catch (error) {
    return toErrorResponse(error)
  }
}
