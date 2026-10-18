import React from 'react';

interface ShapeProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Bunga 5 kelopak membulat khas moodboard Classly
 */
export const FlowerShape: React.FC<ShapeProps & { opacity?: number }> = ({
  size = 40,
  color = '#FFB2DD',
  opacity = 1,
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill={color}
    style={{ opacity, ...style }}
    className={className}
    aria-hidden="true"
  >
    <circle cx="50" cy="24" r="22" />
    <circle cx="75" cy="42" r="22" />
    <circle cx="65" cy="72" r="22" />
    <circle cx="35" cy="72" r="22" />
    <circle cx="25" cy="42" r="22" />
    <circle cx="50" cy="50" r="18" />
  </svg>
);

/**
 * Bintang / Asterisk 6-sudut membulat tebal khas moodboard Classly
 */
export const StarShape: React.FC<ShapeProps> = ({
  size = 32,
  color = '#9AAB65',
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill={color}
    style={style}
    className={className}
    aria-hidden="true"
  >
    {/* 3 rounded bars intersecting at 60 degree angles */}
    <rect x="38" y="10" width="24" height="80" rx="12" />
    <rect
      x="38"
      y="10"
      width="24"
      height="80"
      rx="12"
      transform="rotate(60 50 50)"
    />
    <rect
      x="38"
      y="10"
      width="24"
      height="80"
      rx="12"
      transform="rotate(120 50 50)"
    />
  </svg>
);

/**
 * Gelombang zig-zag playful khas moodboard Classly
 */
export const ZigZagShape: React.FC<ShapeProps & { width?: number; height?: number }> = ({
  width = 60,
  height = 24,
  color = '#FFB2DD',
  className,
  style,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 120 48"
    fill="none"
    stroke={color}
    strokeWidth="12"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    className={className}
    aria-hidden="true"
  >
    <path d="M 8,24 Q 20,4 32,24 T 56,24 T 80,24 T 104,24" />
  </svg>
);

/**
 * Ikon petir lembut khas moodboard Classly
 */
export const LightningShape: React.FC<ShapeProps> = ({
  size = 28,
  color = '#B6CAEB',
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill={color}
    style={style}
    className={className}
    aria-hidden="true"
  >
    <path d="M 18,2 L 7,16 L 15,16 L 13,30 L 25,14 L 17,14 Z" />
  </svg>
);

/**
 * Circular progress ring ringkas di sudut kartu bento
 */
interface CircularProgressRingProps {
  progressPercent: number; // 0..100
  size?: number;
  strokeWidth?: number;
  ringColor?: string;
  trackColor?: string;
}

export const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  progressPercent,
  size = 28,
  strokeWidth = 3.5,
  ringColor = '#9AAB65',
  trackColor = 'rgba(45, 45, 43, 0.12)',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const validPercent = Math.max(0, Math.min(100, progressPercent));
  const offset = circumference - (validPercent / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={ringColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="transparent"
        style={{ transition: 'stroke-dashoffset 0.35s ease' }}
      />
    </svg>
  );
};
