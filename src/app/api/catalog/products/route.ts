import {
  parsePositiveInt,
  parseStatus,
  toErrorResponse,
} from '@/lib/api/route-utils';
import { getCatalogProducts } from '@/lib/api/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') ?? undefined;
    const category = request.nextUrl.searchParams.get('category') ?? undefined;
    const status = parseStatus(request.nextUrl.searchParams.get('status'));
    const page = parsePositiveInt(request.nextUrl.searchParams.get('page'), 1);
    const pageSize = parsePositiveInt(
      request.nextUrl.searchParams.get('pageSize'),
      12,
    );
    const locale = request.nextUrl.searchParams.get('locale') ?? undefined;

    const payload = await getCatalogProducts(
      {
        q,
        category,
        status,
        page,
        pageSize,
      },
      locale,
    );

    return NextResponse.json(payload);
  } catch (error) {
    return toErrorResponse(error);
  }
}
