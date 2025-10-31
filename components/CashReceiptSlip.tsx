'use client';

import { DollarSign, Calendar, User, FileText, Printer } from 'lucide-react';

interface CashReceiptSlipProps {
  receiptNumber?: string;
  receiptDate?: string;
  amount?: number;
  receivedBy?: string;
  notes?: string;
  paymentMethod?: 'EFT' | 'Cash' | 'Card' | 'Cheque';
  residentName: string;
  residentUnit: string;
  moveType: 'Move In' | 'Move Out';
  moveDate: string;
  onEdit?: () => void;
  isEditable?: boolean;
}

export default function CashReceiptSlip({
  receiptNumber,
  receiptDate,
  amount,
  receivedBy,
  notes,
  paymentMethod,
  residentName,
  residentUnit,
  moveType,
  moveDate,
  onEdit,
  isEditable = false,
}: CashReceiptSlipProps) {
  
  const handlePrint = () => {
    window.print();
  };

  if (!receiptNumber) {
    return (
      <div className="bg-yellow-600/20 border-2 border-yellow-500 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <DollarSign className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-yellow-300 font-bold text-xl mb-2">No Cash Receipt</h3>
            <p className="text-yellow-200 text-base mb-4">
              Deposit payment has not been recorded yet.
            </p>
            {isEditable && onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-500 transition-all"
              >
                Record Cash Payment
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-300 text-gray-900 print:shadow-none">
      {/* Receipt Header */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-gray-900">CASH RECEIPT</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Receipt No.</p>
            <p className="text-2xl font-bold text-gray-900">{receiptNumber}</p>
          </div>
        </div>
        <p className="text-lg text-gray-700 font-semibold">Strata Facilities Management</p>
        <p className="text-sm text-gray-600">Move In/Out Deposit Payment</p>
      </div>

      {/* Receipt Details */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Date Received</p>
          <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            {receiptDate ? new Date(receiptDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : 'N/A'}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Received By</p>
          <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            {receivedBy || 'N/A'}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Resident Name</p>
          <p className="text-lg font-semibold text-gray-900">{residentName}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Unit Number</p>
          <p className="text-lg font-semibold text-gray-900">{residentUnit}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Move Type</p>
          <p className="text-lg font-semibold text-gray-900">{moveType}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Move Date</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(moveDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Payment Method</p>
            <p className="text-xl font-bold text-gray-900">{paymentMethod || 'Cash'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Amount Received</p>
            <p className="text-4xl font-bold text-green-700">
              R{amount?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Notes
          </p>
          <p className="text-base text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {notes}
          </p>
        </div>
      )}

      {/* Signature Line */}
      <div className="border-t-2 border-gray-300 pt-6 mt-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="border-b-2 border-gray-400 pb-2 mb-2 min-h-[60px]"></div>
            <p className="text-sm text-gray-600 text-center">Resident Signature</p>
          </div>
          <div>
            <div className="border-b-2 border-gray-400 pb-2 mb-2 min-h-[60px]"></div>
            <p className="text-sm text-gray-600 text-center">Staff Signature</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>This receipt is proof of deposit payment for move in/out services.</p>
        <p className="mt-1">Deposit will be refunded within 7 business days if no damages occur.</p>
      </div>

      {/* Action Buttons - Hide on print */}
      <div className="mt-6 flex gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all"
        >
          <Printer className="w-5 h-5" />
          Print Receipt
        </button>
        {isEditable && onEdit && (
          <button
            onClick={onEdit}
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition-all"
          >
            Edit Receipt
          </button>
        )}
      </div>
    </div>
  );
}
