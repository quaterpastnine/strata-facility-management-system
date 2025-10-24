'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SplashScreen from '../components/SplashScreen';
import { 
  Calendar,
  Building2,
  Wrench,
  Home,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  History,
  Menu,
  X,
} from 'lucide-react';

export default function ResidentDashboard() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock data for resident
  const residentData = {
    name: "Willow Legg",
    unit: "Auto Spin Door",
    initials: "WL",
    stats: {
      totalBookings: 12,
      activeMoveRequests: 1,
      maintenanceTickets: 3,
      pendingApprovals: 2,
    },
    recentActivity: [
      { type: 'booking', title: 'Tennis Court 1', status: 'Confirmed', date: 'Dec 15, 2024', time: '3:00 PM' },
      { type: 'maintenance', title: 'AC Not Working', status: 'In Progress', date: 'Dec 10, 2024', assignee: 'Tech #3' },
      { type: 'move', title: 'Move In Request', status: 'Approved', date: 'Nov 28, 2024', time: '9:00 AM' },
      { type: 'booking', title: 'Swimming Pool', status: 'Completed', date: 'Dec 5, 2024', time: '2:00 PM' },
      { type: 'maintenance', title: 'Leaking Faucet', status: 'Completed', date: 'Nov 20, 2024', assignee: 'Tech #1' },
    ]
  };

  return (
    <>
      {/* Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Main Dashboard */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      
      {/* Background Image */}
      <div 
        className="fixed inset-0 opacity-40 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/background.jpg")',
          zIndex: 0
        }}
      />
      
      {/* Content Wrapper */}
      <div className="relative z-10">
      
      {/* Header Bar - Dark Navy with mobile optimization */}
      <div className="bg-[#001F3F] border-b-2 border-cyan-500/30 shadow-xl">
        <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 flex items-center justify-between">
          
          {/* Mobile: Hamburger + Logo */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full md:w-auto">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-all"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo - responsive sizing */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1 md:flex-none">
              <Image
                src="/logo.png"
                alt="StrataTrac Logo"
                width={180}
                height={72}
                priority
                className="object-contain w-32 h-auto sm:w-44 md:w-56"
              />
              <div className="hidden sm:block border-l border-cyan-500/30 pl-3 sm:pl-4 md:pl-6">
                <p className="text-cyan-400 text-sm sm:text-lg md:text-xl font-semibold">Strata Management Solutions</p>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base">Resident Portal</p>
              </div>
            </div>
          </div>

          {/* Desktop: Navigation & User */}
          <div className="hidden md:flex items-center gap-4">
            <button className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-cyan-500 text-cyan-400 bg-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-all">
              <Home className="h-5 w-5" />
              My Dashboard
            </button>
            
            <button className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-blue-500 text-blue-400 bg-transparent hover:bg-blue-500 hover:text-white transition-all">
              <Calendar className="h-5 w-5" />
              My Bookings
            </button>

            {/* User Info */}
            <div className="flex items-center gap-4 pl-6 ml-6 border-l border-cyan-500/30">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center border-2 border-cyan-400">
                <span className="text-white font-bold text-lg">{residentData.initials}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white text-lg">{residentData.name}</div>
                <div className="text-base text-cyan-400">{residentData.unit}</div>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-red-500 text-red-400 bg-transparent hover:bg-red-500 hover:text-white transition-all">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>

          {/* Mobile: User avatar only */}
          <div className="md:hidden">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center border-2 border-cyan-400">
              <span className="text-white font-bold text-sm sm:text-base">{residentData.initials}</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#001F3F] border-t border-cyan-500/30 px-3 py-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium border-2 border-cyan-500 text-cyan-400 bg-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-all">
              <Home className="h-5 w-5" />
              My Dashboard
            </button>
            
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium border-2 border-blue-500 text-blue-400 bg-transparent hover:bg-blue-500 hover:text-white transition-all">
              <Calendar className="h-5 w-5" />
              My Bookings
            </button>

            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center border-2 border-cyan-400">
                <span className="text-white font-bold text-sm">{residentData.initials}</span>
              </div>
              <div>
                <div className="font-semibold text-white text-base">{residentData.name}</div>
                <div className="text-sm text-cyan-400">{residentData.unit}</div>
              </div>
            </div>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium border-2 border-red-500 text-red-400 bg-transparent hover:bg-red-500 hover:text-white transition-all">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Page Header - Rounded Tile - Mobile optimized */}
      <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
        <div 
          className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-xl sm:rounded-2xl py-4 px-4 sm:py-6 sm:px-6 md:py-8 md:px-8 shadow-2xl transition-all duration-1000 ease-out"
          style={{
            animation: 'slideDown 0.8s ease-out'
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">Welcome, Willow Legg</h2>
              <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium">Auto Spin Door</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-white text-base sm:text-lg md:text-2xl font-semibold">Friday, October 24, 2025 • 10:45 AM</p>
              <p className="text-white/90 text-sm sm:text-base md:text-xl mt-1 sm:mt-2">🌤️ Partly Cloudy • 22°C</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
        
        {/* Stats Row - Personal Summary - Mobile responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          
          {/* Total Bookings */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg cursor-pointer hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <p className="text-white text-sm sm:text-base md:text-lg font-semibold">My Bookings</p>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white/50" />
            </div>
            <p className="text-white text-3xl sm:text-4xl md:text-6xl font-bold">{residentData.stats.totalBookings}</p>
            <p className="text-white/80 text-xs sm:text-sm md:text-base mt-1">All time</p>
          </div>

          {/* Pending Approvals */}
          <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg cursor-pointer hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <p className="text-white text-sm sm:text-base md:text-lg font-semibold">Pending</p>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white/50" />
            </div>
            <p className="text-white text-3xl sm:text-4xl md:text-6xl font-bold">{residentData.stats.pendingApprovals}</p>
            <p className="text-white/80 text-xs sm:text-sm md:text-base mt-1">Awaiting approval</p>
          </div>

          {/* Move Requests */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg cursor-pointer hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <p className="text-white text-sm sm:text-base md:text-lg font-semibold">Move Requests</p>
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white/50" />
            </div>
            <p className="text-white text-3xl sm:text-4xl md:text-6xl font-bold">{residentData.stats.activeMoveRequests}</p>
            <p className="text-white/80 text-xs sm:text-sm md:text-base mt-1">Active</p>
          </div>

          {/* Maintenance */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg cursor-pointer hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <p className="text-white text-sm sm:text-base md:text-lg font-semibold">Maintenance</p>
              <Wrench className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white/50" />
            </div>
            <p className="text-white text-3xl sm:text-4xl md:text-6xl font-bold">{residentData.stats.maintenanceTickets}</p>
            <p className="text-white/80 text-xs sm:text-sm md:text-base mt-1">Tickets</p>
          </div>

        </div>

        {/* Quick Actions - Mobile: Stack vertically, Tablet+: 3 columns */}
        <h3 className="text-gray-200 text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          
          {/* Move In/Out */}
          <div 
            onClick={() => router.push('/resident/move-requests')}
            className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-lg cursor-pointer hover:scale-105 transition-all active:scale-95"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <div>
                  <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">Move In/Out</h3>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg">Elevator booking</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white/60" />
            </div>
            
            <div className="space-y-2">
              <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-sm sm:text-base md:text-lg">Move In - Auto Spin Door</p>
                  <span className="text-xs sm:text-sm text-white/80 bg-green-500/30 px-2 py-1 rounded">Approved</span>
                </div>
                <p className="text-white/80 text-xs sm:text-sm md:text-base">Nov 28, 2024 • 9:00 AM</p>
              </div>
            </div>
            
            <button className="mt-3 sm:mt-4 w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm sm:text-base active:scale-95">
              New Request
            </button>
          </div>

          {/* Maintenance */}
          <div 
            onClick={() => router.push('/resident/maintenance')}
            className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-lg cursor-pointer hover:scale-105 transition-all active:scale-95"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <div>
                  <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">Maintenance</h3>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg">Report issues</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white/60" />
            </div>
            
            <div className="space-y-2">
              <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-sm sm:text-base md:text-lg">AC Not Working</p>
                  <span className="text-xs sm:text-sm text-white/80 bg-yellow-500/30 px-2 py-1 rounded">In Progress</span>
                </div>
                <p className="text-white/80 text-xs sm:text-sm md:text-base">Dec 10, 2024 • Tech #3</p>
              </div>
            </div>
            
            <button className="mt-3 sm:mt-4 w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm sm:text-base active:scale-95">
              New Ticket
            </button>
          </div>

          {/* Bookings */}
          <div 
            onClick={() => router.push('/resident/bookings')}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-lg cursor-pointer hover:scale-105 transition-all active:scale-95"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <div>
                  <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">My Bookings</h3>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg">View & manage</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white/60" />
            </div>
            
            <div className="space-y-2">
              <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-sm sm:text-base md:text-lg">Tennis Court 1</p>
                  <span className="text-xs sm:text-sm text-white/80 bg-green-500/30 px-2 py-1 rounded">Confirmed</span>
                </div>
                <p className="text-white/80 text-xs sm:text-sm md:text-base">Dec 15, 2024 • 3:00 PM</p>
              </div>
            </div>
            
            <button className="mt-3 sm:mt-4 w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm sm:text-base active:scale-95">
              New Booking
            </button>
          </div>

        </div>

        {/* Activity History */}
        <h3 className="text-gray-200 text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
          <History className="w-6 h-6 sm:w-8 sm:h-8" />
          My Activity History  
        </h3>
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-white/20">
          <div className="space-y-2 sm:space-y-3">
            {residentData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 sm:p-4 md:p-6 bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition-all cursor-pointer active:scale-98">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                  {activity.type === 'booking' && <Calendar className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-400 flex-shrink-0" />}
                  {activity.type === 'move' && <Building2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-orange-400 flex-shrink-0" />}
                  {activity.type === 'maintenance' && <Wrench className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-teal-400 flex-shrink-0" />}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 font-bold text-base sm:text-xl md:text-3xl truncate">{activity.title}</p>
                    <p className="text-gray-300 text-sm sm:text-base md:text-xl">
                      {activity.date} 
                      {activity.time && ` • ${activity.time}`}
                      {activity.assignee && ` • ${activity.assignee}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  {activity.status === 'Confirmed' && (
                    <span className="text-xs sm:text-sm md:text-xl text-green-200 bg-green-600/50 px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-full font-bold whitespace-nowrap">
                      {activity.status}
                    </span>
                  )}
                  {activity.status === 'Approved' && (
                    <span className="text-xs sm:text-sm md:text-xl text-green-200 bg-green-600/50 px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-full font-bold whitespace-nowrap">
                      {activity.status}
                    </span>
                  )}
                  {activity.status === 'In Progress' && (
                    <span className="text-xs sm:text-sm md:text-xl text-yellow-200 bg-yellow-600/50 px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-full font-bold whitespace-nowrap">
                      {activity.status}
                    </span>
                  )}
                  {activity.status === 'Completed' && (
                    <span className="text-xs sm:text-sm md:text-xl text-gray-200 bg-gray-600/50 px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-full font-bold whitespace-nowrap">
                      {activity.status}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      </div>
    </div>
    </>
  );
}
