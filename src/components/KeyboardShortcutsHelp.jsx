import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { formatShortcut } from '../hooks/useKeyboardShortcuts';

/**
 * Modal displaying available keyboard shortcuts
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Callback to close the modal
 */
export function KeyboardShortcutsHelp({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: 'cmd+k', description: 'Open quick widget switcher' },
        { keys: 'cmd+/', description: 'Focus search input' },
        { keys: 'Escape', description: 'Close modals and overlays' },
      ]
    },
    {
      category: 'Actions',
      items: [
        { keys: 'cmd+e', description: 'Open export modal' },
        { keys: 'cmd+b', description: 'Go to brand generator' },
        { keys: 'cmd+s', description: 'Quick save (export)' },
      ]
    },
    {
      category: 'Help',
      items: [
        { keys: '?', description: 'Show this help dialog' },
      ]
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        className="bg-[#0B0E12] border-2 border-purple-400/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Keyboard className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 id="shortcuts-title" className="text-xl font-bold text-white">
                Keyboard Shortcuts
              </h2>
              <p className="text-sm text-neutral-400">
                Boost your productivity with these shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors focus-ring"
            aria-label="Close shortcuts dialog"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(80vh-120px)] space-y-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-xs uppercase tracking-wider font-bold text-purple-400 mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm text-neutral-300">
                      {item.description}
                    </span>
                    <kbd className="px-3 py-1.5 bg-[#1F2937] border border-white/20 rounded-lg text-xs font-mono text-white shadow-sm">
                      {formatShortcut(item.keys)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5">
          <p className="text-xs text-neutral-400 text-center">
            Press <kbd className="px-2 py-0.5 bg-[#1F2937] border border-white/20 rounded text-[10px] font-mono">?</kbd> anytime to see this dialog
          </p>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsHelp;
