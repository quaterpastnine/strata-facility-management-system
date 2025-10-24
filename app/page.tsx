'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Building2, Users, ArrowRight, Quote } from 'lucide-react';
import { getQuoteOfTheDay } from '@/lib/quotes';

export default function LandingPage() {
  const router = useRouter();
  const quote = getQuoteOfTheDay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-3 sm:p-6">
      <div className="text-center max-w-6xl mx-auto w-full">
        {/* Logo */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <Image
            src="/logo.png"
            alt="StrataTrac Logo"
            width={300}
            height={120}
            priority
            className="object-contain mx-auto w-40 h-auto sm:w-56 md:w-72 lg:w-80"
          />
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4 px-2">
          Strata Facility Management
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 md:mb-10 px-2">
          Choose your role to continue
        </p>

        {/* Quote of the Day - C.S. Lewis */}
        <div className="mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-4">
          <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3 sm:gap-4">
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 flex-shrink-0 mt-1" />
              <div className="flex-1 text-left">
                <p className="text-amber-50 text-sm sm:text-base md:text-lg leading-relaxed mb-2 italic">
                  "{quote}"
                </p>
                <p className="text-amber-400/80 text-xs sm:text-sm font-semibold">
                  — C.S. Lewis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Selection Cards - Mobile: Stack vertically with large touch targets */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full max-w-5xl mx-auto px-2">
          
          {/* Resident Portal */}
          <button
            onClick={() => router.push('/resident')}
            className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all transform w-full text-left"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 rounded-full p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Resident
              </h2>
              
              <p className="text-white/90 text-base sm:text-lg md:text-xl mb-5 sm:mb-6 leading-relaxed px-2">
                Access your bookings, maintenance requests, and move in/out scheduling
              </p>
              
              <div className="flex items-center gap-2 sm:gap-3 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 md:px-10 rounded-xl text-base sm:text-lg md:text-xl transition-all">
                Enter Portal
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </button>

          {/* Facilities Manager Portal */}
          <button
            onClick={() => router.push('/facilitiesmanager')}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all transform w-full text-left"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 rounded-full p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                <Building2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Facilities Manager
              </h2>
              
              <p className="text-white/90 text-base sm:text-lg md:text-xl mb-5 sm:mb-6 leading-relaxed px-2">
                Manage all bookings, maintenance, users, and facility operations
              </p>
              
              <div className="flex items-center gap-2 sm:gap-3 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 md:px-10 rounded-xl text-base sm:text-lg md:text-xl transition-all">
                Enter Portal
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </button>

        </div>

        {/* Footer text */}
        <p className="text-gray-500 text-xs sm:text-sm mt-8 sm:mt-10 md:mt-12 px-4">
          Professional Property Solutions • Powered by BCMTrac
        </p>
      </div>
    </div>
  );
}
