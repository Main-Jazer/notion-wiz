import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Instagram, RefreshCcw } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme'; // Import useTheme

export const QuotesWidget = ({ config, onCustomizeRequest }) => {
  const { theme } = useTheme(); // Use the global theme
  const [currentQuote, setCurrentQuote] = useState({
    text: config.quoteText,
    author: config.author
  });
  const [isDark, setIsDark] = useState(() => {
    if (config.appearanceMode === 'dark') return true;
    if (config.appearanceMode === 'light') return false;
    if (config.appearanceMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [fetching, setFetching] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

  // Listen for system dark mode changes
  useEffect(() => {
    if (config.appearanceMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else if (config.appearanceMode === 'dark') {
      setIsDark(true);
    } else if (config.appearanceMode === 'light') {
      setIsDark(false);
    }
    // 'do-nothing' mode doesn't change isDark
  }, [config.appearanceMode]);

  useEffect(() => {
    setCurrentQuote({
      text: config.quoteText,
      author: config.author
    });
  }, [config.quoteText, config.author]);

  const fetchQuote = useCallback(async (signal) => {
    if (!config.useQuoteAPI) return;
    setFetching(true);
    try {
      const response = await fetch('https://api.quotable.io/random', { signal });
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      const data = await response.json();
      if (!signal?.aborted && isMountedRef.current) {
        setCurrentQuote({ text: data.content, author: data.author });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        // Silently fail and keep existing quote
      }
    } finally {
      if (!signal?.aborted && isMountedRef.current) {
        setFetching(false);
      }
    }
  }, [config.useQuoteAPI]);

  useEffect(() => {
    if (!config.useQuoteAPI) return undefined;
    const controller = new AbortController();
    fetchQuote(controller.signal);
    return () => controller.abort();
  }, [config.useQuoteAPI, fetchQuote]);

  useEffect(() => {
    if (!config.useQuoteAPI || config.autoRefreshInterval <= 0) {
      return undefined;
    }
    const interval = setInterval(() => {
      fetchQuote();
    }, config.autoRefreshInterval * 60 * 1000);
    return () => clearInterval(interval);
  }, [config.autoRefreshInterval, config.useQuoteAPI, fetchQuote]);

  // Font mapping
  const getFontFamily = (fontType) => {
    const fontMap = {
      body: theme.fonts.body,
      heading: theme.fonts.heading,
      serif: 'ui-serif, Georgia, serif',
      mono: 'ui-monospace, "Courier New", monospace'
    };
    return fontMap[fontType] || theme.fonts.body;
  };

  // Get colors based on appearance mode
  const textColor = isDark ? config.textColorDark : config.textColorLight;
  const quoteBackground = isDark ? config.quoteBackgroundDark : config.quoteBackgroundLight;
  const bgColor = config.useTransparentBackground
    ? 'transparent'
    : (config.setBackgroundColor ? config.backgroundColor : quoteBackground);

  // Text shadow calculation
  const textShadow = config.textShadows ? '0 2px 4px rgba(0,0,0,0.1)' : 'none';

  // Quote text styles
  const quoteTextStyle = {
    fontSize: `${config.fontSize}px`,
    fontFamily: getFontFamily(config.quoteTextFont),
    fontStyle: 'italic',
    lineHeight: '1.6',
    textShadow: textShadow,
    ...(config.gradientQuoteText && {
      background: theme.gradients.gradient,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    })
  };

  // Author/attribution styles
  const attributionStyle = {
    fontFamily: getFontFamily(config.attributionFont),
    color: config.authorColor,
    fontSize: '14px',
    fontWeight: 'bold',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    textShadow: textShadow
  };

  // Quote card styles
  const quoteCardStyle = {
    background: bgColor,
    color: config.gradientQuoteText ? textColor : textColor,
    textAlign: config.textAlign,
    padding: '48px',
    borderRadius: '16px',
    ...(config.gradientQuoteCardBorder && {
      border: '2px solid transparent',
      backgroundImage: `${theme.gradients.gradient}, ${bgColor}`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box'
    }),
    ...(config.glowQuoteCard && {
      boxShadow: theme.effects.glow
    })
  };

  // Refresh icon button styles
  const refreshButtonStyle = {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '50%',
    backgroundColor: config.useGradientRefreshIcon
      ? 'transparent'
      : `${config.refreshIconColor}20`,
    border: config.useGradientRefreshIcon ? `2px solid ${config.refreshIconColor}` : 'none',
    color: config.refreshIconColor,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ...(config.useGradientRefreshIcon && {
      background: theme.gradients.gradient,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    })
  };

  const refreshButtonHoverStyle = config.glowRefreshIconHover
    ? { filter: `drop-shadow(${theme.effects.glow})` }
    : {};

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full p-8 relative"
      style={{
        background: bgColor,
        color: textColor
      }}
    >
      {/* Loading overlay */}
      {fetching && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm z-10 rounded-lg">
          <span className="text-xl font-bold" style={{ fontFamily: theme.fonts.heading }}>
            Loading...
          </span>
        </div>
      )}

      {/* Quote card */}
      <div style={quoteCardStyle} className="max-w-3xl w-full">
        {/* Quote text */}
        <p className="mb-6" style={quoteTextStyle}>
          "{currentQuote.text}"
        </p>

        {/* Author and Instagram link */}
        <div className="flex flex-col items-center gap-2">
          <span style={attributionStyle}>
            — {currentQuote.author}
          </span>

          {config.instagramAccount && (
            <a
              href={`https://www.instagram.com/${config.instagramAccount}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs opacity-50 hover:opacity-100 hover:underline transition-opacity"
              style={{ color: textColor }}
            >
              <Instagram className="w-3 h-3" />
              @{config.instagramAccount}
            </a>
          )}
        </div>

        {/* Refresh icon */}
        {config.showRefreshIcon && (
          <button
            onClick={() => fetchQuote()}
            className="mx-auto hover:scale-110 transition-transform"
            style={refreshButtonStyle}
            onMouseEnter={(e) => {
              if (config.glowRefreshIconHover) {
                Object.assign(e.currentTarget.style, refreshButtonHoverStyle);
              }
            }}
            onMouseLeave={(e) => {
              if (config.glowRefreshIconHover) {
                e.currentTarget.style.filter = 'none';
              }
            }}
            aria-label="Refresh Quote"
            disabled={fetching || !config.useQuoteAPI}
          >
            <RefreshCcw className={`w-5 h-5 ${fetching ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Customize button */}
      {config.showCustomizeButton && (
        <button
          className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
          style={{
            backgroundColor: theme.colors.cosmicBlue,
            color: theme.colors.stardustWhite,
            fontFamily: theme.fonts.heading
          }}
          onClick={() => onCustomizeRequest?.('contentSource')}
        >
          Customize
        </button>
      )}
    </div>
  );
};
