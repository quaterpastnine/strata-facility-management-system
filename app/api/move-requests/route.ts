import { NextResponse } from 'next/server';
import { getAllMoveRequests, createMoveRequest } from '@/lib/serverData';

export async function GET() {
  try {
    const requests = getAllMoveRequests();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch move requests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newRequest = createMoveRequest(data);
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create move request' }, { status: 500 });
  }
}
