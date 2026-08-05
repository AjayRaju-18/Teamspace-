import React from "react";

interface AvatarProps {
  /** URL of the avatar image. Falls back to initials if omitted. */
  src?: string;
  /** Full display name — used for alt text and initials fallback. */
  name: string;
  /** Shows a green online-status dot when true. */
  isOnline?: boolean;
  /** Pixel size of the avatar circle. Defaults to 40. */
  size?: number;
}

/**
 * Avatar — circular profile image with an optional name-initial fallback
 * and an animated green online-status indicator.
 */
export default function Avatar({
  src,
  name,
  isOnline = false,
  size = 40,
}: AvatarProps) {
  /** Derive up to 2 uppercase initials from the display name. */
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  /** Scale font size proportionally to avatar size. */
  const fontSize = Math.round(size * 0.36);

  /** Status dot is ~25% of avatar size, min 10px. */
  const dotSize = Math.max(10, Math.round(size * 0.25));

  return (
    <div
      className="relative inline-block flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={`${name}'s avatar`}
          width={size}
          height={size}
          className="rounded-full object-cover w-full h-full ring-2 ring-white/10"
          draggable={false}
        />
      ) : (
        <div
          aria-label={`${name}'s avatar`}
          className="rounded-full bg-accent flex items-center justify-center text-white font-bold select-none ring-2 ring-white/10 w-full h-full"
          style={{ fontSize }}
        >
          {initials}
        </div>
      )}

      {/* Online status dot */}
      {isOnline && (
        <span
          aria-label="Online"
          className="absolute bottom-0 right-0 block rounded-full bg-green-500 border-2 border-bg-primary"
          style={{ width: dotSize, height: dotSize }}
        />
      )}
    </div>
  );
}
