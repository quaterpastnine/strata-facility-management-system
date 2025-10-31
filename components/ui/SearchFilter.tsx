import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search...' 
}: SearchInputProps) {
  return (
    <div className="flex-1 relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 pr-4 py-5 bg-gray-800/60 text-white rounded-xl border border-gray-600 focus:border-orange-500 focus:outline-none text-xl"
      />
    </div>
  );
}

interface FilterSelectProps<T extends string> {
  value: T | 'All';
  onChange: (value: T | 'All') => void;
  options: T[];
  label?: string;
}

export function FilterSelect<T extends string>({ 
  value, 
  onChange, 
  options,
  label = 'All Status'
}: FilterSelectProps<T>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T | 'All')}
      className="px-6 py-5 bg-gray-800/60 text-white rounded-xl border border-gray-600 focus:border-orange-500 focus:outline-none text-xl min-w-[200px]"
    >
      <option value="All">{label}</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}

interface SearchFilterBarProps<T extends string> {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterValue: T | 'All';
  onFilterChange: (value: T | 'All') => void;
  filterOptions: T[];
  filterLabel?: string;
}

export function SearchFilterBar<T extends string>({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel
}: SearchFilterBarProps<T>) {
  return (
    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
      <SearchInput 
        value={searchValue}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
      <FilterSelect
        value={filterValue}
        onChange={onFilterChange}
        options={filterOptions}
        label={filterLabel}
      />
    </div>
  );
}
