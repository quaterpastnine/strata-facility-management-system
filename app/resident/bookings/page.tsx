'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PageLayout, ResidentHeader, PageHeader } from '@/components/resident';

export default function FacilitiesComingSoon() {
  const router = useRouter();

  return (
    <PageLayout>
      <ResidentHeader currentPage="Facilities" />
      
      <PageHeader 
        title="Facilities Booking" 
        subtitle="Book and manage facility reservations"
        icon={Calendar}
        color="blue"
        showBackButton
        backUrl="/resident"
      />

      {/* Coming Soon Content */}
      <div className="px-3 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Animated Icon */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Calendar className="w-16 h-16 text-white" />
            </div>
            <div className="absolute top-0 right-1/2 transform translate-x-24 -translate-y-4">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-24 translate-y-4">
              <Sparkles className="w-6 h-6 text-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>

          {/* Main Message */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Coming Soon!
          </h2>
          
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8">
            Facilities Booking System
          </p>

          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-10 border border-gray-700 mb-8">
            <p className="text-lg sm:text-xl text-gray-300 mb-6">
              We're working hard to bring you an amazing facilities booking experience!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                <Calendar className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">Easy Booking</h3>
                <p className="text-gray-400 text-sm">Book tennis courts, pools, and common areas with just a few clicks</p>
              </div>
              
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                <Clock className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">Real-time Availability</h3>
                <p className="text-gray-400 text-sm">See what's available instantly and avoid conflicts</p>
              </div>
              
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                <Sparkles className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">Manage Bookings</h3>
                <p className="text-gray-400 text-sm">View, modify, or cancel your reservations anytime</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push('/resident')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          {/* Timeline */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-500 text-sm">
              <Clock className="w-4 h-4 inline mr-2" />
              Expected launch: Q1 2025
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
