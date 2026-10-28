'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabaseClient';
import Card from '@/components/Card';
import Button from '@/components/Button';

/** Classic macOS traffic-light colours */
const TRAFFIC_LIGHTS = [
  { color: '#FF5F56', label: 'Close' },
  { color: '#FFBD2E', label: 'Minimise' },
  { color: '#27C93F', label: 'Maximise' },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    setIsDemoMode(!url);
  }, []);

  /**
   * getSupabase() is called here — inside an event handler — so it never
   * runs during Next.js static prerendering. The lazy client is created only
   * when the user clicks the button.
   */
  const handleGoogleSignIn = async () => {
    if (isDemoMode) {
      // In demo mode, just redirect to workspace
      console.log('🎮 Demo Mode: Redirecting to workspace');
      router.push('/workspace');
      return;
    }

    try {
      const supabase = getSupabase();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
          scopes: 'https://www.googleapis.com/auth/drive.file',
        },
      });
    } catch (error) {
      console.error('Sign in error:', error);
      // If auth fails, redirect to workspace anyway in demo mode
      router.push('/workspace');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-primary px-4 pt-8">
      {/* Ambient glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <Card className="relative w-full max-w-sm p-8 overflow-hidden">
        {/* ── macOS traffic lights ── */}
        <div className="flex items-center gap-[7px] mb-8" aria-hidden="true">
          {TRAFFIC_LIGHTS.map(({ color, label }) => (
            <motion.span
              key={label}
              title={label}
              whileHover={{ scale: 1.1 }}
              className="block rounded-full cursor-default"
              style={{ width: 12, height: 12, backgroundColor: color }}
            />
          ))}
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="mb-6 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-xs text-accent text-center">
              🎮 Demo Mode - Click to explore the interface
            </p>
          </div>
        )}

        {/* ── App branding ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center gap-2 mb-8"
        >
          {/* Logo mark */}
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-[0_4px_20px_rgba(10,132,255,0.45)] mb-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M17 20H7a5 5 0 0 1 0-10h.09A5.5 5.5 0 0 1 17.5 5c.17 0 .34.01.5.03A5 5 0 0 1 17 20Z"
                fill="white"
                opacity="0.9"
              />
              <circle cx="8" cy="16" r="2" fill="white" opacity="0.6" />
              <circle cx="12" cy="16" r="2" fill="white" opacity="0.8" />
              <circle cx="16" cy="16" r="2" fill="white" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            TeamSpace
          </h1>
          <p className="text-text-muted text-sm">
            {isDemoMode ? 'Demo Mode - Explore the UI' : 'Sign in to continue'}
          </p>
        </motion.div>

        {/* ── Google sign-in button ── */}
        <Button
          id="google-signin-btn"
          variant="secondary"
          onClick={handleGoogleSignIn}
          className="w-full gap-3"
        >
          {/* Official Google "G" logo */}
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
              fill="#EA4335"
            />
          </svg>
          {isDemoMode ? 'Enter Demo Workspace' : 'Continue with Google'}
        </Button>

        {/* Fine print */}
        <p className="text-text-muted text-xs text-center mt-5 leading-relaxed">
          By continuing you agree to our{' '}
          <span className="text-accent hover:text-accent/80 hover:underline cursor-pointer transition-colors duration-150">
            Terms of Service
          </span>{' '}
          and{' '}
          <span className="text-accent hover:text-accent/80 hover:underline cursor-pointer transition-colors duration-150">
            Privacy Policy
          </span>
          .
        </p>

        {/* Setup instructions */}
        {isDemoMode && (
          <div className="mt-6 p-4 rounded-lg bg-bg-primary border border-white/10">
            <p className="text-xs text-text-muted leading-relaxed">
              <strong className="text-white block mb-2">Want full features?</strong>
              Create <code className="text-accent">.env.local</code> file with your Supabase credentials.
              See <code className="text-accent">.env.local.example</code> for details.
            </p>
          </div>
        )}
      </Card>
    </main>
  );
}
