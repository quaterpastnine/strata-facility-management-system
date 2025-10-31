import { NextResponse } from 'next/server';
import { getActivity } from '@/lib/serverData';

export async function GET() {
  try {
    const activity = getActivity();
    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
