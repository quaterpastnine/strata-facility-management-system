// Status and priority configurations
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  LucideIcon 
} from 'lucide-react';
import type { MaintenanceStatus, MoveStatus } from './types';

// Status configurations for maintenance tickets
export const MAINTENANCE_STATUS_CONFIG: Record<MaintenanceStatus, {
  icon: LucideIcon;
  color: string;
  label: string;
}> = {
  'Pending': {
    icon: Clock,
    color: 'bg-orange-500/20 text-orange-300 border-orange-500',
    label: 'Pending'
  },
  'Open': {
    icon: Clock,
    color: 'bg-blue-500/20 text-blue-300 border-blue-500',
    label: 'Open'
  },
  'In Progress': {
    icon: AlertCircle,
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
    label: 'In Progress'
  },
  'Completed': {
    icon: CheckCircle,
    color: 'bg-green-500/20 text-green-300 border-green-500',
    label: 'Completed'
  },
  'Rejected': {
    icon: XCircle,
    color: 'bg-red-500/20 text-red-300 border-red-500',
    label: 'Rejected'
  },
  'Cancelled': {
    icon: XCircle,
    color: 'bg-gray-500/20 text-gray-300 border-gray-500',
    label: 'Cancelled'
  }
};

// Status configurations for move requests
export const MOVE_STATUS_CONFIG: Record<MoveStatus, {
  icon: LucideIcon;
  color: string;
  label: string;
}> = {
  'Pending': {
    icon: Clock,
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
    label: 'Pending'
  },
  'Approved': {
    icon: CheckCircle,
    color: 'bg-green-500/20 text-green-300 border-green-500',
    label: 'Approved'
  },
  'Deposit Pending': {
    icon: Clock,
    color: 'bg-orange-500/20 text-orange-300 border-orange-500',
    label: 'Deposit Pending'
  },
  'Payment Claimed': {
    icon: AlertCircle,
    color: 'bg-purple-500/20 text-purple-300 border-purple-500',
    label: 'Payment Claimed'
  },
  'Deposit Verified': {
    icon: CheckCircle,
    color: 'bg-teal-500/20 text-teal-300 border-teal-500',
    label: 'Deposit Verified'
  },
  'Fully Approved': {
    icon: CheckCircle,
    color: 'bg-green-600/20 text-green-300 border-green-600',
    label: 'Fully Approved'
  },
  'In Progress': {
    icon: AlertCircle,
    color: 'bg-blue-500/20 text-blue-300 border-blue-500',
    label: 'In Progress'
  },
  'Completed': {
    icon: CheckCircle,
    color: 'bg-gray-500/20 text-gray-300 border-gray-500',
    label: 'Completed'
  },
  'Rejected': {
    icon: XCircle,
    color: 'bg-red-500/20 text-red-300 border-red-500',
    label: 'Rejected'
  },
  'Cancelled': {
    icon: XCircle,
    color: 'bg-red-500/20 text-red-300 border-red-500',
    label: 'Cancelled'
  }
};

// Priority color configurations
export const PRIORITY_COLORS: Record<string, string> = {
  'Low': 'bg-gray-500/20 text-gray-300',
  'Medium': 'bg-yellow-500/20 text-yellow-300',
  'High': 'bg-orange-500/20 text-orange-300',
  'Emergency': 'bg-red-500/20 text-red-300'
};

// Helper functions
export const getMaintenanceStatusConfig = (status: MaintenanceStatus) => 
  MAINTENANCE_STATUS_CONFIG[status];

export const getMoveStatusConfig = (status: MoveStatus) => 
  MOVE_STATUS_CONFIG[status];

export const getPriorityColor = (priority: string) => 
  PRIORITY_COLORS[priority] || PRIORITY_COLORS['Low'];
