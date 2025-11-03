'use client';

import { useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Truck, 
  Calendar, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  MessageSquare,
  ChevronLeft,
  Save,
  UserCheck,
  TrendingUp,
  XCircle,
  Edit,
  Send,
  DollarSign,
  CreditCard,
  Banknote,
  Shield,
  Building2
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { type MoveRequest, type MoveStatus, type CashReceipt } from '@/lib/types';
import { motion } from 'framer-motion';
import { CashReceiptModal } from '@/components/fm/CashReceiptModal';
import { FMHeader } from '@/components/fm/FMHeader';

export default function FMMoveRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const moveId = params.id as string;
  const { 
    moveRequests, 
    updateMoveRequest, 
    getComments, 
    addComment, 
    markCommentsAsRead, 
    isLoading,
    setDepositInstructions,
    verifyDepositReceived,
    createCashReceipt
  } = useData();
  
  // State for approval modal
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [depositMethod, setDepositMethod] = useState<'bank' | 'cash'>('bank');
  const [depositAmount, setDepositAmount] = useState('');
  
  // State for cash receipt modal
  const [showCashReceiptModal, setShowCashReceiptModal] = useState(false);
  const [bankDetails, setBankDetails] = useState('');
  const [cashDate, setCashDate] = useState('');
  const [commentText, setCommentText] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Find the specific move request
  const moveRequest = useMemo(() => {
    return moveRequests?.find(m => m.id === moveId) || null;
  }, [moveRequests, moveId]);

  // Get comments for this move request
  const comments = useMemo(() => {
    if (!moveRequest) return [];
    return getComments(moveRequest.id, 'move');
  }, [moveRequest, getComments]);

  // Mark comments as read when page loads
  useMemo(() => {
    if (moveRequest) {
      markCommentsAsRead(moveRequest.id, 'move');
    }
  }, [moveRequest, markCommentsAsRead]);

  const handleApprove = () => {
    setShowApprovalModal(true);
  };

  const handleSubmitApproval = () => {
    if (!moveRequest) return;
    
    // Validate inputs
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid deposit amount');
      return;
    }
    
    if (depositMethod === 'bank' && !bankDetails.trim()) {
      alert('Please enter bank details');
      return;
    }
    
    if (depositMethod === 'cash' && !cashDate) {
      alert('Please select a cash payment appointment date');
      return;
    }
    
    setProcessing(true);
    
    try {
      // Set deposit instructions using context function
      setDepositInstructions(
        moveRequest.id,
        depositMethod,
        parseFloat(depositAmount),
        depositMethod === 'bank' ? bankDetails : undefined,
        depositMethod === 'cash' ? cashDate : undefined
      );
      
      setShowApprovalModal(false);
      setDepositAmount('');
      setBankDetails('');
      setCashDate('');
      alert('Move request approved and deposit instructions sent!');
    } catch (error) {
      console.error('Error approving move request:', error);
      alert('Error processing approval. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = () => {
    if (!moveRequest) return;
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    updateMoveRequest(moveRequest.id, { 
      status: 'Rejected', 
      rejectionReason: reason,
      completedDate: new Date().toISOString().split('T')[0]
    });
    addComment(moveRequest.id, 'move', `Rejected: ${reason}`, 'fm');
    router.push('/facilitiesmanager');
  };

  const handleVerifyPayment = () => {
    if (!moveRequest) return;
    
    const confirm = window.confirm('Confirm that you have received the deposit payment?');
    if (!confirm) return;
    
    setProcessing(true);
    try {
      verifyDepositReceived(moveRequest.id);
      alert('Payment verified! Resident will now select insurance option.');
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Error verifying payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleAddComment = () => {
    if (!moveRequest || !commentText.trim()) return;
    
    addComment(moveRequest.id, 'move', commentText, 'fm');
    setCommentText('');
  };
  
  // NEW: Handle cash receipt creation
  const handleCashReceiptSave = (receipt: Omit<CashReceipt, 'id' | 'createdAt' | 'createdBy'>) => {
    createCashReceipt(receipt);
    setShowCashReceiptModal(false);
    alert('Cash receipt created and payment verified! Resident will now select insurance option.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <FMHeader currentPage="Move Requests" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Loading move request details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!moveRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <FMHeader currentPage="Move Requests" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Move Request Not Found</h2>
            <p className="text-gray-400 mb-6 text-base">Move Request ID: {moveId}</p>
            <button
              onClick={() => router.push('/facilitiesmanager')}
              className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-all text-base"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: MoveStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Approved': return 'bg-blue-500';
      case 'Deposit Pending': return 'bg-orange-400';
      case 'Payment Claimed': return 'bg-purple-500';
      case 'Deposit Verified': return 'bg-teal-500';
      case 'Fully Approved': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-600';
      case 'Completed': return 'bg-green-600';
      case 'Rejected': return 'bg-red-500';
      case 'Cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

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
      
      {/* Content */}
      <div className="relative z-10">
        <FMHeader currentPage="Move Requests" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-6 px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/facilitiesmanager')}
            className="flex items-center gap-2 text-white hover:text-orange-100 transition-colors mb-4 text-base"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl font-bold">{moveRequest.moveType} Request</h1>
                <p className="text-orange-100 text-base">Move Request #{moveRequest.id} - {moveRequest.residentUnit}</p>
              </div>
            </div>
            <div className={`${getStatusColor(moveRequest.status)} text-white px-6 py-3 rounded-xl font-bold text-lg`}>
              {moveRequest.status}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Request Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Deposit Workflow Section */}
            {moveRequest.status !== 'Pending' && moveRequest.status !== 'Rejected' && moveRequest.status !== 'Cancelled' && (
              <motion.div 
                className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-cyan-500/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-cyan-400" />
                  Deposit Workflow Status
                </h2>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    {['Approved', 'Deposit Pending', 'Payment Claimed', 'Deposit Verified', 'Fully Approved'].map((step, idx) => {
                      const stepStatuses = ['Approved', 'Deposit Pending', 'Payment Claimed', 'Deposit Verified', 'Fully Approved'];
                      const currentIndex = stepStatuses.indexOf(moveRequest.status);
                      const isActive = idx <= currentIndex;
                      const isCurrent = idx === currentIndex;
                      
                      return (
                        <div key={step} className="flex flex-col items-center flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-cyan-500' : 'bg-gray-600'
                          } ${isCurrent ? 'ring-4 ring-cyan-300' : ''}`}>
                            {isActive && <CheckCircle className="w-6 h-6 text-white" />}
                          </div>
                          <p className={`text-sm mt-2 text-center ${isActive ? 'text-cyan-300 font-semibold' : 'text-gray-500'}`}>
                            {step.replace('Deposit ', '')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Deposit Instructions (if sent) */}
                {moveRequest.depositPaymentMethod && (
                  <div className="bg-gray-800/50 rounded-xl p-5 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      {moveRequest.depositPaymentMethod === 'bank' ? (
                        <Building2 className="w-6 h-6 text-cyan-400" />
                      ) : (
                        <Banknote className="w-6 h-6 text-green-400" />
                      )}
                      <h3 className="text-white font-bold text-lg">Deposit Instructions Sent</h3>
                    </div>
                    <div className="space-y-2 text-gray-300 text-base">
                      <p><span className="text-gray-400">Method:</span> {moveRequest.depositPaymentMethod === 'bank' ? 'Bank Transfer (EFT)' : 'Cash Payment'}</p>
                      <p><span className="text-gray-400">Amount:</span> R{moveRequest.depositAmount}</p>
                      {moveRequest.depositPaymentMethod === 'bank' && moveRequest.depositBankDetails && (
                        <div>
                          <p className="text-gray-400 mb-1">Bank Details:</p>
                          <pre className="bg-gray-900 p-3 rounded text-sm text-cyan-300 whitespace-pre-wrap">{moveRequest.depositBankDetails}</pre>
                        </div>
                      )}
                      {moveRequest.depositPaymentMethod === 'cash' && moveRequest.depositCashAppointmentDate && (
                        <p><span className="text-gray-400">Appointment Date:</span> {new Date(moveRequest.depositCashAppointmentDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Claimed Info */}
                {moveRequest.status === 'Payment Claimed' && (
                  <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl p-5 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-6 h-6 text-purple-400 animate-pulse" />
                      <h3 className="text-white font-bold text-lg">Payment Claimed by Resident</h3>
                    </div>
                    <div className="space-y-2 text-gray-300 text-base">
                      <p><span className="text-gray-400">Payment Date:</span> {moveRequest.depositPaidDate}</p>
                      {moveRequest.depositProofUrl && (
                        <div>
                          <p className="text-gray-400 mb-1">Proof of Payment:</p>
                          <a 
                            href={moveRequest.depositProofUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline text-base"
                          >
                            View Uploaded Proof
                          </a>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleVerifyPayment}
                      disabled={processing}
                      className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-base"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {processing ? 'Verifying...' : 'Verify Payment Received'}
                    </button>
                  </div>
                )}

                {/* Deposit Verified */}
                {(moveRequest.status === 'Deposit Verified' || moveRequest.status === 'Fully Approved') && (
                  <div className="bg-green-900/30 border-2 border-green-500 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h3 className="text-white font-bold text-lg">Payment Verified</h3>
                    </div>
                    <p className="text-gray-300 text-base">
                      Verified by {moveRequest.depositVerifiedBy} on {moveRequest.depositVerifiedDate && new Date(moveRequest.depositVerifiedDate).toLocaleDateString()}
                    </p>
                    {moveRequest.status === 'Deposit Verified' && (
                      <p className="text-yellow-300 text-base mt-2">⏳ Waiting for resident to select insurance option...</p>
                    )}
                  </div>
                )}

                {/* Insurance Selection */}
                {moveRequest.status === 'Fully Approved' && moveRequest.insuranceSelected !== undefined && (
                  <div className="bg-gray-800/50 rounded-xl p-5 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-white font-bold text-lg">Insurance Selection</h3>
                    </div>
                    <p className="text-gray-300 text-base">
                      Moving company insurance: <span className={`font-bold ${moveRequest.insuranceSelected ? 'text-green-400' : 'text-orange-400'}`}>
                        {moveRequest.insuranceSelected ? 'YES' : 'NO'}
                      </span>
                    </p>
                    {moveRequest.insuranceSelectionDate && (
                      <p className="text-gray-400 text-sm mt-1">
                        Selected on {new Date(moveRequest.insuranceSelectionDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Move Details Card */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-cyan-400" />
                Move Details
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Move Date</p>
                  <p className="text-white font-semibold text-base">{new Date(moveRequest.moveDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Time Slot</p>
                  <p className="text-white font-semibold text-base">{moveRequest.startTime} - {moveRequest.endTime}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Duration</p>
                  <p className="text-white font-semibold text-base">{moveRequest.estimatedDuration} hours</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Loading Dock</p>
                  <p className="text-white font-semibold text-base">{moveRequest.loadingDock || 'TBD'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Service Elevator</p>
                  <p className="text-white font-semibold text-base">{moveRequest.serviceElevator ? 'Required' : 'Not Required'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Moving Trolleys</p>
                  <p className="text-white font-semibold text-base">{moveRequest.movingTrolleys}</p>
                </div>
              </div>
            </motion.div>

            {/* Moving Company Info */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Truck className="w-6 h-6 text-cyan-400" />
                Moving Company
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Type</p>
                  <p className="text-white font-semibold text-base">{moveRequest.movingCompanyType}</p>
                </div>
                {moveRequest.movingCompanyName && (
                  <>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Company Name</p>
                      <p className="text-white font-semibold text-base">{moveRequest.movingCompanyName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Phone</p>
                      <p className="text-white font-semibold text-base">{moveRequest.movingCompanyPhone}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Special Requirements */}
            {moveRequest.specialRequirements && (
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-cyan-400" />
                  Special Requirements
                </h2>
                <p className="text-gray-300 leading-relaxed text-base">{moveRequest.specialRequirements}</p>
              </motion.div>
            )}

            {/* Comments Section */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-cyan-400" />
                Communication Thread
              </h2>

              {/* Comments List */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-400 text-center py-8 text-base">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-xl ${
                        comment.author === 'fm'
                          ? 'bg-cyan-500/20 border-l-4 border-cyan-500'
                          : 'bg-gray-700/50 border-l-4 border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white flex items-center gap-2 text-base">
                          {comment.author === 'fm' ? (
                            <>
                              <UserCheck className="w-5 h-5 text-cyan-400" />
                              {comment.authorName}
                            </>
                          ) : (
                            <>
                              <User className="w-5 h-5 text-gray-400" />
                              {comment.authorName}
                            </>
                          )}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-200 text-base">{comment.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Add a comment for the resident..."
                  className="flex-1 bg-gray-700 text-white text-base border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold flex items-center gap-2 text-base"
                >
                  <Send className="w-5 h-5" />
                  Send
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Info & Actions */}
          <div className="space-y-6">
            
            {/* Resident Info */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-cyan-400" />
                Resident Info
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Name</p>
                  <p className="text-white font-semibold text-base">{moveRequest.residentName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Unit</p>
                  <p className="text-white font-semibold text-base">{moveRequest.residentUnit}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white font-semibold text-base break-all">{moveRequest.residentEmail}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Phone</p>
                  <p className="text-white font-semibold text-base">{moveRequest.residentPhone}</p>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-cyan-400" />
                Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Submitted</p>
                  <p className="text-white font-semibold text-base">{new Date(moveRequest.submittedDate).toLocaleDateString()}</p>
                </div>
                {moveRequest.approvedDate && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Approved</p>
                    <p className="text-white font-semibold text-base">{new Date(moveRequest.approvedDate).toLocaleDateString()}</p>
                  </div>
                )}
                {moveRequest.completedDate && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Completed</p>
                    <p className="text-white font-semibold text-base">{new Date(moveRequest.completedDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            {moveRequest.status === 'Pending' && (
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-base"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve & Set Deposit
                  </button>
                  <button
                    onClick={handleReject}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-base"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* NEW: Payment Verification Actions */}
            {moveRequest.status === 'Payment Claimed' && (
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Payment Verification</h3>
                
                {moveRequest.depositPaymentMethod === 'cash' ? (
                  <div className="space-y-3">
                    <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 mb-4">
                      <p className="text-purple-300 text-sm mb-1">Cash Payment Expected</p>
                      <p className="text-white text-base">Resident will bring cash to office</p>
                    </div>
                    <button
                      onClick={() => setShowCashReceiptModal(true)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-base"
                    >
                      <Banknote className="w-5 h-5" />
                      Record Cash Receipt
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-cyan-900/30 border border-cyan-500/50 rounded-lg p-4 mb-4">
                      <p className="text-cyan-300 text-sm mb-1">Bank Transfer Expected</p>
                      <p className="text-white text-base">Check proof of payment uploaded</p>
                    </div>
                    <button
                      onClick={handleVerifyPayment}
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-base"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {processing ? 'Processing...' : 'Verify Bank Transfer'}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowApprovalModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-2xl w-full border-2 border-cyan-500/30 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-7 h-7 text-cyan-400" />
              Set Deposit Instructions
            </h2>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-3 text-base">Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDepositMethod('bank')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    depositMethod === 'bank'
                      ? 'border-cyan-500 bg-cyan-500/20'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <Building2 className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-white font-semibold text-base">Bank Transfer</p>
                  <p className="text-gray-400 text-sm">EFT Payment</p>
                </button>
                <button
                  onClick={() => setDepositMethod('cash')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    depositMethod === 'cash'
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <Banknote className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold text-base">Cash Payment</p>
                  <p className="text-gray-400 text-sm">In Person</p>
                </button>
              </div>
            </div>

            {/* Deposit Amount */}
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2 text-base">Deposit Amount (R)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="e.g., 5000"
                className="w-full bg-gray-700 text-white text-base border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Bank Details (if bank method) */}
            {depositMethod === 'bank' && (
              <div className="mb-6">
                <label className="block text-gray-300 font-semibold mb-2 text-base">Bank Details</label>
                <textarea
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                  placeholder="Enter bank details for EFT payment...&#10;e.g., Bank: FNB&#10;Account: 123456789&#10;Branch: 250655&#10;Reference: Unit 101"
                  rows={5}
                  className="w-full bg-gray-700 text-white text-base border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {/* Cash Payment Date (if cash method) */}
            {depositMethod === 'cash' && (
              <div className="mb-6">
                <label className="block text-gray-300 font-semibold mb-2 text-base">Cash Payment Appointment Date</label>
                <input
                  type="date"
                  value={cashDate}
                  onChange={(e) => setCashDate(e.target.value)}
                  className="w-full bg-gray-700 text-white text-base border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-semibold transition-all text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApproval}
                disabled={processing}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-all text-base"
              >
                {processing ? 'Processing...' : 'Approve & Send Instructions'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* NEW: Cash Receipt Modal */}
      {showCashReceiptModal && moveRequest && (
        <CashReceiptModal
          moveRequest={moveRequest}
          onClose={() => setShowCashReceiptModal(false)}
          onSave={handleCashReceiptSave}
        />
      )}
      </div>
    </div>
  );
}
