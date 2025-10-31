'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Building2,
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';

// Calendar helper functions
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ManagerDashboard() {
  const router = useRouter();
  const { tickets, moveRequests, bookings, residentData, isLoading } = useData();
  
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Calculate calendar data
  const calendarData = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    // Create event map by date
    const eventsByDate: Record<string, any[]> = {};
    
    // Add maintenance tickets
    tickets.forEach(ticket => {
      const date = ticket.dateSubmitted;
      if (!eventsByDate[date]) eventsByDate[date] = [];
      eventsByDate[date].push({
        type: 'maintenance',
        id: ticket.id,
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        time: 'All day',
        data: ticket,
      });
    });
    
    // Add move requests
    moveRequests.forEach(move => {
      const date = move.moveDate;
      if (!eventsByDate[date]) eventsByDate[date] = [];
      eventsByDate[date].push({
        type: 'move',
        id: move.id,
        title: `${move.moveType} - ${move.residentUnit}`,
        status: move.status,
        time: move.startTime,
        data: move,
      });
    });
    
    // Add facility bookings
    bookings.forEach(booking => {
      const date = booking.bookingDate;
      if (!eventsByDate[date]) eventsByDate[date] = [];
      eventsByDate[date].push({
        type: 'booking',
        id: booking.id,
        title: booking.facilityName,
        status: booking.status,
        time: booking.startTime,
        data: booking,
      });
    });
    
    return { daysInMonth, firstDay, eventsByDate };
  }, [currentYear, currentMonth, tickets, moveRequests, bookings]);

  // Stats
  const stats = useMemo(() => {
    return {
      pendingApprovals: [
        ...tickets.filter(t => t.status === 'Pending'),
        ...moveRequests.filter(m => m.status === 'Pending'),
        ...bookings.filter(b => b.status === 'Pending')
      ].length,
      activeMaintenance: tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length,
      upcomingMoves: moveRequests.filter(m => m.status === 'Approved' || m.status === 'In Progress').length,
      totalEvents: tickets.length + moveRequests.length + bookings.length,
    };
  }, [tickets, moveRequests, bookings]);

  // Navigation functions
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Get events for selected date
  const selectedEvents = selectedDate ? (calendarData.eventsByDate[selectedDate] || []) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 md:p-8">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
              <Home className="w-10 h-10 text-blue-400" />
              Facilities Manager Dashboard
            </h1>
            <p className="text-gray-400 text-lg mt-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm font-semibold">Pending Approvals</p>
              <Clock className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.pendingApprovals}</p>
            <p className="text-white/80 text-xs mt-1">Requires action</p>
          </div>

          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm font-semibold">Active Maintenance</p>
              <Wrench className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.activeMaintenance}</p>
            <p className="text-white/80 text-xs mt-1">In progress</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm font-semibold">Upcoming Moves</p>
              <Building2 className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.upcomingMoves}</p>
            <p className="text-white/80 text-xs mt-1">Scheduled</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm font-semibold">Total Events</p>
              <CalendarIcon className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-white text-4xl font-bold">{stats.totalEvents}</p>
            <p className="text-white/80 text-xs mt-1">All time</p>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white">
                  {MONTHS[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={goToToday}
                  className="text-sm text-blue-100 hover:text-white mt-1 underline"
                >
                  Today
                </button>
              </div>
              
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-gray-400 font-bold text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: calendarData.firstDay }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Actual days */}
              {Array.from({ length: calendarData.daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dateStr = formatDate(currentYear, currentMonth, day);
                const events = calendarData.eventsByDate[dateStr] || [];
                const isToday = dateStr === formatDate(today.getFullYear(), today.getMonth(), today.getDate());
                const isSelected = dateStr === selectedDate;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`aspect-square p-2 rounded-xl border-2 transition-all hover:scale-105 ${
                      isToday
                        ? 'bg-blue-600 border-blue-400'
                        : isSelected
                        ? 'bg-gray-700 border-blue-500'
                        : events.length > 0
                        ? 'bg-gray-700/50 border-gray-600 hover:border-blue-500'
                        : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      <span className={`text-lg font-bold mb-1 ${isToday ? 'text-white' : 'text-gray-300'}`}>
                        {day}
                      </span>
                      
                      {/* Event indicators */}
                      {events.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-auto">
                          {events.slice(0, 3).map((event, idx) => (
                            <div
                              key={idx}
                              className={`w-2 h-2 rounded-full ${
                                event.type === 'maintenance'
                                  ? 'bg-teal-400'
                                  : event.type === 'move'
                                  ? 'bg-orange-400'
                                  : 'bg-purple-400'
                              }`}
                            />
                          ))}
                          {events.length > 3 && (
                            <span className="text-xs text-gray-400">+{events.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="border-t border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Events on {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              
              {selectedEvents.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No events scheduled for this date</p>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border-l-4 ${
                        event.type === 'maintenance'
                          ? 'bg-teal-500/10 border-teal-500'
                          : event.type === 'move'
                          ? 'bg-orange-500/10 border-orange-500'
                          : 'bg-purple-500/10 border-purple-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {event.type === 'maintenance' && <Wrench className="w-5 h-5 text-teal-400" />}
                          {event.type === 'move' && <Building2 className="w-5 h-5 text-orange-400" />}
                          {event.type === 'booking' && <CalendarIcon className="w-5 h-5 text-purple-400" />}
                          
                          <div>
                            <p className="text-white font-bold">{event.title}</p>
                            <p className="text-gray-400 text-sm">{event.time}</p>
                          </div>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          event.status === 'Pending'
                            ? 'bg-orange-500/20 text-orange-300'
                            : event.status === 'Approved' || event.status === 'Confirmed'
                            ? 'bg-green-500/20 text-green-300'
                            : event.status === 'In Progress'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : event.status === 'Completed'
                            ? 'bg-gray-500/20 text-gray-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="border-t border-gray-700 p-6 bg-gray-800/30">
            <h4 className="text-white font-bold mb-3">Legend</h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                <span className="text-gray-300 text-sm">Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                <span className="text-gray-300 text-sm">Move Request</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span className="text-gray-300 text-sm">Facility Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-600 border-2 border-blue-400"></div>
                <span className="text-gray-300 text-sm">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
