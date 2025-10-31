// Client-side data functions - calls API routes
import type { 
  MaintenanceTicket, 
  ResidentData, 
  ActivityItem, 
  MaintenancePriority, 
  MaintenanceCategory,
  MoveRequest,
  FacilityBooking 
} from './types';

export type { 
  MaintenanceTicket, 
  ResidentData, 
  ActivityItem, 
  MaintenancePriority, 
  MaintenanceCategory,
  MoveRequest,
  FacilityBooking 
};
export type { MaintenanceStatus, MoveStatus, BookingStatus } from './types';

// ===== MAINTENANCE TICKETS =====

export async function getMaintenanceTickets(): Promise<MaintenanceTicket[]> {
  try {
    const response = await fetch('/api/maintenance');
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}

export async function getMaintenanceTicketById(id: string): Promise<MaintenanceTicket | null> {
  try {
    const tickets = await getMaintenanceTickets();
    return tickets.find(t => t.id === id) || null;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return null;
  }
}

export async function createMaintenanceTicket(
  data: Omit<MaintenanceTicket, 'id' | 'dateSubmitted' | 'status' | 'residentName' | 'residentUnit'>
): Promise<MaintenanceTicket> {
  try {
    const response = await fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to create ticket');
    return await response.json();
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

// ===== MOVE REQUESTS =====

export async function getMoveRequests(): Promise<MoveRequest[]> {
  try {
    const response = await fetch('/api/move-requests');
    if (!response.ok) throw new Error('Failed to fetch move requests');
    return await response.json();
  } catch (error) {
    console.error('Error fetching move requests:', error);
    return [];
  }
}

export async function getMoveRequestById(id: string): Promise<MoveRequest | null> {
  try {
    const requests = await getMoveRequests();
    return requests.find(r => r.id === id) || null;
  } catch (error) {
    console.error('Error fetching move request:', error);
    return null;
  }
}

export async function createMoveRequest(
  data: Omit<MoveRequest, 'id' | 'submittedDate' | 'residentName' | 'residentUnit' | 'residentEmail' | 'residentPhone'>
): Promise<MoveRequest> {
  try {
    const response = await fetch('/api/move-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to create move request');
    return await response.json();
  } catch (error) {
    console.error('Error creating move request:', error);
    throw error;
  }
}

// ===== FACILITY BOOKINGS =====

export async function getFacilityBookings(): Promise<FacilityBooking[]> {
  try {
    const response = await fetch('/api/bookings');
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

// ===== RESIDENT DATA =====

export async function getResidentData(): Promise<ResidentData> {
  try {
    const response = await fetch('/api/resident');
    if (!response.ok) throw new Error('Failed to fetch resident data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching resident data:', error);
    return {
      name: "Willow Legg",
      unit: "Unit 111",
      initials: "WL",
      email: "willow.legg@example.com",
      phone: "(555) 987-6543",
      stats: {
        totalBookings: 2,
        activeMoveRequests: 1,
        maintenanceTickets: 3,
        pendingApprovals: 1,
      }
    };
  }
}

// ===== ACTIVITY HISTORY =====

export async function getActivityHistory(): Promise<ActivityItem[]> {
  try {
    const response = await fetch('/api/activity');
    if (!response.ok) throw new Error('Failed to fetch activity');
    return await response.json();
  } catch (error) {
    console.error('Error fetching activity:', error);
    return [];
  }
}

// ===== STATISTICS =====

export async function getMaintenanceStats() {
  const tickets = await getMaintenanceTickets();
  
  return {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    completed: tickets.filter(t => t.status === 'Completed').length,
    cancelled: tickets.filter(t => t.status === 'Cancelled').length,
    byPriority: {
      low: tickets.filter(t => t.priority === 'Low').length,
      medium: tickets.filter(t => t.priority === 'Medium').length,
      high: tickets.filter(t => t.priority === 'High').length,
      emergency: tickets.filter(t => t.priority === 'Emergency').length,
    },
    byCategory: {
      plumbing: tickets.filter(t => t.category === 'Plumbing').length,
      electrical: tickets.filter(t => t.category === 'Electrical').length,
      hvac: tickets.filter(t => t.category === 'HVAC').length,
      appliances: tickets.filter(t => t.category === 'Appliances').length,
      structural: tickets.filter(t => t.category === 'Structural').length,
      doorsWindows: tickets.filter(t => t.category === 'Doors/Windows').length,
      other: tickets.filter(t => t.category === 'Other').length,
    }
  };
}
