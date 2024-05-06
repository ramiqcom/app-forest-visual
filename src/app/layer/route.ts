import { NextRequest, NextResponse } from 'next/server';
import { loadLayer } from '../../module/layer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await loadLayer(body);
    return NextResponse.json(result, { status: 200 });
  } catch ({ message }) {
    return NextResponse.json({ message }, { status: 404 });
  }
}
