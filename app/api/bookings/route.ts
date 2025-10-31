import { NextResponse } from 'next/server';
import { getAllFacilityBookings, createFacilityBooking } from '@/lib/serverData';

export async function GET() {
  try {
    const bookings = getAllFacilityBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newBooking = createFacilityBooking(data);
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
