'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FMHeader } from '@/components/fm/FMHeader';
import { 
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  AlertCircle,
  Filter,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Download
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { type MoveRequest } from '@/lib/types';

export default function FMMoveRequestsList() {
  const router = useRouter();
  const { moveRequests, isLoading } = useData();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter move requests
  const filteredRequests = useMemo(() => {
    return moveRequests.filter(request => {
      let matchesStatus = false;
      
      if (selectedStatus === 'All') {
        matchesStatus = true;
      } else if (selectedStatus === 'Approved') {
        // "Approved" includes all approval-related statuses
        matchesStatus = ['Approved', 'Deposit Pending', 'Payment Claimed', 'Deposit Verified', 'Fully Approved'].includes(request.status);
      } else if (selectedStatus === 'Rejected') {
        // "Rejected" includes both Rejected and Cancelled
        matchesStatus = ['Rejected', 'Cancelled'].includes(request.status);
      } else {
        matchesStatus = request.status === selectedStatus;
      }
      
      const matchesSearch = searchQuery === '' || 
        request.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.residentUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.moveType.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [moveRequests, selectedStatus, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const pending = moveRequests.filter(r => r.status === 'Pending').length;
    const approved = moveRequests.filter(r => 
      ['Approved', 'Deposit Pending', 'Payment Claimed', 'Deposit Verified', 'Fully Approved'].includes(r.status)
    ).length;
    const inProgress = moveRequests.filter(r => r.status === 'In Progress').length;
    const completed = moveRequests.filter(r => r.status === 'Completed').length;
    const rejected = moveRequests.filter(r => r.status === 'Rejected').length;
    const cancelled = moveRequests.filter(r => r.status === 'Cancelled').length;
    
    return {
      total: moveRequests.length,
      pending,
      approved,
      inProgress,
      completed,
      rejected,
      cancelled
    };
  }, [moveRequests]);



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Approved': return 'bg-blue-500';
      case 'Deposit Pending': return 'bg-orange-500';
      case 'Payment Claimed': return 'bg-purple-500';
      case 'Deposit Verified': return 'bg-teal-500';
      case 'Fully Approved': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-600';
      case 'Completed': return 'bg-green-600';
      case 'Rejected': return 'bg-red-500';
      case 'Cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return AlertCircle;
      case 'Approved': return CheckCircle;
      case 'Deposit Pending': return Clock;
      case 'Payment Claimed': return DollarSign;
      case 'Deposit Verified': return CheckCircle;
      case 'Fully Approved': return CheckCircle;
      case 'In Progress': return PlayCircle;
      case 'Completed': return CheckCircle;
      case 'Rejected': return XCircle;
      case 'Cancelled': return XCircle;
      default: return Truck;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <FMHeader currentPage="Move Requests" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading move requests...</p>
          </div>
        </div>
      </div>
    );
  }

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
        <FMHeader currentPage="Move Requests" />

      {/* Page Header with Stats */}
      <div className="px-8 py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Move In/Out Requests</h2>
          <p className="text-gray-400 text-lg">Track and manage all move requests</p>
        </div>

        {/* Quick Stats - SOLID BACKGROUNDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div 
            onClick={() => setSelectedStatus('All')}
            className={`bg-gray-800 rounded-xl p-6 border-2 transition-all cursor-pointer group shadow-xl ${
              selectedStatus === 'All' ? 'border-purple-500' : 'border-gray-600 hover:border-purple-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 font-bold text-lg">Total</p>
              <Truck className="w-8 h-8 text-purple-400 group-hover:rotate-12 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.total}</p>
            <p className="text-gray-400 text-sm mt-1">All requests</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Pending')}
            className={`bg-gray-800 rounded-xl p-6 border-2 transition-all cursor-pointer group shadow-xl ${
              selectedStatus === 'Pending' ? 'border-yellow-500' : 'border-gray-600 hover:border-yellow-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 font-bold text-lg">Pending</p>
              <AlertCircle className="w-8 h-8 text-yellow-400 group-hover:animate-pulse" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.pending}</p>
            <p className="text-gray-400 text-sm mt-1">Awaiting review</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Approved')}
            className={`bg-gray-800 rounded-xl p-6 border-2 transition-all cursor-pointer group shadow-xl ${
              selectedStatus === 'Approved' ? 'border-blue-500' : 'border-gray-600 hover:border-blue-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 font-bold text-lg">Approved</p>
              <CheckCircle className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.approved}</p>
            <p className="text-gray-400 text-sm mt-1">Ready to go</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('In Progress')}
            className={`bg-gray-800 rounded-xl p-6 border-2 transition-all cursor-pointer group shadow-xl ${
              selectedStatus === 'In Progress' ? 'border-cyan-500' : 'border-gray-600 hover:border-cyan-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 font-bold text-lg">In Progress</p>
              <PlayCircle className="w-8 h-8 text-cyan-400 group-hover:animate-spin" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.inProgress}</p>
            <p className="text-gray-400 text-sm mt-1">Move day</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Completed')}
            className={`bg-gray-800 rounded-xl p-6 border-2 transition-all cursor-pointer group shadow-xl ${
              selectedStatus === 'Completed' ? 'border-green-500' : 'border-gray-600 hover:border-green-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 font-bold text-lg">Completed</p>
              <CheckCircle className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.completed}</p>
            <p className="text-gray-400 text-sm mt-1">Finished</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Rejected')}
            className={`bg-gray-800 rounded-xl p-6 border-2 transition-all cursor-pointer group shadow-xl ${
              selectedStatus === 'Rejected' ? 'border-red-500' : 'border-gray-600 hover:border-red-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 font-bold text-lg">Rejected</p>
              <XCircle className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.rejected + stats.cancelled}</p>
            <p className="text-gray-400 text-sm mt-1">Declined</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        
        {/* Filters and Search Bar */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border-2 border-gray-700 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Search className="inline w-4 h-4 mr-2" />
                Search Requests
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, unit, or move type..."
                className="w-full h-12 px-4 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Filter className="inline w-4 h-4 mr-2" />
                Status Filter
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-12 px-4 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-lg"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Deposit Pending">Deposit Pending</option>
                <option value="Payment Claimed">Payment Claimed</option>
                <option value="Deposit Verified">Deposit Verified</option>
                <option value="Fully Approved">Fully Approved</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end mt-4 pt-4 border-t-2 border-gray-700">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold bg-purple-600 text-white hover:bg-purple-500 transition-all text-lg shadow-lg">
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        {/* List View - SOLID BACKGROUNDS */}
        <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-12 text-center border-2 border-gray-700 shadow-xl">
                  <Truck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No move requests found</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredRequests.map((request) => {
                  const StatusIcon = getStatusIcon(request.status);
                  
                  return (
                    <div
                      key={request.id}
                      onClick={() => router.push(`/facilitiesmanager/move-requests/${request.id}`)}
                      className="bg-gray-800 rounded-xl p-6 border-2 border-gray-600 hover:border-purple-500 hover:bg-gray-750 transition-all cursor-pointer group shadow-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                              <Truck className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                {request.moveType} - {request.residentUnit}
                              </h3>
                              <p className="text-gray-400 text-lg">{request.residentName}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-base">
                            <div className="flex items-center gap-2 text-gray-300">
                              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-medium">{new Date(request.moveDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-medium">{request.startTime} - {request.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-medium">{request.loadingDock}</span>
                            </div>
                          </div>

                          {request.depositAmount && (
                            <div className="mt-3 flex items-center gap-2 text-base text-gray-300">
                              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-semibold">Deposit: R{request.depositAmount.toFixed(2)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <p className="text-base font-mono font-bold text-purple-400">#{request.id}</p>
                          <span className={`inline-flex items-center gap-2 ${getStatusColor(request.status)} text-white px-6 py-3 rounded-lg font-bold text-base border-2 border-white/20`}>
                            <StatusIcon className="w-5 h-5" />
                            {request.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      </div>
    </div>
  );
}
