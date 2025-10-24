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
} from 'lucide-react';

export default function ResidentDashboard() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  // Mock data for resident
  const residentData = {
    name: "Sarah Johnson",
    unit: "Unit 111",
    initials: "SJ",
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
      
      {/* Header Bar - Dark Navy */}
      <div className="bg-[#001F3F] border-b-2 border-cyan-500/30 shadow-xl">
        <div className="px-8 py-6 flex items-center justify-between">
          
          {/* Left: Logo & Branding */}
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
              <p className="text-gray-400 text-base">Resident Portal</p>
            </div>
          </div>

          {/* Right: Navigation & User */}
          <div className="flex items-center gap-4">
            {/* Navigation Buttons - Resident Only */}
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

            {/* Logout */}
            <button className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-red-500 text-red-400 bg-transparent hover:bg-red-500 hover:text-white transition-all">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Page Header - Rounded Tile */}
      <div className="px-8 py-6">
        <div 
          className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-2xl py-8 px-8 shadow-2xl transition-all duration-1000 ease-out"
          style={{
            animation: 'slideDown 0.8s ease-out'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Welcome, Sarah Johnson</h2>
              <p className="text-white/90 text-xl font-medium">Unit 111</p>
            </div>
            <div className="text-right">
              <p className="text-white text-2xl font-semibold">Friday, October 24, 2025 • 10:45 AM</p>
              <p className="text-white/90 text-xl mt-2">🌤️ Partly Cloudy • 22°C</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        
        {/* Stats Row - Personal Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          
          {/* Total Bookings */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-lg font-semibold">My Bookings</p>
              <Calendar className="w-10 h-10 text-white/50" />
            </div>
            <p className="text-white text-6xl font-bold">{residentData.stats.totalBookings}</p>
            <p className="text-white/80 text-base mt-1">All time</p>
          </div>

          {/* Pending Approvals */}
          <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-lg font-semibold">Pending</p>
              <Clock className="w-10 h-10 text-white/50" />
            </div>
            <p className="text-white text-6xl font-bold">{residentData.stats.pendingApprovals}</p>
            <p className="text-white/80 text-base mt-1">Awaiting approval</p>
          </div>

          {/* Move Requests */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-lg font-semibold">Move Requests</p>
              <Building2 className="w-10 h-10 text-white/50" />
            </div>
            <p className="text-white text-6xl font-bold">{residentData.stats.activeMoveRequests}</p>
            <p className="text-white/80 text-base mt-1">Active</p>
          </div>

          {/* Maintenance */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-lg font-semibold">Maintenance</p>
              <Wrench className="w-10 h-10 text-white/50" />
            </div>
            <p className="text-white text-6xl font-bold">{residentData.stats.maintenanceTickets}</p>
            <p className="text-white/80 text-base mt-1">Tickets</p>
          </div>

        </div>

        {/* Quick Actions - 3 Tiles */}
        <h3 className="text-gray-200 text-2xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          
          {/* Move In/Out */}
          <div 
            onClick={() => router.push('/resident/move-requests')}
            className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-10 h-10 text-white" />
                <div>
                  <h3 className="text-white text-3xl font-bold">Move In/Out</h3>
                  <p className="text-white/90 text-lg">Elevator booking</p>
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-white/60" />
            </div>
            
            <div className="space-y-2">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-lg">Move In - Unit 111</p>
                  <span className="text-sm text-white/80 bg-green-500/30 px-2 py-1 rounded">Approved</span>
                </div>
                <p className="text-white/80 text-base">Nov 28, 2024 • 9:00 AM</p>
              </div>
            </div>
            
            <button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all">
              New Request
            </button>
          </div>

          {/* Maintenance */}
          <div 
            onClick={() => router.push('/resident/maintenance')}
            className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Wrench className="w-10 h-10 text-white" />
                <div>
                  <h3 className="text-white text-3xl font-bold">Maintenance</h3>
                  <p className="text-white/90 text-lg">Report issues</p>
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-white/60" />
            </div>
            
            <div className="space-y-2">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-lg">AC Not Working</p>
                  <span className="text-sm text-white/80 bg-yellow-500/30 px-2 py-1 rounded">In Progress</span>
                </div>
                <p className="text-white/80 text-base">Dec 10, 2024 • Tech #3</p>
              </div>
            </div>
            
            <button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all">
              New Ticket
            </button>
          </div>

          {/* Bookings */}
          <div 
            onClick={() => router.push('/resident/bookings')}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-10 h-10 text-white" />
                <div>
                  <h3 className="text-white text-3xl font-bold">My Bookings</h3>
                  <p className="text-white/90 text-lg">View & manage</p>
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-white/60" />
            </div>
            
            <div className="space-y-2">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-lg">Tennis Court 1</p>
                  <span className="text-sm text-white/80 bg-green-500/30 px-2 py-1 rounded">Confirmed</span>
                </div>
                <p className="text-white/80 text-base">Dec 15, 2024 • 3:00 PM</p>
              </div>
            </div>
            
            <button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all">
              New Booking
            </button>
          </div>

        </div>

        {/* Activity History */}
        <h3 className="text-gray-200 text-3xl font-bold mb-4 flex items-center gap-2">
          <History className="w-8 h-8" />
          My Activity History  
        </h3>
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="space-y-3">
            {residentData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-6 bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  {activity.type === 'booking' && <Calendar className="w-10 h-10 text-blue-400" />}
                  {activity.type === 'move' && <Building2 className="w-10 h-10 text-orange-400" />}
                  {activity.type === 'maintenance' && <Wrench className="w-10 h-10 text-teal-400" />}
                  
                  <div>
                    <p className="text-gray-200 font-bold text-3xl">{activity.title}</p>
                    <p className="text-gray-300 text-xl">
                      {activity.date} 
                      {activity.time && ` • ${activity.time}`}
                      {activity.assignee && ` • ${activity.assignee}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {activity.status === 'Confirmed' && (
                    <span className="text-xl text-green-200 bg-green-600/50 px-6 py-3 rounded-full font-bold">
                      {activity.status}
                    </span>
                  )}
                  {activity.status === 'Approved' && (
                    <span className="text-xl text-green-200 bg-green-600/50 px-6 py-3 rounded-full font-bold">
                      {activity.status}
                    </span>
                  )}
                  {activity.status === 'In Progress' && (
                    <span className="text-xl text-yellow-200 bg-yellow-600/50 px-6 py-3 rounded-full font-bold">
                      {activity.status}
                    </span>
                  )}
                  {activity.status === 'Completed' && (
                    <span className="text-xl text-gray-200 bg-gray-600/50 px-6 py-3 rounded-full font-bold">
                      {activity.status}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-white/40" />
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


