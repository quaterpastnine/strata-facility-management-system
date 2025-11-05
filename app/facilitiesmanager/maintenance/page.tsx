'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FMHeader } from '@/components/fm/FMHeader';
import { useData } from '@/contexts/DataContext';
import { 
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  AlertCircle,
  Filter,
  Search,
  Download,
  TrendingUp,
  Plus
} from 'lucide-react';

// Types matching serverData
interface MaintenanceRequest {
  id: string;
  title: string;
  location: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  dateSubmitted: string;
  assignedTo?: string;
  residentName: string;
  residentUnit: string;
}

// Status configuration
const statusConfig = {
  'Open': {
    label: 'Urgent',
    color: 'bg-red-500',
    lightColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-300',
    icon: AlertCircle,
    gradient: 'from-red-500 to-red-600'
  },
  'In Progress': {
    label: 'In Progress',
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-300',
    icon: PlayCircle,
    gradient: 'from-yellow-500 to-yellow-600'
  },
  'Pending': {
    label: 'Pending',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    icon: Clock,
    gradient: 'from-blue-500 to-blue-600'
  },
  'Completed': {
    label: 'Completed',
    color: 'bg-green-500',
    lightColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    icon: CheckCircle,
    gradient: 'from-green-500 to-green-600'
  },
  'Rejected': {
    label: 'Rejected',
    color: 'bg-gray-500',
    lightColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    icon: XCircle,
    gradient: 'from-gray-500 to-gray-600'
  },
  'Cancelled': {
    label: 'Cancelled',
    color: 'bg-gray-500',
    lightColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    icon: XCircle,
    gradient: 'from-gray-500 to-gray-600'
  }
};

export default function MaintenanceCalendarDashboard() {
  const router = useRouter();
  const { tickets, isLoading } = useData();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Use tickets directly from DataContext
  const maintenanceData = tickets;

  // Filter maintenance requests
  const filteredRequests = useMemo(() => {
    return maintenanceData.filter(request => {
      const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || request.priority.toLowerCase() === selectedPriority;
      const matchesSearch = searchQuery === '' || 
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.residentUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.residentName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [maintenanceData, selectedStatus, selectedPriority, searchQuery]);

  // Calculate statistics from ALL tickets (not filtered)
  const stats = useMemo(() => {
    return {
      total: maintenanceData.length,
      open: maintenanceData.filter(r => r.status === 'Open').length,
      inProgress: maintenanceData.filter(r => r.status === 'In Progress').length,
      pending: maintenanceData.filter(r => r.status === 'Pending').length,
      completed: maintenanceData.filter(r => r.status === 'Completed').length,
      rejected: maintenanceData.filter(r => r.status === 'Rejected').length,
      cancelled: maintenanceData.filter(r => r.status === 'Cancelled').length
    };
  }, [maintenanceData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <FMHeader currentPage="Maintenance" />
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-2xl">Loading maintenance data...</div>
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
        <FMHeader currentPage="Maintenance" />
      


      {/* Page Header with Stats */}
      <div className="bg-gradient-to-r from-cyan-600 via-cyan-700 to-teal-700 py-6 px-8 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Maintenance Requests</h2>
            <p className="text-white text-base drop-shadow">Track and manage all maintenance requests</p>
          </div>
          
          <button
            onClick={() => router.push('/facilitiesmanager/maintenance/new')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-emerald-500/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden lg:inline">Create New Maintenance Ticket</span>
            <span className="hidden sm:inline lg:hidden">Create Ticket</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-7 gap-4">
          <div 
            onClick={() => setSelectedStatus('all')}
            className={`backdrop-blur-sm rounded-xl p-4 border transition-all cursor-pointer group ${
              selectedStatus === 'all'
                ? 'bg-white/40 border-white ring-2 ring-white'
                : 'bg-white/25 border-white/40 hover:bg-white/35'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold drop-shadow">All</p>
              <Wrench className="w-6 h-6 text-white drop-shadow group-hover:rotate-12 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold drop-shadow-lg">{stats.total}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Open')}
            className={`backdrop-blur-sm rounded-xl p-4 border transition-all cursor-pointer group ${
              selectedStatus === 'Open'
                ? 'bg-red-600/50 border-red-300 ring-2 ring-red-300'
                : 'bg-red-600/30 border-red-400/50 hover:bg-red-600/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold drop-shadow">Open</p>
              <AlertCircle className="w-6 h-6 text-white drop-shadow group-hover:animate-pulse" />
            </div>
            <p className="text-white text-4xl font-bold drop-shadow-lg">{stats.open}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('In Progress')}
            className={`backdrop-blur-sm rounded-xl p-4 border transition-all cursor-pointer group ${
              selectedStatus === 'In Progress'
                ? 'bg-yellow-600/50 border-yellow-300 ring-2 ring-yellow-300'
                : 'bg-yellow-600/30 border-yellow-400/50 hover:bg-yellow-600/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold drop-shadow">In Progress</p>
              <PlayCircle className="w-6 h-6 text-white drop-shadow group-hover:animate-spin" />
            </div>
            <p className="text-white text-4xl font-bold drop-shadow-lg">{stats.inProgress}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Pending')}
            className={`backdrop-blur-sm rounded-xl p-4 border transition-all cursor-pointer group ${
              selectedStatus === 'Pending'
                ? 'bg-blue-600/50 border-blue-300 ring-2 ring-blue-300'
                : 'bg-blue-600/30 border-blue-400/50 hover:bg-blue-600/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold drop-shadow">Pending</p>
              <Clock className="w-6 h-6 text-white drop-shadow group-hover:animate-bounce" />
            </div>
            <p className="text-white text-4xl font-bold drop-shadow-lg">{stats.pending}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Completed')}
            className={`backdrop-blur-sm rounded-xl p-4 border transition-all cursor-pointer group ${
              selectedStatus === 'Completed'
                ? 'bg-green-600/50 border-green-300 ring-2 ring-green-300'
                : 'bg-green-600/30 border-green-400/50 hover:bg-green-600/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold drop-shadow">Completed</p>
              <CheckCircle className="w-6 h-6 text-white drop-shadow group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold drop-shadow-lg">{stats.completed}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Rejected')}
            className={`backdrop-blur-sm rounded-xl p-4 border transition-all cursor-pointer group ${
              selectedStatus === 'Rejected'
                ? 'bg-gray-600/50 border-gray-300 ring-2 ring-gray-300'
                : 'bg-gray-600/30 border-gray-400/50 hover:bg-gray-600/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold drop-shadow">Rejected</p>
              <XCircle className="w-6 h-6 text-white drop-shadow group-hover:rotate-180 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold drop-shadow-lg">{stats.rejected}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Cancelled')}
            className={`backdrop-blur-sm rounded-xl p-4 border transition-all cursor-pointer group ${
              selectedStatus === 'Cancelled'
                ? 'bg-slate-600/50 border-slate-300 ring-2 ring-slate-300'
                : 'bg-slate-600/30 border-slate-400/50 hover:bg-slate-600/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold drop-shadow">Cancelled</p>
              <XCircle className="w-6 h-6 text-white drop-shadow group-hover:scale-75 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold drop-shadow-lg">{stats.cancelled}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        
        {/* Filters and Search Bar */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700 shadow-xl">
          <div className="grid grid-cols-4 gap-4">
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Search className="inline w-4 h-4 mr-2" />
                Search Requests
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, unit, or reporter..."
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
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <TrendingUp className="inline w-4 h-4 mr-2" />
                Priority Filter
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full h-12 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-700">
            <button className="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* List View */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-cyan-400" />
                All Maintenance Requests ({filteredRequests.length})
              </h3>

              <div className="space-y-4">
                {filteredRequests.map(request => {
                  const config = statusConfig[request.status as keyof typeof statusConfig];
                  const Icon = config.icon;

                  return (
                    <div
                      key={request.id}
                      onClick={() => router.push(`/facilitiesmanager/maintenance/${request.id}`)}
                      className="bg-gray-900 rounded-lg p-6 border-l-4 hover:shadow-xl transition-all cursor-pointer group hover:scale-[1.02] animate-fade-in"
                      style={{ borderLeftColor: config.color.replace('bg-', '') }}
                    >
                      <div className="flex items-start justify-between">
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-cyan-400 font-mono font-bold text-lg">{request.id}</span>
                            <h4 className="text-white text-xl font-bold group-hover:text-cyan-400 transition-colors">
                              {request.title}
                            </h4>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-gray-400 text-sm">Location</p>
                              <p className="text-white font-semibold">{request.location}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Reported By</p>
                              <p className="text-white font-semibold">{request.residentName}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Date Submitted</p>
                              <p className="text-white font-semibold">{request.dateSubmitted}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-gray-400 text-sm">Category</p>
                              <p className="text-cyan-400 font-semibold">{request.category}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Assigned To</p>
                              <p className="text-white font-semibold">{request.assignedTo || 'Unassigned'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Unit</p>
                              <p className="text-white font-semibold">{request.residentUnit}</p>
                            </div>
                          </div>

                          <p className="text-gray-300 mt-3 text-sm italic">"{request.description}"</p>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className={`px-6 py-3 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-bold text-lg shadow-lg flex items-center gap-2`}>
                            <Icon className="w-5 h-5" />
                            {config.label}
                          </div>

                          <div className={`px-4 py-2 rounded-lg ${
                            request.priority === 'High' 
                              ? 'bg-red-500/20 text-red-300 border border-red-500/50' 
                              : request.priority === 'Medium'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                          } font-semibold`}>
                            {request.priority.toUpperCase()} Priority
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredRequests.length === 0 && (
                  <div className="text-center py-12">
                    <Wrench className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-xl">No maintenance requests found matching your filters</p>
                  </div>
                )}
              </div>
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
