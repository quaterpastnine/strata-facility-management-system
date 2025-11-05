'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Users, Truck, Shield, Building2 } from 'lucide-react';
import { FMHeader } from '@/components/fm/FMHeader';
import { motion } from 'framer-motion';

export default function CommunicationsPage() {
  const router = useRouter();

  const communicationChannels = [
    {
      title: 'Residents',
      icon: Users,
      color: 'from-blue-500 via-blue-600 to-cyan-500',
      route: '/facilitiesmanager/communications/residents',
      description: 'Communicate with building residents'
    },
    {
      title: 'Suppliers',
      icon: Truck,
      color: 'from-purple-500 via-purple-600 to-pink-500',
      route: '/facilitiesmanager/communications/suppliers',
      description: 'Manage supplier communications'
    },
    {
      title: 'Council of Owners',
      icon: Shield,
      color: 'from-orange-500 via-orange-600 to-red-500',
      route: '/facilitiesmanager/communications/council',
      description: 'Connect with council members'
    },
    {
      title: 'Strata Manager',
      icon: Building2,
      color: 'from-emerald-500 via-emerald-600 to-teal-500',
      route: '/facilitiesmanager/communications/manager',
      description: 'Contact strata management'
    }
  ];

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
        <FMHeader currentPage="Communications" />
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

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Page Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Communications Hub
          </h1>
          <p className="text-gray-300 text-lg">
            Select a communication channel to get started
          </p>
        </motion.div>

        {/* Communication Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {communicationChannels.map((channel, idx) => {
            const Icon = channel.icon;
            return (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(channel.route)}
                className={`
                  bg-gradient-to-br ${channel.color} 
                  rounded-3xl p-8 text-white shadow-2xl 
                  hover:shadow-3xl transition-all duration-300 
                  relative overflow-hidden group cursor-pointer
                  border-2 border-white/20
                `}
              >
                {/* Animated Background Effect */}
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Shine Effect on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center gap-6">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl"
                  >
                    <Icon className="w-12 h-12" strokeWidth={2} />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{channel.title}</h2>
                    <p className="text-white/80 text-sm">{channel.description}</p>
                  </div>

                  {/* Arrow Icon */}
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    <svg 
                      className="w-8 h-8" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-3">
            <p className="text-gray-300 text-sm">
              💡 <span className="font-semibold text-cyan-400">Note:</span> Individual communication pages will be available soon
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
