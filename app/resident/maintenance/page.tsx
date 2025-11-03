'use client';

import { Suspense, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Wrench, Plus, MessageSquare, User } from 'lucide-react';
import { PageLayout, ResidentHeader, PageHeader } from '@/components/resident';
import { StatsCard } from '@/components/ui/StatsCard';
import { SearchFilterBar } from '@/components/ui/SearchFilter';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSearchFilter } from '@/lib/hooks';
import { useData } from '@/contexts/DataContext';
import { type MaintenanceTicket, type MaintenanceStatus } from '@/lib/types';
import { getMaintenanceStatusConfig, getPriorityColor } from '@/lib/statusConfig';
import { filterBySearch } from '@/lib/constants';
import { Calendar, MapPin, ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const MAINTENANCE_STATUSES: MaintenanceStatus[] = ['Pending', 'Open', 'In Progress', 'Completed', 'Rejected', 'Cancelled'];

// Separate component that uses useSearchParams
function MaintenanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tickets, isLoading } = useData();
  
  // Search and filter state
  const { searchQuery, setSearchQuery, filterStatus, setFilterStatus } = useSearchFilter<MaintenanceStatus>();

  // Set initial filter from URL query parameter
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && MAINTENANCE_STATUSES.includes(statusParam as MaintenanceStatus)) {
      setFilterStatus(statusParam as MaintenanceStatus);
    }
  }, [searchParams, setFilterStatus]);

  // Memoized filtered results
  const filteredTickets = useMemo(() => {
    let results = tickets || [];
    
    // Apply status filter
    if (filterStatus !== 'All') {
      results = results.filter(ticket => ticket.status === filterStatus);
    }
    
    // Apply search filter
    if (searchQuery) {
      results = filterBySearch(results, searchQuery, ['title', 'description', 'location']);
    }
    
    return results;
  }, [tickets, searchQuery, filterStatus]);

  // Memoized stats
  const stats = useMemo(() => {
    const ticketArray = tickets || [];
    return {
      pending: ticketArray.filter(t => t.status === 'Pending').length,
      open: ticketArray.filter(t => t.status === 'Open').length,
      inProgress: ticketArray.filter(t => t.status === 'In Progress').length,
      completed: ticketArray.filter(t => t.status === 'Completed').length,
      rejected: ticketArray.filter(t => t.status === 'Rejected').length,
      total: ticketArray.length
    };
  }, [tickets]);

  if (isLoading) {
    return (
      <PageLayout>
        <ResidentHeader currentPage="Maintenance" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  const handleTicketClick = (ticket: MaintenanceTicket) => {
    router.push(`/resident/maintenance/${ticket.id}`);
  };

  return (
    <PageLayout>
      <ResidentHeader currentPage="Maintenance" />
      
      <PageHeader 
        title="Maintenance Requests" 
        subtitle="Submit and track maintenance tickets"
        icon={Wrench}
        color="green"
        showBackButton
        backUrl="/resident"
        actions={
          <button
            onClick={() => router.push('/resident/maintenance/new')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition-all text-lg shadow-lg"
          >
            <Plus className="w-6 h-6" />
            New Ticket
          </button>
        }
      />

      <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
        
        {/* Stats Summary - SOLID BACKGROUNDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
          <div onClick={() => setFilterStatus('Pending')} className="cursor-pointer">
            <StatsCard
              title="Pending"
              value={stats.pending}
              subtitle="Waiting review"
              icon={Clock}
              gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
            />
          </div>
          <div onClick={() => setFilterStatus('Open')} className="cursor-pointer">
            <StatsCard
              title="Open"
              value={stats.open}
              subtitle="Acknowledged"
              icon={AlertCircle}
              gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
          </div>
          <div onClick={() => setFilterStatus('In Progress')} className="cursor-pointer">
            <StatsCard
              title="In Progress"
              value={stats.inProgress}
              subtitle="Being fixed"
              icon={Wrench}
              gradient="bg-gradient-to-br from-orange-500 to-orange-600"
            />
          </div>
          <div onClick={() => setFilterStatus('Completed')} className="cursor-pointer">
            <StatsCard
              title="Completed"
              value={stats.completed}
              subtitle="Resolved"
              icon={CheckCircle}
              gradient="bg-gradient-to-br from-green-500 to-green-600"
            />
          </div>
          <div onClick={() => setFilterStatus('All')} className="cursor-pointer">
            <StatsCard
              title="Total"
              value={stats.total}
              subtitle="All time"
              icon={Wrench}
              gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            />
          </div>
        </div>

        {/* Search and Filter */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search tickets..."
          filterValue={filterStatus}
          onFilterChange={setFilterStatus}
          filterOptions={MAINTENANCE_STATUSES}
          filterLabel="All Status"
        />

        {/* Tickets List - SOLID BACKGROUNDS */}
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="No tickets found"
              description="Try adjusting your search or filters"
            />
          ) : (
            filteredTickets.map((ticket) => {
              const statusConfig = getMaintenanceStatusConfig(ticket.status);
              const StatusIcon = statusConfig.icon;
              const hasComments = ticket.status === 'In Progress' || ticket.status === 'Open' || (ticket.status === 'Completed' && ticket.assignedTo);
              
              return (
                <div
                  key={ticket.id}
                  onClick={() => handleTicketClick(ticket)}
                  className="bg-gray-800 rounded-xl p-6 border-2 border-gray-600 hover:border-emerald-500 hover:bg-gray-700 transition-all cursor-pointer active:scale-[0.99] shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">{ticket.title}</h3>
                        <span className={`px-4 py-2 rounded-lg text-lg font-bold ${
                          ticket.priority === 'High' ? 'bg-red-600 text-white' :
                          ticket.priority === 'Medium' ? 'bg-yellow-600 text-white' :
                          'bg-green-600 text-white'
                        }`}>
                          {ticket.priority} Priority
                        </span>
                        {/* Comment indicator for FM responses */}
                        {hasComments && (
                          <span className="bg-cyan-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            FM Update
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-lg md:text-xl mb-4 font-medium">{ticket.description}</p>
                      <div className="flex flex-wrap items-center gap-6 text-lg md:text-xl text-gray-200">
                        <span className="flex items-center gap-2 font-medium">
                          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                          {ticket.location}
                        </span>
                        <span className="flex items-center gap-2 font-medium">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          {ticket.dateSubmitted}
                        </span>
                        {ticket.assignedTo && (
                          <span className="flex items-center gap-2 font-medium">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            {ticket.assignedTo}
                          </span>
                        )}
                      </div>
                      
                      {/* FM Comment Section (simulated) */}
                      {hasComments && (
                        <div className="mt-4 p-3 bg-cyan-900 rounded-lg border border-cyan-500">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-400 font-semibold text-sm">Facilities Manager</span>
                            <span className="text-gray-400 text-xs">3 hours ago</span>
                          </div>
                          <p className="text-cyan-200 text-sm">
                            {ticket.status === 'In Progress' && ticket.assignedTo
                              ? `Assigned to ${ticket.assignedTo}. Work scheduled for tomorrow morning. Will update once completed.`
                              : ticket.status === 'Open'
                              ? 'Request received and acknowledged. Assessing priority and scheduling contractor.'
                              : ticket.status === 'Completed'
                              ? 'Issue has been resolved. Please confirm if everything is working properly.'
                              : 'Your request is being reviewed by the facilities team.'}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-start gap-3">
                      <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg md:text-xl font-bold border-2 whitespace-nowrap ${
                        ticket.status === 'Pending' ? 'bg-yellow-600 border-yellow-400 text-white' :
                        ticket.status === 'Open' ? 'bg-blue-600 border-blue-400 text-white' :
                        ticket.status === 'In Progress' ? 'bg-orange-600 border-orange-400 text-white' :
                        ticket.status === 'Completed' ? 'bg-green-600 border-green-400 text-white' :
                        ticket.status === 'Rejected' ? 'bg-red-600 border-red-400 text-white' :
                        'bg-gray-600 border-gray-400 text-white'
                      }`}>
                        <StatusIcon className="w-6 h-6" />
                        {ticket.status}
                      </span>
                      <span className="px-6 py-3 bg-gray-700 text-gray-100 rounded-full text-lg font-bold whitespace-nowrap border-2 border-gray-500">
                        {ticket.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t-2 border-gray-600">
                    <span className="text-lg md:text-xl text-gray-300 font-bold">Ticket #{ticket.id}</span>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-lg md:text-xl font-bold flex items-center gap-2 transition-all">
                      View Details
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PageLayout>
  );
}

// Loading fallback component
function MaintenanceLoading() {
  return (
    <PageLayout>
      <ResidentHeader currentPage="Maintenance" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    </PageLayout>
  );
}

// Main page component with Suspense boundary
export default function MaintenancePage() {
  return (
    <Suspense fallback={<MaintenanceLoading />}>
      <MaintenanceContent />
    </Suspense>
  );
}
