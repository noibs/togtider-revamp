import { NextRequest, NextResponse } from 'next/server';

const REJSEPLANEN_BASE = 'https://www.rejseplanen.dk/api';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const accessId = process.env.REJSEPLANEN_ACCESS_ID;
  if (!accessId) {
    return NextResponse.json(
      { error: 'REJSEPLANEN_ACCESS_ID is not configured' },
      { status: 500 }
    );
  }

  const endpoint = params.path.join('/');
  const search = new URLSearchParams(req.nextUrl.searchParams);
  search.set('accessId', accessId);
  if (!search.has('format')) search.set('format', 'json');

  const upstream = `${REJSEPLANEN_BASE}/${endpoint}?${search.toString()}`;

  try {
    const res = await fetch(upstream, { cache: 'no-store' });
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Upstream request failed', detail: String(err) },
      { status: 502 }
    );
  }
}
