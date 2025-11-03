'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Wrench, 
  Truck,
  ChevronRight,
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  MessageSquare,
  Send,
  User
} from 'lucide-react';
import { PageLayout, ResidentHeader } from '@/components/resident';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import type { ActivityItem } from '@/lib/types';

// Comment Interface for two-way communication between Resident and FM
interface Comment {
  id: string;
  author: 'resident' | 'fm';
  message: string;
  timestamp: string;
  itemId: string;
  itemType: 'maintenance' | 'move';
}

export default function ResidentDashboard() {
  const router = useRouter();
  const { residentData, tickets, moveRequests, bookings, activityHistory, isLoading } = useData();
  
  // Comment state - in production this would come from backend
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'fm',
      message: 'Assigned to Tech #3 - John Smith. Work scheduled for tomorrow 2PM.',
      timestamp: '2 hours ago',
      itemId: '1',
      itemType: 'maintenance'
    },
    {
      id: '2',
      author: 'fm',
      message: 'Approved for 2025-01-15. Elevator reserved from 9AM-12PM. Please ensure all items are packed.',
      timestamp: '4 hours ago',
      itemId: '1',
      itemType: 'move'
    }
  ]);

  if (isLoading) {
    return (
      <PageLayout>
        <ResidentHeader currentPage="Dashboard" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  // Calculate stats from actual data - ONLY ACTIVE ITEMS
  const maintenanceActive = tickets?.filter(t => 
    t.status !== 'Completed' && t.status !== 'Rejected' && t.status !== 'Cancelled'
  ) || [];
  const maintenanceCount = maintenanceActive.length;
  const maintenancePending = tickets?.filter(t => t.status === 'Pending').length || 0;
  const maintenanceInProgress = tickets?.filter(t => t.status === 'In Progress' || t.status === 'Open').length || 0;
  
  const moveRequestsActive = moveRequests?.filter(m => 
    m.status !== 'Completed' && m.status !== 'Rejected' && m.status !== 'Cancelled'
  ) || [];
  const moveRequestsCount = moveRequestsActive.length;
  const moveRequestsPending = moveRequests?.filter(m => m.status === 'Pending').length || 0;
  const moveRequestsApproved = moveRequests?.filter(m => m.status === 'Approved' || m.status === 'In Progress').length || 0;

  // Handle activity click - properly typed
  const handleActivityClick = (activity: ActivityItem) => {
    if (activity.type === 'maintenance' && activity.referenceId) {
      router.push(`/resident/maintenance/${activity.referenceId}`);
    } else if (activity.type === 'maintenance') {
      router.push('/resident/maintenance');
    } else if (activity.type === 'move' && activity.referenceId) {
      router.push(`/resident/move-requests/${activity.referenceId}`);
    } else if (activity.type === 'move') {
      router.push('/resident/move-requests');
    } else if (activity.type === 'booking') {
      router.push('/resident/bookings');
    }
  };

  return (
    <PageLayout>
      <ResidentHeader currentPage="Dashboard" />

      {/* Main Content - FULL WIDTH */}
      <div className="px-2 sm:px-3 md:px-4 py-4">
        
        {/* Welcome Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-6 h-6 text-cyan-400" />
            <h1 className="text-white text-2xl font-bold">Welcome, {residentData?.name || 'Resident'}</h1>
          </div>
          <p className="text-gray-300 text-base">{residentData?.unit || 'Unit 101'}</p>
        </motion.div>

        {/* FM Notifications Bar - SOLID BACKGROUND for better visibility */}
        <motion.div 
          className="mb-6 bg-gradient-to-r from-emerald-800 to-emerald-900 border-2 border-emerald-400 rounded-lg p-4 shadow-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-cyan-300 animate-pulse" />
            <h3 className="text-white font-bold text-lg">Facilities Manager Updates</h3>
          </div>
          
          {/* Filter for items with FM comments or status changes */}
          {(() => {
            // Get items with FM updates
            const maintenanceWithFMUpdates = maintenanceActive.filter(t => 
              t.status === 'In Progress' || 
              t.status === 'Open' ||
              t.assignedTo
            ).slice(0, 2);
            
            const moveWithFMUpdates = moveRequestsActive.filter(m => 
              m.status === 'Approved' || 
              m.status === 'In Progress'
            ).slice(0, 2);
            
            // Map to display format with comments
            const allFMUpdates = [
              ...maintenanceWithFMUpdates.map(t => {
                const comment = comments.find(c => c.itemId === t.id && c.itemType === 'maintenance');
                return {
                  type: 'maintenance',
                  id: t.id,
                  title: t.title,
                  status: t.status,
                  message: comment?.message || `FM: ${t.assignedTo ? `Assigned to ${t.assignedTo}` : 'Work scheduled'}`,
                  timestamp: comment?.timestamp || '1 hour ago',
                  hasNewComment: true
                };
              }),
              ...moveWithFMUpdates.map(m => {
                const comment = comments.find(c => c.itemId === m.id && c.itemType === 'move');
                return {
                  type: 'move',
                  id: m.id,
                  title: `${m.moveType} Request`,
                  status: m.status,
                  message: comment?.message || `FM: Approved for ${m.moveDate}`,
                  timestamp: comment?.timestamp || '2 hours ago',
                  hasNewComment: true
                };
              })
            ];
            
            if (allFMUpdates.length === 0) {
              return (
                <div className="text-gray-300 text-sm bg-black/20 rounded p-3">
                  No new updates from Facilities Manager
                </div>
              );
            }
            
            return (
              <div className="space-y-2">
                {allFMUpdates.map((update, idx) => (
                  <motion.div
                    key={`${update.type}-${update.id}`}
                    className="flex items-center justify-between bg-gray-900 rounded-lg p-3 border border-cyan-500"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {update.type === 'maintenance' ? (
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Wrench className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-semibold">{update.title}</span>
                          {update.hasNewComment && (
                            <span className="bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                          )}
                        </div>
                        <div className="text-cyan-200 text-sm mt-1 font-medium">
                          <MessageSquare className="w-3 h-3 inline mr-1" />
                          {update.message}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">{update.timestamp}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/resident/${update.type === 'maintenance' ? 'maintenance' : 'move-requests'}/${update.id}`)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-1 transition-all"
                    >
                      View <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            );
          })()}
        </motion.div>

        {/* Three Main Tiles - Keep at 3 for proper layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-4 mb-6">
          
          {/* Move In/Move Out Tile */}
          <motion.button
            onClick={() => router.push('/resident/move-requests')}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white cursor-pointer hover:from-orange-400 hover:to-orange-500 transition-all shadow-xl text-left border-2 border-orange-400 min-h-[240px] flex flex-col"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Truck className="w-14 h-14 text-white drop-shadow-lg" />
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Move In/Move Out</h3>
              <div className="text-4xl font-bold mb-2">
                {moveRequestsCount}
              </div>
              <div className="text-base text-orange-100">Active Requests</div>
            </div>
            {/* Status indicator with solid background */}
            {moveRequestsPending > 0 && (
              <div className="text-sm text-white mt-3 flex items-center gap-2 bg-orange-700 rounded-lg p-2">
                <Clock className="w-4 h-4" />
                {moveRequestsPending} pending FM review
              </div>
            )}
            {moveRequestsApproved > 0 && moveRequestsPending === 0 && (
              <div className="text-sm text-white mt-3 flex items-center gap-2 bg-green-600 rounded-lg p-2">
                <CheckCircle className="w-4 h-4" />
                {moveRequestsApproved} approved
              </div>
            )}
          </motion.button>

          {/* Maintenance Tile */}
          <motion.button
            onClick={() => router.push('/resident/maintenance')}
            className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white cursor-pointer hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-xl text-left border-2 border-emerald-400 min-h-[240px] flex flex-col"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Wrench className="w-14 h-14 text-white drop-shadow-lg" />
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Maintenance</h3>
              <div className="text-4xl font-bold mb-2">
                {maintenanceCount}
              </div>
              <div className="text-base text-emerald-100">Active Tickets</div>
            </div>
            {/* Status indicator with solid background */}
            {maintenanceInProgress > 0 && (
              <div className="text-sm text-white mt-3 flex items-center gap-2 bg-yellow-600 rounded-lg p-2">
                <AlertCircle className="w-4 h-4" />
                {maintenanceInProgress} in progress
              </div>
            )}
            {maintenancePending > 0 && maintenanceInProgress === 0 && (
              <div className="text-sm text-white mt-3 flex items-center gap-2 bg-emerald-800 rounded-lg p-2">
                <Clock className="w-4 h-4" />
                {maintenancePending} pending FM review
              </div>
            )}
          </motion.button>

          {/* Facilities Booking Tile - Coming Soon */}
          <motion.div
            className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-6 text-white cursor-not-allowed shadow-xl text-left border-2 border-gray-500 min-h-[240px] flex flex-col opacity-75"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.75, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-14 h-14 text-gray-400" />
              <Lock className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Facility Bookings</h3>
              <div className="text-3xl font-semibold mb-2 text-gray-300">
                Coming Soon
              </div>
              <div className="text-base text-gray-400">Book amenities & facilities</div>
            </div>
            <div className="text-sm text-gray-300 mt-3 bg-gray-800 rounded-lg p-2">
              Currently under development
            </div>
          </motion.div>
        </div>

        {/* Activity History and Stats Section - Full Width */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          
          {/* Recent Activity */}
          <motion.div 
          className="bg-gray-900 rounded-xl border-2 border-gray-700 p-5 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-white text-lg font-bold">Recent Activity</h2>
          </div>
          
          {activityHistory && activityHistory.length > 0 ? (
            <div className="space-y-2">
              {activityHistory.slice(0, 5).map((activity, idx) => (
                <motion.button
                  key={activity.id}
                  onClick={() => handleActivityClick(activity)}
                  className="w-full flex items-center justify-between bg-gray-800 rounded-lg p-3 border border-gray-600 hover:bg-gray-700 hover:border-cyan-500 transition-all cursor-pointer text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon with solid background */}
                    {activity.type === 'maintenance' && (
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {activity.type === 'move' && (
                      <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {activity.type === 'booking' && (
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">{activity.title}</span>
                        {/* Show comment indicator for items with FM responses */}
                        {(activity.status === 'In Progress' || activity.status === 'Approved') && (
                          <span className="bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            FM Reply
                          </span>
                        )}
                      </div>
                      <div className="text-gray-400 text-xs">{activity.date}{activity.time ? ` • ${activity.time}` : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      activity.status === 'Completed' ? 'bg-green-600 text-white' :
                      activity.status === 'In Progress' ? 'bg-yellow-600 text-white' :
                      activity.status === 'Pending' ? 'bg-orange-600 text-white' :
                      activity.status === 'Approved' ? 'bg-green-600 text-white' :
                      activity.status === 'Confirmed' ? 'bg-blue-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {activity.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-6 text-sm bg-gray-800 rounded-lg">
              No recent activity
            </div>
          )}
          </motion.div>
          
          {/* Quick Stats Panel */}
          <motion.div
            className="bg-gray-900 rounded-xl border-2 border-gray-700 p-5 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-cyan-400" />
              <h2 className="text-white text-lg font-bold">Quick Overview</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Pending Items */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="text-yellow-400 text-3xl font-bold mb-2">
                  {maintenancePending + moveRequestsPending}
                </div>
                <div className="text-gray-300 text-sm font-semibold">Total Pending</div>
                <div className="text-gray-400 text-xs mt-1">Awaiting FM review</div>
              </div>
              
              {/* In Progress Items */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="text-orange-400 text-3xl font-bold mb-2">
                  {maintenanceInProgress + moveRequestsApproved}
                </div>
                <div className="text-gray-300 text-sm font-semibold">In Progress</div>
                <div className="text-gray-400 text-xs mt-1">Being worked on</div>
              </div>
              
              {/* Response Time */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="text-green-400 text-3xl font-bold mb-2">
                  &lt;24h
                </div>
                <div className="text-gray-300 text-sm font-semibold">Avg Response</div>
                <div className="text-gray-400 text-xs mt-1">FM response time</div>
              </div>
              
              {/* Satisfaction */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="text-cyan-400 text-3xl font-bold mb-2">
                  98%
                </div>
                <div className="text-gray-300 text-sm font-semibold">Satisfaction</div>
                <div className="text-gray-400 text-xs mt-1">Resident rating</div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => router.push('/resident/maintenance/new')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Wrench className="w-5 h-5" />
                Report Maintenance Issue
              </button>
              <button
                onClick={() => router.push('/resident/move-requests/new')}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Truck className="w-5 h-5" />
                Schedule Move
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </PageLayout>
  );
}
