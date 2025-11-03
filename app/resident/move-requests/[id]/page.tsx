'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Truck, 
  MapPin, 
  DollarSign, 
  User, 
  MessageSquare, 
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Building,
  CreditCard,
  Phone,
  Mail,
  Download,
  Plus,
  Shield,
  Upload,
  Building2,
  Banknote
} from 'lucide-react';
import { PageLayout, ResidentHeader } from '@/components/resident';
import { useData } from '@/contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import type { MoveRequest, Comment } from '@/lib/types';

export default function MoveRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { moveRequests, confirmDepositPaid, setInsuranceSelection, updateMoveRequest } = useData();
  
  // Find the specific move request
  const moveRequest = moveRequests?.find(m => m.id === params.id) as MoveRequest | undefined;
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<MoveRequest>>({});
  
  // NEW: Deposit payment state
  const [paymentDate, setPaymentDate] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  
  // NEW: Insurance selection state
  const [insuranceChoice, setInsuranceChoice] = useState<boolean | null>(null);
  const [submittingInsurance, setSubmittingInsurance] = useState(false);
  
  // Comment state - session only
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      ticketId: params.id as string,
      ticketType: 'move',
      author: 'system',
      authorName: 'System',
      message: 'Move request submitted for review',
      timestamp: '2024-01-15T10:00:00Z',
      isRead: true,
      statusChange: {
        from: 'Draft',
        to: 'Pending'
      }
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  // Load comments for this move request
  useEffect(() => {
    if (moveRequest) {
      // Initialize edit data when move request loads
      setEditedData({
        moveDate: moveRequest.moveDate,
        startTime: moveRequest.startTime,
        endTime: moveRequest.endTime,
        loadingDock: moveRequest.loadingDock,
        movingTrolleys: moveRequest.movingTrolleys,
        accessCardsNeeded: moveRequest.accessCardsNeeded,
        specialRequirements: moveRequest.specialRequirements,
        oversizedItems: moveRequest.oversizedItems,
        oversizedItemDetails: moveRequest.oversizedItemDetails,
      });
      
      if (moveRequest.status === 'Approved') {
        setComments(prev => [...prev, {
          id: '2',
          ticketId: params.id as string,
          ticketType: 'move',
          author: 'fm',
          authorName: 'Sarah Johnson (FM)',
          message: `Your move request has been approved. Elevator reserved from ${moveRequest.startTime} to ${moveRequest.endTime}. Please ensure all items are properly packed and labeled.`,
          timestamp: '2024-01-15T14:30:00Z',
          isRead: false,
          statusChange: {
            from: 'Pending',
            to: 'Approved'
          }
        }]);
      }
    }
  }, [moveRequest, params.id]);

  // Handle adding a new comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      ticketId: params.id as string,
      ticketType: 'move',
      author: 'resident',
      authorName: moveRequest?.residentName || 'Resident',
      message: newComment,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment('');
    setIsAddingComment(false);
    
    // Simulate FM response after 2 seconds
    setTimeout(() => {
      const fmResponse: Comment = {
        id: (Date.now() + 1).toString(),
        ticketId: params.id as string,
        ticketType: 'move',
        author: 'fm',
        authorName: 'Sarah Johnson (FM)',
        message: 'Thank you for your message. I will look into this and get back to you shortly.',
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setComments(prev => [...prev, fmResponse]);
    }, 2000);
  };

  // NEW: Handle payment confirmation
  const handleConfirmPayment = async () => {
    if (!moveRequest) return;
    
    if (!paymentDate) {
      alert('Please select the payment date');
      return;
    }
    
    // If bank transfer, proof is required
    if (moveRequest.depositPaymentMethod === 'bank' && !proofFile) {
      alert('Please upload proof of payment for bank transfer');
      return;
    }
    
    setSubmittingPayment(true);
    
    try {
      // Simulate file upload if there's a proof file
      let proofUrl;
      if (proofFile) {
        // In real app, upload to server/cloud storage
        proofUrl = URL.createObjectURL(proofFile);
      }
      
      // Call context function
      confirmDepositPaid(moveRequest.id, paymentDate, proofUrl);
      
      alert('Payment confirmation submitted! Facilities Manager will verify shortly.');
      setPaymentDate('');
      setProofFile(null);
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Error submitting payment confirmation. Please try again.');
    } finally {
      setSubmittingPayment(false);
    }
  };

  // NEW: Handle insurance selection
  const handleInsuranceSubmit = () => {
    if (!moveRequest || insuranceChoice === null) {
      alert('Please select YES or NO for insurance');
      return;
    }
    
    setSubmittingInsurance(true);
    
    try {
      setInsuranceSelection(moveRequest.id, insuranceChoice);
      alert('Insurance selection submitted! Your move request is now fully approved.');
    } catch (error) {
      console.error('Error submitting insurance selection:', error);
      alert('Error submitting insurance selection. Please try again.');
    } finally {
      setSubmittingInsurance(false);
    }
  };

  // NEW: Handle save edits
  const handleSaveEdits = () => {
    if (!moveRequest) return;
    
    // Validate
    if (!editedData.moveDate) {
      alert('Move date is required');
      return;
    }
    
    if (!editedData.loadingDock) {
      alert('Loading dock is required');
      return;
    }
    
    try {
      updateMoveRequest(moveRequest.id, editedData);
      setIsEditing(false);
      alert('Move request updated successfully!');
    } catch (error) {
      console.error('Error updating move request:', error);
      alert('Error updating move request. Please try again.');
    }
  };

  // NEW: Handle cancel edit
  const handleCancelEdit = () => {
    // Reset to original data
    setEditedData({
      moveDate: moveRequest?.moveDate,
      startTime: moveRequest?.startTime,
      endTime: moveRequest?.endTime,
      loadingDock: moveRequest?.loadingDock,
      movingTrolleys: moveRequest?.movingTrolleys,
      accessCardsNeeded: moveRequest?.accessCardsNeeded,
      specialRequirements: moveRequest?.specialRequirements,
      oversizedItems: moveRequest?.oversizedItems,
      oversizedItemDetails: moveRequest?.oversizedItemDetails,
    });
    setIsEditing(false);
  };

  if (!moveRequest) {
    return (
      <PageLayout>
        <ResidentHeader currentPage="Move Requests" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Move request not found</div>
        </div>
      </PageLayout>
    );
  }

  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-600 text-white';
      case 'Approved': return 'bg-blue-600 text-white';
      case 'Deposit Pending': return 'bg-orange-500 text-white';
      case 'Payment Claimed': return 'bg-purple-600 text-white';
      case 'Deposit Verified': return 'bg-teal-600 text-white';
      case 'Fully Approved': return 'bg-green-600 text-white';
      case 'In Progress': return 'bg-blue-600 text-white';
      case 'Completed': return 'bg-gray-600 text-white';
      case 'Rejected': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <PageLayout>
      <ResidentHeader currentPage="Move Requests" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/resident/move-requests')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{moveRequest.moveType} Request</h1>
                <p className="text-orange-100 mt-1">Request #{moveRequest.id}</p>
              </div>
            </div>
            <span className={`px-6 py-3 rounded-full text-lg font-bold ${getStatusColor(moveRequest.status)}`}>
              {moveRequest.status}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        
        {/* NEW: Progress Stepper - Only show if workflow started */}
        {moveRequest.depositPaymentMethod && (
          <motion.div
            className="bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-cyan-500/30 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Move Approval Progress</h2>
            <div className="flex items-center justify-between">
              {[
                { label: 'Submitted', status: 'Pending' },
                { label: 'FM Approved', status: 'Approved' },
                { label: 'Deposit Payment', status: 'Deposit Pending' },
                { label: 'Payment Verified', status: 'Deposit Verified' },
                { label: 'Insurance Selected', status: 'Fully Approved' },
                { label: 'Ready for Move', status: 'Fully Approved' }
              ].map((step, idx) => {
                const stepStatuses = ['Pending', 'Approved', 'Deposit Pending', 'Payment Claimed', 'Deposit Verified', 'Fully Approved'];
                const currentIndex = stepStatuses.indexOf(moveRequest.status);
                const isActive = idx <= currentIndex + 1;
                const isCurrent = idx === currentIndex + 1;
                
                return (
                  <div key={step.label} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-cyan-500' : 'bg-gray-600'
                    } ${isCurrent ? 'ring-4 ring-cyan-300' : ''}`}>
                      {isActive && <CheckCircle className="w-6 h-6 text-white" />}
                      {!isActive && <span className="text-white text-sm">{idx + 1}</span>}
                    </div>
                    <p className={`text-xs mt-2 text-center ${isActive ? 'text-cyan-300 font-semibold' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* NEW: Deposit Instructions Card - Shows when FM has set deposit instructions */}
            {(moveRequest.status === 'Deposit Pending' || moveRequest.status === 'Payment Claimed') && moveRequest.depositPaymentMethod && (
              <motion.div
                className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 shadow-xl border-2 border-cyan-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-cyan-400" />
                  Deposit Payment Instructions
                </h2>

                <div className="bg-gray-800/50 rounded-lg p-5 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    {moveRequest.depositPaymentMethod === 'bank' ? (
                      <Building2 className="w-6 h-6 text-cyan-400" />
                    ) : (
                      <Banknote className="w-6 h-6 text-green-400" />
                    )}
                    <h3 className="text-white font-bold text-lg">
                      {moveRequest.depositPaymentMethod === 'bank' ? 'Bank Transfer (EFT)' : 'Cash Payment'}
                    </h3>
                  </div>

                  <div className="space-y-3 text-base">
                    <div>
                      <p className="text-gray-400">Deposit Amount:</p>
                      <p className="text-white text-2xl font-bold">R{moveRequest.depositAmount}</p>
                    </div>

                    {moveRequest.depositPaymentMethod === 'bank' && moveRequest.depositBankDetails && (
                      <div>
                        <p className="text-gray-400 mb-2">Bank Details:</p>
                        <pre className="bg-gray-900 p-4 rounded text-sm text-cyan-300 whitespace-pre-wrap">
                          {moveRequest.depositBankDetails}
                        </pre>
                      </div>
                    )}

                    {moveRequest.depositPaymentMethod === 'cash' && moveRequest.depositCashAppointmentDate && (
                      <div>
                        <p className="text-gray-400">Appointment Date:</p>
                        <p className="text-white text-lg font-semibold">
                          {new Date(moveRequest.depositCashAppointmentDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-yellow-300 text-sm mt-2">
                          ⏰ Please bring exact cash amount to the Facilities Manager office
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Confirmation Form - Only if not yet claimed */}
                {moveRequest.status === 'Deposit Pending' && (
                  <div className="bg-gray-800 rounded-lg p-5">
                    <h3 className="text-white font-bold mb-4">Confirm Payment Made</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Payment Date</label>
                        <input
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      {moveRequest.depositPaymentMethod === 'bank' && (
                        <div>
                          <label className="block text-gray-300 mb-2">
                            Upload Proof of Payment <span className="text-red-400">*</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <label className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-600 transition-colors">
                              <div className="flex items-center gap-2 text-gray-300">
                                <Upload className="w-5 h-5" />
                                <span>{proofFile ? proofFile.name : 'Choose file...'}</span>
                              </div>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                                className="hidden"
                              />
                            </label>
                            {proofFile && (
                              <button
                                onClick={() => setProofFile(null)}
                                className="p-3 bg-red-600 hover:bg-red-500 rounded-lg"
                              >
                                <XCircle className="w-5 h-5 text-white" />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-1">
                            Upload your bank transfer receipt or screenshot
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handleConfirmPayment}
                        disabled={submittingPayment}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all"
                      >
                        {submittingPayment ? 'Submitting...' : 'Confirm Payment Made'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Payment Claimed - Waiting for FM */}
                {moveRequest.status === 'Payment Claimed' && (
                  <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-6 h-6 text-purple-400 animate-pulse" />
                      <h3 className="text-white font-bold text-lg">Payment Submitted - Awaiting Verification</h3>
                    </div>
                    <p className="text-gray-300">
                      Your payment confirmation has been submitted. The Facilities Manager will verify and confirm receipt shortly.
                    </p>
                    {moveRequest.depositPaidDate && (
                      <p className="text-gray-400 text-sm mt-2">
                        Submitted on: {new Date(moveRequest.depositPaidDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* NEW: Insurance Selection Card - Shows after deposit verified */}
            {moveRequest.status === 'Deposit Verified' && (
              <motion.div
                className="bg-gradient-to-br from-teal-900/30 to-emerald-900/30 rounded-xl p-6 shadow-xl border-2 border-teal-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-teal-400" />
                  Moving Company Insurance - REQUIRED
                </h2>

                <div className="bg-gray-800/50 rounded-lg p-5 mb-4">
                  <p className="text-gray-300 mb-4">
                    Does your moving company have insurance coverage for this move?
                  </p>

                  <div className="space-y-3 mb-6">
                    <label className="flex items-center gap-3 bg-gray-900 p-4 rounded-lg cursor-pointer border-2 border-transparent hover:border-teal-500 transition-colors">
                      <input
                        type="radio"
                        name="insurance"
                        checked={insuranceChoice === true}
                        onChange={() => setInsuranceChoice(true)}
                        className="w-5 h-5 text-teal-500"
                      />
                      <div className="flex-1">
                        <p className="text-white font-semibold">YES - I have insurance</p>
                        <p className="text-gray-400 text-sm">My moving company is insured</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 bg-gray-900 p-4 rounded-lg cursor-pointer border-2 border-transparent hover:border-orange-500 transition-colors">
                      <input
                        type="radio"
                        name="insurance"
                        checked={insuranceChoice === false}
                        onChange={() => setInsuranceChoice(false)}
                        className="w-5 h-5 text-orange-500"
                      />
                      <div className="flex-1">
                        <p className="text-white font-semibold">NO - I do not have insurance</p>
                        <p className="text-gray-400 text-sm">I will move at my own risk</p>
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={handleInsuranceSubmit}
                    disabled={insuranceChoice === null || submittingInsurance}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all"
                  >
                    {submittingInsurance ? 'Submitting...' : 'Confirm Insurance Selection'}
                  </button>

                  <p className="text-yellow-300 text-sm mt-3 text-center">
                    ⚠️ You must select an option to complete your move request approval
                  </p>
                </div>
              </motion.div>
            )}

            {/* NEW: Fully Approved Confirmation */}
            {moveRequest.status === 'Fully Approved' && (
              <motion.div
                className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 shadow-xl border-2 border-green-500"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Move Request Fully Approved!</h2>
                    <p className="text-green-300">All requirements completed - You're ready for move day</p>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 mt-4">
                  <p className="text-gray-300">
                    <strong>Move Date:</strong> {new Date(moveRequest.moveDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-gray-300 mt-2">
                    <strong>Time:</strong> {moveRequest.startTime} - {moveRequest.endTime}
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Move Details Card */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-400" />
                Move Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Move Date</div>
                  <div className="text-white text-lg font-semibold">{moveRequest.moveDate}</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Time Slot</div>
                  <div className="text-white text-lg font-semibold">{moveRequest.startTime} - {moveRequest.endTime}</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Duration</div>
                  <div className="text-white text-lg font-semibold">{moveRequest.estimatedDuration} hours</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Unit</div>
                  <div className="text-white text-lg font-semibold">{moveRequest.residentUnit}</div>
                </div>
              </div>
            </motion.div>

            {/* Facilities & Equipment */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Building className="w-6 h-6 text-orange-400" />
                Facilities & Equipment
              </h2>
              
              <div className="space-y-3">
                {moveRequest.loadingDock && (
                  <div className="flex items-center justify-between bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-orange-400" />
                      <div>
                        <div className="text-white font-medium">Loading Dock</div>
                        <div className="text-gray-400 text-sm">{moveRequest.loadingDock}</div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                )}
                
                {moveRequest.serviceElevator && (
                  <div className="flex items-center justify-between bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-orange-400" />
                      <div>
                        <div className="text-white font-medium">Service Elevator</div>
                        <div className="text-gray-400 text-sm">Reserved</div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                )}
                
                {moveRequest.movingTrolleys > 0 && (
                  <div className="flex items-center justify-between bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-orange-400" />
                      <div>
                        <div className="text-white font-medium">Moving Trolleys</div>
                        <div className="text-gray-400 text-sm">{moveRequest.movingTrolleys} reserved</div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Moving Company */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Truck className="w-6 h-6 text-orange-400" />
                Moving Company
              </h2>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-2">Company Type</div>
                <div className="text-white text-lg font-semibold mb-3">{moveRequest.movingCompanyType}</div>
                
                {moveRequest.movingCompanyName && (
                  <>
                    <div className="text-gray-400 text-sm mb-1">Company Name</div>
                    <div className="text-white mb-2">{moveRequest.movingCompanyName}</div>
                  </>
                )}
                
                {moveRequest.movingCompanyPhone && (
                  <div className="flex items-center gap-2 text-gray-400 mt-2">
                    <Phone className="w-4 h-4" />
                    <span>{moveRequest.movingCompanyPhone}</span>
                  </div>
                )}
                
                {moveRequest.movingCompanyInsurance && (
                  <div className="flex items-center gap-2 text-green-400 mt-2">
                    <Shield className="w-4 h-4" />
                    <span>Insurance Verified</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-orange-400" />
                Comments & Updates
                <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full ml-2">
                  {comments.length}
                </span>
              </h2>
              
              {/* Comment Thread */}
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-3 ${
                        comment.author === 'resident' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        comment.author === 'fm' ? 'bg-cyan-600' :
                        comment.author === 'system' ? 'bg-gray-600' :
                        'bg-orange-600'
                      }`}>
                        <User className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className={`flex-1 ${
                        comment.author === 'resident' ? 'text-right' : ''
                      }`}>
                        <div className={`inline-block bg-gray-900 rounded-lg p-4 max-w-md ${
                          comment.author === 'resident' ? 'bg-orange-900/50' : ''
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-300">
                              {comment.authorName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          {comment.statusChange && (
                            <div className="text-xs text-cyan-400 mb-2">
                              Status changed: {comment.statusChange.from} → {comment.statusChange.to}
                            </div>
                          )}
                          
                          <div className="text-gray-200">{comment.message}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Add Comment */}
              {!isAddingComment ? (
                <button
                  onClick={() => setIsAddingComment(true)}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Comment
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingComment(false);
                      setNewComment('');
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            
            {/* Payment Status */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Payment Status
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-gray-400 text-sm">Deposit Amount</div>
                  <div className="text-white text-2xl font-bold">R{moveRequest.depositAmount}</div>
                </div>
                
                <div className={`flex items-center gap-2 ${
                  moveRequest.depositPaid ? 'text-green-400' : 
                  moveRequest.status === 'Payment Claimed' ? 'text-purple-400' :
                  'text-yellow-400'
                }`}>
                  {moveRequest.depositPaid ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Deposit Verified</span>
                    </>
                  ) : moveRequest.status === 'Payment Claimed' ? (
                    <>
                      <AlertCircle className="w-5 h-5 animate-pulse" />
                      <span className="font-semibold">Awaiting Verification</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">Payment Pending</span>
                    </>
                  )}
                </div>
                
                {moveRequest.depositPaid && moveRequest.cashReceiptNumber && (
                  <div className="bg-gray-900 rounded-lg p-3 text-sm">
                    <div className="text-gray-400">Receipt #</div>
                    <div className="text-white font-mono">{moveRequest.cashReceiptNumber}</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-300">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{moveRequest.residentName}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{moveRequest.residentEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{moveRequest.residentPhone}</span>
                </div>
              </div>
            </motion.div>

            {/* Documents */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" />
                Documents
              </h3>
              
              <div className="space-y-2">
                <button className="w-full bg-gray-900 hover:bg-gray-700 rounded-lg p-3 text-left transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">Move Request Form</span>
                    </div>
                    <Download className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                
                {moveRequest.movingCompanyInsurance && (
                  <button className="w-full bg-gray-900 hover:bg-gray-700 rounded-lg p-3 text-left transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">Insurance Certificate</span>
                      </div>
                      <Download className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            {moveRequest.status === 'Pending' && (
              <motion.div 
                className="bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-gray-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                
                {!isEditing ? (
                  <div className="space-y-2">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded-lg transition-colors"
                    >
                      Edit Request
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this move request?')) {
                          // TODO: Implement cancel functionality
                          alert('Cancel functionality coming soon');
                        }
                      }}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg transition-colors"
                    >
                      Cancel Request
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button 
                      onClick={handleSaveEdits}
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Save Changes
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition-colors"
                    >
                      Cancel Edit
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
