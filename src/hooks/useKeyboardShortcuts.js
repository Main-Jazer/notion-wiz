import { useEffect, useCallback } from 'react';

/**
 * Hook to register global keyboard shortcuts
 * @param {Object} shortcuts - Object mapping key combinations to callbacks
 * @param {boolean} enabled - Whether shortcuts are enabled (default: true)
 * 
 * Example usage:
 * useKeyboardShortcuts({
 *   'cmd+k': () => openQuickSwitcher(),
 *   'cmd+e': () => openExport(),
 *   'cmd+b': () => goToBrandGenerator(),
 *   'cmd+/': () => focusSearch(),
 *   '?': () => openHelp(),
 *   'Escape': () => closeModals()
 * });
 */
export function useKeyboardShortcuts(shortcuts = {}, enabled = true) {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Build the key combination string
    const parts = [];
    if (event.ctrlKey || event.metaKey) parts.push('cmd');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    
    // Normalize the key
    const key = event.key.toLowerCase();
    parts.push(key);
    
    const combination = parts.join('+');
    
    // Also try without modifiers for simple keys
    const simpleKey = event.key;
    
    // Check if we have a handler for this combination
    const handler = shortcuts[combination] || shortcuts[simpleKey];
    
    if (handler) {
      // Prevent default behavior for registered shortcuts
      event.preventDefault();
      event.stopPropagation();
      handler(event);
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

/**
 * Format a keyboard shortcut for display
 * @param {string} combination - The key combination (e.g., 'cmd+k')
 * @returns {string} Formatted shortcut for display
 */
export function formatShortcut(combination) {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  
  return combination
    .split('+')
    .map(key => {
      switch (key.toLowerCase()) {
        case 'cmd':
          return isMac ? '⌘' : 'Ctrl';
        case 'alt':
          return isMac ? '⌥' : 'Alt';
        case 'shift':
          return isMac ? '⇧' : 'Shift';
        case 'escape':
          return 'Esc';
        default:
          return key.toUpperCase();
      }
    })
    .join(isMac ? '' : '+');
}
