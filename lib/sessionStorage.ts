// Session-only storage for comments and new tickets
// Data persists only for the current browser session

import { Comment, MaintenanceTicket, MoveRequest, StatusChange } from './types';

// Session storage keys
const COMMENTS_KEY = 'session_comments';
const NEW_TICKETS_KEY = 'session_maintenance_tickets';
const NEW_MOVES_KEY = 'session_move_requests';

// Comment Management
export const commentStorage = {
  // Get all comments for a specific item
  getComments: (ticketId: string, ticketType: 'maintenance' | 'move'): Comment[] => {
    const stored = sessionStorage.getItem(COMMENTS_KEY);
    const allComments: Comment[] = stored ? JSON.parse(stored) : [];
    return allComments.filter(c => c.ticketId === ticketId && c.ticketType === ticketType);
  },

  // Add a new comment
  addComment: (comment: Omit<Comment, 'id' | 'timestamp'>): Comment => {
    const stored = sessionStorage.getItem(COMMENTS_KEY);
    const allComments: Comment[] = stored ? JSON.parse(stored) : [];
    
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    
    allComments.push(newComment);
    sessionStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
    
    return newComment;
  },

  // Mark comments as read
  markAsRead: (ticketId: string, ticketType: 'maintenance' | 'move') => {
    const stored = sessionStorage.getItem(COMMENTS_KEY);
    const allComments: Comment[] = stored ? JSON.parse(stored) : [];
    
    const updated = allComments.map(c => {
      if (c.ticketId === ticketId && c.ticketType === ticketType) {
        return { ...c, isRead: true };
      }
      return c;
    });
    
    sessionStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));
  },

  // Get unread count
  getUnreadCount: (ticketId: string, ticketType: 'maintenance' | 'move'): number => {
    const comments = commentStorage.getComments(ticketId, ticketType);
    return comments.filter(c => !c.isRead && c.author === 'fm').length;
  },

  // Clear all comments (for testing)
  clearAll: () => {
    sessionStorage.removeItem(COMMENTS_KEY);
  }
};

// New Maintenance Tickets (session only)
export const ticketStorage = {
  // Get all session tickets
  getTickets: (): MaintenanceTicket[] => {
    const stored = sessionStorage.getItem(NEW_TICKETS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Add new ticket
  addTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'dateSubmitted'>): MaintenanceTicket => {
    const stored = sessionStorage.getItem(NEW_TICKETS_KEY);
    const tickets: MaintenanceTicket[] = stored ? JSON.parse(stored) : [];
    
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `TKT-NEW-${Date.now()}`,
      dateSubmitted: new Date().toISOString().split('T')[0],
    };
    
    tickets.push(newTicket);
    sessionStorage.setItem(NEW_TICKETS_KEY, JSON.stringify(tickets));
    
    // Add system comment for new ticket
    commentStorage.addComment({
      ticketId: newTicket.id,
      ticketType: 'maintenance',
      author: 'system',
      authorName: 'System',
      message: `Ticket created: ${newTicket.title}`,
      isRead: true,
      statusChange: { from: '', to: 'Pending' }
    });
    
    return newTicket;
  },

  // Update ticket status
  updateTicketStatus: (ticketId: string, newStatus: string, comment?: string) => {
    const stored = sessionStorage.getItem(NEW_TICKETS_KEY);
    const tickets: MaintenanceTicket[] = stored ? JSON.parse(stored) : [];
    
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex !== -1) {
      const oldStatus = tickets[ticketIndex].status;
      tickets[ticketIndex].status = newStatus as any;
      
      if (newStatus === 'Completed') {
        tickets[ticketIndex].dateCompleted = new Date().toISOString().split('T')[0];
      }
      
      sessionStorage.setItem(NEW_TICKETS_KEY, JSON.stringify(tickets));
      
      // Add status change comment
      commentStorage.addComment({
        ticketId,
        ticketType: 'maintenance',
        author: 'fm',
        authorName: 'Facilities Manager',
        message: comment || `Status changed to ${newStatus}`,
        isRead: false,
        statusChange: { from: oldStatus, to: newStatus }
      });
    }
  },

  // Clear all tickets
  clearAll: () => {
    sessionStorage.removeItem(NEW_TICKETS_KEY);
  }
};

// Move Request Storage (session only)
export const moveStorage = {
  // Get all session move requests
  getMoves: (): MoveRequest[] => {
    const stored = sessionStorage.getItem(NEW_MOVES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Add new move request
  addMove: (move: Omit<MoveRequest, 'id' | 'submittedDate'>): MoveRequest => {
    const stored = sessionStorage.getItem(NEW_MOVES_KEY);
    const moves: MoveRequest[] = stored ? JSON.parse(stored) : [];
    
    const newMove: MoveRequest = {
      ...move,
      id: `MOV-NEW-${Date.now()}`,
      submittedDate: new Date().toISOString().split('T')[0],
    };
    
    moves.push(newMove);
    sessionStorage.setItem(NEW_MOVES_KEY, JSON.stringify(moves));
    
    // Add system comment
    commentStorage.addComment({
      ticketId: newMove.id,
      ticketType: 'move',
      author: 'system',
      authorName: 'System',
      message: `Move request created for ${newMove.moveDate}`,
      isRead: true,
      statusChange: { from: '', to: 'Pending' }
    });
    
    return newMove;
  },

  // Update move status
  updateMoveStatus: (moveId: string, newStatus: string, comment?: string) => {
    const stored = sessionStorage.getItem(NEW_MOVES_KEY);
    const moves: MoveRequest[] = stored ? JSON.parse(stored) : [];
    
    const moveIndex = moves.findIndex(m => m.id === moveId);
    if (moveIndex !== -1) {
      const oldStatus = moves[moveIndex].status;
      moves[moveIndex].status = newStatus as any;
      
      if (newStatus === 'Approved') {
        moves[moveIndex].approvedDate = new Date().toISOString().split('T')[0];
        moves[moveIndex].approvedBy = 'Facilities Manager';
      }
      
      sessionStorage.setItem(NEW_MOVES_KEY, JSON.stringify(moves));
      
      // Add status change comment
      commentStorage.addComment({
        ticketId: moveId,
        ticketType: 'move',
        author: 'fm',
        authorName: 'Facilities Manager',
        message: comment || `Status changed to ${newStatus}`,
        isRead: false,
        statusChange: { from: oldStatus, to: newStatus }
      });
    }
  },

  // Clear all
  clearAll: () => {
    sessionStorage.removeItem(NEW_MOVES_KEY);
  }
};

// Simulate FM responses based on status
export const simulateFMResponse = (ticketId: string, type: 'maintenance' | 'move', status: string) => {
  setTimeout(() => {
    let message = '';
    
    if (type === 'maintenance') {
      switch (status) {
        case 'Pending':
          message = 'We have received your maintenance request and will review it shortly.';
          break;
        case 'Open':
          message = 'Your request has been reviewed and prioritized. We will assign a technician soon.';
          break;
        case 'In Progress':
          message = 'Technician has been assigned and work is scheduled. We will update you upon completion.';
          break;
        case 'Completed':
          message = 'The maintenance work has been completed. Please confirm if the issue is resolved.';
          break;
      }
    } else if (type === 'move') {
      switch (status) {
        case 'Pending':
          message = 'Your move request has been received. We will review and confirm elevator availability.';
          break;
        case 'Approved':
          message = 'Your move request is approved. Elevator has been reserved for your time slot. Please ensure all items are packed and ready.';
          break;
        case 'In Progress':
          message = 'Move is in progress. Security has been notified. Please use the designated loading dock.';
          break;
        case 'Completed':
          message = 'Move completed successfully. Thank you for following the building guidelines.';
          break;
      }
    }
    
    if (message) {
      commentStorage.addComment({
        ticketId,
        ticketType: type,
        author: 'fm',
        authorName: 'Facilities Manager',
        message,
        isRead: false
      });
    }
  }, 2000); // Simulate 2 second delay
};
