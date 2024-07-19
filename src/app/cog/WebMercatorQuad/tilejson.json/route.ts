export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { nextUrl } = req;
    const { pathname, search } = nextUrl;
    const endpoint = `${process.env.TITILER_ENDPOINT}${pathname}${search}`;
    const res = await fetch(endpoint);
    const json = await res.json();
    const url = json.tiles[0];
    json.tiles[0] = url.replace('http', 'https');
    return NextResponse.json(json, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch ({ message }) {
    return NextResponse.json({ message }, { status: 404 });
  }
}
