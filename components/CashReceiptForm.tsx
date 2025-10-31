'use client';

import { useState } from 'react';
import { X, DollarSign, Calendar, User, FileText, Save } from 'lucide-react';

interface CashReceiptFormData {
  receiptNumber: string;
  receiptDate: string;
  amount: number;
  receivedBy: string;
  notes: string;
  paymentMethod: 'EFT' | 'Cash' | 'Card' | 'Cheque';
}

interface CashReceiptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CashReceiptFormData) => void;
  defaultAmount?: number;
  existingData?: Partial<CashReceiptFormData>;
}

export default function CashReceiptForm({
  isOpen,
  onClose,
  onSave,
  defaultAmount = 500,
  existingData,
}: CashReceiptFormProps) {
  const [formData, setFormData] = useState<CashReceiptFormData>({
    receiptNumber: existingData?.receiptNumber || `CR-${Date.now()}`,
    receiptDate: existingData?.receiptDate || new Date().toISOString().split('T')[0],
    amount: existingData?.amount || defaultAmount,
    receivedBy: existingData?.receivedBy || '',
    notes: existingData?.notes || '',
    paymentMethod: existingData?.paymentMethod || 'Cash',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CashReceiptFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.receiptNumber.trim()) {
      newErrors.receiptNumber = 'Receipt number is required';
    }
    if (!formData.receiptDate) {
      newErrors.receiptDate = 'Receipt date is required';
    }
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.receivedBy.trim()) {
      newErrors.receivedBy = 'Received by is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-700">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between border-b-2 border-green-800">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Cash Receipt Form</h2>
              <p className="text-green-100 text-sm">Record deposit payment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Receipt Number */}
          <div>
            <label className="block text-white font-bold mb-2 text-lg">
              Receipt Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.receiptNumber}
              onChange={(e) => handleChange('receiptNumber', e.target.value)}
              placeholder="CR-123456789"
              className={`w-full px-4 py-3 bg-gray-900 text-white rounded-lg border-2 ${
                errors.receiptNumber ? 'border-red-500' : 'border-gray-600'
              } focus:border-green-500 focus:outline-none text-lg`}
            />
            {errors.receiptNumber && (
              <p className="text-red-400 text-sm mt-1">{errors.receiptNumber}</p>
            )}
          </div>

          {/* Receipt Date */}
          <div>
            <label className="block text-white font-bold mb-2 text-lg">
              Receipt Date <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-400 pointer-events-none z-10" />
              <input
                type="date"
                value={formData.receiptDate}
                onChange={(e) => handleChange('receiptDate', e.target.value)}
                className={`w-full pl-14 pr-4 py-3 bg-gray-900 text-white rounded-lg border-2 ${
                  errors.receiptDate ? 'border-red-500' : 'border-gray-600'
                } focus:border-green-500 focus:outline-none text-lg cursor-pointer`}
                style={{ colorScheme: 'dark' }}
              />
            </div>
            {errors.receiptDate && (
              <p className="text-red-400 text-sm mt-1">{errors.receiptDate}</p>
            )}
          </div>

          {/* Amount and Payment Method Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Amount */}
            <div>
              <label className="block text-white font-bold mb-2 text-lg">
                Amount (R) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 font-bold text-xl z-10">R</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-900 text-white rounded-lg border-2 ${
                    errors.amount ? 'border-red-500' : 'border-gray-600'
                  } focus:border-green-500 focus:outline-none text-lg`}
                />
              </div>
              {errors.amount && (
                <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-white font-bold mb-2 text-lg">
                Payment Method <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleChange('paymentMethod', e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border-2 border-gray-600 focus:border-green-500 focus:outline-none text-lg cursor-pointer"
              >
                <option value="Cash">Cash</option>
                <option value="EFT">EFT</option>
                <option value="Card">Card</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          {/* Received By */}
          <div>
            <label className="block text-white font-bold mb-2 text-lg">
              Received By <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-400 pointer-events-none z-10" />
              <input
                type="text"
                value={formData.receivedBy}
                onChange={(e) => handleChange('receivedBy', e.target.value)}
                placeholder="Staff member name"
                className={`w-full pl-14 pr-4 py-3 bg-gray-900 text-white rounded-lg border-2 ${
                  errors.receivedBy ? 'border-red-500' : 'border-gray-600'
                } focus:border-green-500 focus:outline-none text-lg`}
              />
            </div>
            {errors.receivedBy && (
              <p className="text-red-400 text-sm mt-1">{errors.receivedBy}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-white font-bold mb-2 text-lg">
              Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-6 h-6 text-green-400 pointer-events-none z-10" />
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Additional notes about the payment..."
                rows={4}
                className="w-full pl-14 pr-4 py-3 bg-gray-900 text-white rounded-lg border-2 border-gray-600 focus:border-green-500 focus:outline-none text-lg resize-none"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-600/20 border-l-4 border-blue-500 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              💡 This receipt will be generated and can be printed for resident records. 
              All fields marked with <span className="text-red-400">*</span> are required.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-500 hover:to-green-600 transition-all text-lg"
            >
              <Save className="w-5 h-5" />
              Save Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
