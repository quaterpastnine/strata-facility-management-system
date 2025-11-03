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
    totalBookings: 0,
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
    dateSubmitted: '2025-11-01',
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
    dateSubmitted: '2025-11-05',
    dateCompleted: '2025-11-07',
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
    dateSubmitted: '2025-11-10',
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
    dateSubmitted: '2025-11-12',
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
    dateSubmitted: '2025-11-18',
    location: 'Unit 111 - Bathroom',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    rejectionReason: 'This is a building-wide issue already being addressed. See notice on resident portal. Expected resolution: Jan 5, 2026.',
  },
  {
    id: 'MNT-006',
    title: 'Window Screen Replacement',
    category: 'Doors/Windows',
    priority: 'Low',
    status: 'Cancelled',
    description: 'Requested replacement of torn window screen in living room.',
    dateSubmitted: '2025-11-22',
    location: 'Unit 111 - Living Room',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
  },
];

// ==================== MOVE REQUESTS ====================
// Multiple scenarios demonstrating different stages of the move process
const moveRequests: MoveRequest[] = [
  // SCENARIO 1: Completed Move with Full Refund - Bank Transfer Payment
  {
    id: 'MOVE-001',
    moveType: 'Move In',
    status: 'Completed',
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    residentEmail: 'willow.legg@example.com',
    residentPhone: '(555) 987-6543',
    
    // Move Details
    moveDate: '2025-11-01',
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
    movingCompanyInsurance: true, // ✅ YES - company has insurance
    
    // ✨ NEW: Deposit Payment Method
    depositPaymentMethod: 'bank', // Resident chose bank transfer
    depositAmount: 500,
    depositPaid: true,
    depositPaidDate: '2025-10-25',
    depositProofUrl: '/uploads/proof-move-001.pdf', // Bank transfer proof
    depositStatus: 'verified',
    depositVerifiedBy: 'Sarah Johnson',
    depositVerifiedDate: '2025-10-25',
    
    // Refund Details (for Move Out only - but keeping structure)
    depositRefundAccount: undefined,
    
    // Building Access
    accessCardsNeeded: 3,
    vehicleDetails: 'Large moving truck - License ABC123',
    
    // Special Requirements
    specialRequirements: 'Need parking close to loading dock',
    oversizedItems: true,
    oversizedItemDetails: 'King size bed, Large wardrobe, Piano',
    
    // Acceptance
    termsAccepted: true,
    termsAcceptedDate: '2025-10-20',
    
    // Approval
    approvedBy: 'Facilities Manager - Sarah Johnson',
    approvedDate: '2025-10-21',
    
    // Timestamps
    submittedDate: '2025-10-20',
    completedDate: '2025-11-01',
    
    // REMOVED OLD FIELDS:
    // hasInsurance, insuranceProvider, insurancePolicyNumber
    // cashReceiptNumber, cashReceiptDate, paymentMethod (those are for cash only)
  },
  
  // SCENARIO 2: Payment Claimed - Ready for Cash Receipt
  {
    id: 'MOVE-002',
    moveType: 'Move Out',
    status: 'Payment Claimed', // ⚠️ Resident confirmed payment, FM needs to record cash receipt
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    residentEmail: 'willow.legg@example.com',
    residentPhone: '(555) 987-6543',
    
    // Move Details
    moveDate: '2025-11-15',
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
    movingCompanyInsurance: true, // ✅ YES - company has insurance
    
    // ✨ NEW: Deposit Payment Method - CASH SELECTED
    depositPaymentMethod: 'cash', // Resident chose cash payment
    depositAmount: 500,
    depositPaid: false, // ⚠️ Claimed but not yet verified by FM
    depositPaidDate: '2025-11-01', // Date resident claimed they paid
    depositCashAppointmentDate: '2025-11-05', // FM scheduled appointment
    depositBankDetails: undefined, // Not needed for cash
    depositStatus: 'claimed',
    
    // Refund Details (Move Out - where deposit refund will go)
    depositRefundAccount: 'Account Name: Willow Legg\nBank: Standard Bank\nAccount Number: 062-548-987654321\nBranch Code: 051001',
    
    // Cash Receipt - Will be created when resident pays
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
    termsAcceptedDate: '2025-10-20',
    
    // Approval
    approvedBy: 'Facilities Manager - Sarah Johnson',
    approvedDate: '2025-10-21',
    
    // Timestamps
    submittedDate: '2025-10-20',
    
    // REMOVED OLD FIELDS:
    // hasInsurance, insuranceProvider, insurancePolicyNumber
  },
  
  // SCENARIO 3: Pending Approval - Self-Move, No Insurance
  {
    id: 'MOVE-003',
    moveType: 'Move In',
    status: 'Pending', // ⚠️ Awaiting FM approval
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    residentEmail: 'willow.legg@example.com',
    residentPhone: '(555) 987-6543',
    
    // Move Details
    moveDate: '2025-11-20',
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
    movingCompanyInsurance: false, // ⚠️ NO insurance (self-move)
    
    // ✨ NEW: Deposit Payment Method - BANK SELECTED
    depositPaymentMethod: 'bank', // Resident chose bank transfer
    depositAmount: 500,
    depositPaid: false, // Not paid yet (pending approval first)
    depositStatus: 'awaiting_instructions', // Waiting for FM approval
    depositRefundAccount: undefined,
    
    // Building Access
    accessCardsNeeded: 2,
    vehicleDetails: 'Personal van',
    
    // Special Requirements
    specialRequirements: 'First time moving, may need assistance with procedures',
    oversizedItems: false,
    oversizedItemDetails: '',
    
    // Acceptance
    termsAccepted: true,
    termsAcceptedDate: '2025-10-28',
    
    // Approval - NOT YET APPROVED
    approvedBy: undefined,
    approvedDate: undefined,
    
    // Timestamps
    submittedDate: '2025-10-28',
    
    // REMOVED OLD FIELDS:
    // hasInsurance, insuranceProvider, insurancePolicyNumber
  },
  
  // SCENARIO 4: In Progress (Move Day) - Bank Transfer, Verified Payment
  {
    id: 'MOVE-004',
    moveType: 'Move In',
    status: 'In Progress', // 🚚 Moving happening NOW
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    residentEmail: 'willow.legg@example.com',
    residentPhone: '(555) 987-6543',
    
    // Move Details
    moveDate: '2025-11-03', // TODAY
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
    movingCompanyInsurance: true, // ✅ YES - company has insurance
    
    // ✨ NEW: Deposit Payment Method - BANK TRANSFER, VERIFIED
    depositPaymentMethod: 'bank', // Resident chose bank transfer
    depositAmount: 500,
    depositPaid: true, // ✅ PAID AND VERIFIED
    depositPaidDate: '2025-10-22',
    depositProofUrl: '/uploads/proof-move-004.pdf', // Bank transfer proof uploaded
    depositStatus: 'verified',
    depositVerifiedBy: 'Sarah Johnson',
    depositVerifiedDate: '2025-10-23',
    depositRefundAccount: undefined,
    
    // Building Access
    accessCardsNeeded: 5,
    vehicleDetails: 'Large truck - License MV1234, White color',
    
    // Special Requirements
    specialRequirements: 'Elevator padding required, protective floor covering needed',
    oversizedItems: true,
    oversizedItemDetails: 'Grand piano, Antique armoire, Large mirror',
    
    // Acceptance
    termsAccepted: true,
    termsAcceptedDate: '2025-10-18',
    
    // Approval
    approvedBy: 'Facilities Manager - Sarah Johnson',
    approvedDate: '2025-10-19',
    
    // Timestamps
    submittedDate: '2025-10-18',
    
    // REMOVED OLD FIELDS:
    // hasInsurance, insuranceProvider, insurancePolicyNumber
    // cashReceiptNumber, cashReceiptDate (not used for bank transfer)
  },
  
  // SCENARIO 5: Rejected Request - Holiday Move
  {
    id: 'MOVE-005',
    moveType: 'Move Out',
    status: 'Rejected', // ❌ Rejected by FM
    residentName: 'Willow Legg',
    residentUnit: 'Unit 111',
    residentEmail: 'willow.legg@example.com',
    residentPhone: '(555) 987-6543',
    
    // Move Details
    moveDate: '2025-11-25', // Holiday move attempt
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
    movingCompanyInsurance: false, // ⚠️ NO insurance (self-move)
    
    // ✨ NEW: Deposit Payment Method - CASH SELECTED (but rejected before payment)
    depositPaymentMethod: 'cash', // Resident chose cash
    depositAmount: 500,
    depositPaid: false, // Never paid (request rejected)
    depositStatus: undefined, // No status (rejected before approval)
    depositRefundAccount: 'Account Name: Willow Legg\nBank: Standard Bank\nAccount Number: 062-548-444555666\nBranch Code: 051001',
    
    // Building Access
    accessCardsNeeded: 2,
    vehicleDetails: 'Personal truck',
    
    // Special Requirements
    specialRequirements: 'Emergency move, need urgent scheduling',
    oversizedItems: false,
    oversizedItemDetails: '',
    
    // Acceptance
    termsAccepted: true,
    termsAcceptedDate: '2025-10-10',
    
    // Approval
    approvedBy: 'Facilities Manager - Sarah Johnson',
    approvedDate: '2025-10-11',
    rejectionReason: 'Move requested on Day of Reconciliation (public holiday). Building closed. Please reschedule to Nov 26 or later.',
    
    // Timestamps
    submittedDate: '2025-10-10',
    
    // REMOVED OLD FIELDS:
    // hasInsurance, insuranceProvider, insurancePolicyNumber
    // cashReceiptNumber, cashReceiptDate (never created - request rejected)
  },
];

// ==================== FACILITY BOOKINGS ====================
const facilityBookings: FacilityBooking[] = [];

// ==================== ACTIVITY HISTORY ====================
let activityHistory: ActivityItem[] = [
  { 
    id: 'ACT-001',
    type: 'move', 
    title: 'Move In - In Progress', 
    status: 'In Progress', 
    date: 'Nov 3, 2025', 
    time: '9:00 AM',
    referenceId: 'MOVE-004'
  },
  { 
    id: 'ACT-002',
    type: 'move', 
    title: 'Move Out - Payment Pending', 
    status: 'Approved', 
    date: 'Nov 15, 2025', 
    time: '8:00 AM',
    referenceId: 'MOVE-002'
  },
  { 
    id: 'ACT-003',
    type: 'move', 
    title: 'Move In - Awaiting Approval', 
    status: 'Pending', 
    date: 'Nov 20, 2025', 
    time: '10:00 AM',
    referenceId: 'MOVE-003'
  },
  { 
    id: 'ACT-004',
    type: 'maintenance', 
    title: 'Faulty Light Switch', 
    status: 'Open', 
    date: 'Nov 12, 2025',
    referenceId: 'MNT-004'
  },
  { 
    id: 'ACT-005',
    type: 'maintenance', 
    title: 'Broken Door Handle', 
    status: 'Pending', 
    date: 'Nov 10, 2025',
    referenceId: 'MNT-003'
  },
  { 
    id: 'ACT-006',
    type: 'maintenance', 
    title: 'Water Pressure Issue', 
    status: 'Rejected', 
    date: 'Nov 18, 2025',
    referenceId: 'MNT-005'
  },
  { 
    id: 'ACT-007',
    type: 'maintenance', 
    title: 'AC Not Working', 
    status: 'In Progress', 
    date: 'Nov 1, 2025', 
    assignee: 'Tech #3',
    referenceId: 'MNT-001'
  },
  { 
    id: 'ACT-008',
    type: 'move', 
    title: 'Move In - Completed', 
    status: 'Completed', 
    date: 'Nov 1, 2025', 
    time: '9:00 AM',
    referenceId: 'MOVE-001'
  },
  { 
    id: 'ACT-009',
    type: 'maintenance', 
    title: 'Leaking Faucet', 
    status: 'Completed', 
    date: 'Nov 7, 2025', 
    assignee: 'Tech #1',
    referenceId: 'MNT-002'
  },
  { 
    id: 'ACT-010',
    type: 'move', 
    title: 'Move Out - Rejected', 
    status: 'Rejected', 
    date: 'Nov 25, 2025', 
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
