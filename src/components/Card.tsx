"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  /** Additional Tailwind classes to merge onto the card root. */
  className?: string;
  /** Optional click handler — adds cursor-pointer and hover highlight. */
  onClick?: () => void;
}

/**
 * Card — a rounded dark surface container with a subtle border and shadow.
 * Use `className` to override padding, width, or add extra utilities.
 */
export default function Card({ children, className = "", onClick }: CardProps) {
  const interactive = onClick
    ? "cursor-pointer hover:border-accent/20 hover:bg-accent/5 transition-colors duration-200"
    : "";

  const Component = onClick ? motion.div : "div";
  const motionProps = onClick ? { whileTap: { scale: 0.97 } } : {};

  return (
    <Component
      onClick={onClick}
      {...motionProps}
      className={[
        "bg-bg-secondary rounded-xl p-6",
        "border border-white/[0.07]",
        "shadow-[0_4px_24px_rgba(0,0,0,0.45)]",
        interactive,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Component>
  );
}
