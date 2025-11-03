'use client';

import React from 'react';
import { AnimatedCalendarDashboard } from '@/components/dashboard/AnimatedCalendarDashboard';
import { FMHeader } from '@/components/fm/FMHeader';

export default function FacilitiesManagerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-x-hidden">
      
      {/* Background Image */}
      <div 
        className="fixed inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/background.jpg")',
          zIndex: 0
        }}
      />
      
      {/* Header */}
      <div className="relative z-10">
        <FMHeader currentPage="Dashboard" />
      </div>
      
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #00D9FF 1px, transparent 1px),
            linear-gradient(to bottom, #00D9FF 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Main Dashboard Content */}
      <div className="relative z-10">
        <AnimatedCalendarDashboard />
      </div>
    </div>
  );
}
