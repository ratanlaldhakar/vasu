"use client";

import { forwardRef } from "react";
import Link from "next/link";

interface WobblyButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "marker" | "ballpoint";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

export const WobblyButton = forwardRef<any, WobblyButtonProps>(
  ({ className = "", variant = "primary", size = "md", href, children, ...props }, ref) => {
    const baseClasses =
      "wobbly inline-flex items-center justify-center font-[family-name:var(--font-kalam-var)] font-bold border-3 border-pencil transition-all duration-100 cursor-pointer select-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

    const variants = {
      primary:
        "bg-white text-pencil shadow-hard-md hover:bg-marker hover:text-white hover:shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px]",
      secondary:
        "bg-postit text-pencil shadow-hard-md hover:shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px]",
      ghost:
        "bg-transparent text-pencil border-dashed hover:bg-erased shadow-none hover:shadow-none font-bold",
      marker:
        "bg-marker text-white shadow-hard-md hover:bg-pencil hover:text-white hover:shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px]",
      ballpoint:
        "bg-ballpoint text-white shadow-hard-md hover:bg-pencil hover:text-white hover:shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px]",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm min-h-[44px] md:min-h-[36px]",
      md: "px-6 py-2.5 text-base min-h-[52px] md:min-h-[48px]",
      lg: "px-8 py-3 text-lg min-h-[52px] md:min-h-[56px]",
    };

    const variantKey = (variant || "primary") as keyof typeof variants;
    const sizeKey = (size || "md") as keyof typeof sizes;

    let variantClasses = variants[variantKey] || variants.primary;

    // If custom background class is provided in className (e.g. bg-marker, bg-ballpoint), strip default bg-white & text-pencil
    if (className.includes("bg-") && variant === "primary") {
      variantClasses = "shadow-hard-md hover:shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px]";
    }

    const combinedClasses = `${baseClasses} ${variantClasses} ${sizes[sizeKey]} ${className}`;

    if (href) {
      // Check if external link
      const isExternal = href.startsWith("http") || href.startsWith("//");
      if (isExternal) {
        return (
          <a
            ref={ref}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClasses}
            {...props}
          >
            {children}
          </a>
        );
      }

      return (
        <Link ref={ref} href={href} className={combinedClasses} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClasses} {...props}>
        {children}
      </button>
    );
  }
);

WobblyButton.displayName = "WobblyButton";
