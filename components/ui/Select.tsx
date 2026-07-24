import React from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full flex flex-col text-left space-y-2">
        <label htmlFor={selectId} className="text-sm font-medium text-neutral-300 tracking-wide">
          {label}
        </label>
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full bg-[#080808]/90 text-white rounded-xl border border-white/10 py-3 px-4 text-base font-sans transition-colors appearance-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 cursor-pointer',
              error ? 'border-red-500' : '',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            {...props}
          >
            <option value="" disabled className="bg-neutral-900 text-neutral-400">
              Select {label}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white py-1">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 text-neutral-400 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="text-xs text-red-500 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
