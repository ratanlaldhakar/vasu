"use client";

import { ReactNode } from "react";

interface WobblyCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "postit" | "paper";
  decoration?: "none" | "tape" | "thumbtack";
  rotation?: number;
  hover?: boolean;
  tilt?: boolean;
}

export function WobblyCard({
  children,
  className = "",
  variant = "default",
  decoration = "none",
  // rotation and tilt are accepted for backward compatibility but intentionally unused
  // to prevent GPU-layer rasterization blur on text
  rotation: _rotation,
  hover = true,
  tilt: _tilt,
}: WobblyCardProps) {

  const variants = {
    default: "bg-white",
    postit: "bg-postit",
    paper: "bg-paper",
  };

  const decorationClass =
    decoration === "tape" ? "tape" : decoration === "thumbtack" ? "thumbtack" : "";

  return (
    <div
      className={`wobbly border-3 border-pencil shadow-hard-md p-6 relative ${
        variants[variant]
      } ${decorationClass} ${
        hover
          ? "transition-shadow duration-300 ease-out hover:shadow-hard-lg cursor-pointer"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

