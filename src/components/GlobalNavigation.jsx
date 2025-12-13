import React, { useState, useEffect, useRef } from 'react';
import { Menu, Sparkles, HelpCircle, Newspaper } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

// Note: WIDGET_REGISTRY will be passed down as props or accessed through other means
// For now, we'll handle breadcrumbs without direct import to avoid circular dependency

/**
 * Global Navigation Component
 * Features:
 * - Horizontal tabs on desktop, dropdown on mobile
 * - Breadcrumb navigation
 * - Sticky header with backdrop blur
 * - Brand status badge
 */
export function GlobalNavigation({ 
  currentView, 
  onNavigateHome, 
  onNavigateBuilder, 
  onNavigateBrand,
  onOpenHelp,
  selectedWidgetId,
  selectedWidgetLabel, // Pass widget label from parent
  hasBrandTheme, 
  brandLabel 
}) {
  const navItems = [
    { id: 'landing', label: 'Widgets', action: onNavigateHome },
    { id: 'builder', label: 'Builder', action: onNavigateBuilder, disabled: !selectedWidgetId },
    { id: 'brand-generator', label: 'Brand Kit', action: onNavigateBrand }
  ];
  
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const navMenuRef = useRef(null);

  // Check if desktop (for responsive behavior)
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showNavMenu) return undefined;
    const handleClick = (event) => {
      if (!navMenuRef.current) return;
      if (!navMenuRef.current.contains(event.target)) {
        setShowNavMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNavMenu]);

  // Build breadcrumbs based on current view
  const breadcrumbs = React.useMemo(() => {
    const items = [{ label: 'Home', onClick: onNavigateHome }];
    
    if (currentView === 'builder' && selectedWidgetId && selectedWidgetLabel) {
      items.push({ label: selectedWidgetLabel, onClick: null });
      items.push({ label: 'Builder', onClick: null });
    } else if (currentView === 'brand-generator') {
      items.push({ label: 'Brand Generator', onClick: null });
    }
    
    return items;
  }, [currentView, selectedWidgetId, selectedWidgetLabel, onNavigateHome]);

  return (
    <header className="w-full border-b border-subtle bg-[#0B0E12]/90 backdrop-blur-md sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Logo/Branding */}
          <div className="flex items-center justify-between">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-3 focus-ring rounded-lg group"
              aria-label="Go to home"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center font-black text-white shadow-lg group-hover:scale-105 transition-transform">
                NW
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">JaZeR</p>
                <p className="text-base font-semibold text-white">Notion Wiz</p>
              </div>
            </button>

            {/* Mobile menu button */}
            {!isDesktop && (
              <button
                type="button"
                onClick={() => setShowNavMenu((prev) => !prev)}
                className="md:hidden p-2 rounded-lg border border-interactive text-neutral-200 hover:border-purple-300 hover:text-white transition focus-ring"
                aria-label="Toggle navigation menu"
                aria-expanded={showNavMenu}
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
            {/* Desktop: Horizontal tabs */}
            {isDesktop ? (
              <div className="flex items-center gap-2">
                {navItems.map(item => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.action}
                      disabled={item.disabled}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-semibold transition-all focus-ring
                        ${isActive
                          ? 'bg-purple-500/20 text-white border-2 border-purple-400 shadow-lg'
                          : 'text-neutral-300 hover:text-white hover:bg-white/5 border-2 border-transparent'
                        }
                        ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Mobile: Dropdown menu */
              <div className="relative" ref={navMenuRef}>
                {showNavMenu && (
                  <div className="absolute left-0 top-0 min-w-[200px] bg-[#0C0F16] border border-interactive rounded-xl shadow-2xl p-2 space-y-1 animate-fadeIn">
                    {navItems.map(item => {
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            item.action();
                            setShowNavMenu(false);
                          }}
                          disabled={item.disabled}
                          className={`
                            w-full px-4 py-2.5 rounded-lg text-left text-sm font-medium transition
                            ${isActive
                              ? 'bg-purple-500/20 border border-purple-400 text-white'
                              : 'bg-white/5 border border-subtle text-neutral-200 hover:border-purple-300 hover:text-white'
                            }
                            ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                          `}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Breadcrumbs - Desktop only */}
            {isDesktop && breadcrumbs.length > 1 && (
              <div className="hidden lg:block">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            )}

            {/* Secondary actions */}
            <div className="ml-auto flex items-center gap-3">
              {/* Brand status badge */}
              <div className="flex items-center gap-2 text-xs">
                <span className="hidden sm:inline uppercase tracking-widest text-neutral-500">Brand</span>
                <span className={`
                  px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5
                  ${hasBrandTheme 
                    ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200' 
                    : 'border-interactive bg-white/5 text-neutral-300'
                  }
                `}>
                  {hasBrandTheme && <Sparkles className="w-3 h-3" />}
                  <span className="hidden sm:inline">{hasBrandTheme ? brandLabel : 'JaZeR Neon'}</span>
                  <span className="sm:hidden">{hasBrandTheme ? '✓' : '–'}</span>
                </span>
              </div>

              {/* Help button */}
              {onOpenHelp && (
                <button
                  onClick={onOpenHelp}
                  className="p-2 rounded-lg border border-interactive text-neutral-300 hover:border-purple-300 hover:text-white transition focus-ring"
                  aria-label="Open help and shortcuts"
                  title="Keyboard shortcuts"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile breadcrumbs - shown below main nav */}
        {!isDesktop && breadcrumbs.length > 1 && (
          <div className="mt-3 pt-3 border-t border-subtle">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
      </div>
    </header>
  );
}

export default GlobalNavigation;
