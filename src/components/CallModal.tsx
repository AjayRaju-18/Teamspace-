'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

// ── Minimal interface for the Daily call frame ────────────────────────────────
// (Avoids importing Daily types at module level, which would run during SSR.)
interface DailyFrame {
  join(opts: { url: string }): Promise<unknown>;
  leave(): Promise<unknown>;
  destroy(): void;
  setLocalAudio(enabled: boolean): DailyFrame;
  setLocalVideo(enabled: boolean): DailyFrame;
}

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Daily.co room URL returned by /api/create-room */
  roomUrl: string;
}

/**
 * CallModal — a full-screen video call overlay powered by Daily.co.
 *
 * The Daily JS SDK is imported dynamically inside useEffect so it only ever
 * runs in the browser (never during Next.js SSR / static prerendering).
 *
 * Layout:
 *  - Full-screen panel (overrides Modal's default max-w-lg sizing)
 *  - Daily iframe fills 100% of the panel
 *  - Floating control bar at the bottom: Mic toggle · Camera toggle · End call
 */
export default function CallModal({ isOpen, onClose, roomUrl }: CallModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef     = useRef<DailyFrame | null>(null);

  const [micOn,    setMicOn]    = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  // ── Mount / unmount Daily frame ────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !roomUrl) return;

    let mounted = true;

    (async () => {
      // Dynamic import keeps the Daily SDK out of the server bundle entirely.
      const mod = await import('@daily-co/daily-js');
      const DailyIframe = mod.default;

      if (!mounted || !containerRef.current) return;

      const frame = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '0',
          background: '#000',
        },
        showLeaveButton: false,
        showFullscreenButton: false,
      }) as unknown as DailyFrame;

      frameRef.current = frame;

      await frame.join({ url: roomUrl });
    })();

    return () => {
      mounted = false;
      const frame = frameRef.current;
      if (frame) {
        frame.leave().catch(() => {}).finally(() => {
          frame.destroy();
        });
        frameRef.current = null;
      }
    };
  }, [isOpen, roomUrl]);

  // ── Controls ───────────────────────────────────────────────────────────────
  const toggleMic = () => {
    const next = !micOn;
    frameRef.current?.setLocalAudio(next);
    setMicOn(next);
  };

  const toggleCamera = () => {
    const next = !cameraOn;
    frameRef.current?.setLocalVideo(next);
    setCameraOn(next);
  };

  const handleLeave = async () => {
    const frame = frameRef.current;
    if (frame) {
      await frame.leave().catch(() => {});
      frame.destroy();
      frameRef.current = null;
    }
    onClose();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleLeave}
      /**
       * Override Modal's default centered-dialog sizing to create a
       * near-full-screen panel. The `!` prefix applies `!important` so these
       * values beat the defaults (max-w-lg, p-6) defined inside Modal.tsx.
       */
      className="!max-w-none !w-[calc(100vw-32px)] !h-[calc(100vh-32px)] !p-0 overflow-hidden"
    >
      {/* Wrapper that fills the panel and positions the control bar */}
      <div className="w-full h-full relative bg-black">

        {/* Daily.co iframe container — SDK appends its iframe here */}
        <div ref={containerRef} className="w-full h-full" />

        {/* ── Floating control bar ── */}
        <div
          className="absolute bottom-6 left-0 right-0 flex justify-center z-10 pointer-events-none"
          aria-label="Call controls"
        >
          <div className="flex items-center gap-3 bg-bg-secondary/90 backdrop-blur-md rounded-full px-5 py-3 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.55)] pointer-events-auto">

            {/* Mic toggle */}
            <motion.button
              aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
              onClick={toggleMic}
              whileTap={{ scale: 0.97 }}
              className={[
                'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-150',
                micOn
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-400',
              ].join(' ')}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </motion.button>

            {/* Camera toggle */}
            <motion.button
              aria-label={cameraOn ? 'Turn off camera' : 'Turn on camera'}
              onClick={toggleCamera}
              whileTap={{ scale: 0.97 }}
              className={[
                'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-150',
                cameraOn
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-400',
              ].join(' ')}
            >
              {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </motion.button>

            {/* End call */}
            <motion.button
              aria-label="Leave call"
              onClick={handleLeave}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-150 shadow-[0_2px_12px_rgba(239,68,68,0.4)]"
            >
              <PhoneOff className="w-5 h-5" />
            </motion.button>

          </div>
        </div>
      </div>
    </Modal>
  );
}
