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
  ChevronLeft
} from 'lucide-react';
import { PageLayout, ResidentHeader, PageHeader } from '@/components/resident';
import { useData } from '@/contexts/DataContext';
import { type MaintenanceTicket } from '@/lib/types';
import { getMaintenanceStatusConfig, getPriorityColor } from '@/lib/statusConfig';

export default function MaintenanceTicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;
  const { tickets, updateTicket, isLoading } = useData();
  
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  
  // Find the specific ticket
  const ticket = useMemo(() => {
    return tickets?.find(t => t.id === ticketId) || null;
  }, [tickets, ticketId]);

  const handleCancelTicket = async () => {
    setCancelling(true);
    
    try {
      // Update ticket status to Cancelled using context
      updateTicket(ticketId, { 
        status: 'Cancelled',
        dateCompleted: new Date().toISOString().split('T')[0]
      });
      
      // Show success message
      alert('Ticket cancelled successfully');
      
      // Close modal
      setShowCancelConfirm(false);
      
      // Navigate back to maintenance list (data already updated)
      router.push('/resident/maintenance');
    } catch (error) {
      console.error('Error cancelling ticket:', error);
      alert('Error cancelling ticket. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <ResidentHeader currentPage="Maintenance" />
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading ticket details...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!ticket) {
    return (
      <PageLayout>
        <ResidentHeader currentPage="Maintenance" />
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Ticket Not Found</h2>
            <p className="text-gray-400 mb-6">The maintenance ticket you're looking for doesn't exist (ID: {ticketId}).</p>
            <button
              onClick={() => router.push('/resident/maintenance')}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all"
            >
              Back to Maintenance
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const statusConfig = getMaintenanceStatusConfig(ticket.status);
  const StatusIcon = statusConfig.icon;

  return (
    <PageLayout>
      <ResidentHeader currentPage="Maintenance" />
      
      <PageHeader 
        title={`Ticket #${ticket.id}`}
        subtitle={ticket.title}
        icon={Wrench}
        color="teal"
        showBackButton
        backUrl="/resident/maintenance"
      />

      <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          
          {/* Status & Priority Card */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-xl">
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg md:text-xl font-bold border-2 ${statusConfig.color}`}>
                  <StatusIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  {ticket.status}
                </span>
                <span className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-lg md:text-xl font-bold ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority} Priority
                </span>
              </div>
              <span className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700/70 text-gray-200 rounded-full text-base sm:text-lg md:text-xl font-bold border border-gray-600">
                {ticket.category}
              </span>
            </div>
          </div>

          {/* Main Details Card */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-xl">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-400" />
              Ticket Details
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="text-gray-400 text-sm sm:text-base font-bold uppercase tracking-wider">Title</label>
                <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mt-1 sm:mt-2">{ticket.title}</p>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm sm:text-base font-bold uppercase tracking-wider">Description</label>
                <p className="text-gray-300 text-base sm:text-lg md:text-xl mt-1 sm:mt-2 leading-relaxed">{ticket.description}</p>
              </div>

              {/* Rejection Reason - Only show if rejected */}
              {ticket.status === 'Rejected' && ticket.rejectionReason && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg sm:rounded-xl p-4 sm:p-5">
                  <label className="text-red-400 text-sm sm:text-base font-bold uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Rejection Reason
                  </label>
                  <p className="text-red-200 text-base sm:text-lg md:text-xl mt-2 leading-relaxed">{ticket.rejectionReason}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-600">
                <div className="flex items-start gap-3 sm:gap-4">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <label className="text-gray-400 text-sm sm:text-base font-bold uppercase tracking-wider block">Location</label>
                    <p className="text-white text-base sm:text-lg md:text-xl font-semibold mt-1">{ticket.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <label className="text-gray-400 text-sm sm:text-base font-bold uppercase tracking-wider block">Date Submitted</label>
                    <p className="text-white text-base sm:text-lg md:text-xl font-semibold mt-1">{ticket.dateSubmitted}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <label className="text-gray-400 text-sm sm:text-base font-bold uppercase tracking-wider block">Assigned To</label>
                    <p className="text-white text-base sm:text-lg md:text-xl font-semibold mt-1">
                      {ticket.assignedTo || <span className="text-gray-500 italic">Not yet assigned</span>}
                    </p>
                  </div>
                </div>

                {ticket.dateCompleted && (
                  <div className="flex items-start gap-3 sm:gap-4">
                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <label className="text-gray-400 text-sm sm:text-base font-bold uppercase tracking-wider block">Date Completed</label>
                      <p className="text-white text-base sm:text-lg md:text-xl font-semibold mt-1">{ticket.dateCompleted}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-xl">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-400" />
              Activity Timeline
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Ticket Created */}
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-teal-600 flex items-center justify-center">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
                    <p className="text-white font-bold text-base sm:text-lg md:text-xl">Ticket Created</p>
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-1">{ticket.dateSubmitted}</p>
                    <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-2">{ticket.title} - {ticket.category}</p>
                  </div>
                </div>
              </div>

              {/* Status Updates - Mock data */}
              {ticket.status === 'In Progress' && (
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-yellow-600 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
                      <p className="text-white font-bold text-base sm:text-lg md:text-xl">Status Updated to In Progress</p>
                      <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-1">Assigned to {ticket.assignedTo || 'Maintenance Team'}</p>
                      <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-2">Work has begun on this ticket.</p>
                    </div>
                  </div>
                </div>
              )}

              {ticket.status === 'Completed' && (
                <>
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-yellow-600 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
                        <p className="text-white font-bold text-base sm:text-lg md:text-xl">Status Updated to In Progress</p>
                        <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-1">Assigned to {ticket.assignedTo || 'Maintenance Team'}</p>
                        <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-2">Work has begun on this ticket.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-green-600 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
                        <p className="text-white font-bold text-base sm:text-lg md:text-xl">Ticket Completed</p>
                        <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-1">Resolved by {ticket.assignedTo || 'Maintenance Team'}</p>
                        <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-2">The maintenance issue has been resolved.</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cancel Confirmation Dialog */}
          {showCancelConfirm && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/20 shadow-2xl">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Cancel Ticket?</h3>
                <p className="text-gray-300 text-base sm:text-lg mb-6">
                  Are you sure you want to cancel this maintenance ticket? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    disabled={cancelling}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all text-base sm:text-lg disabled:opacity-50"
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={handleCancelTicket}
                    disabled={cancelling}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all text-base sm:text-lg disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/resident/maintenance')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gray-700 text-white rounded-lg sm:rounded-xl font-bold hover:bg-gray-600 transition-all text-base sm:text-lg md:text-xl border border-gray-600"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              Back to Maintenance
            </button>
            
            {ticket.status === 'Open' && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-red-600 text-white rounded-lg sm:rounded-xl font-bold hover:bg-red-700 transition-all text-base sm:text-lg md:text-xl"
              >
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                Cancel Ticket
              </button>
            )}
            
            {ticket.status === 'Pending' && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-red-600 text-white rounded-lg sm:rounded-xl font-bold hover:bg-red-700 transition-all text-base sm:text-lg md:text-xl"
              >
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                Cancel Ticket
              </button>
            )}
            
            {ticket.status !== 'Completed' && ticket.status !== 'Cancelled' && ticket.status !== 'Rejected' && (
              <button
                onClick={() => alert('Add comment feature coming soon!')}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-teal-600 text-white rounded-lg sm:rounded-xl font-bold hover:bg-teal-700 transition-all text-base sm:text-lg md:text-xl"
              >
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                Add Comment
              </button>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
