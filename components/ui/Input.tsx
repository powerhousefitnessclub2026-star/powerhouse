import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full flex flex-col text-left space-y-2">
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-300 tracking-wide">
          {label}
        </label>
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3.5 text-neutral-400 pointer-events-none">{icon}</div>}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-[#080808]/90 text-white rounded-xl border border-white/10 py-3 text-base font-sans transition-colors placeholder:text-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500',
              icon ? 'pl-11 pr-4' : 'px-4',
              error ? 'border-red-500 focus:ring-red-500' : '',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-500 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
