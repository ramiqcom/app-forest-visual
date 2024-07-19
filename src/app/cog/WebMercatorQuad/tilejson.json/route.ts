export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { nextUrl } = req;
    const { pathname, search } = nextUrl;
    const endpoint = `${process.env.TITILER_ENDPOINT}${pathname}${search}`;
    const res = await fetch(endpoint);
    const json = await res.json();
    return NextResponse.json(json, { status: 200 });
  } catch ({ message }) {
    return NextResponse.json({ message }, { status: 404 });
  }
}
