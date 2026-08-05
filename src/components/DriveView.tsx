'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getSupabase } from '@/lib/supabaseClient';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Folder, Upload, Loader2, RefreshCw } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  iconLink?: string;
  webViewLink?: string;
  modifiedTime?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * DriveView — displays and manages the signed-in user's Google Drive files.
 *
 * Auth flow:
 *   1. Reads `session.provider_token` (Google OAuth access token) client-side.
 *   2. Passes it as `Authorization: Bearer <token>` to our own API routes,
 *      which proxy the Google Drive API calls server-side.
 */
export default function DriveView() {
  const [files,     setFiles]     = useState<DriveFile[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Get Google OAuth token from the Supabase session ──────────────────────
  const getProviderToken = async (): Promise<string> => {
    const { data } = await getSupabase().auth.getSession();
    const token = data.session?.provider_token;
    if (!token) {
      throw new Error(
        'No Google OAuth token found. Please sign out and sign back in to reconnect Drive.',
      );
    }
    return token;
  };

  // ── Fetch file list ────────────────────────────────────────────────────────
  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getProviderToken();
      const res   = await fetch('/api/drive/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Drive list failed (${res.status})`);
      }
      const data = await res.json();
      setFiles((data.files as DriveFile[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Upload handler ─────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const token    = await getProviderToken();
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/drive/upload', {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Upload failed (${res.status})`);
      }

      // Refetch the file list to show the newly uploaded file
      await fetchFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Section header ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <p className="font-semibold text-white text-sm">Google Drive</p>
          <p className="text-text-muted text-xs mt-0.5">Your team&apos;s shared files</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <motion.button
            onClick={fetchFiles}
            disabled={loading}
            aria-label="Refresh file list"
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-white hover:bg-accent/10 transition-colors duration-150 disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            id="drive-file-input"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Upload button */}
          <Button
            id="drive-upload-btn"
            variant="primary"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 text-sm"
          >
            {uploading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Upload className="w-4 h-4" />
            }
            {uploading ? 'Uploading…' : 'Upload'}
          </Button>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-text-muted animate-spin" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-full gap-4 text-center max-w-sm mx-auto"
          >
            <Folder className="w-12 h-12 text-text-muted" />
            <div>
              <p className="text-white text-sm font-medium mb-1">Could not load files</p>
              <p className="text-text-muted text-xs leading-relaxed">{error}</p>
            </div>
            <Button variant="secondary" onClick={fetchFiles} className="text-sm">
              Try again
            </Button>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && files.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-full gap-3 select-none"
          >
            <Folder className="w-12 h-12 text-text-muted" />
            <div className="text-center">
              <p className="text-white text-sm font-medium mb-0.5">No files yet</p>
              <p className="text-text-muted text-xs">
                Upload a file or create one in Google Drive
              </p>
            </div>
          </motion.div>
        )}

        {/* File grid */}
        {!loading && !error && files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {files.map((file) => (
              <Card
                key={file.id}
                onClick={() => {
                  if (file.webViewLink) window.open(file.webViewLink, '_blank', 'noopener');
                }}
                className="flex flex-col items-center text-center gap-2.5 !p-4 group"
              >
                {/* File icon from Google Drive (16px → display at 40px) */}
                {file.iconLink ? (
                  <img
                    src={file.iconLink}
                    alt=""
                    aria-hidden="true"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-150 pointer-events-none"
                    draggable={false}
                  />
                ) : (
                  <Folder className="w-10 h-10 text-text-muted flex-shrink-0" />
                )}

                {/* File name */}
                <p
                  className="text-white text-xs font-medium leading-snug line-clamp-2 w-full"
                  title={file.name}
                >
                  {file.name}
                </p>

                {/* Modified date */}
                {file.modifiedTime && (
                  <p className="text-text-muted text-[10px] mt-auto leading-none">
                    {formatDate(file.modifiedTime)}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
