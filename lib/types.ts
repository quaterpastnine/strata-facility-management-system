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
export type MoveStatus = 
  | 'Pending'              // Initial submission
  | 'Approved'             // FM approved, deposit instructions sent
  | 'Deposit Pending'      // Awaiting resident payment
  | 'Payment Claimed'      // Resident claims payment made
  | 'Deposit Verified'     // FM verified payment received
  | 'Fully Approved'       // All steps complete, ready for move
  | 'Rejected'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';
export type LoadingDock = 'Dock 1' | 'Dock 2';
export type MovingCompanyType = 'Professional' | 'Self-Move' | 'Family/Friends';
export type DepositPaymentMethod = 'bank' | 'cash';
export type DepositStatus = 'awaiting_instructions' | 'pending' | 'awaiting_payment' | 'claimed' | 'payment_claimed' | 'verified';

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
  
  // Insurance & Deposit (Original fields - hasInsurance deprecated, use movingCompanyInsurance)
  hasInsurance?: boolean; // DEPRECATED - use movingCompanyInsurance
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  depositAmount: number;
  depositPaid: boolean;
  depositRefundAccount?: string;
  
  // NEW: Enhanced Deposit Workflow
  depositPaymentMethod?: DepositPaymentMethod; // FM sets: 'bank' or 'cash'
  depositBankDetails?: string; // FM enters bank details if method is 'bank'
  depositCashAppointmentDate?: string; // FM sets appointment date if method is 'cash'
  depositPaidDate?: string; // Date resident claims payment was made
  depositProofUrl?: string; // Required if payment method is 'bank' (EFT proof)
  depositStatus?: DepositStatus; // Track deposit workflow stage
  depositVerifiedBy?: string; // FM name who verified payment
  depositVerifiedDate?: string; // Date FM verified payment received
  
  // NEW: Insurance Selection (Required Step)
  insuranceSelected?: boolean; // true=YES, false=NO, undefined=not yet selected
  insuranceSelectionDate?: string; // When resident made selection
  
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

// Cash Receipt Types (Phase 3B)
export interface CashReceipt {
  id: string;
  receiptNumber: string;          // CR-YYYYMMDD-###
  moveRequestId: string;
  date: string;                   // ISO date
  amount: number;
  paymentMethod: 'Cash';
  receivedBy: string;             // FM name
  receivedDate: string;
  notes?: string;
  printedCopies: number;
  residentCopyGiven: boolean;
  fileCopyStored: boolean;
  residentName: string;
  residentUnit: string;
  residentSignature?: string;     // Could be image URL
  fmSignature?: string;           // Could be image URL
  createdAt: string;
  createdBy: string;
}

// Damage Assessment Types (Phase 7)
export interface DamageItem {
  id: string;
  location: string;               // "Elevator", "Wall - 3rd Floor", etc.
  description: string;
  estimatedCost: number;
  photoUrls: string[];
}

export interface DamageAssessment {
  id: string;
  moveRequestId: string;
  assessedBy: string;             // FM name
  assessedDate: string;
  damageFound: boolean;
  damageItems: DamageItem[];
  totalCost: number;
  photos: string[];               // URLs
  notes: string;
}

// Refund Processing Types (Phase 8)
export interface RefundRecord {
  id: string;
  moveRequestId: string;
  depositAmount: number;
  damageDeductions: number;
  refundAmount: number;
  refundMethod: 'cash' | 'eft' | 'card';
  processedBy: string;
  processedDate: string;
  bankReference?: string;
  notes?: string;
  residentNotified: boolean;
  status: 'pending' | 'processed' | 'failed';
}
