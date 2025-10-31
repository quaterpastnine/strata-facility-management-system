'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2,
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar as CalendarIcon,
  Truck,
  Shield,
  FileText,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { PageLayout, ResidentHeader, PageHeader } from '@/components/resident';
import type { MoveType, LoadingDock, MovingCompanyType } from '@/lib/types';

const STEPS = [
  { id: 1, title: 'Terms & Conditions', icon: FileText },
  { id: 2, title: 'Move Details', icon: CalendarIcon },
  { id: 3, title: 'Facilities', icon: Building2 },
  { id: 4, title: 'Moving Company', icon: Truck },
  { id: 5, title: 'Insurance & Deposit', icon: Shield },
  { id: 6, title: 'Additional Details', icon: FileText },
  { id: 7, title: 'Review & Submit', icon: Check },
];

interface FormData {
  termsAccepted: boolean;
  moveType: MoveType;
  moveDate: string;
  startTime: string;
  endTime: string;
  estimatedDuration: number;
  loadingDock: LoadingDock | '';
  serviceElevator: boolean;
  visitorParkingBay: string;
  movingTrolleys: number;
  movingCompanyType: MovingCompanyType;
  movingCompanyName: string;
  movingCompanyPhone: string;
  movingCompanyInsurance: boolean;
  hasInsurance: boolean;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  depositAmount: number;
  depositRefundAccount: string;
  accessCardsNeeded: number;
  vehicleDetails: string;
  specialRequirements: string;
  oversizedItems: boolean;
  oversizedItemDetails: string;
}

export default function NewMoveRequest() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    termsAccepted: false,
    moveType: 'Move In',
    moveDate: '',
    startTime: '09:00',
    endTime: '17:00',
    estimatedDuration: 8,
    loadingDock: '',
    serviceElevator: true,
    visitorParkingBay: '',
    movingTrolleys: 2,
    movingCompanyType: 'Professional',
    movingCompanyName: '',
    movingCompanyPhone: '',
    movingCompanyInsurance: false,
    hasInsurance: false,
    insuranceProvider: '',
    insurancePolicyNumber: '',
    depositAmount: 500,
    depositRefundAccount: '',
    accessCardsNeeded: 2,
    vehicleDetails: '',
    specialRequirements: '',
    oversizedItems: false,
    oversizedItemDetails: '',
  });

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.termsAccepted) {
          alert('You must accept the terms and conditions to proceed');
          return false;
        }
        return true;
      case 2:
        if (!formData.moveDate) {
          alert('Please select a move date');
          return false;
        }
        const selectedDate = new Date(formData.moveDate);
        const minDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
        if (selectedDate < minDate) {
          alert('Move date must be at least 48 hours in advance');
          return false;
        }
        if (!formData.startTime || !formData.endTime) {
          alert('Please select start and end times');
          return false;
        }
        return true;
      case 3:
        if (!formData.loadingDock) {
          alert('Please select a loading dock');
          return false;
        }
        return true;
      case 4:
        if (formData.movingCompanyType === 'Professional' && !formData.movingCompanyName) {
          alert('Please enter moving company name');
          return false;
        }
        return true;
      case 5:
        if (formData.hasInsurance && !formData.insuranceProvider) {
          alert('Please enter insurance provider');
          return false;
        }
        if (!formData.depositRefundAccount && formData.moveType === 'Move Out') {
          alert('Please enter bank details for deposit refund');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Move request submitted successfully!\n\nType: ${formData.moveType}\nDate: ${formData.moveDate}\nLoading Dock: ${formData.loadingDock}\n\nYou will receive confirmation once approved.`);
      router.push('/resident/move-requests');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
      setIsSaving(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageLayout>
      <ResidentHeader currentPage="New Move Request" />
      
      <PageHeader 
        title="New Move Request" 
        subtitle={`Step ${currentStep} of ${STEPS.length}: ${STEPS[currentStep - 1].title}`}
        icon={Building2}
        color="orange"
        showBackButton
        backUrl="/resident/move-requests"
      />

      {/* Progress Steps - Desktop */}
      <div className="hidden md:block px-3 sm:px-6 md:px-8 pb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isCompleted ? 'bg-green-600' : 
                    isCurrent ? 'bg-orange-600' : 
                    'bg-gray-700'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-8 h-8 text-white" />
                    ) : (
                      <Icon className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <p className={`mt-2 text-xs font-bold ${
                    isCurrent ? 'text-orange-400' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-1 flex-1 mx-1 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 pb-12">
        <div className="bg-gray-800 rounded-xl border-2 border-gray-700 p-6 sm:p-8 md:p-12 shadow-xl">
            
            {/* Step 1: Terms & Conditions - NOW FIRST! */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="bg-orange-600/10 border-2 border-orange-500 rounded-xl p-6 mb-6">
                  <h2 className="text-orange-300 font-bold mb-4 text-3xl sm:text-4xl md:text-5xl flex items-center gap-3">
                    <FileText className="w-10 h-10" />
                    Terms and Conditions
                  </h2>
                  <p className="text-orange-200 text-lg sm:text-xl md:text-2xl mb-4">
                    Please read and accept the following terms before proceeding with your move request:
                  </p>
                </div>
                
                <div className="bg-gray-900 rounded-xl p-6 sm:p-8 md:p-10 max-h-96 overflow-y-auto border-2 border-gray-700">
                  <div className="space-y-6 text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed">
                    <div>
                      <h4 className="text-white font-bold text-xl sm:text-2xl mb-3">1. Building Access</h4>
                      <p className="mb-2">• All movers must check in at security and receive temporary access cards.</p>
                      <p className="mb-2">• Service elevator must be reserved in advance and used exclusively for your move.</p>
                      <p className="mb-2">• Loading dock time slots are strictly enforced.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-bold text-xl sm:text-2xl mb-3">2. Liability and Insurance</h4>
                      <p className="mb-2">• You are responsible for any damage to building property, elevators, or common areas.</p>
                      <p className="mb-2">• Moving company must have valid liability insurance if using professional movers.</p>
                      <p className="mb-2">• Security deposit will be withheld to cover any damages.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-bold text-xl sm:text-2xl mb-3">3. Security Deposit</h4>
                      <p className="mb-2">• A refundable deposit of R{formData.depositAmount} is required.</p>
                      <p className="mb-2">• Deposit will be refunded within 7 business days if no damage occurs.</p>
                      <p className="mb-2">• Any deductions will be itemized and documented with photos.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-bold text-xl sm:text-2xl mb-3">4. Building Rules</h4>
                      <p className="mb-2">• Moves are only allowed Monday-Saturday, 8 AM - 6 PM (unless special permission granted).</p>
                      <p className="mb-2">• Common areas must not be blocked for more than 15 minutes.</p>
                      <p className="mb-2">• All furniture must be properly wrapped to prevent wall damage.</p>
                      <p className="mb-2">• Maximum 5 movers allowed in service elevator at one time.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-bold text-xl sm:text-2xl mb-3">5. Cancellation Policy</h4>
                      <p className="mb-2">• Must provide 48 hours notice for cancellation.</p>
                      <p className="mb-2">• Late cancellations may result in loss of deposit.</p>
                      <p className="mb-2">• Rescheduling subject to availability.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-600/20 border-2 border-orange-500 rounded-xl p-6 sm:p-8">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
                      className="w-10 h-10 mt-1 rounded border-orange-500 text-orange-600 focus:ring-orange-500 flex-shrink-0 cursor-pointer"
                      required
                    />
                    <div>
                      <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl">
                        I accept the terms and conditions <span className="text-red-400">*</span>
                      </span>
                      <p className="text-orange-200 text-base sm:text-lg md:text-xl mt-2">
                        By checking this box, you agree to comply with all building rules and accept responsibility for any damages during your move.
                      </p>
                    </div>
                  </label>
                </div>

                {!formData.termsAccepted && (
                  <div className="bg-red-600/20 border-l-4 border-red-500 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                      <p className="text-red-200 text-lg sm:text-xl font-semibold">
                        You must accept the terms and conditions to proceed with your move request.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Move Details */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Move Details</h2>
                
                <div>
                  <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                    Move Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      type="button"
                      onClick={() => updateFormData('moveType', 'Move In')}
                      className={`p-8 rounded-xl border-2 transition-all ${
                        formData.moveType === 'Move In'
                          ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                          : 'border-gray-600 text-gray-300 hover:border-orange-500/50'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold">Move In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFormData('moveType', 'Move Out')}
                      className={`p-8 rounded-xl border-2 transition-all ${
                        formData.moveType === 'Move Out'
                          ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                          : 'border-gray-600 text-gray-300 hover:border-orange-500/50'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold">Move Out</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                    Move Date <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 w-8 h-8 text-orange-400 pointer-events-none z-10" />
                    <input
                      type="date"
                      value={formData.moveDate}
                      onChange={(e) => updateFormData('moveDate', e.target.value)}
                      min={new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className="w-full pl-20 pr-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-orange-500 focus:outline-none text-xl sm:text-2xl md:text-3xl cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                      required
                    />
                  </div>
                  <p className="text-gray-400 text-base sm:text-lg md:text-xl mt-3">
                    📅 Click the field above to open the calendar picker • Must be at least 48 hours in advance
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                      Start Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => updateFormData('startTime', e.target.value)}
                      className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-orange-500 focus:outline-none text-xl sm:text-2xl md:text-3xl cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                      End Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => updateFormData('endTime', e.target.value)}
                      className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-orange-500 focus:outline-none text-xl sm:text-2xl md:text-3xl cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-600/20 border-l-4 border-blue-500 rounded-xl p-8">
                  <div className="flex items-start gap-6">
                    <AlertCircle className="w-12 h-12 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-blue-300 font-bold text-xl sm:text-2xl md:text-3xl mb-3">Building Hours</h3>
                      <p className="text-blue-100 text-lg sm:text-xl md:text-2xl leading-relaxed">
                        Standard moves: Monday - Saturday, 8:00 AM - 6:00 PM<br />
                        Sunday/Holiday moves incur additional charges
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Facilities */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Facility Requirements</h2>
                
                <div>
                  <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                    Loading Dock <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.loadingDock}
                    onChange={(e) => updateFormData('loadingDock', e.target.value)}
                    className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-orange-500 focus:outline-none text-xl sm:text-2xl md:text-3xl"
                    required
                  >
                    <option value="">Select a loading dock</option>
                    <option value="Dock 1">Loading Dock 1</option>
                    <option value="Dock 2">Loading Dock 2</option>
                  </select>
                </div>

                <div className="bg-gray-700/40 rounded-xl p-6">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.serviceElevator}
                      onChange={(e) => updateFormData('serviceElevator', e.target.checked)}
                      className="w-8 h-8 rounded border-gray-600 text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl">Service Elevator Required</span>
                      <p className="text-gray-400 text-base sm:text-lg md:text-xl mt-1">Reserved exclusively for your move</p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                    Visitor Parking Bay (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.visitorParkingBay}
                    onChange={(e) => updateFormData('visitorParkingBay', e.target.value)}
                    placeholder="e.g., Bay 12"
                    className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-orange-500 focus:outline-none text-xl sm:text-2xl md:text-3xl placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                    Number of Moving Trolleys
                  </label>
                  <input
                    type="number"
                    value={formData.movingTrolleys}
                    onChange={(e) => updateFormData('movingTrolleys', parseInt(e.target.value) || 0)}
                    min="0"
                    max="5"
                    className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-orange-500 focus:outline-none text-xl sm:text-2xl md:text-3xl"
                  />
                  <p className="text-gray-400 text-base sm:text-lg md:text-xl mt-3">Maximum 5 trolleys available</p>
                </div>

                <div>
                  <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                    Access Cards Needed
                  </label>
                  <input
                    type="number"
                    value={formData.accessCardsNeeded}
                    onChange={(e) => updateFormData('accessCardsNeeded', parseInt(e.target.value) || 0)}
                    min="0"
                    max="10"
                    className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-orange-500 focus:outline-none text-xl sm:text-2xl md:text-3xl"
                  />
                  <p className="text-gray-400 text-base sm:text-lg md:text-xl mt-3">Temporary access cards for movers</p>
                </div>
              </div>
            )}

            {/* Step 4: Moving Company */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Moving Company Details</h2>
                
                <div>
                  <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                    Moving Company Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <button
                      type="button"
                      onClick={() => {
                        updateFormData('movingCompanyType', 'Professional');
                      }}
                      className={`p-8 rounded-xl border-2 transition-all ${
                        formData.movingCompanyType === 'Professional'
                          ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                          : 'border-gray-600 text-gray-300 hover:border-orange-500/50'
                      }`}
                    >
                      <Truck className="w-12 h-12 mx-auto mb-4" />
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold block">Professional Movers</span>
                      <p className="text-sm sm:text-base md:text-lg mt-2 opacity-80">Licensed moving company</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateFormData('movingCompanyType', 'Self-Move');
                        updateFormData('movingCompanyName', '');
                        updateFormData('movingCompanyPhone', '');
                      }}
                      className={`p-8 rounded-xl border-2 transition-all ${
                        formData.movingCompanyType === 'Self-Move'
                          ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                          : 'border-gray-600 text-gray-300 hover:border-orange-500/50'
                      }`}
                    >
                      <span className="text-5xl mx-auto mb-4 block">🚚</span>
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold block">Self Move</span>
                      <p className="text-sm sm:text-base md:text-lg mt-2 opacity-80">Moving yourself</p>
                    </button>
                  </div>
                </div>

                {/* Professional Movers Details */}
                {formData.movingCompanyType === 'Professional' && (
                  <div className="space-y-8 bg-orange-600/10 border-2 border-orange-500/30 rounded-xl p-6 sm:p-8">
                    <div>
                      <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                        Moving Company Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.movingCompanyName}
                        onChange={(e) => updateFormData('movingCompanyName', e.target.value)}
                        placeholder="e.g., Swift Movers Ltd"
                        className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-orange-500 focus:outline-none text-xl sm:text-2xl md:text-3xl placeholder:text-gray-500"
                        required={formData.movingCompanyType === 'Professional'}
                      />
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-4 text-xl sm:text-2xl md:text-3xl">
                        Company Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.movingCompanyPhone}
                        onChange={(e) => updateFormData('movingCompanyPhone', e.target.value)}
                        placeholder="e.g., (555) 123-4567"
                        className="w-full px-6 py-6 bg-gray-900 text-white rounded-xl border-2 border-gray-600 focus:border-orange-500 focus:outline-none text-xl sm:text-2xl md:text-3xl placeholder:text-gray-500"
                        required={formData.movingCompanyType === 'Professional'}
                      />
                    </div>

                    <div className="bg-gray-700/40 rounded-xl p-6">
                      <label className="flex items-start gap-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.movingCompanyInsurance}
                          onChange={(e) => updateFormData('movingCompanyInsurance', e.target.checked)}
                          className="w-8 h-8 mt-1 rounded border-gray-600 text-orange-600 focus:ring-orange-500"
                        />
                        <div>
                          <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl flex items-center gap-2">
                            <Shield className="w-6 h-6" />
                            Moving Company Has Insurance
                          </span>
                          <p className="text-gray-400 text-base sm:text-lg md:text-xl mt-2">
                            Confirm that the moving company has valid liability insurance (recommended)
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="bg-blue-600/20 border-l-4 border-blue-500 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <AlertCircle className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-blue-300 font-bold text-xl sm:text-2xl mb-2">Professional Movers Recommended</h3>
                          <p className="text-blue-100 text-base sm:text-lg md:text-xl leading-relaxed">
                            Professional moving companies typically have insurance coverage and trained staff. 
                            Ensure they provide proof of insurance before the move date.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Self Move Information */}
                {formData.movingCompanyType === 'Self-Move' && (
                  <div className="bg-yellow-600/20 border-l-4 border-yellow-500 rounded-xl p-8">
                    <div className="flex items-start gap-6">
                      <AlertCircle className="w-12 h-12 text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-yellow-300 font-bold text-xl sm:text-2xl md:text-3xl mb-4">Self-Move Requirements</h3>
                        <ul className="space-y-3 text-yellow-100 text-lg sm:text-xl md:text-2xl">
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-400 font-bold">•</span>
                            <span>You are fully responsible for any damage to building property</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-400 font-bold">•</span>
                            <span>Personal insurance is strongly recommended</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-400 font-bold">•</span>
                            <span>You must still comply with all building rules and time restrictions</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-400 font-bold">•</span>
                            <span>The R{formData.depositAmount} deposit still applies and may be used for damages</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {currentStep === 5 && <div className="text-white text-2xl">Step 5: Insurance & Deposit (same content as old step 4)</div>}
            {currentStep === 6 && <div className="text-white text-2xl">Step 6: Additional Details (same content as old step 5)</div>}
            {currentStep === 7 && <div className="text-white text-2xl">Step 7: Review & Submit (same content as old step 6)</div>}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-6 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-all text-xl sm:text-2xl md:text-3xl"
                >
                  <ArrowLeft className="w-8 h-8" />
                  Previous
                </button>
              )}
              
              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-bold hover:from-orange-500 hover:to-orange-600 transition-all text-xl sm:text-2xl md:text-3xl"
                >
                  Next
                  <ArrowRight className="w-8 h-8" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-500 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl sm:text-2xl md:text-3xl"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-8 h-8" />
                      Submit Request
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
