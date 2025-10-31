// Constants for the Strata Facility Management System

// Move request constants
export const MOVE_REQUEST_CONSTANTS = {
  MIN_ADVANCE_HOURS: 48,
  STANDARD_DEPOSIT: 500,
  REFUND_DAYS: 7,
  MAX_TROLLEYS: 5,
  MAX_ACCESS_CARDS: 10,
  STANDARD_HOURS: {
    START: '08:00',
    END: '18:00',
    DAYS: 'Monday - Saturday'
  }
} as const;

// Date/Time utilities
export const getMinMoveDate = () => {
  const minDate = new Date(Date.now() + MOVE_REQUEST_CONSTANTS.MIN_ADVANCE_HOURS * 60 * 60 * 1000);
  return minDate.toISOString().split('T')[0];
};

export const validateMoveDate = (dateString: string): boolean => {
  const selectedDate = new Date(dateString);
  const minDate = new Date(Date.now() + MOVE_REQUEST_CONSTANTS.MIN_ADVANCE_HOURS * 60 * 60 * 1000);
  return selectedDate >= minDate;
};

// Currency formatting
export const formatCurrency = (amount: number): string => {
  return `R${amount.toLocaleString()}`;
};

// Search filter utility
export const filterBySearch = <T extends Record<string, any>>(
  items: T[],
  searchQuery: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchQuery.trim()) return items;
  
  const query = searchQuery.toLowerCase();
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      return value && String(value).toLowerCase().includes(query);
    })
  );
};

// Stats calculation utility
export const calculateStats = <T extends { status: string }>(
  items: T[],
  statusMap: Record<string, string>
): Record<string, number> => {
  const stats: Record<string, number> = { total: items.length };
  
  Object.keys(statusMap).forEach(key => {
    stats[key] = items.filter(item => item.status === statusMap[key]).length;
  });
  
  return stats;
};
