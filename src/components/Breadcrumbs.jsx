import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb navigation component
 * Shows the current location in the app hierarchy
 * 
 * @param {Array} items - Array of breadcrumb items [{ label, onClick }]
 * @param {string} className - Additional CSS classes
 */
export function Breadcrumbs({ items = [], className = '' }) {
  if (items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHome = index === 0 && item.label === 'Home';
          
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight 
                  className="w-4 h-4 text-neutral-500" 
                  aria-hidden="true" 
                />
              )}
              
              {isLast ? (
                <span 
                  className="text-white font-medium flex items-center gap-1.5"
                  aria-current="page"
                >
                  {isHome && <Home className="w-4 h-4" />}
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={item.onClick}
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 focus-ring rounded px-1 -mx-1"
                  type="button"
                >
                  {isHome && <Home className="w-4 h-4" />}
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
