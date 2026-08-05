"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  /** Controls modal visibility. */
  isOpen: boolean;
  /** Called when the user clicks the backdrop or presses Escape. */
  onClose: () => void;
  /** Optional header title shown at the top of the panel. */
  title?: string;
  children: React.ReactNode;
  /** Additional Tailwind classes for the inner panel. */
  className?: string;
}

/**
 * Modal — a centered overlay dialog with:
 * - `backdrop-blur-md` frosted-glass background
 * - `bg-bg-secondary/90` dark panel
 * - Escape key + backdrop-click to close
 * - Body scroll lock while open
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* ── Panel ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={[
              "relative z-10 w-full max-w-lg",
              "bg-bg-secondary/90 backdrop-blur-md",
              "rounded-xl border border-white/10",
              "shadow-[0_24px_80px_rgba(0,0,0,0.65)]",
              "p-6",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-4">
                <h2
                  id="modal-title"
                  className="text-base font-semibold text-white tracking-tight"
                >
                  {title}
                </h2>
                <motion.button
                  onClick={onClose}
                  aria-label="Close modal"
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-text-muted hover:text-white hover:bg-accent/10 transition-colors duration-150 text-sm leading-none"
                >
                  ✕
                </motion.button>
              </div>
            )}

            {/* Content */}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
