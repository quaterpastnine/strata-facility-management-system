'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Home, LogOut, Menu, X } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

interface ResidentHeaderProps {
  currentPage?: string;
  showBackButton?: boolean;
  backUrl?: string;
  actions?: React.ReactNode;
}

export function ResidentHeader({ 
  currentPage = 'Resident Portal',
  showBackButton = false,
  backUrl = '/resident',
  actions
}: ResidentHeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { residentData } = useData();

  return (
    <div className="bg-[#001F3F] border-b-2 border-cyan-500/30 shadow-xl">
      <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 flex items-center justify-between">
        
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full md:w-auto">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-all"
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
            <div className="hidden sm:block border-l border-cyan-500/30 pl-3 sm:pl-4 md:pl-6">
              <p className="text-cyan-400 text-sm sm:text-lg md:text-xl font-semibold">Strata Management Solutions</p>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base">{currentPage}</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => router.push('/resident')}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-cyan-500 text-cyan-400 bg-transparent hover:bg-cyan-500 hover:text-white transition-all"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </button>

          {actions}

          <div className="flex items-center gap-4 pl-6 ml-6 border-l border-cyan-500/30">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center border-2 border-cyan-400">
              <span className="text-white font-bold text-lg">{residentData?.initials || 'JD'}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-white text-lg">{residentData?.name || 'Loading...'}</div>
              <div className="text-base text-cyan-400">{residentData?.unit || ''}</div>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-red-500 text-red-400 bg-transparent hover:bg-red-500 hover:text-white transition-all">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>

        <div className="md:hidden">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center border-2 border-cyan-400">
            <span className="text-white font-bold text-sm sm:text-base">{residentData?.initials || 'JD'}</span>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#001F3F] border-t border-cyan-500/30 px-3 py-4 space-y-2">
          <button 
            onClick={() => router.push('/resident')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium border-2 border-cyan-500 text-cyan-400 bg-transparent hover:bg-cyan-500 hover:text-white transition-all"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </button>

          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center border-2 border-cyan-400">
              <span className="text-white font-bold text-sm">{residentData?.initials || 'JD'}</span>
            </div>
            <div>
              <div className="font-semibold text-white text-base">{residentData?.name || 'Loading...'}</div>
              <div className="text-sm text-cyan-400">{residentData?.unit || ''}</div>
            </div>
          </div>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium border-2 border-red-500 text-red-400 bg-transparent hover:bg-red-500 hover:text-white transition-all">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
