import { NextRequest, NextResponse } from 'next/server';
import { getAllTickets, createTicket, updateTicket } from '@/lib/serverData';

export async function GET() {
  try {
    const tickets = getAllTickets();
    return NextResponse.json({ tickets });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newTicket = createTicket(data);
    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 });
    }
    
    const updatedTicket = updateTicket(id, updates);
    
    if (!updatedTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedTicket);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
