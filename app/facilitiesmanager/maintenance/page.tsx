'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  AlertCircle,
  Filter,
  Search,
  Download,
  Plus,
  Home,
  LogOut,
  ArrowLeft,
  TrendingUp
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch maintenance data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/maintenance');
        const data = await response.json();
        setMaintenanceData(data.tickets || []);
      } catch (error) {
        console.error('Error fetching maintenance data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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

  // Get requests for a specific date
  const getRequestsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return filteredRequests.filter(req => req.dateSubmitted === dateStr);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: filteredRequests.length,
      open: filteredRequests.filter(r => r.status === 'Open').length,
      inProgress: filteredRequests.filter(r => r.status === 'In Progress').length,
      pending: filteredRequests.filter(r => r.status === 'Pending').length,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading maintenance data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Header Bar */}
      <div className="bg-[#001F3F] border-b-2 border-cyan-500/30 shadow-xl">
        <div className="px-8 py-6 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <Image
              src="/logo.png"
              alt="StrataTrac Logo"
              width={220}
              height={88}
              priority
              className="object-contain"
            />
            <div className="border-l border-cyan-500/30 pl-6">
              <p className="text-cyan-400 text-xl font-semibold">Strata Management Solutions</p>
              <p className="text-gray-400 text-base">Maintenance Calendar Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/facilitiesmanager')}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-cyan-500 text-cyan-400 bg-transparent hover:bg-cyan-500 hover:text-white transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-4 pl-6 ml-6 border-l border-cyan-500/30">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center border-2 border-cyan-400">
                <span className="text-white font-bold text-lg">JD</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white text-lg">John Doe</div>
                <div className="text-base text-cyan-400">Facilities Manager</div>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-red-500 text-red-400 bg-transparent hover:bg-red-500 hover:text-white transition-all">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Page Header with Stats */}
      <div className="bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 py-6 px-8 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Maintenance Request Calendar</h2>
            <p className="text-white/90 text-base">Track and manage all maintenance requests</p>
          </div>
          <button className="inline-flex items-center gap-2 h-14 px-8 rounded-xl text-lg font-bold bg-white text-teal-600 hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
            <Plus className="h-6 w-6" />
            New Request
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90 font-semibold">Total Requests</p>
              <Wrench className="w-6 h-6 text-white/70 group-hover:rotate-12 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.total}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Open')}
            className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-300/30 hover:bg-red-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90 font-semibold">Open</p>
              <AlertCircle className="w-6 h-6 text-red-200 group-hover:animate-pulse" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.open}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('In Progress')}
            className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-300/30 hover:bg-yellow-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90 font-semibold">In Progress</p>
              <PlayCircle className="w-6 h-6 text-yellow-200 group-hover:animate-spin" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.inProgress}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Pending')}
            className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-300/30 hover:bg-blue-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90 font-semibold">Pending</p>
              <Clock className="w-6 h-6 text-blue-200 group-hover:animate-bounce" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.pending}</p>
          </div>

          <div 
            onClick={() => setSelectedStatus('Completed')}
            className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-300/30 hover:bg-green-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90 font-semibold">Completed</p>
              <CheckCircle className="w-6 h-6 text-green-200 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.completed}</p>
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
                          const Icon = config.icon;
                          
                          return (
                            <div
                              key={request.id}
                              className={`p-2 rounded text-xs font-medium ${config.lightColor} ${config.textColor} border ${config.borderColor} hover:scale-105 transition-all animate-fade-in`}
                              title={`${request.title} - ${request.residentUnit}`}
                            >
                              <div className="flex items-center gap-1">
                                <Icon className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{request.title}</span>
                              </div>
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
  );
}
