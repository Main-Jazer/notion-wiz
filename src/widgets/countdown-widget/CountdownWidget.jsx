import React, { useState, useEffect, useMemo } from 'react';
import { JAZER_BRAND } from '../../theme/jazerNeonTheme';

const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
};

// Helper function to calculate time units
const calculateUnits = (milliseconds, isPast) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44); // Average month
  const years = Math.floor(days / 365.25); // Average year

  return {
    finished: false,
    isPast,
    years,
    months: months % 12,
    weeks: weeks % 4,
    days: days % 7,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60
  };
};

// Helper function to calculate time remaining
const calculateTimeLeft = (targetDate, stopAtZero) => {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;

  if (diff <= 0) {
    if (stopAtZero) {
      return { finished: true, isPast: false };
    } else {
      // Continue counting into negative
      return calculateUnits(Math.abs(diff), true);
    }
  }

  return calculateUnits(diff, false);
};

export const CountdownWidget = ({ config, onCustomizeRequest }) => {
  const [timeLeft, setTimeLeft] = useState(() => 
    calculateTimeLeft(config.targetDate, config.stopAtZero)
  );
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiStartTime, setConfettiStartTime] = useState(null);
  const [confettiParticles] = useState(() =>
    Array.from({ length: 50 }, () => ({
      left: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2
    }))
  );

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

  // Calculate time remaining - use interval for updates
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(config.targetDate, config.stopAtZero);
      
      // Handle confetti trigger when countdown finishes
      if (newTimeLeft.finished && !showConfetti && config.confettiDuration !== 'never') {
        setShowConfetti(true);
        setConfettiStartTime(Date.now());
      }
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [config.targetDate, config.stopAtZero, showConfetti, config.confettiDuration]);

  // Manage confetti duration
  useEffect(() => {
    if (!showConfetti || !confettiStartTime) return;

    const durations = {
      'never': 0,
      '1min': 60000,
      '5min': 300000,
      '10min': 600000,
      '1hour': 3600000,
      'forever': Infinity
    };

    const duration = durations[config.confettiDuration];
    if (duration === Infinity) return;

    const timeout = setTimeout(() => {
      setShowConfetti(false);
    }, duration);

    return () => clearTimeout(timeout);
  }, [showConfetti, confettiStartTime, config.confettiDuration]);

  // Get active colors with fallback defaults (memoized)
  const colors = useMemo(() => {
    const defaultColors = {
      textColor: isDark ? '#F8F9FF' : '#0B0E12',
      panelColor: isDark ? '#1F2937' : '#F8F9FF',
      digitColor: isDark ? '#F8F9FF' : '#0B0E12'
    };
    return (isDark ? config.darkMode : config.lightMode) || defaultColors;
  }, [isDark, config.darkMode, config.lightMode]);

  // Font mapping
  const getFontFamily = (fontType) => {
    const fontMap = {
      default: 'ui-sans-serif, system-ui, sans-serif',
      impact: '"Impact", "Arial Black", sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono: 'ui-monospace, "Courier New", monospace'
    };
    return fontMap[fontType] || fontMap.default;
  };

  // Render time unit
  const TimeUnit = ({ value, label, isLast }) => {
    if (config.countdownStyle === 'flip-countdown') {
      return (
        <div className="flex flex-col items-center mx-2">
          <div
            className="relative flex items-center justify-center font-mono rounded-lg overflow-hidden shadow-lg"
            style={{
              backgroundColor: colors.panelColor,
              color: colors.digitColor,
              fontSize: '2.5rem',
              padding: '12px 20px',
              minWidth: '80px',
              fontFamily: getFontFamily(config.digitFontFamily),
              textShadow: config.textShadows ? `0 0 ${JAZER_BRAND.glowBlur} rgba(0,0,0,0.3)` : 'none'
            }}
          >
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black/10"></div>
            {String(value).padStart(2, '0')}
          </div>
          <span
            className="text-xs uppercase mt-2 font-bold tracking-wide"
            style={{
              color: colors.textColor,
              fontFamily: getFontFamily(config.textFontFamily),
              opacity: 0.7
            }}
          >
            {label}
          </span>
        </div>
      );
    }

    // Text-only style
    return (
      <span
        className="mx-1"
        style={{
          fontFamily: getFontFamily(config.digitFontFamily),
          fontSize: '2rem',
          fontWeight: 'bold',
          color: colors.textColor
        }}
      >
        {value} {label}{!isLast && ', '}
      </span>
    );
  };

  // Build units array
  const units = [];
  if (config.showYear && timeLeft.years > 0) units.push({ value: timeLeft.years, label: 'Year' });
  if (config.showMonth && timeLeft.months > 0) units.push({ value: timeLeft.months, label: 'Month' });
  if (config.showWeek && timeLeft.weeks > 0) units.push({ value: timeLeft.weeks, label: 'Week' });
  if (config.showDay) units.push({ value: timeLeft.days || 0, label: 'Day' });
  if (config.showHour) units.push({ value: timeLeft.hours || 0, label: 'Hr' });
  if (config.showMinute) units.push({ value: timeLeft.minutes || 0, label: 'Min' });
  if (config.showSecond) units.push({ value: timeLeft.seconds || 0, label: 'Sec' });

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full p-8 transition-colors relative"
      style={{
        backgroundColor: config.useTransparentBg ? 'transparent' : (isDark ? JAZER_BRAND.colors.nightBlack : JAZER_BRAND.colors.stardustWhite),
        textAlign: config.textAlign
      }}
    >
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${particle.left}%`,
                top: '-10px',
                width: '10px',
                height: '10px',
                backgroundColor: Object.values(JAZER_BRAND.colors)[i % Object.values(JAZER_BRAND.colors).length],
                animation: `confettiFall ${particle.duration}s linear infinite`,
                animationDelay: `${particle.delay}s`,
                opacity: 0.8,
                borderRadius: '2px'
              }}
            />
          ))}
        </div>
      )}

      {/* Event Title */}
      <h2
        className="text-2xl font-bold mb-6"
        style={{
          color: colors.textColor,
          fontFamily: getFontFamily(config.textFontFamily),
          textShadow: config.textShadows ? `0 0 ${JAZER_BRAND.glowBlur} rgba(0,0,0,0.1)` : 'none'
        }}
      >
        {escapeHTML(config.eventTitle)}
      </h2>

      {/* Countdown Display */}
      <div className={`flex ${config.countdownStyle === 'flip-countdown' ? 'gap-2' : 'flex-wrap justify-center'}`}>
        {timeLeft.finished ? (
          <div className="text-4xl font-bold" style={{ color: colors.textColor }}>
            🎉 Event Started!
          </div>
        ) : (
          units.map((unit, i) => (
            <TimeUnit
              key={unit.label}
              value={unit.value}
              label={unit.label}
              isLast={i === units.length - 1}
            />
          ))
        )}
      </div>

      {/* To Go / Ago Label */}
      {config.showToGoLabel && !timeLeft.finished && (
        <div
          className="mt-4 text-sm uppercase tracking-wide opacity-60"
          style={{
            color: colors.textColor,
            fontFamily: getFontFamily(config.textFontFamily)
          }}
        >
          {timeLeft.isPast ? 'Ago' : 'To Go'}
        </div>
      )}

      {/* Customize Button */}
      {config.showCustomizeButton && (
        <button
          className="mt-6 px-6 py-2 rounded-lg font-medium text-sm"
          style={{
            backgroundColor: colors.panelColor,
            color: colors.digitColor,
            opacity: 0.8
          }}
          onClick={() => onCustomizeRequest?.('event')}
        >
          Customize
        </button>
      )}

      <style>{`
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
