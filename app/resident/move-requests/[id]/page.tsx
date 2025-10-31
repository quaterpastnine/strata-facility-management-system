'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Truck, 
  MapPin, 
  DollarSign,
  Shield,
  CreditCard,
  CheckCircle,
  Phone,
  Mail,
  User,
  Package,
  Receipt,
} from 'lucide-react';
import { PageLayout, ResidentHeader, PageHeader } from '@/components/resident';
import CashReceiptSlip from '@/components/CashReceiptSlip';
import CashReceiptForm from '@/components/CashReceiptForm';
import type { MoveRequest } from '@/lib/types';

// Mock data - would come from API
const mockMoveRequest: MoveRequest = {
  id: 'MOVE-001',
  moveType: 'Move In',
  status: 'Approved',
  residentName: 'Willow Legg',
  residentUnit: 'Auto Spin Door',
  residentEmail: 'willow.legg@example.com',
  residentPhone: '(555) 987-6543',
  moveDate: '2024-11-28',
  startTime: '09:00',
  endTime: '15:00',
  estimatedDuration: 6,
  loadingDock: 'Dock 1',
  serviceElevator: true,
  visitorParkingBay: 'Bay 5',
  movingTrolleys: 3,
  accessCardsNeeded: 3,
  movingCompanyType: 'Professional',
  movingCompanyName: 'Swift Movers Ltd',
  movingCompanyPhone: '(555) 123-4567',
  movingCompanyInsurance: true,
  hasInsurance: true,
  insuranceProvider: 'InsureAll',
  insurancePolicyNumber: 'POL-2024-567890',
  depositAmount: 500,
  depositPaid: true,
  depositRefundAccount: 'BSB: 062-000, Acc: 12345678',
  vehicleDetails: 'Large moving truck - License ABC123',
  oversizedItems: true,
  oversizedItemDetails: 'King size bed, Large wardrobe',
  specialRequirements: 'Please ensure service elevator is reserved',
  termsAccepted: true,
  termsAcceptedDate: '2024-11-15',
  approvedBy: 'Facilities Manager - Sarah Johnson',
  approvedDate: '2024-11-16',
  submittedDate: '2024-11-15',
  // Cash receipt data (initially empty)
  cashReceiptNumber: '',
  cashReceiptDate: '',
  cashReceiptAmount: 0,
  cashReceiptReceivedBy: '',
  cashReceiptNotes: '',
  paymentMethod: 'Cash',
};

export default function MoveRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [moveRequest, setMoveRequest] = useState<MoveRequest>(mockMoveRequest);
  const [showReceiptForm, setShowReceiptForm] = useState(false);

  const handleSaveReceipt = (receiptData: any) => {
    setMoveRequest(prev => ({
      ...prev,
      cashReceiptNumber: receiptData.receiptNumber,
      cashReceiptDate: receiptData.receiptDate,
      cashReceiptAmount: receiptData.amount,
      cashReceiptReceivedBy: receiptData.receivedBy,
      cashReceiptNotes: receiptData.notes,
      paymentMethod: receiptData.paymentMethod,
      depositPaid: true,
    }));
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
      'Approved': 'bg-green-500/20 text-green-300 border-green-500',
      'Rejected': 'bg-red-500/20 text-red-300 border-red-500',
      'In Progress': 'bg-blue-500/20 text-blue-300 border-blue-500',
      'Completed': 'bg-gray-500/20 text-gray-300 border-gray-500',
      'Cancelled': 'bg-red-500/20 text-red-300 border-red-500',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500';
  };

  return (
    <PageLayout>
      <ResidentHeader currentPage="Move Request Details" />
      
      <PageHeader 
        title={`${moveRequest.moveType} Request`}
        subtitle={moveRequest.id}
        icon={Building2}
        color="orange"
        showBackButton
        backUrl="/resident/move-requests"
      />

      <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 pb-12 space-y-6">
        
        {/* Status Banner */}
        <div className={`rounded-xl p-6 border-2 ${getStatusColor(moveRequest.status)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Status: {moveRequest.status}</h3>
              {moveRequest.approvedBy && (
                <p className="text-lg">
                  Approved by {moveRequest.approvedBy} on {new Date(moveRequest.approvedDate!).toLocaleDateString()}
                </p>
              )}
            </div>
            <CheckCircle className="w-12 h-12" />
          </div>
        </div>

        {/* Move Details */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-orange-400" />
            Move Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
            <div>
              <p className="text-gray-400">Move Date</p>
              <p className="text-white font-semibold">{new Date(moveRequest.moveDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-gray-400">Time</p>
              <p className="text-white font-semibold">{moveRequest.startTime} - {moveRequest.endTime} ({moveRequest.estimatedDuration} hours)</p>
            </div>
            <div>
              <p className="text-gray-400">Loading Dock</p>
              <p className="text-white font-semibold">{moveRequest.loadingDock || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Service Elevator</p>
              <p className="text-white font-semibold">{moveRequest.serviceElevator ? 'Yes' : 'No'}</p>
            </div>
            {moveRequest.visitorParkingBay && (
              <div>
                <p className="text-gray-400">Parking Bay</p>
                <p className="text-white font-semibold">{moveRequest.visitorParkingBay}</p>
              </div>
            )}
            <div>
              <p className="text-gray-400">Moving Trolleys</p>
              <p className="text-white font-semibold">{moveRequest.movingTrolleys}</p>
            </div>
            <div>
              <p className="text-gray-400">Access Cards</p>
              <p className="text-white font-semibold">{moveRequest.accessCardsNeeded}</p>
            </div>
          </div>
        </div>

        {/* Moving Company */}
        {moveRequest.movingCompanyName && (
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Truck className="w-6 h-6 text-orange-400" />
              Moving Company
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
              <div>
                <p className="text-gray-400">Company Name</p>
                <p className="text-white font-semibold">{moveRequest.movingCompanyName}</p>
              </div>
              <div>
                <p className="text-gray-400">Phone</p>
                <p className="text-white font-semibold">{moveRequest.movingCompanyPhone}</p>
              </div>
              <div>
                <p className="text-gray-400">Insurance</p>
                <p className="text-white font-semibold">{moveRequest.movingCompanyInsurance ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-gray-400">Type</p>
                <p className="text-white font-semibold">{moveRequest.movingCompanyType}</p>
              </div>
            </div>
          </div>
        )}

        {/* Deposit & Payment */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            Deposit & Payment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg mb-6">
            <div>
              <p className="text-gray-400">Deposit Amount</p>
              <p className="text-white font-semibold text-2xl">R{moveRequest.depositAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Payment Status</p>
              <p className={`font-semibold text-xl ${moveRequest.depositPaid ? 'text-green-400' : 'text-yellow-400'}`}>
                {moveRequest.depositPaid ? 'Paid' : 'Pending'}
              </p>
            </div>
            {moveRequest.paymentMethod && (
              <div>
                <p className="text-gray-400">Payment Method</p>
                <p className="text-white font-semibold">{moveRequest.paymentMethod}</p>
              </div>
            )}
            {moveRequest.depositRefundAccount && (
              <div className="md:col-span-2">
                <p className="text-gray-400">Refund Account</p>
                <p className="text-white font-semibold">{moveRequest.depositRefundAccount}</p>
              </div>
            )}
          </div>

          {/* Cash Receipt Section */}
          <div className="border-t border-gray-700 pt-6">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-green-400" />
              Cash Receipt
            </h4>
            <CashReceiptSlip
              receiptNumber={moveRequest.cashReceiptNumber}
              receiptDate={moveRequest.cashReceiptDate}
              amount={moveRequest.cashReceiptAmount}
              receivedBy={moveRequest.cashReceiptReceivedBy}
              notes={moveRequest.cashReceiptNotes}
              paymentMethod={moveRequest.paymentMethod}
              residentName={moveRequest.residentName}
              residentUnit={moveRequest.residentUnit}
              moveType={moveRequest.moveType}
              moveDate={moveRequest.moveDate}
              onEdit={() => setShowReceiptForm(true)}
              isEditable={true}
            />
          </div>
        </div>

        {/* Insurance */}
        {moveRequest.hasInsurance && (
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              Insurance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
              <div>
                <p className="text-gray-400">Provider</p>
                <p className="text-white font-semibold">{moveRequest.insuranceProvider}</p>
              </div>
              <div>
                <p className="text-gray-400">Policy Number</p>
                <p className="text-white font-semibold">{moveRequest.insurancePolicyNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Details */}
        {(moveRequest.vehicleDetails || moveRequest.oversizedItems || moveRequest.specialRequirements) && (
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-purple-400" />
              Additional Details
            </h3>
            <div className="space-y-4 text-lg">
              {moveRequest.vehicleDetails && (
                <div>
                  <p className="text-gray-400 mb-1">Vehicle Details</p>
                  <p className="text-white">{moveRequest.vehicleDetails}</p>
                </div>
              )}
              {moveRequest.oversizedItems && (
                <div>
                  <p className="text-gray-400 mb-1">Oversized Items</p>
                  <p className="text-white">{moveRequest.oversizedItemDetails}</p>
                </div>
              )}
              {moveRequest.specialRequirements && (
                <div>
                  <p className="text-gray-400 mb-1">Special Requirements</p>
                  <p className="text-white">{moveRequest.specialRequirements}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-teal-400" />
            Resident Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
            <div>
              <p className="text-gray-400">Name</p>
              <p className="text-white font-semibold">{moveRequest.residentName}</p>
            </div>
            <div>
              <p className="text-gray-400">Unit</p>
              <p className="text-white font-semibold">{moveRequest.residentUnit}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-white font-semibold">{moveRequest.residentEmail}</p>
            </div>
            <div>
              <p className="text-gray-400">Phone</p>
              <p className="text-white font-semibold">{moveRequest.residentPhone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Receipt Form Modal */}
      <CashReceiptForm
        isOpen={showReceiptForm}
        onClose={() => setShowReceiptForm(false)}
        onSave={handleSaveReceipt}
        defaultAmount={moveRequest.depositAmount}
        existingData={{
          receiptNumber: moveRequest.cashReceiptNumber,
          receiptDate: moveRequest.cashReceiptDate,
          amount: moveRequest.cashReceiptAmount,
          receivedBy: moveRequest.cashReceiptReceivedBy,
          notes: moveRequest.cashReceiptNotes,
          paymentMethod: moveRequest.paymentMethod,
        }}
      />
    </PageLayout>
  );
}
