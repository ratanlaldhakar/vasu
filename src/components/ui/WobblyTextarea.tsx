'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';

interface WobblyTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const WobblyTextarea = forwardRef<HTMLTextAreaElement, WobblyTextareaProps>(
  ({ className = '', label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil mb-1.5 text-lg">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 md:py-3 font-[family-name:var(--font-patrick-var)] text-pencil text-base md:text-lg placeholder:text-pencil/40 focus:outline-none focus:ring-3 focus:ring-ballpoint focus:border-ballpoint transition-all duration-100 resize-none ${className}`}
          rows={5}
          {...props}
        />
      </div>
    );
  }
);

WobblyTextarea.displayName = 'WobblyTextarea';
