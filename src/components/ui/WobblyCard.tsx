"use client";

import { ReactNode, useRef } from "react";

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
  rotation = 0,
  hover = true,
  tilt = true,
}: WobblyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const variants = {
    default: "bg-white",
    postit: "bg-postit",
    paper: "bg-paper",
  };

  const decorationClass =
    decoration === "tape" ? "tape" : decoration === "thumbtack" ? "thumbtack" : "";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 12; // Max tilt rotation
    const angleY = (x - xc) / 12;

    card.style.transition = "transform 0.1s ease-out, box-shadow 0.3s ease";
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) rotate(${rotation}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.boxShadow = "8px 8px 0px 0px #2d2d2d";
    card.style.zIndex = "10";
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease";
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) rotate(${rotation}deg) scale3d(1, 1, 1)`;
    card.style.boxShadow = ""; // Reverts to base CSS shadow
    card.style.zIndex = "";
  };

  const rotationStyle = rotation !== 0 ? { transform: `rotate(${rotation}deg)` } : {};

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`wobbly border-3 border-pencil shadow-hard-md p-6 relative ${
        variants[variant]
      } ${decorationClass} ${
        hover
          ? "transition-all duration-300 ease-out hover:shadow-hard-lg cursor-pointer"
          : ""
      } ${className}`}
      style={rotationStyle}
    >
      {children}
    </div>
  );
}
