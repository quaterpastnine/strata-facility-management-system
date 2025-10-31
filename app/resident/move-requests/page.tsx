'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, Calendar, Clock, Truck, MapPin, DollarSign, ChevronRight, CheckCircle, MessageSquare, User } from 'lucide-react';
import { PageLayout, ResidentHeader, PageHeader } from '@/components/resident';
import { StatsCard } from '@/components/ui/StatsCard';
import { SearchFilterBar } from '@/components/ui/SearchFilter';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSearchFilter } from '@/lib/hooks';
import { getMoveStatusConfig } from '@/lib/statusConfig';
import { filterBySearch, formatCurrency } from '@/lib/constants';
import { getMoveRequests } from '@/lib/mockData';
import type { MoveRequest, MoveStatus } from '@/lib/types';

const MOVE_STATUSES: MoveStatus[] = ['Pending', 'Approved', 'In Progress', 'Completed', 'Rejected', 'Cancelled'];

export default function MoveRequestsPage() {
  const router = useRouter();
  const [moveRequests, setMoveRequests] = useState<MoveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and filter state
  const { searchQuery, setSearchQuery, filterStatus, setFilterStatus } = useSearchFilter<MoveStatus>();

  // Load move requests on mount
  useEffect(() => {
    async function loadMoveRequests() {
      setIsLoading(true);
      const requests = await getMoveRequests();
      setMoveRequests(requests);
      setIsLoading(false);
    }
    loadMoveRequests();
  }, []);

  // Memoized filtered results
  const filteredRequests = useMemo(() => {
    let results = moveRequests;
    
    // Apply status filter
    if (filterStatus !== 'All') {
      results = results.filter(request => request.status === filterStatus);
    } else {
      // When 'All' is selected, show only active requests (exclude Completed, Rejected, Cancelled)
      results = results.filter(request => 
        request.status !== 'Completed' && 
        request.status !== 'Rejected' && 
        request.status !== 'Cancelled'
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      results = filterBySearch(results, searchQuery, ['id', 'moveType', 'moveDate', 'residentUnit']);
    }
    
    return results;
  }, [moveRequests, searchQuery, filterStatus]);

  // Memoized stats
  const stats = useMemo(() => ({
    pending: moveRequests.filter(r => r.status === 'Pending').length,
    approved: moveRequests.filter(r => r.status === 'Approved').length,
    inProgress: moveRequests.filter(r => r.status === 'In Progress').length,
    completed: moveRequests.filter(r => r.status === 'Completed').length,
    total: moveRequests.length
  }), [moveRequests]);

  const handleRequestClick = (request: MoveRequest) => {
    router.push(`/resident/move-requests/${request.id}`);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <ResidentHeader currentPage="Move Requests" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading move requests...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ResidentHeader currentPage="Move Requests" />
      
      <PageHeader 
        title="Move Requests" 
        subtitle="Manage your move in and move out requests with elevator bookings"
        icon={Building2}
        color="orange"
        showBackButton
        backUrl="/resident"
        actions={
          <button
            onClick={() => router.push('/resident/move-requests/new')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-400 transition-all text-lg shadow-lg"
          >
            <Plus className="w-6 h-6" />
            New Request
          </button>
        }
      />

      <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
        
        {/* Stats Summary - SOLID BACKGROUNDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
          <StatsCard
            title="Pending"
            value={stats.pending}
            subtitle="Awaiting approval"
            icon={Clock}
            gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
          />
          <StatsCard
            title="Approved"
            value={stats.approved}
            subtitle="Ready to go"
            icon={CheckCircle}
            gradient="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            subtitle="Move day"
            icon={Truck}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            subtitle="Finished"
            icon={CheckCircle}
            gradient="bg-gradient-to-br from-gray-500 to-gray-600"
          />
          <StatsCard
            title="Total"
            value={stats.total}
            subtitle="All requests"
            icon={Building2}
            gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          />
        </div>

        {/* Search and Filter */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search requests..."
          filterValue={filterStatus}
          onFilterChange={setFilterStatus}
          filterOptions={MOVE_STATUSES}
          filterLabel="All Status"
        />

        {/* Move Requests List - SOLID BACKGROUNDS */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No move requests found"
              description="Get started by creating your first move request"
              actionLabel="New Move Request"
              onAction={() => router.push('/resident/move-requests/new')}
            />
          ) : (
            filteredRequests.map((request) => {
              const statusConfig = getMoveStatusConfig(request.status);
              const StatusIcon = statusConfig.icon;
              const hasComments = request.status === 'Approved' || request.status === 'In Progress';
              
              return (
                <div
                  key={request.id}
                  onClick={() => handleRequestClick(request)}
                  className="bg-gray-800 rounded-xl p-6 border-2 border-gray-600 hover:border-orange-500 hover:bg-gray-700 transition-all cursor-pointer active:scale-[0.99] shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">{request.moveType}</h3>
                        <span className="px-4 py-2 rounded-lg text-lg font-bold bg-orange-600 text-white">
                          {request.id}
                        </span>
                        {/* Comment indicator for FM responses */}
                        {hasComments && (
                          <span className="bg-cyan-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            FM Response
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-lg md:text-xl mb-4 font-semibold">{request.residentUnit}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg md:text-xl text-gray-200">
                        <span className="flex items-center gap-2 font-medium">
                          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          {request.moveDate}
                        </span>
                        <span className="flex items-center gap-2 font-medium">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          {request.startTime} - {request.endTime}
                        </span>
                        {request.loadingDock && (
                          <span className="flex items-center gap-2 font-medium">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            {request.loadingDock}
                          </span>
                        )}
                        {request.movingCompanyName && (
                          <span className="flex items-center gap-2 font-medium">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                              <Truck className="w-5 h-5 text-white" />
                            </div>
                            {request.movingCompanyName}
                          </span>
                        )}
                        <span className="flex items-center gap-2 font-medium">
                          <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-white" />
                          </div>
                          Deposit: {formatCurrency(request.depositAmount)} 
                          <span className={request.depositPaid ? "text-green-400 font-bold" : "text-yellow-400 font-bold"}>
                            {request.depositPaid ? '✅ Paid' : '⏳ Pending'}
                          </span>
                        </span>
                      </div>
                      
                      {/* FM Comment Section (simulated) */}
                      {hasComments && (
                        <div className="mt-4 p-3 bg-cyan-900 rounded-lg border border-cyan-500">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-400 font-semibold text-sm">Facilities Manager</span>
                            <span className="text-gray-400 text-xs">2 hours ago</span>
                          </div>
                          <p className="text-cyan-200 text-sm">
                            {request.status === 'Approved' 
                              ? `Approved for ${request.moveDate}. Elevator reserved from ${request.startTime}. Please ensure all items are packed and ready.`
                              : 'Move in progress. Security has been notified. Please use the designated loading dock.'}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-start gap-3">
                      <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg md:text-xl font-bold border-2 whitespace-nowrap ${
                        request.status === 'Pending' ? 'bg-yellow-600 border-yellow-400 text-white' :
                        request.status === 'Approved' ? 'bg-green-600 border-green-400 text-white' :
                        request.status === 'In Progress' ? 'bg-blue-600 border-blue-400 text-white' :
                        request.status === 'Completed' ? 'bg-gray-600 border-gray-400 text-white' :
                        request.status === 'Rejected' ? 'bg-red-600 border-red-400 text-white' :
                        'bg-gray-600 border-gray-400 text-white'
                      }`}>
                        <StatusIcon className="w-6 h-6" />
                        {request.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t-2 border-gray-600">
                    <span className="text-lg md:text-xl text-gray-300 font-bold">Submitted: {request.submittedDate}</span>
                    <button className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg text-lg md:text-xl font-bold flex items-center gap-2 transition-all">
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
