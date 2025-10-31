import { NextResponse } from 'next/server';
import { getResident } from '@/lib/serverData';

export async function GET() {
  try {
    const resident = getResident();
    return NextResponse.json(resident);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resident data' }, { status: 500 });
  }
}
