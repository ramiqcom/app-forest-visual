import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { nextUrl } = req;
    const { pathname, search } = nextUrl;
    const endpoint = `${process.env.TITILER_ENDPOINT}${pathname}${search}`;
    console.log(endpoint);
    const res = await fetch(endpoint);
    const buffer = await res.arrayBuffer();
    const type = 'image/png';
    return new NextResponse(buffer, { status: 200, headers: { 'Content-type': type } });
  } catch ({ message }) {
    return NextResponse.json({ message }, { status: 404 });
  }
}
