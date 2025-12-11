import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';

export const CounterWidget = ({ config, onCustomizeRequest }) => {
  const { getColor } = useTheme(); // Access global theme
  const [count, setCount] = useState(config.resetValue || 0);
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (config.appearanceMode !== 'system' || typeof window === 'undefined') {
      return undefined;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event) => setSystemPrefersDark(event.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [config.appearanceMode]);

  const isDark = useMemo(() => {
    if (config.appearanceMode === 'system') return systemPrefersDark;
    return config.appearanceMode === 'dark';
  }, [config.appearanceMode, systemPrefersDark]);

  const sizeMap = {
    small: { container: 'text-4xl p-4', button: 'text-2xl px-3 py-1', title: 'text-sm' },
    medium: { container: 'text-6xl p-6', button: 'text-3xl px-4 py-2', title: 'text-base' },
    large: { container: 'text-8xl p-8', button: 'text-4xl px-5 py-2', title: 'text-lg' },
    xlarge: { container: 'text-9xl p-10', button: 'text-5xl px-6 py-3', title: 'text-xl' }
  };

  const size = sizeMap[config.counterSize] || sizeMap.medium;
  // Use config colors with theme fallbacks
  const textColor = isDark
    ? (config.textColorDark || getColor('stardustWhite'))
    : (config.textColorLight || getColor('graphite'));
  const bgColor = config.transparentBg ? 'transparent' : (config.backgroundColor || getColor('stardustWhite'));

  const iconMap = {
    plusMinus: { increment: '+', decrement: '-' },
    arrows: { increment: '↑', decrement: '↓' }
  };

  const icons = iconMap[config.preferredIcons] || iconMap.plusMinus;

  return (
    <div 
      style={{
        backgroundColor: bgColor,
        color: textColor,
        textAlign: config.centerText ? 'center' : 'left',
        textShadow: config.textShadows ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
        borderRadius: '8px',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: config.centerText ? 'center' : 'flex-start'
      }}
      className={`${size.container} relative`}
    >
      <div className={`font-bold mb-4 ${size.title}`}>{config.counterTitle}</div>
      
      <div className="font-bold mb-6">{count}</div>
      
      <div className="flex gap-4">
        <button
          onClick={() => setCount(c => {
            const newValue = c - (config.step || 1);
            if (config.minValue !== null && newValue < config.minValue) {
              return config.minValue;
            }
            return newValue;
          })}
          className={`${size.button} rounded-lg hover:opacity-80 transition-opacity`}
          style={{ 
            backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
            color: textColor,
            border: `2px solid ${textColor}`
          }}
        >
          {icons.decrement}
        </button>
        
        <button
          onClick={() => setCount(c => {
            const newValue = c + (config.step || 1);
            if (config.maxValue !== null && newValue > config.maxValue) {
              return config.maxValue;
            }
            return newValue;
          })}
          className={`${size.button} rounded-lg hover:opacity-80 transition-opacity`}
          style={{ 
            backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
            color: textColor,
            border: `2px solid ${textColor}`
          }}
        >
          {icons.increment}
        </button>
        
        {!config.hideResetButton && (
          <button
            onClick={() => setCount(config.resetValue || 0)}
            className={`${size.button} rounded-lg hover:opacity-80 transition-opacity text-sm`}
            style={{ 
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              color: textColor,
              border: `1px solid ${textColor}`
            }}
          >
            Reset
          </button>
        )}
      </div>

      {config.showCustomizeButton && (
        <button
          className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600 text-white shadow-lg hover:scale-105 transition-transform"
          onClick={() => onCustomizeRequest?.('features')}
        >
          Customize
        </button>
      )}
    </div>
  );
};
