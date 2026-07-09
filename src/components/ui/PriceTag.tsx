"use client";

interface PriceTagProps {
  priceCents: number;
  className?: string;
}

export function PriceTag({ priceCents, className = '' }: PriceTagProps) {
  const dollars = Math.floor(priceCents / 100);
  const cents = priceCents % 100;
  
  return (
    <span className={`inline-flex items-baseline font-[family-name:var(--font-kalam-var)] font-bold text-marker ${className}`}>
      <span className="text-lg">$</span>
      <span className="text-2xl">{dollars}</span>
      {cents > 0 && <span className="text-lg">.{cents.toString().padStart(2, '0')}</span>}
    </span>
  );
}
