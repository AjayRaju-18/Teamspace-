'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabaseClient';
import Avatar from '@/components/Avatar';
import CallModal from '@/components/CallModal';
import DriveView from '@/components/DriveView';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Hash,
  Settings,
  Phone,
  Video,
  MessageSquare,
  Send,
  Smile,
  Folder,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

// ── Static placeholder data ────────────────────────────────────────────────────

const CHANNELS = ['general', 'engineering', 'random'] as const;
type Channel = (typeof CHANNELS)[number];

const DMS = [
  { id: 1, name: 'Alice Johnson',  isOnline: true },
  { id: 2, name: 'Bob Smith',      isOnline: true },
  { id: 3, name: 'Charlie Brown',  isOnline: false },
] as const;

// ── Sub-components ─────────────────────────────────────────────────────────────

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-3 mb-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted px-2 mb-1 select-none">
        {title}
      </p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function ChannelItem({
  name,
  active,
  onClick,
}: {
  name: Channel;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={[
          'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors duration-150 text-left',
          active
            ? 'bg-accent/15 text-white font-medium'
            : 'text-text-muted hover:bg-accent/5 hover:text-white',
        ].join(' ')}
      >
        <Hash className="w-4 h-4 flex-shrink-0 opacity-70" />
        {name}
      </motion.button>
    </li>
  );
}

function DMItem({
  dm,
}: {
  dm: (typeof DMS)[number];
}) {
  return (
    <li>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-text-muted hover:bg-accent/5 hover:text-white transition-colors duration-150"
      >
        <Avatar name={dm.name} isOnline={dm.isOnline} size={24} />
        <span className="truncate">{dm.name}</span>
      </motion.button>
    </li>
  );
}

function IconBtn({
  children,
  label,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={[
        'flex items-center justify-center w-8 h-8 rounded-lg',
        'text-text-muted hover:text-white hover:bg-accent/10',
        'transition-colors duration-150',
        className,
      ].join(' ')}
    >
      {children}
    </motion.button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [user, setUser]               = useState<User | null>(null);
  const [loading, setLoading]         = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChannel, setActiveChannel] = useState<Channel>('general');
  const [message, setMessage]         = useState('');
  const [callRoomUrl, setCallRoomUrl]  = useState<string | null>(null);
  const [callOpen, setCallOpen]        = useState(false);
  const [view, setView]                = useState<'chat' | 'files'>('chat');

  // ── Session guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    getSupabase()
      .auth.getSession()
      .then(({ data }) => {
        if (cancelled) return;
        if (!data.session) {
          router.replace('/login');
        } else {
          setUser(data.session.user);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [router]);

  // ── Loading spinner ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  const userName   = user?.user_metadata?.full_name ?? user?.email ?? 'You';
  const userAvatar = user?.user_metadata?.avatar_url as string | undefined;

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessage('');
    inputRef.current?.focus();
  };

  // ── Start a Daily.co call ────────────────────────────────────────────────────
  const startCall = async () => {
    try {
      const res = await fetch('/api/create-room', { method: 'POST' });
      if (!res.ok) throw new Error('Room creation failed');
      const { url } = (await res.json()) as { url: string };
      setCallRoomUrl(url);
      setCallOpen(true);
    } catch (err) {
      console.error('[startCall]', err);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex overflow-hidden bg-bg-primary text-white pt-8">

      {/* ════ SIDEBAR ════════════════════════════════════════════════════════════ */}
      <aside
        style={{ width: sidebarOpen ? 260 : 0 }}
        className="flex-shrink-0 bg-bg-secondary flex flex-col overflow-hidden transition-[width] duration-300 ease-in-out border-r border-white/10"
      >
        {/* Inner wrapper keeps content at 260px so transitions look clean */}
        <div className="w-[260px] flex flex-col h-full">

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 h-[60px] flex-shrink-0 border-b border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              {/* Logo placeholder */}
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(10,132,255,0.4)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M17 20H7a5 5 0 0 1 0-10h.09A5.5 5.5 0 0 1 17.5 5c.17 0 .34.01.5.03A5 5 0 0 1 17 20Z"
                    fill="white" opacity="0.9"
                  />
                  <circle cx="8"  cy="16" r="2" fill="white" opacity="0.6" />
                  <circle cx="12" cy="16" r="2" fill="white" opacity="0.8" />
                  <circle cx="16" cy="16" r="2" fill="white" />
                </svg>
              </div>
              <span className="font-bold text-sm tracking-tight truncate">TeamSpace</span>
            </div>

            {/* Collapse chevron */}
            <motion.button
              aria-label="Collapse sidebar"
              onClick={() => setSidebarOpen(false)}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-text-muted hover:text-white hover:bg-accent/10 transition-colors duration-150 flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
          </div>

          {/* ── Scrollable nav ── */}
          <nav className="flex-1 overflow-y-auto py-4 space-y-1">

            {/* Files */}
            <div className="px-3 mb-3">
              <motion.button
                onClick={() => setView('files')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={[
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors duration-150 text-left',
                  view === 'files'
                    ? 'bg-accent/15 text-white font-medium'
                    : 'text-text-muted hover:bg-accent/5 hover:text-white',
                ].join(' ')}
              >
                <Folder className="w-4 h-4 flex-shrink-0 opacity-70" />
                Files
              </motion.button>
            </div>

            <SidebarSection title="Channels">
              {CHANNELS.map((ch) => (
                <ChannelItem
                  key={ch}
                  name={ch}
                  active={activeChannel === ch && view === 'chat'}
                  onClick={() => { setActiveChannel(ch); setView('chat'); }}
                />
              ))}
            </SidebarSection>

            <SidebarSection title="Direct Messages">
              {DMS.map((dm) => (
                <DMItem key={dm.id} dm={dm} />
              ))}
            </SidebarSection>

          </nav>

          {/* ── User footer ── */}
          <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3 border-t border-white/10 bg-bg-secondary">
            <Avatar src={userAvatar} name={userName} isOnline size={32} />
            <span className="flex-1 text-sm font-medium truncate min-w-0">{userName}</span>
            <motion.button
              aria-label="Settings"
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 text-text-muted hover:text-white hover:bg-accent/10 rounded-lg w-7 h-7 flex items-center justify-center transition-colors duration-150"
            >
              <Settings className="w-4 h-4" />
            </motion.button>
          </div>

        </div>
      </aside>

      {/* ════ MAIN PANEL ═════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 bg-bg-primary">

        {/* ── Top bar ── */}
        <header className="h-[60px] flex-shrink-0 flex items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            {/* Expand button — visible only when sidebar is closed */}
            {!sidebarOpen && (
              <motion.button
                aria-label="Expand sidebar"
                onClick={() => setSidebarOpen(true)}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-white hover:bg-accent/10 transition-colors duration-150 mr-1"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
            {view === 'files' ? (
              <>
                <Folder className="w-5 h-5 text-text-muted flex-shrink-0" />
                <h1 className="font-semibold text-white text-sm">Files</h1>
                <span className="text-text-muted text-xs hidden sm:block ml-1">— Google Drive</span>
              </>
            ) : (
              <>
                <Hash className="w-5 h-5 text-text-muted flex-shrink-0" />
                <h1 className="font-semibold text-white text-sm">{activeChannel}</h1>
                <span className="text-text-muted text-xs hidden sm:block ml-1">— Team channel</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            {view === 'chat' && (
              <>
                <IconBtn label="Start voice call" onClick={startCall}><Phone className="w-4 h-4" /></IconBtn>
                <IconBtn label="Start video call" onClick={startCall}><Video className="w-4 h-4" /></IconBtn>
              </>
            )}
          </div>
        </header>

        {/* ── Main content: Drive or Chat ── */}
        {view === 'files' ? (
          <DriveView />
        ) : (
          <>
            {/* ── Message area ── */}
            <div className="flex-1 overflow-y-auto flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-3 select-none"
              >
                <MessageSquare className="w-12 h-12 text-text-muted" />
                <div className="text-center">
                  <p className="text-white text-sm font-medium mb-0.5">
                    Welcome to #{activeChannel}
                  </p>
                  <p className="text-text-muted text-xs">
                    No messages yet. Be the first to say something!
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── Message input ── */}
            <div className="flex-shrink-0 px-4 pb-4 pt-2">
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 bg-bg-secondary rounded-full px-4 py-2.5 border border-white/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.3)] focus-within:border-accent/40 transition-colors duration-200"
              >
                <motion.button
                  type="button"
                  aria-label="Add emoji"
                  whileTap={{ scale: 0.97 }}
                  className="flex-shrink-0 text-text-muted hover:text-accent transition-colors duration-150"
                >
                  <Smile className="w-5 h-5" />
                </motion.button>

                <input
                  ref={inputRef}
                  id="message-input"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message #${activeChannel}`}
                  autoComplete="off"
                  className="flex-1 bg-transparent text-sm text-white placeholder-[#8E8E93] focus:outline-none min-w-0"
                />

                <motion.button
                  type="submit"
                  aria-label="Send message"
                  disabled={!message.trim()}
                  whileTap={{ scale: 0.97 }}
                  className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all duration-150"
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </form>
            </div>
          </>
        )}

      </main>

      {/* ── Call modal (rendered outside the layout flow; uses fixed positioning) ── */}
      {callRoomUrl && (
        <CallModal
          isOpen={callOpen}
          onClose={() => { setCallOpen(false); setCallRoomUrl(null); }}
          roomUrl={callRoomUrl}
        />
      )}
    </div>
  );
}
