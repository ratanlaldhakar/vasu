"use client";

import { ReactNode } from 'react';

interface SectionHeadingProps {
  children: ReactNode;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionHeading({ children, subtitle, className = '', align = 'center', as = 'h2' }: SectionHeadingProps) {
  const Component = as;
  return (
    <div className={`mb-8 md:mb-12 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      <Component className="text-3xl md:text-5xl font-bold text-pencil mb-3">
        {children}
      </Component>
      {subtitle && (
        <p className="text-base md:text-xl text-pencil-muted max-w-2xl mx-auto px-2 md:px-0">
          {subtitle}
        </p>
      )}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="block w-8 h-1 bg-marker wobbly"></span>
        <span className="block w-16 h-1 bg-pencil wobbly-md"></span>
        <span className="block w-8 h-1 bg-marker wobbly"></span>
      </div>
    </div>
  );
}
