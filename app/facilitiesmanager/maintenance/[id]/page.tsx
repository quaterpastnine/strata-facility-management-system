'use client';

import { useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Wrench, 
  Calendar, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  MessageSquare,
  ChevronLeft,
  Save,
  UserCheck,
  TrendingUp,
  XCircle,
  Edit,
  Send
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { type MaintenanceTicket, type MaintenanceStatus, type MaintenancePriority } from '@/lib/types';
import { motion } from 'framer-motion';
import { FMHeader } from '@/components/fm/FMHeader';

// Approved Suppliers List by Category
const APPROVED_SUPPLIERS: Record<string, string[]> = {
  'Plumbing': ['ABC Plumbing Services', 'Quick Fix Plumbers', 'Premier Plumbing Co', 'Elite Drain Solutions'],
  'Electrical': ['Bright Spark Electrical', 'Power Pro Electricians', 'SafeWire Electric', 'Volt Masters'],
  'HVAC': ['Cool Air HVAC', 'Climate Control Systems', 'Perfect Temp Solutions', 'Air Care Specialists'],
  'Appliances': ['Appliance Repair Plus', 'Fix-It Appliance Services', 'Home Tech Repairs', 'Quick Appliance Fix'],
  'Structural': ['BuildRight Construction', 'Structural Solutions Ltd', 'Foundation Experts', 'Solid Build Co'],
  'Doors/Windows': ['Window & Door Masters', 'Precision Glass & Glazing', 'Secure Entry Systems', 'Clear View Windows'],
  'Other': ['General Maintenance Co', 'HandyPro Services', 'All-Fix Solutions', 'Property Care Team']
};

export default function FMMaintenanceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;
  const { tickets, updateTicket, getComments, addComment, markCommentsAsRead, isLoading } = useData();
  
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState<MaintenanceStatus>('Pending');
  const [priority, setPriority] = useState<MaintenancePriority>('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [commentText, setCommentText] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Find the specific ticket
  const ticket = useMemo(() => {
    const found = tickets?.find(t => t.id === ticketId) || null;
    if (found && !editMode) {
      setStatus(found.status);
      setPriority(found.priority);
      setAssignedTo(found.assignedTo || '');
    }
    return found;
  }, [tickets, ticketId, editMode]);

  // Get relevant suppliers based on ticket category
  const relevantSuppliers = useMemo(() => {
    if (!ticket) return [];
    return APPROVED_SUPPLIERS[ticket.category] || APPROVED_SUPPLIERS['Other'];
  }, [ticket]);

  // Get comments for this ticket
  const comments = useMemo(() => {
    if (!ticket) return [];
    return getComments(ticket.id, 'maintenance');
  }, [ticket, getComments]);

  // Mark comments as read when page loads
  useMemo(() => {
    if (ticket) {
      markCommentsAsRead(ticket.id, 'maintenance');
    }
  }, [ticket, markCommentsAsRead]);

  const handleSaveChanges = async () => {
    if (!ticket) return;
    
    setSaving(true);
    try {
      const updates: Partial<MaintenanceTicket> = {
        status,
        priority,
        assignedTo: assignedTo || undefined,
      };

      // If completing, add completion date
      if (status === 'Completed') {
        updates.dateCompleted = new Date().toISOString().split('T')[0];
      }

      updateTicket(ticket.id, updates);
      
      // Add automatic FM comment about the change
      const changes = [];
      if (ticket.status !== status) changes.push(`Status: ${ticket.status} → ${status}`);
      if (ticket.priority !== priority) changes.push(`Priority: ${ticket.priority} → ${priority}`);
      if (ticket.assignedTo !== assignedTo && assignedTo) changes.push(`Assigned to supplier: ${assignedTo}`);
      
      if (changes.length > 0) {
        addComment(ticket.id, 'maintenance', `FM Updated: ${changes.join(', ')}`, 'fm');
      }

      setEditMode(false);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = () => {
    if (!ticket || !commentText.trim()) return;
    
    addComment(ticket.id, 'maintenance', commentText, 'fm');
    setCommentText('');
  };

  const handleReject = () => {
    if (!ticket) return;
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    updateTicket(ticket.id, { 
      status: 'Rejected', 
      rejectionReason: reason,
      dateCompleted: new Date().toISOString().split('T')[0]
    });
    addComment(ticket.id, 'maintenance', `Rejected: ${reason}`, 'fm');
    router.push('/facilitiesmanager');
  };

  const handleApprove = () => {
    if (!ticket) return;
    
    updateTicket(ticket.id, { status: 'Open' });
    addComment(ticket.id, 'maintenance', 'Ticket approved and opened for work', 'fm');
    setStatus('Open');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <FMHeader currentPage="Maintenance" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading ticket details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <FMHeader currentPage="Maintenance" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Ticket Not Found</h2>
            <p className="text-gray-400 mb-6">Ticket ID: {ticketId}</p>
            <button
              onClick={() => router.push('/facilitiesmanager')}
              className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Open': return 'bg-blue-500';
      case 'In Progress': return 'bg-orange-500';
      case 'Completed': return 'bg-green-500';
      case 'Rejected': return 'bg-red-500';
      case 'Cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: MaintenancePriority) => {
    switch (priority) {
      case 'Emergency': return 'bg-red-600';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-x-hidden">
      
      {/* Background Image */}
      <div 
        className="fixed inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/background.jpg")',
          zIndex: 0
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <FMHeader currentPage="Maintenance" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 py-6 px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/facilitiesmanager')}
            className="flex items-center gap-2 text-white hover:text-teal-100 transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl font-bold">{ticket.title}</h1>
                <p className="text-teal-100">Maintenance Ticket #{ticket.id}</p>
              </div>
            </div>
            {editMode ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Edit Details
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status and Priority Card */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Status & Priority
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Status</label>
                  {editMode ? (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as MaintenanceStatus)}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <div className={`${getStatusColor(ticket.status)} text-white px-4 py-3 rounded-xl font-bold text-center`}>
                      {ticket.status}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Priority</label>
                  {editMode ? (
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as MaintenancePriority)}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  ) : (
                    <div className={`${getPriorityColor(ticket.priority)} text-white px-4 py-3 rounded-xl font-bold text-center`}>
                      {ticket.priority}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Supplier Assignment Card */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                Supplier Assignment
              </h2>
              
              {editMode ? (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Assign Approved Supplier</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Select Supplier --</option>
                    {relevantSuppliers.map((supplier) => (
                      <option key={supplier} value={supplier}>
                        {supplier}
                      </option>
                    ))}
                  </select>
                  <p className="text-gray-400 text-xs mt-2">Showing approved suppliers for {ticket.category}</p>
                </div>
              ) : (
                <div className="bg-gray-700/50 rounded-xl p-4">
                  {ticket.assignedTo ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{ticket.assignedTo}</p>
                        <p className="text-gray-400 text-sm">Assigned Supplier</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center">No supplier assigned yet</p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Description Card */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Description
              </h2>
              <p className="text-gray-300 leading-relaxed">{ticket.description}</p>
            </motion.div>

            {/* Comments Section */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                Communication Thread
              </h2>

              {/* Comments List */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-xl ${
                        comment.author === 'fm'
                          ? 'bg-cyan-500/20 border-l-4 border-cyan-500'
                          : 'bg-gray-700/50 border-l-4 border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white flex items-center gap-2">
                          {comment.author === 'fm' ? (
                            <>
                              <UserCheck className="w-4 h-4 text-cyan-400" />
                              {comment.authorName}
                            </>
                          ) : (
                            <>
                              <User className="w-4 h-4 text-gray-400" />
                              {comment.authorName}
                            </>
                          )}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-200">{comment.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Add a comment for the resident..."
                  className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Info & Actions */}
          <div className="space-y-6">
            
            {/* Resident Info */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Resident Info
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white font-semibold">{ticket.residentName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Unit</p>
                  <p className="text-white font-semibold">{ticket.residentUnit}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white font-semibold">{ticket.location}</p>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Submitted</p>
                  <p className="text-white font-semibold">{new Date(ticket.dateSubmitted).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Category</p>
                  <p className="text-white font-semibold">{ticket.category}</p>
                </div>
                {ticket.dateCompleted && (
                  <div>
                    <p className="text-gray-400 text-sm">Completed</p>
                    <p className="text-white font-semibold">{new Date(ticket.dateCompleted).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            {ticket.status === 'Pending' && (
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleApprove}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve & Open
                  </button>
                  <button
                    onClick={handleReject}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
