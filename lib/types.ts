// Shared types for client and server
export type MaintenanceStatus = 'Pending' | 'Open' | 'In Progress' | 'Completed' | 'Rejected' | 'Cancelled';
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type MaintenanceCategory = 'Plumbing' | 'Electrical' | 'HVAC' | 'Appliances' | 'Structural' | 'Doors/Windows' | 'Other';

export interface MaintenanceTicket {
  id: string;
  title: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  description: string;
  dateSubmitted: string;
  dateCompleted?: string;
  assignedTo?: string;
  location: string;
  photos?: string[];
  residentName: string;
  residentUnit: string;
  rejectionReason?: string;
}

// Comment System Types
export type CommentAuthor = 'resident' | 'fm' | 'system';

export interface Comment {
  id: string;
  ticketId: string;
  ticketType: 'maintenance' | 'move' | 'booking';
  author: CommentAuthor;
  authorName: string;
  message: string;
  timestamp: string; // ISO date string
  isRead: boolean;
  statusChange?: {
    from: string;
    to: string;
  };
}

export interface StatusChange {
  from: string;
  to: string;
  changedBy: CommentAuthor;
  timestamp: string;
  comment?: string;
}

// Enhanced types with comments
export interface MaintenanceTicketWithComments extends MaintenanceTicket {
  comments: Comment[];
  lastCommentAt?: string;
  unreadCount: number;
  statusHistory: StatusChange[];
}

export interface MoveRequestWithComments extends MoveRequest {
  comments: Comment[];
  lastCommentAt?: string;
  unreadCount: number;
  statusHistory: StatusChange[];
}

export interface ResidentData {
  name: string;
  unit: string;
  initials: string;
  email: string;
  phone: string;
  stats: {
    totalBookings: number;
    activeMoveRequests: number;
    maintenanceTickets: number;
    pendingApprovals: number;
  };
}

export interface ActivityItem {
  id: string;
  type: 'booking' | 'maintenance' | 'move';
  title: string;
  status: string;
  date: string;
  time?: string;
  assignee?: string;
  referenceId?: string; // ID of the actual ticket/move/booking
}

// Move In/Out Types
export type MoveType = 'Move In' | 'Move Out';
export type MoveStatus = 'Pending' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed' | 'Cancelled';
export type LoadingDock = 'Dock 1' | 'Dock 2';
export type MovingCompanyType = 'Professional' | 'Self-Move' | 'Family/Friends';

export interface MoveRequest {
  id: string;
  moveType: MoveType;
  status: MoveStatus;
  residentName: string;
  residentUnit: string;
  residentEmail: string;
  residentPhone: string;
  
  // Move Details
  moveDate: string;
  startTime: string;
  endTime: string;
  estimatedDuration: number; // hours
  
  // Facilities
  loadingDock?: LoadingDock;
  serviceElevator: boolean;
  visitorParkingBay?: string;
  movingTrolleys: number;
  
  // Moving Company
  movingCompanyType: MovingCompanyType;
  movingCompanyName?: string;
  movingCompanyPhone?: string;
  movingCompanyInsurance?: boolean;
  
  // Insurance & Deposit
  hasInsurance: boolean;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  depositAmount: number;
  depositPaid: boolean;
  depositRefundAccount?: string;
  
  // Cash Receipt (for manual payments)
  cashReceiptNumber?: string;
  cashReceiptDate?: string;
  cashReceiptAmount?: number;
  cashReceiptReceivedBy?: string;
  cashReceiptNotes?: string;
  paymentMethod?: 'EFT' | 'Cash' | 'Card' | 'Cheque';
  
  // Building Access
  accessCardsNeeded: number;
  vehicleDetails?: string;
  
  // Special Requirements
  specialRequirements?: string;
  oversizedItems: boolean;
  oversizedItemDetails?: string;
  
  // Acceptance
  termsAccepted: boolean;
  termsAcceptedDate?: string;
  
  // Approval
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  
  // Timestamps
  submittedDate: string;
  completedDate?: string;
}

// Facilities Booking Types
export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
export type FacilityType = 'Tennis Court' | 'Swimming Pool' | 'Gym' | 'BBQ Area' | 'Function Hall' | 'Guest Parking';

export interface FacilityBooking {
  id: string;
  facilityName: string;
  facilityType: FacilityType;
  status: BookingStatus;
  residentName: string;
  residentUnit: string;
  residentEmail: string;
  residentPhone: string;
  
  // Booking Details
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number; // hours
  
  // Additional Details
  numberOfGuests?: number;
  specialRequirements?: string;
  setupRequired?: boolean;
  
  // Timestamps
  submittedDate: string;
  confirmedDate?: string;
  cancelledDate?: string;
  completedDate?: string;
  
  // Approval
  approvedBy?: string;
  cancellationReason?: string;
}
