'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FMHeader } from '@/components/fm/FMHeader';
import { 
  Truck,
  ChevronLeft,
  ChevronRight,
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

// Status configuration for calendar
const statusConfig = {
  'Pending': {
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-300',
    icon: AlertCircle
  },
  'Approved': {
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    icon: CheckCircle
  },
  'Deposit Pending': {
    color: 'bg-orange-500',
    lightColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-300',
    icon: Clock
  },
  'Payment Claimed': {
    color: 'bg-purple-500',
    lightColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
    icon: DollarSign
  },
  'Deposit Verified': {
    color: 'bg-teal-500',
    lightColor: 'bg-teal-100',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-300',
    icon: CheckCircle
  },
  'Fully Approved': {
    color: 'bg-green-500',
    lightColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    icon: CheckCircle
  },
  'In Progress': {
    color: 'bg-blue-600',
    lightColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    icon: PlayCircle
  },
  'Completed': {
    color: 'bg-green-600',
    lightColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    icon: CheckCircle
  },
  'Rejected': {
    color: 'bg-red-500',
    lightColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-300',
    icon: XCircle
  },
  'Cancelled': {
    color: 'bg-gray-500',
    lightColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    icon: XCircle
  }
};

export default function FMMoveRequestsList() {
  const router = useRouter();
  const { moveRequests, isLoading } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [selectedDate]);

  // Filter move requests
  const filteredRequests = useMemo(() => {
    return moveRequests.filter(request => {
      const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
      const matchesSearch = searchQuery === '' || 
        request.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.residentUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.moveType.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [moveRequests, selectedStatus, searchQuery]);

  // Get requests for a specific date
  const getRequestsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return filteredRequests.filter(req => req.moveDate === dateStr);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: filteredRequests.length,
      pending: filteredRequests.filter(r => r.status === 'Pending').length,
      approved: filteredRequests.filter(r => r.status === 'Approved' || r.status === 'Deposit Pending').length,
      inProgress: filteredRequests.filter(r => r.status === 'In Progress').length,
      completed: filteredRequests.filter(r => r.status === 'Completed').length
    };
  }, [filteredRequests]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
      <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-pink-700 py-6 px-8 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Move In/Out Requests</h2>
            <p className="text-white text-base drop-shadow">Track and manage all move requests</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white/25 backdrop-blur-sm rounded-xl p-4 border border-white/40 hover:bg-white/35 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold drop-shadow">Total Requests</p>
              <Truck className="w-6 h-6 text-white drop-shadow group-hover:rotate-12 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold drop-shadow-lg">{stats.total}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Pending')}
            className="bg-yellow-600/30 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/50 hover:bg-yellow-600/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold drop-shadow">Pending</p>
              <AlertCircle className="w-6 h-6 text-white drop-shadow group-hover:animate-pulse" />
            </div>
            <p className="text-white text-4xl font-bold drop-shadow-lg">{stats.pending}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Approved')}
            className="bg-blue-600/30 backdrop-blur-sm rounded-xl p-4 border border-blue-400/50 hover:bg-blue-600/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold drop-shadow">Approved</p>
              <CheckCircle className="w-6 h-6 text-white drop-shadow group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold drop-shadow-lg">{stats.approved}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('In Progress')}
            className="bg-cyan-600/30 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/50 hover:bg-cyan-600/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold drop-shadow">In Progress</p>
              <PlayCircle className="w-6 h-6 text-white drop-shadow group-hover:animate-spin" />
            </div>
            <p className="text-white text-4xl font-bold drop-shadow-lg">{stats.inProgress}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Completed')}
            className="bg-green-600/30 backdrop-blur-sm rounded-xl p-4 border border-green-400/50 hover:bg-green-600/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold drop-shadow">Completed</p>
              <CheckCircle className="w-6 h-6 text-white drop-shadow group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold drop-shadow-lg">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        
        {/* Filters and Search Bar */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700 shadow-xl">
          <div className="grid grid-cols-3 gap-4">
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Search className="inline w-4 h-4 mr-2" />
                Search Requests
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, unit, or move type..."
                className="w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                className="w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Deposit Pending">Deposit Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'calendar' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Calendar className="inline w-4 h-4 mr-2" />
                Calendar View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'list' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                List View
              </button>
            </div>

            <button className="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <>
            {/* Calendar Navigation */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <h3 className="text-3xl font-bold text-white">
                  {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </h3>

                <button
                  onClick={() => navigateMonth('next')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                
                {dayNames.map(day => (
                  <div key={day} className="text-center py-3 text-cyan-400 font-bold text-lg border-b-2 border-cyan-500/30">
                    {day}
                  </div>
                ))}

                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="min-h-[140px] bg-gray-900/50 rounded-lg" />;
                  }

                  const requests = getRequestsForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={index}
                      className={`min-h-[140px] p-3 rounded-lg border-2 transition-all hover:shadow-lg hover:scale-105 cursor-pointer ${
                        isToday 
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/50' 
                          : 'bg-gray-900/50 border-gray-700 hover:border-cyan-500/50'
                      }`}
                    >
                      <div className={`text-right mb-2 font-bold ${
                        isToday ? 'text-cyan-300 text-2xl' : 'text-gray-400 text-lg'
                      }`}>
                        {date.getDate()}
                      </div>

                      <div className="space-y-1">
                        {requests.slice(0, 3).map(request => {
                          const config = statusConfig[request.status as keyof typeof statusConfig];
                          const Icon = config?.icon || Truck;
                          
                          return (
                            <div
                              key={request.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/facilitiesmanager/move-requests/${request.id}`);
                              }}
                              className={`p-2 rounded text-xs font-medium ${config?.lightColor || 'bg-gray-100'} ${config?.textColor || 'text-gray-700'} border ${config?.borderColor || 'border-gray-300'} hover:scale-105 transition-all animate-fade-in`}
                              title={`${request.moveType} - ${request.residentUnit}`}
                            >
                              <div className="flex items-center gap-1">
                                <Icon className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{request.moveType}</span>
                              </div>
                              <div className="text-[10px] opacity-75 truncate">{request.residentUnit}</div>
                            </div>
                          );
                        })}
                        
                        {requests.length > 3 && (
                          <div className="text-center text-xs text-cyan-400 font-bold mt-1">
                            +{requests.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* List View */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
                  <Truck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No move requests found</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => router.push(`/facilitiesmanager/move-requests/${request.id}`)}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 hover:bg-gray-750 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Truck className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                              {request.moveType} - {request.residentUnit}
                            </h3>
                            <p className="text-gray-400">{request.residentName}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span>{new Date(request.moveDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span>{request.startTime} - {request.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <MapPin className="w-4 h-4 text-green-400" />
                            <span>{request.loadingDock}</span>
                          </div>
                        </div>

                        {request.depositAmount && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-gray-300">
                            <DollarSign className="w-4 h-4 text-yellow-400" />
                            <span>Deposit: R{request.depositAmount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`${getStatusColor(request.status)} text-white px-4 py-2 rounded-lg font-bold text-sm`}>
                          {request.status}
                        </span>
                        <p className="text-xs text-gray-500">#{request.id}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
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
