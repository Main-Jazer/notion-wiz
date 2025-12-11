import React, { useState, useEffect, useMemo } from 'react';
import { generateBrandPresets } from '../../utils/brandThemeGenerator';
import { useTheme } from '../../hooks/useTheme'; // Import useTheme

// Preset themes
const PRESET_THEMES = {
  cyberpunk: {
    backgroundColor: '#0a0e27',
    clockColor: '#00ffff',
    digitColor: '#0a0e27',
    textColor: '#ff00ff',
    texture: 'grid',
    glow: true
  },
  stealth: {
    backgroundColor: '#0B0E12',
    clockColor: '#2D3748',
    digitColor: '#E2E8F0',
    textColor: '#4A5568',
    texture: 'none',
    glow: false
  },
  ocean: {
    backgroundColor: '#0c4a6e',
    clockColor: '#06b6d4',
    digitColor: '#f0f9ff',
    textColor: '#bae6fd',
    texture: 'waves',
    glow: true
  },
  sunset: {
    backgroundColor: '#7c2d12',
    clockColor: '#f59e0b',
    digitColor: '#451a03',
    textColor: '#fbbf24',
    texture: 'none',
    glow: true
  },
  forest: {
    backgroundColor: '#14532d',
    clockColor: '#22c55e',
    digitColor: '#052e16',
    textColor: '#86efac',
    texture: 'dots',
    glow: false
  },
  neon: {
    backgroundColor: '#18181b',
    clockColor: '#ec4899',
    digitColor: '#fdf4ff',
    textColor: '#f0abfc',
    texture: 'noise',
    glow: true
  },
  midnight: {
    backgroundColor: '#1e1b4b',
    clockColor: '#818cf8',
    digitColor: '#eef2ff',
    textColor: '#c7d2fe',
    texture: 'stars',
    glow: true
  }
};

// Helper component for flip clock cards with 3D animation
const FlipCard = ({ value, label, colors, size }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (value === prevValue) return undefined;
    let flipTimer;
    let settleTimer;
    let finalizeTimer;
    flipTimer = setTimeout(() => {
      setIsFlipping(true);
      settleTimer = setTimeout(() => {
        setDisplayValue(value);
        finalizeTimer = setTimeout(() => {
          setIsFlipping(false);
          setPrevValue(value);
        }, 300);
      }, 300);
    }, 0);
    return () => {
      clearTimeout(flipTimer);
      clearTimeout(settleTimer);
      clearTimeout(finalizeTimer);
    };
  }, [value, prevValue]);

  const cardStyle = {
    width: `${size * 0.7}px`,
    height: `${size}px`,
    background: colors.clockColor || '#333',
    borderRadius: '8px',
    color: colors.digitColor || '#fff',
    fontSize: `${size * 0.65}px`,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    position: 'relative',
    overflow: 'hidden',
    perspective: '1000px',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
    transform: isFlipping ? 'rotateX(90deg)' : 'rotateX(0deg)'
  };

  return (
    <div className="inline-flex flex-col items-center mx-1">
      <div style={cardStyle}>
        {/* Top half */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          overflow: 'hidden',
          borderRadius: '8px 8px 0 0',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 100%)'
        }}></div>

        {/* Bottom half */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          overflow: 'hidden',
          borderRadius: '0 0 8px 8px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)'
        }}></div>

        {/* Center divider */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.3)', zIndex: 10 }}></div>

        {/* Display value */}
        <div style={{ position: 'relative', zIndex: 5 }}>
          {String(displayValue).padStart(2, '0')}
        </div>
      </div>
      {label && <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7, textTransform: 'uppercase' }}>{label}</div>}
    </div>
  );
};

// Helper component for analog clock
const AnalogClock = ({ time, size, type, colors, config, theme }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const center = size / 2;
  const clockRadius = size * 0.45;

  // Generate hour markers based on config.faceMarkers
  const renderMarkers = () => {
    const markers = [];
    // Valid marker types for analog clocks
    const validMarkerTypes = ['dots', 'numbers', 'roman', 'lines', 'none', 'planets'];
    // Use config.faceMarkers if available and valid, otherwise default to 'dots'
    const markerType = config.faceMarkers !== undefined && validMarkerTypes.includes(config.faceMarkers)
      ? config.faceMarkers
      : 'dots';

    if (markerType === 'none') {
      return markers;
    }

    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * (Math.PI / 180);
      const x = center + Math.sin(angle) * clockRadius * 0.85;
      const y = center - Math.cos(angle) * clockRadius * 0.85;

      if (markerType === 'dots') {
        markers.push(
          <circle key={i} cx={x} cy={y} r={size * 0.015} fill={colors.clockColor} opacity="0.5" />
        );
      } else if (markerType === 'numbers') {
        markers.push(
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                fontSize={size * 0.08} fill={colors.clockColor} fontWeight="bold">
            {i === 0 ? 12 : i}
          </text>
        );
      } else if (markerType === 'roman') {
        const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
        markers.push(
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                fontSize={size * 0.06} fill={colors.clockColor} fontWeight="bold">
            {romanNumerals[i]}
          </text>
        );
      } else if (markerType === 'lines') {
        const innerX = center + Math.sin(angle) * clockRadius * 0.75;
        const innerY = center - Math.cos(angle) * clockRadius * 0.75;
        markers.push(
          <line key={i} x1={innerX} y1={innerY} x2={x} y2={y}
                stroke={colors.clockColor} strokeWidth={size * 0.008} opacity="0.6" />
        );
      } else if (markerType === 'planets') {
        const planetSizes = [8, 6, 7, 5, 9, 6, 8, 5, 6, 7, 5, 6];
        markers.push(
          <circle key={i} cx={x} cy={y} r={size * 0.01 * planetSizes[i] / 5}
                  fill={colors.clockColor} opacity="0.6" />
        );
      }
    }
    return markers;
  };

  // Hand rendering based on handShape config
  const renderHand = (angle, length, handType) => {
    // Valid hand shapes for analog clocks
    const validHandShapes = ['classic', 'arrow', 'modern', 'minimalist'];
    // Use config.handShape if available and valid, otherwise default to 'classic'
    const handShape = config.handShape !== undefined && validHandShapes.includes(config.handShape)
      ? config.handShape
      : 'classic';
    const x2 = center + Math.sin(angle * Math.PI / 180) * length;
    const y2 = center - Math.cos(angle * Math.PI / 180) * length;

    // Width based on hand type with defensive fallback
    const widthMap = {
      hour: size * 0.04,
      minute: size * 0.03,
      second: size * 0.01
    };
    const width = type === 'trail' && handType === 'second' ? size * 0.01 : (widthMap[handType] || size * 0.02);

    switch (handShape) {
      case 'classic':
        return (
          <line
            x1={center} y1={center}
            x2={x2} y2={y2}
            stroke={handType === 'second' && type === 'trail' ? colors.textColor : colors.clockColor}
            strokeWidth={width}
            strokeLinecap="round"
            opacity={type === 'trail' ? 0.7 : 1}
            style={type === 'tick' ? { transition: 'all 0.05s ease' } : {}}
          />
        );

      case 'arrow': {
        const arrowWidth = width * 2;
        const arrowLength = length * 0.15;
        const arrowX = center + Math.sin(angle * Math.PI / 180) * (length - arrowLength);
        const arrowY = center - Math.cos(angle * Math.PI / 180) * (length - arrowLength);
        return (
          <g>
            <line x1={center} y1={center} x2={arrowX} y2={arrowY}
                  stroke={colors.clockColor} strokeWidth={width} strokeLinecap="round" />
            <polygon
              points={`${x2},${y2} ${arrowX - arrowWidth},${arrowY} ${arrowX + arrowWidth},${arrowY}`}
              fill={colors.clockColor}
            />
          </g>
        );
      }

      case 'modern': {
        const backLength = length * 0.2;
        const backX = center - Math.sin(angle * Math.PI / 180) * backLength;
        const backY = center + Math.cos(angle * Math.PI / 180) * backLength;
        return (
          <line
            x1={backX} y1={backY}
            x2={x2} y2={y2}
            stroke={colors.clockColor}
            strokeWidth={width}
            strokeLinecap="round"
          />
        );
      }

      case 'minimalist':
        return (
          <line
            x1={center} y1={center}
            x2={x2} y2={y2}
            stroke={colors.clockColor}
            strokeWidth={width * 0.5}
            strokeLinecap="butt"
            opacity={0.9}
          />
        );

      default:
        return (
          <line x1={center} y1={center} x2={x2} y2={y2}
                stroke={colors.clockColor} strokeWidth={width} strokeLinecap="round" />
        );
    }
  };

  return (
    <svg width={size} height={size} style={{ filter: config.glowEffect ? `drop-shadow(0 0 ${theme.effects.glowBlur} ${colors.clockColor})` : 'none' }}>
      {/* Clock face */}
      <circle cx={center} cy={center} r={clockRadius}
              fill="none" stroke={colors.clockColor}
              strokeWidth={size * 0.01} opacity="0.2" />

      {/* Markers */}
      {renderMarkers()}

      {/* Hour hand */}
      {renderHand(hourAngle, clockRadius * 0.5, 'hour')}

      {/* Minute hand */}
      {renderHand(minuteAngle, clockRadius * 0.75, 'minute')}

      {/* Second hand */}
      {config.showSeconds && renderHand(secondAngle, clockRadius * 0.85, 'second')}

      {/* Center dot */}
      <circle cx={center} cy={center} r={size * 0.02} fill={colors.clockColor} />
    </svg>
  );
};

export const ClockWidget = ({ config, brandTheme, onCustomizeRequest }) => {
  const { theme } = useTheme(); // Use the global theme
  const [time, setTime] = useState(new Date());
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  // Subscribe to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Derive isDark from config and system preference
  const isDark = useMemo(() => {
    if (config.appearance === 'dark') return true;
    if (config.appearance === 'light') return false;
    // system mode
    return systemPrefersDark;
  }, [config.appearance, systemPrefersDark]);

  // Add CSS for blinking separator animation
  useEffect(() => {
    if (config.blinkingSeparator) {
      const styleId = 'clock-blink-animation';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes blink-separator {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
          .blink-separator {
            animation: blink-separator 1s step-end infinite;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, [config.blinkingSeparator]);

  // Load Google Fonts dynamically
  useEffect(() => {
    if (config.googleFont && config.googleFont !== 'none') {
      const linkId = `google-font-${config.googleFont}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${config.googleFont}:wght@400;700&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [config.googleFont]);

  // Add responsive sizing with container queries
  useEffect(() => {
    if (config.responsiveSizing) {
      const styleId = 'clock-responsive-sizing';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          .clock-responsive-container {
            container-type: size;
            container-name: clock;
          }

          @container clock (max-width: 300px) {
            .clock-responsive-text { font-size: clamp(24px, 8cqw, 48px) !important; }
            .clock-responsive-date { font-size: clamp(12px, 4cqw, 16px) !important; }
          }

          @container clock (min-width: 301px) and (max-width: 600px) {
            .clock-responsive-text { font-size: clamp(36px, 10cqw, 64px) !important; }
            .clock-responsive-date { font-size: clamp(14px, 4.5cqw, 18px) !important; }
          }

          @container clock (min-width: 601px) {
            .clock-responsive-text { font-size: clamp(48px, 12cqw, 96px) !important; }
            .clock-responsive-date { font-size: clamp(16px, 5cqw, 24px) !important; }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, [config.responsiveSizing]);

  // Timer countdown logic
  useEffect(() => {
    if (config.widgetMode === 'timer' && timerRunning) {
      const interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          setTimerRunning(false);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [config.widgetMode, timerRunning, timerMinutes, timerSeconds]);

  // Stopwatch logic
  useEffect(() => {
    if (config.widgetMode === 'stopwatch' && stopwatchRunning) {
      const interval = setInterval(() => {
        setStopwatchTime(t => t + 10);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [config.widgetMode, stopwatchRunning]);

  // Update time - use requestAnimationFrame for smooth clocks, setInterval for others
  useEffect(() => {
    const isSmoothClock = config.clockType === 'analog-smooth' || config.clockType === 'analog-trail';

    if (isSmoothClock) {
      // Use requestAnimationFrame for 60fps smooth animation
      let animationFrameId;
      const updateTime = () => {
        setTime(new Date());
        animationFrameId = requestAnimationFrame(updateTime);
      };
      animationFrameId = requestAnimationFrame(updateTime);
      return () => cancelAnimationFrame(animationFrameId);
    } else {
      // Use setInterval for tick-based clocks (more efficient)
      const interval = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [config.clockType]);

  // Generate brand-based presets if brand theme is available
  const brandPresets = React.useMemo(() => {
    if (!brandTheme) return [];
    return generateBrandPresets(brandTheme);
  }, [brandTheme]);

  // Merge static and brand-based presets
  const allPresets = React.useMemo(() => {
    const combined = { ...PRESET_THEMES };
    brandPresets.forEach(preset => {
      combined[preset.id] = preset;
    });
    return combined;
  }, [brandPresets]);

  // Get active colors based on mode and preset theme
  const colors = React.useMemo(() => {
    let computedColors = isDark ? config.darkMode : config.lightMode;

    // Apply preset theme if selected (check both static and brand-based)
    if (config.presetTheme && config.presetTheme !== 'none') {
      const theme = allPresets[config.presetTheme];
      if (theme) {
        computedColors = {
          backgroundColor: theme.backgroundColor,
          clockColor: theme.clockColor,
          digitColor: theme.digitColor,
          textColor: theme.textColor
        };
      }
    }

    return computedColors;
  }, [isDark, config.darkMode, config.lightMode, config.presetTheme, allPresets]);

  // Add CSS variables for instant color updates
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--clock-bg-color', colors.backgroundColor);
    root.style.setProperty('--clock-primary-color', colors.clockColor);
    root.style.setProperty('--clock-text-color', colors.textColor);
    root.style.setProperty('--clock-digit-color', colors.digitColor);
  }, [colors]);

  // Font mapping with Google Fonts support
  const getFontFamily = (fontType, isDigit = false) => {
    // Google Fonts override
    if (config.googleFont && config.googleFont !== 'none') {
      const fontName = config.googleFont.replace(/\+/g, ' ');
      return `"${fontName}", ui-sans-serif, system-ui, sans-serif`;
    }

    // Standard fonts
    const font = isDigit ? config.digitFontFamily : config.textFontFamily;
    const fontMap = {
      default: 'ui-sans-serif, system-ui, sans-serif',
      impact: '"Impact", "Arial Black", sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono: 'ui-monospace, "Courier New", monospace'
    };
    return fontMap[font] || fontMap.default;
  };

  // Size mapping
  const sizeMap = {
    small: { time: '32px', date: '14px', analog: 120 },
    medium: { time: '48px', date: '16px', analog: 180 },
    large: { time: '64px', date: '18px', analog: 240 },
    xlarge: { time: '96px', date: '24px', analog: 320 }
  };
  const size = sizeMap[config.clockSize] || sizeMap.large;

  // Get background texture
  const getBackgroundTexture = () => {
    const texture = config.presetTheme !== 'none' && allPresets[config.presetTheme]
      ? allPresets[config.presetTheme].texture
      : config.backgroundTexture;

    switch (texture) {
      case 'noise':
        return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`;
      case 'stars':
        return `radial-gradient(2px 2px at 20px 30px, white, transparent),
                radial-gradient(2px 2px at 60px 70px, white, transparent),
                radial-gradient(1px 1px at 50px 50px, white, transparent),
                radial-gradient(1px 1px at 130px 80px, white, transparent),
                radial-gradient(2px 2px at 90px 10px, white, transparent),
                radial-gradient(1px 1px at 110px 120px, white, transparent)`;
      case 'dots':
        return `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`;
      case 'grid':
        return `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`;
      case 'waves':
        return `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`;
      default:
        return 'none';
    }
  };

  const getBackgroundSize = () => {
    const texture = config.backgroundTexture;
    switch (texture) {
      case 'dots':
        return '20px 20px';
      case 'grid':
        return '20px 20px';
      case 'stars':
        return '200px 200px';
      default:
        return 'auto';
    }
  };

  // Common styles
  const containerStyle = {
    backgroundColor: config.useTransparentBg ? 'transparent' : colors.backgroundColor,
    backgroundImage: getBackgroundTexture(),
    backgroundSize: getBackgroundSize(),
    color: colors.textColor,
    textAlign: config.textAlign
  };

  const timeStyle = {
    fontSize: size.time,
    fontFamily: getFontFamily(config.digitFontFamily, true),
    fontWeight: 'bold',
    color: colors.clockColor,
    textShadow: config.textShadows ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
  };

  if (config.glowEffect) {
    timeStyle.textShadow = `0 0 ${theme.effects.glowBlur} currentColor`;
  }

  if (config.gradientText) {
    timeStyle.background = theme.gradients.gradient;
    timeStyle.WebkitBackgroundClip = 'text';
    timeStyle.color = 'transparent';
  }

  // Format time based on type with timezone support
  const formatTime = () => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: config.showSeconds ? '2-digit' : undefined,
      hour12: config.is12Hour
    };

    // Add timezone if not 'local'
    if (config.timezone && config.timezone !== 'local') {
      options.timeZone = config.timezone;
    }

    return time.toLocaleTimeString([], options);
  };

  // Get UTC offset for display
  const getTimezoneOffset = () => {
    if (!config.timezone || config.timezone === 'local') {
      const offset = -time.getTimezoneOffset();
      const hours = Math.floor(Math.abs(offset) / 60);
      const minutes = Math.abs(offset) % 60;
      const sign = offset >= 0 ? '+' : '-';
      return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: config.timezone,
        timeZoneName: 'short'
      });
      const parts = formatter.formatToParts(time);
      const tzPart = parts.find(p => p.type === 'timeZoneName');
      return tzPart ? tzPart.value : '';
    } catch {
      return '';
    }
  };

  // Format date based on selected format
  const formatDate = () => {
    const tzOptions = config.timezone !== 'local' ? { timeZone: config.timezone } : {};

    switch (config.dateFormat) {
      case 'long':
        return time.toLocaleDateString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          ...tzOptions
        });
      case 'short':
        return time.toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          ...tzOptions
        });
      case 'numeric':
        // US format: MM/DD/YYYY
        return time.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          ...tzOptions
        });
      case 'european':
        // European format: DD.MM.YYYY
        return time.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          ...tzOptions
        });
      case 'iso': {
        // ISO format: YYYY-MM-DD
        const year = time.getFullYear();
        const month = String(time.getMonth() + 1).padStart(2, '0');
        const day = String(time.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      default:
        return time.toLocaleDateString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          ...tzOptions
        });
    }
  };

  // Render different clock types
  const renderClock = () => {
    const timeStr = formatTime();

    // DIGITAL CLOCKS
    if (config.clockType === 'digital-solid') {
      return (
        <div style={timeStyle} className={`tabular-nums tracking-tight ${config.responsiveSizing ? 'clock-responsive-text' : ''}`}>
          {config.blinkingSeparator ? (
            timeStr.split('').map((char, i) => (
              <span key={i} className={char === ':' ? 'blink-separator' : ''}>
                {char}
              </span>
            ))
          ) : timeStr}
        </div>
      );
    }

    if (config.clockType === 'digital-roulette') {
      return (
        <div style={{...timeStyle, letterSpacing: '0.1em'}} className={`tabular-nums font-mono ${config.responsiveSizing ? 'clock-responsive-text' : ''}`}>
          {timeStr.split('').map((char, i) => (
            <span key={i}
              className={config.blinkingSeparator && char === ':' ? 'blink-separator' : ''}
              style={{
                display: 'inline-block',
                animation: `roulette 0.5s ease ${i * 0.05}s`,
                transformOrigin: 'center'
              }}>
              {char}
            </span>
          ))}
        </div>
      );
    }

    if (config.clockType === 'flip-clock') {
      const parts = timeStr.match(/\d+/g) || [];
      return (
        <div className="flex gap-2 justify-center items-center">
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              <FlipCard
                value={parseInt(part)}
                label={i === 0 ? 'HR' : i === 1 ? 'MIN' : 'SEC'}
                size={parseInt(size.time)}
                colors={{ clockColor: colors.clockColor, digitColor: colors.digitColor }}
              />
              {i < parts.length - 1 && <span style={{fontSize: size.time, opacity: 0.5}}>:</span>}
            </React.Fragment>
          ))}
        </div>
      );
    }

    // ANALOG CLOCKS
    if (config.clockType.startsWith('analog-')) {
      const analogType = config.clockType.replace('analog-', '');
      // Ensure analog size is valid - default to 240 (large) if undefined
      const analogSize = typeof size.analog === 'number' && size.analog > 0 ? size.analog : 240;
      return <AnalogClock
        time={time}
        size={analogSize}
        type={analogType}
        colors={colors}
        config={config}
        theme={theme}
      />;
    }

    return <div style={timeStyle}>{timeStr}</div>;
  };

  // Render timer mode
  const renderTimer = () => {
    const timeStr = `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`;
    return (
      <div className="flex flex-col items-center gap-4">
        <div style={timeStyle} className={`tabular-nums ${config.responsiveSizing ? 'clock-responsive-text' : ''}`}>
          {timeStr}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.clockColor, color: colors.digitColor }}
          >
            {timerRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => { setTimerMinutes(5); setTimerSeconds(0); setTimerRunning(false); }}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.textColor, color: colors.backgroundColor }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  };

  // Render stopwatch mode
  const renderStopwatch = () => {
    const milliseconds = stopwatchTime % 1000;
    const seconds = Math.floor(stopwatchTime / 1000) % 60;
    const minutes = Math.floor(stopwatchTime / 60000);
    const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(Math.floor(milliseconds / 10)).padStart(2, '0')}`;

    return (
      <div className="flex flex-col items-center gap-4">
        <div style={timeStyle} className={`tabular-nums ${config.responsiveSizing ? 'clock-responsive-text' : ''}`}>
          {timeStr}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStopwatchRunning(!stopwatchRunning)}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.clockColor, color: colors.digitColor }}
          >
            {stopwatchRunning ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={() => { setStopwatchTime(0); setStopwatchRunning(false); }}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.textColor, color: colors.backgroundColor }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  };

  // Render based on widget mode
  const renderContent = () => {
    switch (config.widgetMode) {
      case 'timer':
        return renderTimer();
      case 'stopwatch':
        return renderStopwatch();
      default:
        return renderClock();
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-full w-full p-6 ${config.responsiveSizing ? 'clock-responsive-container' : ''}`}
      style={containerStyle}
    >
      {renderContent()}

      {config.showDate && config.widgetMode === 'clock' && (
        <div
          className={`mt-4 font-medium ${config.responsiveSizing ? 'clock-responsive-date' : ''}`}
          style={{
            fontSize: size.date,
            fontFamily: getFontFamily(config.textFontFamily),
            opacity: 0.7,
            color: colors.textColor,
            textShadow: config.textShadows ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          {formatDate()}
          {config.timezone && (
            <div style={{ fontSize: '0.85em', marginTop: '4px', opacity: 0.6 }}>
              {getTimezoneOffset()}
            </div>
          )}
        </div>
      )}

      {config.showCustomizeButton && (
        <button
          className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: colors.clockColor,
            color: colors.digitColor,
            opacity: 0.8
          }}
          onClick={() => onCustomizeRequest?.('appearance')}
        >
          Customize
        </button>
      )}
    </div>
  );
};
