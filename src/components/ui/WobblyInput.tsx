'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface WobblyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const WobblyInput = forwardRef<HTMLInputElement, WobblyInputProps>(
  ({ className = '', label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil mb-1.5 text-lg">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 md:py-3 min-h-[52px] font-[family-name:var(--font-patrick-var)] text-pencil text-base md:text-lg placeholder:text-erased focus:outline-none focus:ring-3 focus:ring-ballpoint focus:border-ballpoint transition-all duration-100 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

WobblyInput.displayName = 'WobblyInput';
