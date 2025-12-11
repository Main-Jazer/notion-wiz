import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme'; // Import useTheme

const ProgressBar = ({
  label,
  percentage,
  showValue = true,
  barHeightPx,
  barBackground,
  barColor,
  theme,
  config
}) => {
  const barStyle = {
    width: '100%',
    height: `${barHeightPx}px`,
    backgroundColor: barBackground,
    borderRadius: '9999px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: config.dropShadows ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
  };

  const fillStyle = {
    width: `${percentage}%`,
    height: '100%',
    background: config.useGradientBars ? theme.gradients.gradient : barColor,
    borderRadius: '9999px',
    transition: 'width 0.5s ease',
    boxShadow: config.useGlowEffect ? theme.effects.glow : 'none'
  };

  const getRemainingTime = () => {
    const now = new Date();
    if (label === 'Year') {
      const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
      const diff = yearEnd - now;
      return `${Math.floor(diff / (1000 * 60 * 60 * 24))} days`;
    }
    if (label === 'Month') {
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const diff = monthEnd - now;
      return `${Math.floor(diff / (1000 * 60 * 60 * 24))} days`;
    }
    if (label === 'Week') {
      const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()));
      const diff = weekEnd - now;
      return `${Math.floor(diff / (1000 * 60 * 60 * 24))} days`;
    }
    if (label === 'Day') {
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = dayEnd - now;
      return `${Math.floor(diff / (1000 * 60 * 60))} hours`;
    }
    if (label === 'Lifetime') {
      const birthDate = new Date(config.birthDate);
      const lifeExpectancyMs = config.lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000;
      const endDate = new Date(birthDate.getTime() + lifeExpectancyMs);
      const diff = endDate - now;
      return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))} years`;
    }
    return '';
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium" style={{ fontFamily: theme.fonts.body }}>
          {label}
        </span>
        <div className="flex items-center">
          {config.showRemainingTime && (
            <span className="text-xs opacity-70 mr-2" style={{ fontFamily: theme.fonts.heading }}>
              {getRemainingTime()} left
            </span>
          )}
          {showValue && (
            <span className="text-xs opacity-70" style={{ fontFamily: theme.fonts.heading }}>
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
      <div style={barStyle}>
        <div style={fillStyle} />
      </div>
    </div>
  );
};

export const LifeProgressWidget = ({ config, onCustomizeRequest }) => {
  const { theme, getColor } = useTheme(); // Use the global theme
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [progress, setProgress] = useState({
    year: 0,
    month: 0,
    week: 0,
    day: 0,
    lifetime: 0
  });

  useEffect(() => {
    if (config.appearanceMode !== 'system' || typeof window === 'undefined') return undefined;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event) => setSystemPrefersDark(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [config.appearanceMode]);

  const isDark = useMemo(() => {
    if (config.appearanceMode === 'system') return systemPrefersDark;
    return config.appearanceMode === 'dark';
  }, [config.appearanceMode, systemPrefersDark]);

  // Calculate progress
  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();

      // Year progress
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
      const yearProgress = ((now - yearStart) / (yearEnd - yearStart)) * 100;

      // Month progress
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const monthProgress = ((now - monthStart) / (monthEnd - monthStart)) * 100;

      // Week progress (assuming week starts on Sunday)
      const dayOfWeek = now.getDay();
      const hourOfDay = now.getHours();
      const minuteOfHour = now.getMinutes();
      const totalWeekMinutes = 7 * 24 * 60;
      const passedWeekMinutes = dayOfWeek * 24 * 60 + hourOfDay * 60 + minuteOfHour;
      const weekProgress = (passedWeekMinutes / totalWeekMinutes) * 100;

      // Day progress
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const dayProgress = ((now - dayStart) / (dayEnd - dayStart)) * 100;

      // Lifetime progress
      const birthDate = new Date(config.birthDate);
      const lifeExpectancyMs = config.lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000;
      const lifeProgress = ((now - birthDate) / lifeExpectancyMs) * 100;

      setProgress({
        year: Math.min(yearProgress, 100),
        month: Math.min(monthProgress, 100),
        week: Math.min(weekProgress, 100),
        day: Math.min(dayProgress, 100),
        lifetime: Math.min(lifeProgress, 100)
      });
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [config.birthDate, config.lifeExpectancy]);

  // Get colors based on appearance mode with theme fallbacks
  const textColor = isDark
    ? (config.textColorDark || getColor('stardustWhite'))
    : (config.textColorLight || getColor('graphite'));
  const barColor = isDark
    ? (config.barColorDark || getColor('electricPurple'))
    : (config.barColorLight || getColor('cosmicBlue'));
  const barBackground = isDark
    ? (config.barBackgroundDark || getColor('graphite'))
    : (config.barBackgroundLight || getColor('softSlate'));
  const bgColor = config.useTransparentBackground
    ? 'transparent'
    : (config.setBackgroundColor ? config.backgroundColor : (isDark ? getColor('nightBlack') : getColor('stardustWhite')));

  // Bar height mapping
  const barHeightMap = {
    small: 16,
    medium: 24,
    large: 32
  };
  const barHeightPx = barHeightMap[config.barHeight] || barHeightMap.medium;

  return (
    <div
      className="h-full w-full p-6 relative"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: theme.fonts.body
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 size={32} style={{ color: config.useGradientBars ? theme.colors.electricPurple : barColor }} />
          <h2 className="text-2xl font-bold" style={{ fontFamily: theme.fonts.heading }}>
            Life Progress
          </h2>
        </div>

        <div className="space-y-4">
          {config.showYear && (
            <ProgressBar
              label="Year"
              percentage={progress.year}
              barHeightPx={barHeightPx}
              barBackground={barBackground}
              barColor={barColor}
              theme={theme}
              config={config}
            />
          )}

          {config.showMonth && (
            <ProgressBar
              label="Month"
              percentage={progress.month}
              barHeightPx={barHeightPx}
              barBackground={barBackground}
              barColor={barColor}
              theme={theme}
              config={config}
            />
          )}

          {config.showWeek && (
            <ProgressBar
              label="Week"
              percentage={progress.week}
              barHeightPx={barHeightPx}
              barBackground={barBackground}
              barColor={barColor}
              theme={theme}
              config={config}
            />
          )}

          {config.showDay && (
            <ProgressBar
              label="Day"
              percentage={progress.day}
              barHeightPx={barHeightPx}
              barBackground={barBackground}
              barColor={barColor}
              theme={theme}
              config={config}
            />
          )}

          {config.showLifetime && (
            <ProgressBar
              label="Lifetime"
              percentage={progress.lifetime}
              barHeightPx={barHeightPx}
              barBackground={barBackground}
              barColor={barColor}
              theme={theme}
              config={config}
            />
          )}
        </div>

        {config.showLifetime && (
          <div className="mt-6 text-center text-sm opacity-60">
            <p style={{ fontFamily: theme.fonts.body }}>
              Based on life expectancy of {config.lifeExpectancy} years
            </p>
          </div>
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
          onClick={() => onCustomizeRequest?.('progressConfiguration')}
        >
          Customize
        </button>
      )}
    </div>
  );
};
