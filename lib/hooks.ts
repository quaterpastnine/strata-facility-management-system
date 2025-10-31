import { useState, useEffect } from 'react';

/**
 * Generic data fetching hook with loading and error states
 */
export function useDataFetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, dependencies);

  return { data, loading, error, setData };
}

/**
 * Hook for managing search and filter state
 */
export function useSearchFilter<T extends string>(
  initialFilter: T | 'All' = 'All' as T | 'All'
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<T | 'All'>(initialFilter);

  const resetFilters = () => {
    setSearchQuery('');
    setFilterStatus(initialFilter);
  };

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    resetFilters
  };
}

/**
 * Hook for form data management with validation
 */
export function useFormData<T extends Record<string, any>>(
  initialData: T,
  validationFn?: (data: T) => string | null
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const updateField = (field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user updates it
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateMultiple = (updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validate = (): boolean => {
    if (validationFn) {
      const error = validationFn(formData);
      if (error) {
        setErrors({ _form: error } as any);
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const reset = () => {
    setFormData(initialData);
    setErrors({});
  };

  return {
    formData,
    updateField,
    updateMultiple,
    errors,
    setErrors,
    validate,
    reset,
    setFormData
  };
}
