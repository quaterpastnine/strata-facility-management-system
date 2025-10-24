'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Calendar,
  Building2,
  Wrench,
  Users,
  LayoutDashboard,
  Home,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  UserCheck,
  Truck,
} from 'lucide-react';

export default function FacilitiesManagerDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
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
              <p className="text-gray-400 text-base">Facilities Management System</p>
            </div>
          </div>

          {/* Right: Navigation & User */}
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-cyan-500 text-cyan-400 bg-transparent hover:bg-cyan-500 hover:text-white transition-all">
              <Home className="h-5 w-5" />
              Bookings
            </button>
            
            <button className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-blue-500 text-blue-400 bg-blue-500/20 hover:bg-blue-500 hover:text-white transition-all">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </button>
            
            <button className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-green-500 text-green-400 bg-transparent hover:bg-green-500 hover:text-white transition-all">
              <FileText className="h-5 w-5" />
              Reports
            </button>
            
            <button className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white transition-all">
              <Settings className="h-5 w-5" />
              Admin
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

      {/* Page Header - Smaller with Gradient */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 py-4 px-8 shadow-lg">
        <h2 className="text-2xl font-bold text-white">Management of Schemes Features</h2>
        <p className="text-white/90 text-sm">Facilities Manager Dashboard</p>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        
        {/* Top Stats Row - Compact Tiles */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          
          {/* Total Bookings */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90 text-sm font-medium">Total Bookings</p>
              <Calendar className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white text-5xl font-bold">48</p>
          </div>

          {/* Move In/Out */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90 text-sm font-medium">Move In/Out</p>
              <Truck className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white text-5xl font-bold">8</p>
          </div>

          {/* Maintenance */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90 text-sm font-medium">Maintenance</p>
              <Wrench className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white text-5xl font-bold">15</p>
          </div>

          {/* Active Users */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90 text-sm font-medium">Active Users</p>
              <Users className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white text-5xl font-bold">142</p>
          </div>

        </div>

        {/* Section Title */}
        <h3 className="text-white text-xl font-bold mb-4">Feature Modules</h3>

        {/* Feature Cards Grid - 2x2 Layout */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          
          {/* Bookings Module */}
          <div 
            onClick={() => router.push('/facilitiesmanager/bookings')}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-10 h-10 text-white" />
                <div>
                  <h3 className="text-white text-2xl font-bold">Bookings</h3>
                  <p className="text-white/80 text-base">48 total • 12 pending</p>
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-white/60" />
            </div>
            
            <div className="space-y-2">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-base">Tennis Court 1</p>
                  <span className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded">Pending</span>
                </div>
                <p className="text-white/70 text-sm">Sarah Johnson • Today 3:00 PM</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-base">Swimming Pool</p>
                  <span className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded">Confirmed</span>
                </div>
                <p className="text-white/70 text-sm">Mike Brown • Tomorrow 10:00 AM</p>
              </div>
            </div>
          </div>

          {/* Move In/Out Module */}
          <div 
            onClick={() => router.push('/facilitiesmanager/move-in-out')}
            className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-10 h-10 text-white" />
                <div>
                  <h3 className="text-white text-2xl font-bold">Move In/Out</h3>
                  <p className="text-white/80 text-base">8 total • 3 pending</p>
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-white/60" />
            </div>
            
            <div className="space-y-2">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-base">Unit 205 - Move In</p>
                  <span className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded">Approved</span>
                </div>
                <p className="text-white/70 text-sm">John Smith • Dec 15, 2024 9:00 AM</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-base">Unit 108 - Move Out</p>
                  <span className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded">Pending</span>
                </div>
                <p className="text-white/70 text-sm">Emma Davis • Dec 18, 2024 2:00 PM</p>
              </div>
            </div>
          </div>

          {/* Maintenance Module */}
          <div 
            onClick={() => router.push('/facilitiesmanager/maintenance')}
            className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Wrench className="w-10 h-10 text-white" />
                <div>
                  <h3 className="text-white text-2xl font-bold">Maintenance</h3>
                  <p className="text-white/80 text-base">15 total • 6 open</p>
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-white/60" />
            </div>
            
            <div className="space-y-2">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-base">Elevator #2 Issue</p>
                  <span className="text-xs text-white/70 bg-red-500/30 px-2 py-1 rounded">Urgent</span>
                </div>
                <p className="text-white/70 text-sm">Unit 305 • Reported 2 hours ago</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-base">Leaking Pipe</p>
                  <span className="text-xs text-white/70 bg-yellow-500/30 px-2 py-1 rounded">In Progress</span>
                </div>
                <p className="text-white/70 text-sm">Unit 112 • Assigned to Tech #5</p>
              </div>
            </div>
          </div>

          {/* Users Module */}
          <div 
            onClick={() => router.push('/facilitiesmanager/users')}
            className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="w-10 h-10 text-white" />
                <div>
                  <h3 className="text-white text-2xl font-bold">Users</h3>
                  <p className="text-white/80 text-base">156 total • 142 active</p>
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-white/60" />
            </div>
            
            <div className="space-y-2">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-base">New Registrations</p>
                  <span className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded">5 This Week</span>
                </div>
                <p className="text-white/70 text-sm">3 residents • 2 staff members</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-base">Pending Approvals</p>
                  <span className="text-xs text-white/70 bg-yellow-500/30 px-2 py-1 rounded">2 Waiting</span>
                </div>
                <p className="text-white/70 text-sm">Unit 405, Unit 207</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
