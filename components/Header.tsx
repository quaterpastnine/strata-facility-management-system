'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Home, LogOut, Menu, X } from 'lucide-react';

interface HeaderProps {
  residentName?: string;
  residentUnit?: string;
  residentInitials?: string;
  currentPage?: 'dashboard' | 'facilities' | 'maintenance' | 'other';
  showNavigation?: boolean;
  subtitle?: string;
}

export default function Header({
  residentName = 'Guest',
  residentUnit = '',
  residentInitials = 'GU',
  currentPage = 'other',
  showNavigation = true,
  subtitle = 'Resident Portal'
}: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#001F3F] border-b-2 border-cyan-500/30 shadow-xl">
      <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full md:w-auto">
          {showNavigation && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-all"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}

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
              <p className="text-cyan-400 text-sm sm:text-lg md:text-xl font-semibold">
                Strata Management Solutions
              </p>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        {showNavigation && (
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => router.push('/resident')}
              className={`inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 transition-all ${
                currentPage === 'dashboard'
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-500/20'
                  : 'border-cyan-500 text-cyan-400 bg-transparent hover:bg-cyan-500 hover:text-white'
              }`}
            >
              <Home className="h-5 w-5" />
              Dashboard
            </button>

            {/* User Info */}
            <div className="flex items-center gap-4 pl-6 ml-6 border-l border-cyan-500/30">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center border-2 border-cyan-400">
                <span className="text-white font-bold text-lg">{residentInitials}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white text-lg">{residentName}</div>
                <div className="text-base text-cyan-400">{residentUnit}</div>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-lg font-medium border-2 border-red-500 text-red-400 bg-transparent hover:bg-red-500 hover:text-white transition-all">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        )}

        {/* Mobile User Avatar */}
        {showNavigation && (
          <div className="md:hidden">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center border-2 border-cyan-400">
              <span className="text-white font-bold text-sm sm:text-base">{residentInitials}</span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && showNavigation && (
        <div className="md:hidden bg-[#001F3F] border-t border-cyan-500/30 px-3 py-4 space-y-2">
          <button 
            onClick={() => {
              router.push('/resident');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium border-2 border-cyan-500 text-cyan-400 bg-transparent hover:bg-cyan-500 hover:text-white transition-all"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </button>

          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center border-2 border-cyan-400">
              <span className="text-white font-bold text-sm">{residentInitials}</span>
            </div>
            <div>
              <div className="font-semibold text-white text-base">{residentName}</div>
              <div className="text-sm text-cyan-400">{residentUnit}</div>
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
