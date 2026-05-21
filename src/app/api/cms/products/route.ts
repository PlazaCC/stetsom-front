import {
  parsePositiveInt,
  parseStatus,
  toErrorResponse,
} from '@/lib/api/route-utils';
import { getCmsProductsPayload } from '@/lib/api/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') ?? undefined;
    const status = parseStatus(request.nextUrl.searchParams.get('status'));
    const page = parsePositiveInt(request.nextUrl.searchParams.get('page'), 1);
    const pageSize = parsePositiveInt(
      request.nextUrl.searchParams.get('pageSize'),
      12,
    );

    const payload = await getCmsProductsPayload({
      q,
      status,
      page,
      pageSize,
    });

    return NextResponse.json(payload);
  } catch (error) {
    return toErrorResponse(error);
  }
}
