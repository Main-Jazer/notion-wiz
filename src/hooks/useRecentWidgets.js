import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to track recently edited widgets
 * Stores recently accessed widgets in localStorage (default: 5, configurable)
 * 
 * @param {number} maxRecent - Maximum number of recent widgets to track (default: 5)
 * @returns {Object} { recentWidgets, addRecentWidget, clearRecent }
 */
export function useRecentWidgets(maxRecent = 5) {
  const STORAGE_KEY = 'notion_wiz_recent_widgets';

  const [recentWidgets, setRecentWidgets] = useState(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Add a widget to recent list
  const addRecentWidget = useCallback((widgetId, widgetLabel) => {
    setRecentWidgets(prev => {
      // Remove existing entry if present
      const filtered = prev.filter(w => w.id !== widgetId);
      
      // Add to front
      const updated = [
        {
          id: widgetId,
          label: widgetLabel,
          timestamp: Date.now()
        },
        ...filtered
      ].slice(0, maxRecent); // Keep only maxRecent items
      
      // Save to localStorage
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Silently fail if storage is unavailable
      }
      
      return updated;
    });
  }, [maxRecent]);

  // Clear all recent widgets
  const clearRecent = useCallback(() => {
    setRecentWidgets([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Silently fail
    }
  }, []);

  return {
    recentWidgets,
    addRecentWidget,
    clearRecent
  };
}

/**
 * Format timestamp as relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

export default useRecentWidgets;
