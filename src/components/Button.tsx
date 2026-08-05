"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  /** Visual style of the button. Defaults to 'primary'. */
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  /** Additional Tailwind classes */
  className?: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Button type */
  type?: "button" | "submit" | "reset";
  /** ID attribute */
  id?: string;
}

/**
 * Button — supports `primary` (accent blue) and `secondary` (dark surface) variants.
 * Includes hover, focus-ring, active scale, and disabled states.
 */
export default function Button({
  variant = "primary",
  children,
  className = "",
  onClick,
  disabled,
  type = "button",
  id,
}: ButtonProps) {
  const base = [
    "inline-flex items-center justify-center gap-2",
    "px-5 py-2.5 rounded-xl",
    "text-sm font-semibold tracking-wide",
    "transition-all duration-200 ease-out",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    "shadow-md",
  ].join(" ");

  const variants: Record<"primary" | "secondary", string> = {
    primary: [
      "bg-accent text-white",
      "hover:brightness-110",
      "focus-visible:ring-accent",
      "shadow-[0_4px_16px_rgba(10,132,255,0.35)]",
    ].join(" "),
    secondary: [
      "bg-bg-secondary text-white border border-white/10",
      "hover:bg-accent/5",
      "focus-visible:ring-white/25",
      "shadow-[0_4px_16px_rgba(0,0,0,0.4)]",
    ].join(" "),
  };

  return (
    <motion.button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
