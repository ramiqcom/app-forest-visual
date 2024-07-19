import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { nextUrl } = req;
    console.log(nextUrl);
    const { pathname, search } = nextUrl;
    const endpoint = `${process.env.TITILER_ENDPOINT}${pathname}${search}`;
    console.log(endpoint);
    const res = await fetch(endpoint);
    const { bounds } = await res.json();
    return NextResponse.json(bounds, { status: 200 });
  } catch ({ message }) {
    return NextResponse.json({ message }, { status: 404 });
  }
}
