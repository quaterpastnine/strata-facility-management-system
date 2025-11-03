'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Printer, 
  Save, 
  Receipt, 
  User, 
  Calendar,
  DollarSign,
  Building,
  FileText
} from 'lucide-react';
import type { MoveRequest, CashReceipt } from '@/lib/types';

interface CashReceiptModalProps {
  moveRequest: MoveRequest;
  onClose: () => void;
  onSave: (receipt: Omit<CashReceipt, 'id' | 'createdAt' | 'createdBy'>) => void;
}

export function CashReceiptModal({ moveRequest, onClose, onSave }: CashReceiptModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const [receivedBy, setReceivedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Generate receipt number: CR-YYYYMMDD-### (moved to useState initializer)
  const [receiptNumber] = useState(() => {
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 900) + 100;
    return `CR-${dateStr}-${random}`;
  });

  const handleSave = () => {
    if (!receivedBy.trim()) {
      alert('Please enter who received the payment');
      return;
    }

    setSaving(true);

    const receipt: Omit<CashReceipt, 'id' | 'createdAt' | 'createdBy'> = {
      receiptNumber,
      moveRequestId: moveRequest.id,
      date: today,
      amount: moveRequest.depositAmount,
      paymentMethod: 'Cash',
      receivedBy: receivedBy.trim(),
      receivedDate: today,
      notes: notes.trim() || undefined,
      printedCopies: 0,
      residentCopyGiven: false,
      fileCopyStored: false,
      residentName: moveRequest.residentName,
      residentUnit: moveRequest.residentUnit
    };

    onSave(receipt);
    setSaving(false);
  };

  const handlePrint = () => {
    if (!receivedBy.trim()) {
      alert('Please enter who received the payment before printing');
      return;
    }

    window.print();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-4xl w-full border-2 border-cyan-500/30 shadow-2xl my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Receipt className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Cash Receipt</h2>
              <p className="text-gray-400 text-sm">Move Request #{moveRequest.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Form Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Receipt Number (Auto-generated) */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2 text-sm">
                <FileText className="w-4 h-4 inline mr-1" />
                Receipt Number
              </label>
              <input
                type="text"
                value={receiptNumber}
                disabled
                className="w-full bg-gray-700/50 text-cyan-300 font-mono text-lg border border-gray-600 rounded-xl px-4 py-3 cursor-not-allowed"
              />
            </div>

            {/* Date (Today) */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2 text-sm">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={today}
                disabled
                className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl px-4 py-3 cursor-not-allowed"
              />
            </div>

            {/* Amount (From Request) */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2 text-sm">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Amount
              </label>
              <input
                type="text"
                value={`R ${moveRequest.depositAmount.toFixed(2)}`}
                disabled
                className="w-full bg-gray-700/50 text-green-400 text-xl font-bold border border-gray-600 rounded-xl px-4 py-3 cursor-not-allowed"
              />
            </div>

            {/* Payment Method (Cash) */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2 text-sm">
                Payment Method
              </label>
              <input
                type="text"
                value="💵 Cash"
                disabled
                className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl px-4 py-3 cursor-not-allowed"
              />
            </div>

            {/* Received By (FM enters) */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 font-semibold mb-2 text-sm">
                <User className="w-4 h-4 inline mr-1" />
                Received By <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                placeholder="Enter your name (Facilities Manager)"
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                autoFocus
              />
            </div>

            {/* Notes (Optional) */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 font-semibold mb-2 text-sm">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
                rows={2}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          </div>

          {/* Receipt Preview */}
          <div className="border-2 border-dashed border-cyan-500/30 rounded-2xl p-6 bg-gray-900/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-cyan-400" />
              Receipt Preview
            </h3>
            
            <div 
              ref={receiptRef}
              className="bg-white text-gray-900 rounded-xl p-8 print:shadow-none"
              id="printable-receipt"
            >
              {/* Receipt Header */}
              <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building className="w-6 h-6 text-gray-700" />
                  <h1 className="text-2xl font-bold text-gray-900">BCMTrac Property Management</h1>
                </div>
                <p className="text-sm text-gray-600">Strata Facility Management System</p>
                <p className="text-xl font-bold text-gray-900 mt-2">CASH RECEIPT</p>
              </div>

              {/* Receipt Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Receipt Number:</span>
                  <span className="font-mono font-bold text-cyan-600">{receiptNumber}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Date:</span>
                  <span className="font-semibold">{new Date(today).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Received From:</span>
                  <span className="font-semibold">{moveRequest.residentName}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Unit:</span>
                  <span className="font-semibold">{moveRequest.residentUnit}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Purpose:</span>
                  <span className="font-semibold">{moveRequest.moveType} Deposit</span>
                </div>

                <div className="flex justify-between items-center py-3 bg-green-50 px-3 rounded-lg mt-4">
                  <span className="text-lg font-bold text-gray-900">Amount Received:</span>
                  <span className="text-2xl font-bold text-green-600">R {moveRequest.depositAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Payment Method:</span>
                  <span className="font-semibold">💵 Cash</span>
                </div>

                {receivedBy && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Received By:</span>
                    <span className="font-semibold">{receivedBy}</span>
                  </div>
                )}

                {notes && (
                  <div className="py-2 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-700 block mb-1">Notes:</span>
                    <span className="text-sm text-gray-600">{notes}</span>
                  </div>
                )}
              </div>

              {/* Signature Section */}
              <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t-2 border-gray-300">
                <div>
                  <p className="text-xs text-gray-600 mb-2">Resident Signature:</p>
                  <div className="border-b-2 border-gray-400 h-12"></div>
                  <p className="text-xs text-gray-500 mt-1">{moveRequest.residentName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-2">FM Signature:</p>
                  <div className="border-b-2 border-gray-400 h-12"></div>
                  <p className="text-xs text-gray-500 mt-1">{receivedBy || '(FM Name)'}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-gray-200">
                <p>This receipt confirms payment of the move in/out deposit.</p>
                <p className="mt-1">Please retain this receipt for your records.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-xl font-semibold transition-all text-lg"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              disabled={!receivedBy.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold transition-all text-lg flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print Receipt
            </button>
            <button
              onClick={handleSave}
              disabled={!receivedBy.trim() || saving}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold transition-all text-lg flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save & Mark Paid'}
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
            <p className="text-cyan-300 text-sm">
              <strong>📝 Instructions:</strong> After saving, print 2 copies of the receipt. 
              Both the resident and FM should sign both copies. Give one copy to the resident 
              and file one copy in the office records.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt,
          #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
