'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  MaintenanceTicket, 
  MoveRequest, 
  FacilityBooking,
  ResidentData,
  ActivityItem,
  MaintenancePriority,
  MaintenanceCategory,
  MaintenanceStatus,
  Comment
} from '@/lib/types';
import { commentStorage, ticketStorage, moveStorage } from '@/lib/sessionStorage';

interface DataContextType {
  // Maintenance Tickets
  tickets: MaintenanceTicket[];
  getTicketById: (id: string) => MaintenanceTicket | null;
  createTicket: (data: Omit<MaintenanceTicket, 'id' | 'dateSubmitted' | 'status' | 'residentName' | 'residentUnit'>) => MaintenanceTicket;
  updateTicket: (id: string, updates: Partial<MaintenanceTicket>) => void;
  
  // Move Requests
  moveRequests: MoveRequest[];
  getMoveRequestById: (id: string) => MoveRequest | null;
  createMoveRequest: (data: Omit<MoveRequest, 'id' | 'submittedDate' | 'residentName' | 'residentUnit' | 'residentEmail' | 'residentPhone'>) => MoveRequest;
  updateMoveRequest: (id: string, updates: Partial<MoveRequest>) => void;
  
  // Facility Bookings
  bookings: FacilityBooking[];
  
  // Comments
  getComments: (ticketId: string, ticketType: 'maintenance' | 'move') => Comment[];
  addComment: (ticketId: string, ticketType: 'maintenance' | 'move', message: string, author?: 'resident' | 'fm') => void;
  getUnreadCount: (ticketId: string, ticketType: 'maintenance' | 'move') => number;
  markCommentsAsRead: (ticketId: string, ticketType: 'maintenance' | 'move') => void;
  
  // Resident Data
  residentData: ResidentData | null;
  
  // Activity
  activityHistory: ActivityItem[];
  
  // Loading state
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [moveRequests, setMoveRequests] = useState<MoveRequest[]>([]);
  const [bookings, setBookings] = useState<FacilityBooking[]>([]);
  const [baseResidentData, setBaseResidentData] = useState<ResidentData | null>(null);
  const [activityHistory, setActivityHistory] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate stats dynamically from current data
  const residentData = useMemo(() => {
    if (!baseResidentData) return null;
    
    const stats = {
      totalBookings: bookings.length,
      activeMoveRequests: moveRequests.filter(m => 
        m.status !== 'Completed' && m.status !== 'Cancelled' && m.status !== 'Rejected'
      ).length,
      maintenanceTickets: tickets.length,
      pendingApprovals: [
        ...tickets.filter(t => t.status === 'Pending'),
        ...moveRequests.filter(m => m.status === 'Pending'),
        ...bookings.filter(b => b.status === 'Pending')
      ].length,
    };
    
    console.log('📊 Stats recalculated:', stats);
    console.log('  Pending tickets:', tickets.filter(t => t.status === 'Pending').map(t => t.id));
    console.log('  Pending moves:', moveRequests.filter(m => m.status === 'Pending').map(m => m.id));
    
    return {
      ...baseResidentData,
      stats
    };
  }, [baseResidentData, tickets, moveRequests, bookings]);

  // Load initial data from API on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        
        // Fetch all data from API (hardcoded mock data)
        const [ticketsData, moveData, bookingsData, residentInfo, activity] = await Promise.all([
          fetch('/api/maintenance').then(r => r.json()),
          fetch('/api/move-requests').then(r => r.json()),
          fetch('/api/bookings').then(r => r.json()),
          fetch('/api/resident').then(r => r.json()),
          fetch('/api/activity').then(r => r.json()),
        ]);
        
        // Store in browser memory for the session
        setTickets(ticketsData);
        setMoveRequests(moveData);
        setBookings(bookingsData);
        setBaseResidentData(residentInfo);
        setActivityHistory(activity);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadInitialData();
  }, []);

  // ==================== MAINTENANCE TICKET FUNCTIONS ====================
  
  const getTicketById = (id: string): MaintenanceTicket | null => {
    return tickets.find(t => t.id === id) || null;
  };

  const createTicket = (
    data: Omit<MaintenanceTicket, 'id' | 'dateSubmitted' | 'status' | 'residentName' | 'residentUnit'>
  ): MaintenanceTicket => {
    const maxId = tickets.reduce((max, ticket) => {
      const num = parseInt(ticket.id.replace('MNT-', ''));
      return num > max ? num : max;
    }, 0);
    
    const newTicket: MaintenanceTicket = {
      ...data,
      id: `MNT-${String(maxId + 1).padStart(3, '0')}`,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Pending',
      residentName: baseResidentData?.name || 'Unknown',
      residentUnit: baseResidentData?.unit || 'Unknown',
    };
    
    // Add to tickets array
    setTickets(prev => [...prev, newTicket]);
    
    // Add to activity history
    const newActivity: ActivityItem = {
      id: `ACT-${Date.now()}`,
      type: 'maintenance',
      title: newTicket.title,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      referenceId: newTicket.id
    };
    setActivityHistory(prev => [newActivity, ...prev].slice(0, 20));
    
    return newTicket;
  };

  const updateTicket = (id: string, updates: Partial<MaintenanceTicket>): void => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id ? { ...ticket, ...updates } : ticket
    ));
    
    // Update activity history if status changed
    if (updates.status) {
      setActivityHistory(prev => 
        prev.map(activity => 
          activity.referenceId === id 
            ? { ...activity, status: updates.status! }
            : activity
        )
      );
    }
  };

  // ==================== MOVE REQUEST FUNCTIONS ====================
  
  const getMoveRequestById = (id: string): MoveRequest | null => {
    return moveRequests.find(m => m.id === id) || null;
  };

  const createMoveRequest = (
    data: Omit<MoveRequest, 'id' | 'submittedDate' | 'residentName' | 'residentUnit' | 'residentEmail' | 'residentPhone'>
  ): MoveRequest => {
    const maxId = moveRequests.reduce((max, req) => {
      const num = parseInt(req.id.replace('MOVE-', ''));
      return num > max ? num : max;
    }, 0);
    
    const newRequest: MoveRequest = {
      ...data,
      id: `MOVE-${String(maxId + 1).padStart(3, '0')}`,
      submittedDate: new Date().toISOString().split('T')[0],
      residentName: baseResidentData?.name || 'Unknown',
      residentUnit: baseResidentData?.unit || 'Unknown',
      residentEmail: baseResidentData?.email || '',
      residentPhone: baseResidentData?.phone || '',
    };
    
    setMoveRequests(prev => [...prev, newRequest]);
    
    // Add to activity
    const newActivity: ActivityItem = {
      id: `ACT-${Date.now()}`,
      type: 'move',
      title: `${newRequest.moveType} - ${newRequest.residentUnit}`,
      status: newRequest.status,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: newRequest.startTime,
      referenceId: newRequest.id
    };
    setActivityHistory(prev => [newActivity, ...prev].slice(0, 20));
    
    return newRequest;
  };

  const updateMoveRequest = (id: string, updates: Partial<MoveRequest>): void => {
    setMoveRequests(prev => prev.map(req => 
      req.id === id ? { ...req, ...updates } : req
    ));
    
    // Update activity history
    if (updates.status) {
      setActivityHistory(prev => 
        prev.map(activity => 
          activity.referenceId === id 
            ? { ...activity, status: updates.status! }
            : activity
        )
      );
    }
  };

  // ==================== COMMENT FUNCTIONS ====================
  
  const getComments = (ticketId: string, ticketType: 'maintenance' | 'move'): Comment[] => {
    return commentStorage.getComments(ticketId, ticketType);
  };
  
  const addComment = (ticketId: string, ticketType: 'maintenance' | 'move', message: string, author: 'resident' | 'fm' = 'resident'): void => {
    commentStorage.addComment({
      ticketId,
      ticketType,
      author,
      authorName: author === 'resident' ? (residentData?.name || 'Resident') : 'Facilities Manager',
      message,
      isRead: author === 'resident' // Resident's own comments are marked as read
    });
  };
  
  const getUnreadCount = (ticketId: string, ticketType: 'maintenance' | 'move'): number => {
    return commentStorage.getUnreadCount(ticketId, ticketType);
  };
  
  const markCommentsAsRead = (ticketId: string, ticketType: 'maintenance' | 'move'): void => {
    commentStorage.markAsRead(ticketId, ticketType);
  };

  const value: DataContextType = {
    tickets,
    getTicketById,
    createTicket,
    updateTicket,
    moveRequests,
    getMoveRequestById,
    createMoveRequest,
    updateMoveRequest,
    bookings,
    residentData,
    activityHistory,
    isLoading,
    getComments,
    addComment,
    getUnreadCount,
    markCommentsAsRead,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
