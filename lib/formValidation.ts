import { MOVE_REQUEST_CONSTANTS, validateMoveDate } from './constants';
import type { MoveType, LoadingDock, MovingCompanyType } from './types';

export interface MoveRequestFormData {
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
  termsAccepted: boolean;
}

export const INITIAL_MOVE_REQUEST_DATA: MoveRequestFormData = {
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
  depositAmount: MOVE_REQUEST_CONSTANTS.STANDARD_DEPOSIT,
  depositRefundAccount: '',
  accessCardsNeeded: 2,
  vehicleDetails: '',
  specialRequirements: '',
  oversizedItems: false,
  oversizedItemDetails: '',
  termsAccepted: false,
};

export type ValidationError = string | null;

export const validateMoveRequestStep = (
  step: number, 
  formData: MoveRequestFormData
): ValidationError => {
  switch (step) {
    case 1: // Move Details
      if (!formData.moveDate) {
        return 'Please select a move date';
      }
      if (!validateMoveDate(formData.moveDate)) {
        return `Move date must be at least ${MOVE_REQUEST_CONSTANTS.MIN_ADVANCE_HOURS} hours in advance`;
      }
      if (!formData.startTime || !formData.endTime) {
        return 'Please select start and end times';
      }
      return null;

    case 2: // Facilities
      if (!formData.loadingDock) {
        return 'Please select a loading dock';
      }
      return null;

    case 3: // Moving Company
      if (formData.movingCompanyType === 'Professional' && !formData.movingCompanyName) {
        return 'Please enter moving company name';
      }
      return null;

    case 4: // Insurance & Deposit
      if (formData.hasInsurance && !formData.insuranceProvider) {
        return 'Please enter insurance provider';
      }
      if (!formData.depositRefundAccount && formData.moveType === 'Move Out') {
        return 'Please enter bank details for deposit refund';
      }
      return null;

    case 5: // Additional Details
      // No required fields
      return null;

    case 6: // Review & Submit
      if (!formData.termsAccepted) {
        return 'Please accept the terms and conditions to proceed';
      }
      return null;

    default:
      return null;
  }
};

// Validate entire form
export const validateMoveRequestForm = (formData: MoveRequestFormData): ValidationError => {
  for (let step = 1; step <= 6; step++) {
    const error = validateMoveRequestStep(step, formData);
    if (error) {
      return error;
    }
  }
  return null;
};
