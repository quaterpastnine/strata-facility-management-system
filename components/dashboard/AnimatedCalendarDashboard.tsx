'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Wrench, TrendingUp, ChevronLeft, ChevronRight, Sparkles, Activity, ArrowUpDown, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/contexts/DataContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarEvent {
  id: string;
  type: 'booking' | 'maintenance' | 'move';
  date: Date;
  title: string;
  time?: string;
  resident: string;
  status: string;
  priority?: string;
  category?: string;
  unreadComments?: number;
}

export function AnimatedCalendarDashboard() {
  const router = useRouter();
  const { tickets, moveRequests, bookings, residentData, getComments, addComment, markCommentsAsRead, updateTicket, updateMoveRequest } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [commentText, setCommentText] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Calendar generation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  // Convert all data to calendar events
  const allEvents: CalendarEvent[] = [
    ...bookings.map(b => ({
      id: b.id,
      type: 'booking' as const,
      date: new Date(b.bookingDate),
      title: b.facilityName,
      time: `${b.startTime} - ${b.endTime}`,
      resident: b.residentName,
      status: b.status,
    })),
    ...tickets.map(t => ({
      id: t.id,
      type: 'maintenance' as const,
      date: new Date(t.dateSubmitted),
      title: t.title,
      resident: t.residentName,
      status: t.status,
      priority: t.priority,
      category: t.category,
      unreadComments: getComments(t.id, 'maintenance').filter(c => !c.isRead && c.author === 'fm').length
    })),
    ...moveRequests.map(m => {
      // Parse date more carefully to handle timezone issues
      const dateStr = m.moveDate;
      // If date is in format YYYY-MM-DD, parse it as local time
      let eventDate: Date;
      if (dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-').map(Number);
        eventDate = new Date(year, month - 1, day); // Month is 0-indexed
      } else {
        eventDate = new Date(dateStr);
      }
      
      return {
        id: m.id,
        type: 'move' as const,
        date: eventDate,
        title: `${m.moveType} - ${m.loadingDock}`,
        time: `${m.startTime} - ${m.endTime}`,
        resident: m.residentName,
        status: m.status,
        unreadComments: getComments(m.id, 'move').filter(c => !c.isRead && c.author === 'fm').length
      };
    }),
  ];
  
  // DEBUG: Log move requests to console
  console.log('📅 Calendar Debug - Current Month:', MONTHS[month], year);
  console.log('📋 Total Move Requests:', moveRequests.length);
  console.log('📋 Move Requests:', moveRequests.map(m => {
    const dateStr = m.moveDate;
    let parsedDate: Date;
    if (dateStr.includes('-')) {
      const [y, mo, d] = dateStr.split('-').map(Number);
      parsedDate = new Date(y, mo - 1, d);
    } else {
      parsedDate = new Date(dateStr);
    }
    return {
      id: m.id,
      moveDate: m.moveDate,
      parsedDate: parsedDate.toString(),
      day: parsedDate.getDate(),
      month: parsedDate.getMonth(),
      year: parsedDate.getFullYear(),
      status: m.status
    };
  }));
  console.log('🎯 All Calendar Events:', allEvents.length);
  console.log('🎯 Move Events:', allEvents.filter(e => e.type === 'move'));

  const getEventsForDate = (day: number): CalendarEvent[] => {
    const targetDate = new Date(year, month, day);
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === targetDate.getDate() &&
             eventDate.getMonth() === targetDate.getMonth() &&
             eventDate.getFullYear() === targetDate.getFullYear();
    });
  };

  const getTodayEventsCount = () => {
    const today = new Date();
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === today.toDateString();
    }).length;
  };

  const getUpcomingEventsCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }).length;
  };

  const getPendingCount = () => residentData?.stats.pendingApprovals || 0;

  const previousMonth = () => {
    setIsAnimating(true);
    setCurrentDate(new Date(year, month - 1, 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const nextMonth = () => {
    setIsAnimating(true);
    setCurrentDate(new Date(year, month + 1, 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const hasEvents = (day: number) => getEventsForDate(day).length > 0;

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Route to detail pages instead of showing modal
    if (event.type === 'maintenance') {
      router.push(`/facilitiesmanager/maintenance/${event.id}`);
    } else if (event.type === 'move') {
      router.push(`/facilitiesmanager/move-requests/${event.id}`);
    } else {
      // Bookings can still use modal (simpler item)
      setSelectedEvent(event);
    }
  };

  const handleAddComment = () => {
    if (!selectedEvent || !commentText.trim()) return;
    
    if (selectedEvent.type === 'maintenance' || selectedEvent.type === 'move') {
      addComment(selectedEvent.id, selectedEvent.type, commentText, 'fm');
      setCommentText('');
    }
  };

  const handleApprove = () => {
    if (!selectedEvent) return;
    
    if (selectedEvent.type === 'maintenance') {
      updateTicket(selectedEvent.id, { status: 'Open' });
      addComment(selectedEvent.id, 'maintenance', 'Approved and opened for work', 'fm');
    } else if (selectedEvent.type === 'move') {
      updateMoveRequest(selectedEvent.id, { status: 'Approved' });
      addComment(selectedEvent.id, 'move', 'Move request approved', 'fm');
    }
    setSelectedEvent(null);
  };

  const handleReject = () => {
    if (!selectedEvent) return;
    
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    if (selectedEvent.type === 'maintenance') {
      updateTicket(selectedEvent.id, { status: 'Rejected', rejectionReason: reason });
      addComment(selectedEvent.id, 'maintenance', `Rejected: ${reason}`, 'fm');
    } else if (selectedEvent.type === 'move') {
      updateMoveRequest(selectedEvent.id, { status: 'Rejected' });
      addComment(selectedEvent.id, 'move', `Rejected: ${reason}`, 'fm');
    }
    setSelectedEvent(null);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'maintenance': return Wrench;
      case 'move': return ArrowUpDown;
      default: return Activity;
    }
  };

  const getEventColor = (event: CalendarEvent) => {
    if (event.status === 'Pending') return 'from-yellow-500 to-orange-500';
    if (event.type === 'booking') return 'from-blue-500 to-cyan-500';
    if (event.type === 'maintenance') return 'from-teal-500 to-emerald-500';
    if (event.type === 'move') return 'from-purple-500 to-pink-500';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(0, 217, 255, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(0, 217, 255, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.15) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10"
      >
        {[
          { label: 'Today\'s Items', value: getTodayEventsCount(), icon: Calendar, color: 'from-blue-500 via-blue-600 to-cyan-500', pulse: true, onClick: () => {} },
          { label: 'Upcoming', value: getUpcomingEventsCount(), icon: TrendingUp, color: 'from-green-500 via-green-600 to-emerald-500', pulse: false, onClick: () => {} },
          { label: 'Pending Approval', value: getPendingCount(), icon: Clock, color: 'from-yellow-500 via-orange-500 to-orange-600', pulse: true, onClick: () => {} },
          { label: 'Total Tickets', value: tickets.length, icon: Wrench, color: 'from-purple-500 via-purple-600 to-pink-500', pulse: false, onClick: () => router.push('/facilitiesmanager/maintenance') }
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
            onClick={stat.onClick}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group cursor-pointer`}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <motion.p 
                  className="text-sm opacity-90 mb-1 font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                >
                  {stat.label}
                </motion.p>
                <motion.p 
                  className="text-5xl font-bold tracking-tight"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.p>
              </div>
              <motion.div
                animate={stat.pulse ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <stat.icon className="w-14 h-14 opacity-80" strokeWidth={1.5} />
              </motion.div>
            </div>

            <motion.div
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-white/60" />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Calendar Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 217, 255, 0.2)',
              '0 0 40px rgba(0, 217, 255, 0.3)',
              '0 0 20px rgba(0, 217, 255, 0.2)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <motion.h2 
              key={`${MONTHS[month]}-${year}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            >
              {MONTHS[month]} {year}
            </motion.h2>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.15, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={previousMonth}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentDate(new Date())}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold transition-all shadow-lg hover:shadow-cyan-500/50"
            >
              Today
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextMonth}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-3 mb-4">
          {DAYS.map((day, idx) => (
            <motion.div 
              key={day}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="text-center text-sm font-bold text-cyan-300 py-3 rounded-lg bg-white/5"
            >
              {day}
            </motion.div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-3">
          <AnimatePresence mode="popLayout">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const dayEvents = getEventsForDate(day);
              const isCurrentDay = isToday(day);
              const hasItems = hasEvents(day);

              return (
                <motion.div
                  key={`${month}-${day}`}
                  initial={{ opacity: 0, scale: 0.6, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotateY: 90 }}
                  transition={{ 
                    delay: isAnimating ? 0 : idx * 0.008,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => setSelectedDate(new Date(year, month, day))}
                  whileHover={{ 
                    scale: 1.15,
                    zIndex: 10,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    aspect-square rounded-2xl p-3 cursor-pointer transition-all duration-300 relative overflow-hidden
                    ${isCurrentDay 
                      ? 'bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 shadow-xl shadow-cyan-500/50 ring-4 ring-cyan-400/30' 
                      : hasItems
                        ? 'bg-white/15 hover:bg-white/25 border border-white/20'
                        : 'bg-white/5 hover:bg-white/10 border border-white/5'
                    }
                  `}
                >
                  {isCurrentDay && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                  )}

                  {hoveredDay === day && !isCurrentDay && (
                    <motion.div
                      className="absolute inset-0 bg-cyan-400/20 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}

                  <div className="flex flex-col h-full relative z-10">
                    <motion.span 
                      className={`text-xl font-bold ${isCurrentDay ? 'text-white' : 'text-gray-100'}`}
                      animate={isCurrentDay ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {day}
                    </motion.span>
                    
                    {dayEvents.length > 0 && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.01 + 0.2 }}
                        className="mt-auto space-y-1"
                      >
                        {dayEvents.slice(0, 3).map((event, eIdx) => {
                          const Icon = getEventIcon(event.type);
                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: eIdx * 0.05 }}
                              whileHover={{ scale: 1.05, x: 2 }}
                              onClick={(e) => handleEventClick(event, e)}
                              className={`
                                text-[10px] px-2 py-1 rounded-lg font-medium backdrop-blur-sm flex items-center gap-1 relative
                                ${event.status === 'Pending' ? 'bg-yellow-500/90 shadow-lg shadow-yellow-500/30 animate-pulse' : 
                                  event.type === 'booking' ? 'bg-blue-500/90 shadow-lg shadow-blue-500/30' :
                                  event.type === 'maintenance' ? 'bg-teal-500/90 shadow-lg shadow-teal-500/30' :
                                  'bg-purple-500/90 shadow-lg shadow-purple-500/30'}
                              `}
                            >
                              <Icon className="w-2.5 h-2.5" />
                              <span className="truncate flex-1">{event.title}</span>
                              {event.unreadComments && event.unreadComments > 0 && (
                                <span className="bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-bold">
                                  {event.unreadComments}
                                </span>
                              )}
                            </motion.div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <motion.div 
                            className="text-[10px] text-cyan-300 text-center font-semibold bg-cyan-500/20 rounded-lg py-1 backdrop-blur-sm"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            +{dayEvents.length - 3} more
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Selected Date Details */}
      <AnimatePresence>
        {selectedDate && !selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <motion.h3 
                className="text-2xl font-bold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </motion.h3>
              <motion.button
                onClick={() => setSelectedDate(null)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                ✕
              </motion.button>
            </div>

            {getEventsForDate(selectedDate.getDate()).length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 text-center py-12 text-lg"
              >
                No items for this date
              </motion.p>
            ) : (
              <div className="space-y-4 relative z-10">
                {getEventsForDate(selectedDate.getDate()).map((event, idx) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: idx * 0.1, type: "spring", stiffness: 150 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => handleEventClick(event, {} as React.MouseEvent)}
                      className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all border border-white/10 backdrop-blur-sm relative overflow-hidden group cursor-pointer"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                      />

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${getEventColor(event)}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <motion.h4 
                              className="font-bold text-white text-lg flex items-center gap-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.1 + 0.1 }}
                            >
                              {event.title}
                              {event.unreadComments && event.unreadComments > 0 && (
                                <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  {event.unreadComments}
                                </span>
                              )}
                            </motion.h4>
                            <motion.p 
                              className="text-sm text-gray-300"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.1 + 0.2 }}
                            >
                              {event.resident} • {event.time || 'All day'}
                            </motion.p>
                            {event.category && (
                              <motion.p 
                                className="text-sm text-cyan-300 font-medium"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.1 + 0.3 }}
                              >
                                {event.category}
                                {event.priority && ` • ${event.priority} Priority`}
                              </motion.p>
                            )}
                          </div>
                        </div>
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                          className={`
                            px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap
                            ${event.status === 'Pending' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/30 animate-pulse' : 
                              event.status === 'Approved' || event.status === 'Open' ? 'bg-green-500 shadow-lg shadow-green-500/30' :
                              event.status === 'Rejected' || event.status === 'Cancelled' ? 'bg-red-500 shadow-lg shadow-red-500/30' :
                              'bg-blue-500 shadow-lg shadow-blue-500/30'}
                          `}
                        >
                          {event.status}
                        </motion.span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Detail & Comment Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-2 border-cyan-500/30 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${getEventColor(selectedEvent)}`}>
                    {(() => {
                      const Icon = getEventIcon(selectedEvent.type);
                      return <Icon className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                    <p className="text-gray-300">{selectedEvent.resident}</p>
                    <p className="text-cyan-400 text-sm">{selectedEvent.time || 'All day'}</p>
                    {selectedEvent.category && (
                      <p className="text-sm text-gray-400 mt-1">
                        {selectedEvent.category} {selectedEvent.priority && `• ${selectedEvent.priority} Priority`}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                  ✕
                </button>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <span className={`
                  inline-block px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider
                  ${selectedEvent.status === 'Pending' ? 'bg-yellow-500 animate-pulse' : 
                    selectedEvent.status === 'Approved' || selectedEvent.status === 'Open' ? 'bg-green-500' :
                    selectedEvent.status === 'Rejected' ? 'bg-red-500' :
                    'bg-blue-500'}
                `}>
                  {selectedEvent.status}
                </span>
              </div>

              {/* Action Buttons for Pending Items */}
              {selectedEvent.status === 'Pending' && (
                <div className="flex gap-3 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApprove}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReject}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </motion.button>
                </div>
              )}

              {/* Comments Section */}
              {(selectedEvent.type === 'maintenance' || selectedEvent.type === 'move') && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Comments
                  </h3>
                  
                  {/* Comments List */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {getComments(selectedEvent.id, selectedEvent.type).map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-4 rounded-xl ${
                          comment.author === 'fm' 
                            ? 'bg-cyan-500/20 border-l-4 border-cyan-500' 
                            : 'bg-white/10 border-l-4 border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-white">{comment.authorName}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-200">{comment.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      placeholder="Add a comment..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold"
                    >
                      Send
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
