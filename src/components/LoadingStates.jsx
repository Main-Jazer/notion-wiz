import React from 'react';
import { Loader } from 'lucide-react';

/**
 * Loading state components for different scenarios
 */

// Skeleton screen for content loading
export function Skeleton({ className = '', height = 'h-4', width = 'w-full' }) {
  return (
    <div 
      className={`${height} ${width} bg-white/10 rounded animate-pulse ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
}

// Skeleton for card layouts
export function SkeletonCard() {
  return (
    <div className="bg-white/5 border-interactive rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton height="h-10" width="w-10" className="rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton height="h-4" width="w-32" />
          <Skeleton height="h-3" width="w-48" />
        </div>
      </div>
      <Skeleton height="h-20" />
      <div className="flex gap-2">
        <Skeleton height="h-8" width="w-20" />
        <Skeleton height="h-8" width="w-24" />
      </div>
    </div>
  );
}

// Spinner overlay for full-screen loading
export function SpinnerOverlay({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0B0E12] border-2 border-purple-400/30 rounded-2xl p-8 flex flex-col items-center gap-4">
        <Loader className="w-12 h-12 text-purple-400 animate-spin" />
        <p className="text-white font-medium">{message}</p>
      </div>
    </div>
  );
}

// Inline spinner for button loading states
export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  return (
    <Loader 
      className={`${sizes[size]} animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

// Progress bar for operations with known duration
export function ProgressBar({ progress = 0, className = '' }) {
  return (
    <div className={`w-full h-2 bg-white/10 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
  );
}

// Loading state for lists
export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
          <Skeleton height="h-8" width="w-8" className="rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton height="h-3" width="w-32" />
            <Skeleton height="h-3" width="w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading state for switching widgets
export function WidgetSwitchLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-400/30 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-white font-medium">Loading widget...</p>
        <p className="text-sm text-neutral-400">Please wait a moment</p>
      </div>
    </div>
  );
}

export default {
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SpinnerOverlay,
  Spinner,
  ProgressBar,
  WidgetSwitchLoading
};
