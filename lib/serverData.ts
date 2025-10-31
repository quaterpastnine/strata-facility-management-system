// Server-side data store (in-memory for now, replace with DB later)
import { MaintenanceTicket, ResidentData, ActivityItem, MoveRequest, FacilityBooking } from '@/lib/types';

// ==================== RESIDENT DATA ====================
let residentData: ResidentData = {
  name: "Willow Legg",
  unit: "Unit 111",
  initials: "WL",
  email: "willow.legg@example.com",
  phone: "(555) 987-6543",
  stats: {
    totalBookings: 2,
    activeMoveRequests: 3,
    maintenanceTickets: 6,
    pendingApprovals: 2,
  }
};

// ==================== MAINTENANCE TICKETS ====================
let tickets: MaintenanceTicket[] = [
  {
    id: 'MNT-001',
    title: 'AC Not Working',
    category: 'HVAC',
    priority: 'High',
    status: 'In Progress',
    description: 'Air conditioner in bedroom stopped cooling effectively. Makes strange rattling noise when starting up. Issue began approximately 2 days ago.',
    dateSubmitted: '2025-10-28',
    location: 'Unit 111 - Bedroom',
    assignedTo: 'Tech #3 - John Smith',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
  },
  {
    id: 'MNT-002',
    title: 'Leaking Faucet',
    category: 'Plumbing',
    priority: 'Medium',
    status: 'Completed',
    description: 'Kitchen faucet has been dripping constantly for the past week. Water leak appears to be coming from the base of the faucet handle.',
    dateSubmitted: '2025-10-25',
    dateCompleted: '2025-10-27',
    location: 'Unit 111 - Kitchen',
    assignedTo: 'Tech #1 - Mike Johnson',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
  },
  {
    id: 'MNT-003',
    title: 'Broken Door Handle',
    category: 'Doors/Windows',
    priority: 'Low',
    status: 'Pending',
    description: 'Bathroom door handle is loose and wobbles when turned. The screws appear to need tightening or replacement.',
    dateSubmitted: '2025-10-30',
    location: 'Unit 111 - Bathroom',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
  },
  {
    id: 'MNT-004',
    title: 'Faulty Light Switch',
    category: 'Electrical',
    priority: 'Medium',
    status: 'Open',
    description: 'Light switch in living room requires multiple attempts to turn on/off. Sometimes sparks slightly.',
    dateSubmitted: '2025-10-31',
    location: 'Unit 111 - Living Room',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
  },
  {
    id: 'MNT-005',
    title: 'Water Pressure Issue',
    category: 'Plumbing',
    priority: 'Low',
    status: 'Rejected',
    description: 'Low water pressure in shower.',
    dateSubmitted: '2025-11-01',
    location: 'Unit 111 - Bathroom',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    rejectionReason: 'This is a building-wide issue already being addressed. See notice on resident portal. Expected resolution: Jan 5, 2025.',
  },
  {
    id: 'MNT-006',
    title: 'Window Screen Replacement',
    category: 'Doors/Windows',
    priority: 'Low',
    status: 'Cancelled',
    description: 'Requested replacement of torn window screen in living room.',
    dateSubmitted: '2025-11-02',
    location: 'Unit 111 - Living Room',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
  },
];

// ==================== MOVE REQUESTS ====================
// Multiple scenarios demonstrating different stages of the move process
let moveRequests: MoveRequest[] = [
  // SCENARIO 1: Completed Move with Full Refund
  {
    id: 'MOVE-001',
    moveType: 'Move In',
    status: 'Completed',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    residentEmail: 'willow.legg@example.com',
    residentPhone: '(555) 987-6543',
    
    // Move Details
    moveDate: '2024-11-28',
    startTime: '09:00',
    endTime: '15:00',
    estimatedDuration: 6,
    
    // Facilities
    loadingDock: 'Dock 1',
    serviceElevator: true,
    visitorParkingBay: 'Bay 5',
    movingTrolleys: 3,
    
    // Moving Company
    movingCompanyType: 'Professional',
    movingCompanyName: 'Swift Movers Ltd',
    movingCompanyPhone: '(555) 123-4567',
    movingCompanyInsurance: true,
    
    // Insurance & Deposit
    hasInsurance: true,
    insuranceProvider: 'InsureAll',
    insurancePolicyNumber: 'POL-2024-567890',
    depositAmount: 500,
    depositPaid: true,
    depositRefundAccount: '062-548-123456789',
    
    // Cash Receipt (Manager recorded payment)
    cashReceiptNumber: 'CR-20241115-001',
    cashReceiptDate: '2024-11-15',
    cashReceiptAmount: 500,
    cashReceiptReceivedBy: 'Sarah Johnson',
    cashReceiptNotes: 'Paid in full, cash counted together with resident',
    paymentMethod: 'Cash',
    
    // Building Access
    accessCardsNeeded: 3,
    vehicleDetails: 'Large moving truck - License ABC123',
    
    // Special Requirements
    specialRequirements: 'Need parking close to loading dock',
    oversizedItems: true,
    oversizedItemDetails: 'King size bed, Large wardrobe, Piano',
    
    // Acceptance
    termsAccepted: true,
    termsAcceptedDate: '2024-11-15',
    
    // Approval
    approvedBy: 'Facilities Manager - Sarah Johnson',
    approvedDate: '2024-11-16',
    
    // Timestamps
    submittedDate: '2024-11-15',
    completedDate: '2024-11-28',
  },
  
  // SCENARIO 2: Approved - Awaiting Payment
  {
    id: 'MOVE-002',
    moveType: 'Move Out',
    status: 'Approved',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    residentEmail: 'willow.legg@example.com',
    residentPhone: '(555) 987-6543',
    
    // Move Details
    moveDate: '2025-01-15',
    startTime: '08:00',
    endTime: '14:00',
    estimatedDuration: 6,
    
    // Facilities
    loadingDock: 'Dock 2',
    serviceElevator: true,
    visitorParkingBay: 'Bay 3',
    movingTrolleys: 4,
    
    // Moving Company
    movingCompanyType: 'Professional',
    movingCompanyName: 'Elite Moving Services',
    movingCompanyPhone: '(555) 234-5678',
    movingCompanyInsurance: true,
    
    // Insurance & Deposit - PAYMENT PENDING
    hasInsurance: true,
    insuranceProvider: 'SafeMove Insurance',
    insurancePolicyNumber: 'SM-2025-001234',
    depositAmount: 500,
    depositPaid: false, // ⚠️ NOT YET PAID - Manager needs to record payment
    depositRefundAccount: '062-548-987654321', // Bank details provided for refund
    
    // Cash Receipt - EMPTY (waiting for manager to record)
    cashReceiptNumber: undefined,
    cashReceiptDate: undefined,
    cashReceiptAmount: undefined,
    cashReceiptReceivedBy: undefined,
    cashReceiptNotes: undefined,
    paymentMethod: undefined,
    
    // Building Access
    accessCardsNeeded: 4,
    vehicleDetails: 'Medium truck - License XYZ789',
    
    // Special Requirements
    specialRequirements: 'Final cleaning completed, keys ready for return',
    oversizedItems: true,
    oversizedItemDetails: 'Queen bed, Dining table, Sofa',
    
    // Acceptance
    termsAccepted: true,
    termsAcceptedDate: '2024-12-20',
    
    // Approval
    approvedBy: 'Facilities Manager - Sarah Johnson',
    approvedDate: '2024-12-21',
    
    // Timestamps
    submittedDate: '2024-12-20',
  },
  
  // SCENARIO 3: Pending Approval
  {
    id: 'MOVE-003',
    moveType: 'Move In',
    status: 'Pending',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    residentEmail: 'willow.legg@example.com',
    residentPhone: '(555) 987-6543',
    
    // Move Details
    moveDate: '2025-02-10',
    startTime: '10:00',
    endTime: '16:00',
    estimatedDuration: 6,
    
    // Facilities
    loadingDock: 'Dock 1',
    serviceElevator: true,
    visitorParkingBay: '',
    movingTrolleys: 2,
    
    // Moving Company
    movingCompanyType: 'Family/Friends',
    movingCompanyName: undefined,
    movingCompanyPhone: undefined,
    movingCompanyInsurance: false,
    
    // Insurance & Deposit
    hasInsurance: false,
    insuranceProvider: undefined,
    insurancePolicyNumber: undefined,
    depositAmount: 500,
    depositPaid: false,
    depositRefundAccount: '',
    
    // Cash Receipt - EMPTY (request not approved yet)
    cashReceiptNumber: undefined,
    cashReceiptDate: undefined,
    cashReceiptAmount: undefined,
    cashReceiptReceivedBy: undefined,
    cashReceiptNotes: undefined,
    paymentMethod: undefined,
    
    // Building Access
    accessCardsNeeded: 2,
    vehicleDetails: 'Personal van',
    
    // Special Requirements
    specialRequirements: 'First time moving, may need assistance with procedures',
    oversizedItems: false,
    oversizedItemDetails: '',
    
    // Acceptance
    termsAccepted: true,
    termsAcceptedDate: '2024-12-28',
    
    // Approval - NOT YET APPROVED
    approvedBy: undefined,
    approvedDate: undefined,
    
    // Timestamps
    submittedDate: '2024-12-28',
  },
  
  // SCENARIO 4: In Progress (Move Day)
  {
    id: 'MOVE-004',
    moveType: 'Move In',
    status: 'In Progress',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    residentEmail: 'willow.legg@example.com',
    residentPhone: '(555) 987-6543',
    
    // Move Details
    moveDate: '2024-12-30', // TODAY
    startTime: '09:00',
    endTime: '17:00',
    estimatedDuration: 8,
    
    // Facilities
    loadingDock: 'Dock 1',
    serviceElevator: true,
    visitorParkingBay: 'Bay 7',
    movingTrolleys: 5,
    
    // Moving Company
    movingCompanyType: 'Professional',
    movingCompanyName: 'QuickMove Pro',
    movingCompanyPhone: '(555) 345-6789',
    movingCompanyInsurance: true,
    
    // Insurance & Deposit
    hasInsurance: true,
    insuranceProvider: 'MoveSafe Insurance',
    insurancePolicyNumber: 'MS-2024-999888',
    depositAmount: 500,
    depositPaid: true,
    depositRefundAccount: '062-548-111222333',
    
    // Cash Receipt (Paid via EFT)
    cashReceiptNumber: 'CR-20241222-005',
    cashReceiptDate: '2024-12-22',
    cashReceiptAmount: 500,
    cashReceiptReceivedBy: 'Sarah Johnson',
    cashReceiptNotes: 'Payment received via bank transfer, confirmed in account',
    paymentMethod: 'EFT',
    
    // Building Access
    accessCardsNeeded: 5,
    vehicleDetails: 'Large truck - License MV1234, White color',
    
    // Special Requirements
    specialRequirements: 'Elevator padding required, protective floor covering needed',
    oversizedItems: true,
    oversizedItemDetails: 'Grand piano, Antique armoire, Large mirror',
    
    // Acceptance
    termsAccepted: true,
    termsAcceptedDate: '2024-12-18',
    
    // Approval
    approvedBy: 'Facilities Manager - Sarah Johnson',
    approvedDate: '2024-12-19',
    
    // Timestamps
    submittedDate: '2024-12-18',
  },
  
  // SCENARIO 5: Rejected Request
  {
    id: 'MOVE-005',
    moveType: 'Move Out',
    status: 'Rejected',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    residentEmail: 'willow.legg@example.com',
    residentPhone: '(555) 987-6543',
    
    // Move Details
    moveDate: '2024-12-25', // Christmas Day
    startTime: '09:00',
    endTime: '15:00',
    estimatedDuration: 6,
    
    // Facilities
    loadingDock: 'Dock 1',
    serviceElevator: true,
    visitorParkingBay: '',
    movingTrolleys: 3,
    
    // Moving Company
    movingCompanyType: 'Self-Move',
    movingCompanyName: undefined,
    movingCompanyPhone: undefined,
    movingCompanyInsurance: false,
    
    // Insurance & Deposit
    hasInsurance: false,
    insuranceProvider: undefined,
    insurancePolicyNumber: undefined,
    depositAmount: 500,
    depositPaid: false,
    depositRefundAccount: '062-548-444555666',
    
    // Cash Receipt - EMPTY (request rejected)
    cashReceiptNumber: undefined,
    cashReceiptDate: undefined,
    cashReceiptAmount: undefined,
    cashReceiptReceivedBy: undefined,
    cashReceiptNotes: undefined,
    paymentMethod: undefined,
    
    // Building Access
    accessCardsNeeded: 2,
    vehicleDetails: 'Personal truck',
    
    // Special Requirements
    specialRequirements: 'Emergency move, need urgent scheduling',
    oversizedItems: false,
    oversizedItemDetails: '',
    
    // Acceptance
    termsAccepted: true,
    termsAcceptedDate: '2024-12-10',
    
    // Approval
    approvedBy: 'Facilities Manager - Sarah Johnson',
    approvedDate: '2024-12-11',
    rejectionReason: 'Move requested on statutory holiday (Christmas Day). Building closed. Please reschedule to Dec 26 or later.',
    
    // Timestamps
    submittedDate: '2024-12-10',
  },
];

// ==================== FACILITY BOOKINGS ====================
let facilityBookings: FacilityBooking[] = [
  {
    id: 'BOOK-001',
    facilityName: 'Tennis Court 1',
    facilityType: 'Tennis Court',
    status: 'Confirmed',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    residentEmail: 'willow.legg@example.com',
    residentPhone: '(555) 987-6543',
    
    bookingDate: '2024-12-15',
    startTime: '15:00',
    endTime: '17:00',
    duration: 2,
    
    numberOfGuests: 2,
    specialRequirements: 'Need tennis balls',
    
    submittedDate: '2024-12-01',
    confirmedDate: '2024-12-02',
    approvedBy: 'Facilities Manager - Sarah Johnson',
  },
  {
    id: 'BOOK-002',
    facilityName: 'Swimming Pool',
    facilityType: 'Swimming Pool',
    status: 'Completed',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    residentEmail: 'willow.legg@example.com',
    residentPhone: '(555) 987-6543',
    
    bookingDate: '2024-12-05',
    startTime: '14:00',
    endTime: '16:00',
    duration: 2,
    
    numberOfGuests: 4,
    
    submittedDate: '2024-11-28',
    confirmedDate: '2024-11-29',
    completedDate: '2024-12-05',
    approvedBy: 'Facilities Manager - Sarah Johnson',
  },
];

// ==================== ACTIVITY HISTORY ====================
let activityHistory: ActivityItem[] = [
  { 
    id: 'ACT-001',
    type: 'move', 
    title: 'Move In - In Progress', 
    status: 'In Progress', 
    date: 'Dec 30, 2024', 
    time: '9:00 AM',
    referenceId: 'MOVE-004'
  },
  { 
    id: 'ACT-002',
    type: 'move', 
    title: 'Move Out - Payment Pending', 
    status: 'Approved', 
    date: 'Jan 15, 2025', 
    time: '8:00 AM',
    referenceId: 'MOVE-002'
  },
  { 
    id: 'ACT-003',
    type: 'move', 
    title: 'Move In - Awaiting Approval', 
    status: 'Pending', 
    date: 'Feb 10, 2025', 
    time: '10:00 AM',
    referenceId: 'MOVE-003'
  },
  { 
    id: 'ACT-004',
    type: 'maintenance', 
    title: 'Faulty Light Switch', 
    status: 'Open', 
    date: 'Dec 16, 2024',
    referenceId: 'MNT-004'
  },
  { 
    id: 'ACT-005',
    type: 'maintenance', 
    title: 'Broken Door Handle', 
    status: 'Pending', 
    date: 'Dec 15, 2024',
    referenceId: 'MNT-003'
  },
  { 
    id: 'ACT-006',
    type: 'maintenance', 
    title: 'Water Pressure Issue', 
    status: 'Rejected', 
    date: 'Dec 14, 2024',
    referenceId: 'MNT-005'
  },
  { 
    id: 'ACT-007',
    type: 'maintenance', 
    title: 'AC Not Working', 
    status: 'In Progress', 
    date: 'Dec 10, 2024', 
    assignee: 'Tech #3',
    referenceId: 'MNT-001'
  },
  { 
    id: 'ACT-008',
    type: 'move', 
    title: 'Move In - Completed', 
    status: 'Completed', 
    date: 'Nov 28, 2024', 
    time: '9:00 AM',
    referenceId: 'MOVE-001'
  },
  { 
    id: 'ACT-009',
    type: 'maintenance', 
    title: 'Leaking Faucet', 
    status: 'Completed', 
    date: 'Nov 20, 2024', 
    assignee: 'Tech #1',
    referenceId: 'MNT-002'
  },
  { 
    id: 'ACT-010',
    type: 'move', 
    title: 'Move Out - Rejected', 
    status: 'Rejected', 
    date: 'Dec 25, 2024', 
    time: '9:00 AM',
    referenceId: 'MOVE-005'
  },
];

// ==================== MAINTENANCE FUNCTIONS ====================
export function getAllTickets(): MaintenanceTicket[] {
  return tickets;
}

export function getTicketById(id: string): MaintenanceTicket | null {
  return tickets.find(t => t.id === id) || null;
}

export function createTicket(data: Omit<MaintenanceTicket, 'id' | 'dateSubmitted' | 'status' | 'residentName' | 'residentUnit'>): MaintenanceTicket {
  const maxId = tickets.reduce((max, ticket) => {
    const num = parseInt(ticket.id.replace('MNT-', ''));
    return num > max ? num : max;
  }, 0);
  
  const newTicket: MaintenanceTicket = {
    ...data,
    id: `MNT-${String(maxId + 1).padStart(3, '0')}`,
    dateSubmitted: new Date().toISOString().split('T')[0],
    status: 'Pending', // Changed from 'Open' to 'Pending'
    residentName: residentData.name,
    residentUnit: residentData.unit,
  };
  
  tickets.push(newTicket);
  residentData.stats.maintenanceTickets = tickets.length;
  
  // Update pending approvals count
  residentData.stats.pendingApprovals = [
    ...tickets.filter(t => t.status === 'Pending'),
    ...moveRequests.filter(m => m.status === 'Pending')
  ].length;
  
  activityHistory.unshift({
    id: `ACT-${Date.now()}`,
    type: 'maintenance',
    title: newTicket.title,
    status: 'Pending',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    referenceId: newTicket.id
  });
  
  activityHistory = activityHistory.slice(0, 20);
  
  return newTicket;
}

export function updateTicket(id: string, updates: Partial<MaintenanceTicket>): MaintenanceTicket | null {
  const index = tickets.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  tickets[index] = { ...tickets[index], ...updates };
  return tickets[index];
}

export function deleteTicket(id: string): boolean {
  const initialLength = tickets.length;
  tickets = tickets.filter(t => t.id !== id);
  
  if (tickets.length < initialLength) {
    residentData.stats.maintenanceTickets = tickets.length;
    return true;
  }
  return false;
}

// ==================== MOVE REQUEST FUNCTIONS ====================
export function getAllMoveRequests(): MoveRequest[] {
  return moveRequests;
}

export function getMoveRequestById(id: string): MoveRequest | null {
  return moveRequests.find(m => m.id === id) || null;
}

export function createMoveRequest(data: Omit<MoveRequest, 'id' | 'submittedDate' | 'residentName' | 'residentUnit' | 'residentEmail' | 'residentPhone'>): MoveRequest {
  const maxId = moveRequests.reduce((max, req) => {
    const num = parseInt(req.id.replace('MOVE-', ''));
    return num > max ? num : max;
  }, 0);
  
  const newRequest: MoveRequest = {
    ...data,
    id: `MOVE-${String(maxId + 1).padStart(3, '0')}`,
    submittedDate: new Date().toISOString().split('T')[0],
    residentName: residentData.name,
    residentUnit: residentData.unit,
    residentEmail: residentData.email,
    residentPhone: residentData.phone,
  };
  
  moveRequests.push(newRequest);
  
  // Update stats
  residentData.stats.activeMoveRequests = moveRequests.filter(m => 
    m.status !== 'Completed' && m.status !== 'Cancelled' && m.status !== 'Rejected'
  ).length;
  
  if (newRequest.status === 'Pending') {
    residentData.stats.pendingApprovals++;
  }
  
  // Add to activity
  activityHistory.unshift({
    id: `ACT-${Date.now()}`,
    type: 'move',
    title: `${newRequest.moveType} - ${newRequest.residentUnit}`,
    status: newRequest.status,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: newRequest.startTime,
    referenceId: newRequest.id
  });
  
  activityHistory = activityHistory.slice(0, 20);
  
  return newRequest;
}

export function updateMoveRequest(id: string, updates: Partial<MoveRequest>): MoveRequest | null {
  const index = moveRequests.findIndex(m => m.id === id);
  if (index === -1) return null;
  
  const oldStatus = moveRequests[index].status;
  moveRequests[index] = { ...moveRequests[index], ...updates };
  
  // Update pending approvals count if status changed
  if (oldStatus !== updates.status) {
    if (oldStatus === 'Pending') residentData.stats.pendingApprovals--;
    if (updates.status === 'Pending') residentData.stats.pendingApprovals++;
  }
  
  // Update active requests count
  residentData.stats.activeMoveRequests = moveRequests.filter(m => 
    m.status !== 'Completed' && m.status !== 'Cancelled' && m.status !== 'Rejected'
  ).length;
  
  return moveRequests[index];
}

// ==================== FACILITY BOOKING FUNCTIONS ====================
export function getAllFacilityBookings(): FacilityBooking[] {
  return facilityBookings;
}

export function getFacilityBookingById(id: string): FacilityBooking | null {
  return facilityBookings.find(b => b.id === id) || null;
}

export function createFacilityBooking(data: Omit<FacilityBooking, 'id' | 'submittedDate' | 'residentName' | 'residentUnit' | 'residentEmail' | 'residentPhone'>): FacilityBooking {
  const maxId = facilityBookings.reduce((max, booking) => {
    const num = parseInt(booking.id.replace('BOOK-', ''));
    return num > max ? num : max;
  }, 0);
  
  const newBooking: FacilityBooking = {
    ...data,
    id: `BOOK-${String(maxId + 1).padStart(3, '0')}`,
    submittedDate: new Date().toISOString().split('T')[0],
    residentName: residentData.name,
    residentUnit: residentData.unit,
    residentEmail: residentData.email,
    residentPhone: residentData.phone,
  };
  
  facilityBookings.push(newBooking);
  
  // Update stats
  residentData.stats.totalBookings = facilityBookings.length;
  
  if (newBooking.status === 'Pending') {
    residentData.stats.pendingApprovals++;
  }
  
  // Add to activity
  activityHistory.unshift({
    id: `ACT-${Date.now()}`,
    type: 'booking',
    title: newBooking.facilityName,
    status: newBooking.status,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: newBooking.startTime,
    referenceId: newBooking.id
  });
  
  activityHistory = activityHistory.slice(0, 20);
  
  return newBooking;
}

export function updateFacilityBooking(id: string, updates: Partial<FacilityBooking>): FacilityBooking | null {
  const index = facilityBookings.findIndex(b => b.id === id);
  if (index === -1) return null;
  
  const oldStatus = facilityBookings[index].status;
  facilityBookings[index] = { ...facilityBookings[index], ...updates };
  
  // Update pending approvals count if status changed
  if (oldStatus !== updates.status) {
    if (oldStatus === 'Pending') residentData.stats.pendingApprovals--;
    if (updates.status === 'Pending') residentData.stats.pendingApprovals++;
  }
  
  return facilityBookings[index];
}

// ==================== RESIDENT DATA FUNCTIONS ====================
export function getResident(): ResidentData {
  return residentData;
}

export function updateResident(updates: Partial<ResidentData>): ResidentData {
  residentData = { ...residentData, ...updates };
  return residentData;
}

// ==================== ACTIVITY FUNCTIONS ====================
export function getActivity(): ActivityItem[] {
  return activityHistory;
}

export function addActivity(activity: ActivityItem): void {
  activityHistory.unshift(activity);
  activityHistory = activityHistory.slice(0, 20);
}

// ==================== STATS RECALCULATION ====================
export function recalculateStats(): void {
  residentData.stats = {
    totalBookings: facilityBookings.length,
    activeMoveRequests: moveRequests.filter(m => 
      m.status !== 'Completed' && m.status !== 'Cancelled' && m.status !== 'Rejected'
    ).length,
    maintenanceTickets: tickets.length,
    pendingApprovals: [
      ...tickets.filter(t => t.status === 'Pending'),
      ...moveRequests.filter(m => m.status === 'Pending'),
      ...facilityBookings.filter(b => b.status === 'Pending')
    ].length,
  };
}
