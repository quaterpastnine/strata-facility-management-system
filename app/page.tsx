'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Building2, Users } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="StrataTrac Logo"
            width={300}
            height={120}
            priority
            className="object-contain mx-auto"
          />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">Strata Facility Management System</h1>
        <p className="text-xl text-gray-400 mb-12">Choose your role to continue</p>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Resident Portal */}
          <div 
            onClick={() => router.push('/resident')}
            className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-12 shadow-2xl cursor-pointer hover:scale-105 transition-all"
          >
            <Users className="w-20 h-20 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-3">Resident</h2>
            <p className="text-white/80 text-lg mb-6">Access your bookings, maintenance requests, and move in/out scheduling</p>
            <button className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all">
              Enter Portal
            </button>
          </div>

          {/* Facilities Manager Portal */}
          <div 
            onClick={() => router.push('/facilitiesmanager')}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-12 shadow-2xl cursor-pointer hover:scale-105 transition-all"
          >
            <Building2 className="w-20 h-20 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-3">Facilities Manager</h2>
            <p className="text-white/80 text-lg mb-6">Manage all bookings, maintenance, users, and facility operations</p>
            <button className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all">
              Enter Portal
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
