'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Home, LogOut, Menu, X, Wrench, Truck } from 'lucide-react';

interface FMHeaderProps {
  currentPage?: string;
  showBackButton?: boolean;
  backUrl?: string;
  actions?: React.ReactNode;
}

export function FMHeader({ 
  currentPage = 'Facilities Manager',
  showBackButton = false,
  backUrl = '/facilitiesmanager',
  actions
}: FMHeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#001F3F] border-b-2 border-orange-500/30 shadow-xl">
      <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 flex items-center justify-between">
        
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full md:w-auto">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-orange-400 hover:bg-orange-500/20 transition-all"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1 md:flex-none">
            <Image
              src="/logo.png"
              alt="StrataTrac Logo"
              width={180}
              height={72}
              priority
              className="object-contain w-32 h-auto sm:w-44 md:w-56"
            />
            <div className="hidden sm:block border-l border-orange-500/30 pl-3 sm:pl-4 md:pl-6">
              <p className="text-orange-400 text-sm sm:text-lg md:text-xl font-semibold">Strata Management Solutions</p>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base">{currentPage}</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => router.push('/facilitiesmanager')}
            className={`inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 transition-all ${
              currentPage === 'Dashboard'
                ? 'border-orange-500 bg-orange-500 text-white'
                : 'border-orange-500 text-orange-400 bg-transparent hover:bg-orange-500 hover:text-white'
            }`}
          >
            <Home className="h-5 w-5" />
            Dashboard
          </button>

          <button 
            onClick={() => router.push('/facilitiesmanager/maintenance')}
            className={`inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 transition-all ${
              currentPage === 'Maintenance'
                ? 'border-cyan-500 bg-cyan-500 text-white'
                : 'border-cyan-500 text-cyan-400 bg-transparent hover:bg-cyan-500 hover:text-white'
            }`}
          >
            <Wrench className="h-5 w-5" />
            Maintenance
          </button>

          <button 
            onClick={() => router.push('/facilitiesmanager/move-requests')}
            className={`inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 transition-all ${
              currentPage === 'Move Requests'
                ? 'border-purple-500 bg-purple-500 text-white'
                : 'border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white'
            }`}
          >
            <Truck className="h-5 w-5" />
            Move Requests
          </button>

          {actions}

          <div className="flex items-center gap-4 pl-6 ml-6 border-l border-orange-500/30">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-400 flex-shrink-0 bg-gray-700">
              <Image
                src="/fmavatar.jpg"
                alt="FM Avatar"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 35%' }}
              />
            </div>
            <div className="text-right">
              <div className="font-semibold text-white text-lg">Facilities Manager</div>
              <div className="text-base text-orange-400">Sarah Johnson</div>
            </div>
          </div>

          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-red-500 text-red-400 bg-transparent hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>

        <div className="md:hidden">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-orange-400 flex-shrink-0 bg-gray-700">
            <Image
              src="/fmavatar.jpg"
              alt="FM Avatar"
              width={48}
              height={48}
              className="object-cover w-full h-full"
              style={{ objectPosition: 'center 35%' }}
            />
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#001F3F] border-t border-orange-500/30 px-3 py-4 space-y-2">
          <button 
            onClick={() => router.push('/facilitiesmanager')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium border-2 border-orange-500 text-orange-400 bg-transparent hover:bg-orange-500 hover:text-white transition-all"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </button>

          <button 
            onClick={() => router.push('/facilitiesmanager/maintenance')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium border-2 border-cyan-500 text-cyan-400 bg-transparent hover:bg-cyan-500 hover:text-white transition-all"
          >
            <Wrench className="h-5 w-5" />
            Maintenance
          </button>

          <button 
            onClick={() => router.push('/facilitiesmanager/move-requests')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium border-2 border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white transition-all"
          >
            <Truck className="h-5 w-5" />
            Move Requests
          </button>

          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-400 flex-shrink-0 bg-gray-700">
              <Image
                src="/fmavatar.jpg"
                alt="FM Avatar"
                width={40}
                height={40}
                className="object-cover w-full h-full"
                style={{ objectPosition: 'center 35%' }}
              />
            </div>
            <div>
              <div className="font-semibold text-white text-base">Facilities Manager</div>
              <div className="text-sm text-orange-400">Sarah Johnson</div>
            </div>
          </div>

          <button 
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium border-2 border-red-500 text-red-400 bg-transparent hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
