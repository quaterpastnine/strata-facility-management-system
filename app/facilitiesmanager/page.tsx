'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Wrench, 
  Users, 
  Building2,
  ArrowUpDown,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react';

export default function FacilitiesManagerDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Orange Header */}
      <div className="bg-orange-500 py-6 px-8">
        <h1 className="text-white text-2xl font-semibold">Facility Manager Dashboard</h1>
      </div>

      {/* Hero Image Section */}
      <div className="relative h-64 bg-gray-800">
        <img 
          src="/api/placeholder/1920/400" 
          alt="Building exterior" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 -mt-32 relative z-10">
        {/* Stats Cards Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Facilities Card */}
          <div className="bg-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-12 h-12" />
            </div>
            <div className="text-4xl font-bold mb-2">2</div>
            <div className="text-blue-100">Total bookings</div>
          </div>

          {/* Pending Card */}
          <div className="bg-orange-500 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <SettingsIcon className="w-12 h-12" />
            </div>
            <div className="text-4xl font-bold mb-2">1</div>
            <div className="text-orange-100">Awaiting approval</div>
          </div>

          {/* Move Requests Card */}
          <div className="bg-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Building2 className="w-12 h-12" />
            </div>
            <div className="text-4xl font-bold mb-2">1</div>
            <div className="text-orange-100">Active</div>
          </div>

          {/* Maintenance Card */}
          <div className="bg-teal-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Wrench className="w-12 h-12" />
            </div>
            <div className="text-4xl font-bold mb-2">3</div>
            <div className="text-teal-100">Tickets</div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-white text-2xl font-semibold mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-3 gap-6">
            {/* Move In/Out Card */}
            <div 
              onClick={() => router.push('/facilitiesmanager/moveinout')}
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <ArrowUpDown className="w-10 h-10 mb-3" />
                  <h3 className="text-2xl font-bold mb-2">Move In/Out</h3>
                  <p className="text-orange-100 text-sm">Elevator Booking</p>
                </div>
                <ChevronRight className="w-6 h-6" />
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Move In - Auto Spin Door</span>
                    <span className="bg-green-500/80 px-2 py-1 rounded text-xs">Approved</span>
                  </div>
                  <div className="text-xs text-orange-100">Nov 28, 2024 • 9:00 AM</div>
                </div>
              </div>
              
              <button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded font-medium transition-colors">
                New Request
              </button>
            </div>

            {/* Maintenance Card */}
            <div 
              onClick={() => router.push('/facilitiesmanager/maintenance')}
              className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg p-6 text-white cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Wrench className="w-10 h-10 mb-3" />
                  <h3 className="text-2xl font-bold mb-2">Maintenance</h3>
                  <p className="text-teal-100 text-sm">Report Issues</p>
                </div>
                <ChevronRight className="w-6 h-6" />
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">AC Not Working</span>
                    <span className="bg-yellow-500/80 px-2 py-1 rounded text-xs">In Progress</span>
                  </div>
                  <div className="text-xs text-teal-100">Dec 19, 2024 • Tech #3</div>
                </div>
              </div>
              
              <button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded font-medium transition-colors">
                New Ticket
              </button>
            </div>

            {/* Facilities Card */}
            <div 
              onClick={() => router.push('/facilitiesmanager/facilities')}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Calendar className="w-10 h-10 mb-3" />
                  <h3 className="text-2xl font-bold mb-2">Facilities</h3>
                  <p className="text-blue-100 text-sm">Book Amenities</p>
                </div>
                <ChevronRight className="w-6 h-6" />
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Tennis Court 1</span>
                    <span className="bg-green-500/80 px-2 py-1 rounded text-xs">Confirmed</span>
                  </div>
                  <div className="text-xs text-blue-100">Dec 15, 2024 • 3:00 PM</div>
                </div>
              </div>
              
              <button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded font-medium transition-colors">
                View Facilities
              </button>
            </div>
          </div>
        </div>

        {/* My Activity History */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <SettingsIcon className="w-6 h-6 text-white mr-3" />
            <h2 className="text-white text-xl font-semibold">My Activity History</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-700/50 rounded p-4">
              <div className="flex items-center space-x-4">
                <Calendar className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="text-white font-medium">Tennis Court 1</div>
                  <div className="text-gray-400 text-sm">Dec 15, 2024 • 3:00 PM</div>
                </div>
              </div>
              <div>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm">Confirmed</span>
                <ChevronRight className="w-5 h-5 text-gray-400 inline ml-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
