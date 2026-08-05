'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * TitleBar — Custom window controls for Electron desktop app.
 * 
 * Features:
 * - Fixed at top with drag region for moving the window
 * - macOS-style traffic light controls (red, yellow, green)
 * - Only renders in Electron environment
 */
export default function TitleBar() {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(typeof window !== 'undefined' && 'electronAPI' in window);
  }, []);

  // Don't render in browser
  if (!isElectron) return null;

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.close();
    }
  };

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximize();
    }
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 h-8 bg-bg-secondary border-b border-white/10 flex items-center px-3 z-[9999]"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Traffic light controls */}
      <div
        className="flex items-center gap-2"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* Close */}
        <motion.button
          onClick={handleClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close window"
          className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-110 transition-all duration-150"
        />

        {/* Minimize */}
        <motion.button
          onClick={handleMinimize}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Minimize window"
          className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:brightness-110 transition-all duration-150"
        />

        {/* Maximize/Restore */}
        <motion.button
          onClick={handleMaximize}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Maximize window"
          className="w-3 h-3 rounded-full bg-[#28C840] hover:brightness-110 transition-all duration-150"
        />
      </div>

      {/* Title (centered) */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-xs text-text-muted font-medium select-none">
          TeamSpace
        </span>
      </div>

      {/* Right spacer to keep title centered */}
      <div className="w-[50px]" />
    </div>
  );
}
