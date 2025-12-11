// Clock Widget HTML and Script Export
// Generates standalone HTML with embedded JAZER_BRAND styles

import { jazerNeonTheme } from '../../theme/jazerNeonTheme'; // Import jazerNeonTheme

const PRESET_THEMES = {
  cyberpunk: { backgroundColor: '#0a0e27', clockColor: '#00ffff', digitColor: '#0a0e27', textColor: '#ff00ff', texture: 'grid', glow: true },
  stealth: { backgroundColor: '#0B0E12', clockColor: '#2D3748', digitColor: '#E2E8F0', textColor: '#4A5568', texture: 'none', glow: false },
  ocean: { backgroundColor: '#0c4a6e', clockColor: '#06b6d4', digitColor: '#f0f9ff', textColor: '#bae6fd', texture: 'waves', glow: true },
  sunset: { backgroundColor: '#7c2d12', clockColor: '#f59e0b', digitColor: '#451a03', textColor: '#fbbf24', texture: 'none', glow: true },
  forest: { backgroundColor: '#14532d', clockColor: '#22c55e', digitColor: '#052e16', textColor: '#86efac', texture: 'dots', glow: false },
  neon: { backgroundColor: '#18181b', clockColor: '#ec4899', digitColor: '#fdf4ff', textColor: '#f0abfc', texture: 'noise', glow: true },
  midnight: { backgroundColor: '#1e1b4b', clockColor: '#818cf8', digitColor: '#eef2ff', textColor: '#c7d2fe', texture: 'stars', glow: true }
};

export const generateClockHTML = (config) => {
  const isDark = config.appearance === 'dark';
  let colors = isDark ? config.darkMode : config.lightMode;

  // Apply preset theme if selected
  if (config.presetTheme && config.presetTheme !== 'none' && PRESET_THEMES[config.presetTheme]) {
    const theme = PRESET_THEMES[config.presetTheme];
    colors = {
      backgroundColor: theme.backgroundColor,
      clockColor: theme.clockColor,
      digitColor: theme.digitColor,
      textColor: theme.textColor
    };
  }

  const bgColor = config.useTransparentBg ? 'transparent' : colors.backgroundColor;

  // Get background texture
  const getBackgroundTexture = () => {
    const texture = config.presetTheme !== 'none' && PRESET_THEMES[config.presetTheme]
      ? PRESET_THEMES[config.presetTheme].texture
      : config.backgroundTexture;

    switch (texture) {
      case 'noise':
        return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`;
      case 'stars':
        return 'radial-gradient(2px 2px at 20px 30px, white, transparent), radial-gradient(2px 2px at 60px 70px, white, transparent), radial-gradient(1px 1px at 50px 50px, white, transparent)';
      case 'dots':
        return 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)';
      case 'grid':
        return 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)';
      case 'waves':
        return 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)';
      default:
        return 'none';
    }
  };

  const getBackgroundSize = () => {
    const texture = config.backgroundTexture;
    return (texture === 'dots' || texture === 'grid') ? '20px 20px' : (texture === 'stars' ? '200px 200px' : 'auto');
  };

  // Build Google Fonts URL
  const googleFontsUrl = config.googleFont && config.googleFont !== 'none'
    ? `https://fonts.googleapis.com/css2?family=${config.googleFont}:wght@400;700&family=Montserrat:wght@400;500;700&family=Orbitron:wght@400;700&display=swap`
    : 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Orbitron:wght@400;700&display=swap';

  // Get font family
  const getFontFamily = () => {
    if (config.googleFont && config.googleFont !== 'none') {
      const fontName = config.googleFont.replace(/\+/g, ' ');
      return `"${fontName}", ${jazerNeonTheme.fonts.body}`;
    }
    return jazerNeonTheme.fonts.body;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clock Widget</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${googleFontsUrl}" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 100vw;
      height: 100vh;
      background: ${bgColor};
      background-image: ${getBackgroundTexture()};
      background-size: ${getBackgroundSize()};
      color: ${colors.textColor};
      font-family: ${getFontFamily()};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: ${config.textAlign};
      ${config.responsiveSizing ? 'container-type: size; container-name: clock;' : ''}
    }

    :root {
      --clock-bg-color: ${colors.backgroundColor};
      --clock-primary-color: ${colors.clockColor};
      --clock-text-color: ${colors.textColor};
      --clock-digit-color: ${colors.digitColor};
    }

    #clock {
      font-size: 64px;
      font-weight: bold;
      color: ${colors.clockColor};
      ${config.textShadows ? 'text-shadow: 0 2px 4px rgba(0,0,0,0.1);' : ''}
      ${config.glowEffect ? `text-shadow: 0 0 ${jazerNeonTheme.effects.glowBlur} ${colors.clockColor};` : ''}
      ${config.gradientText ? `
        background: ${jazerNeonTheme.gradients.gradient};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      ` : ''}
    }

    #date {
      margin-top: 16px;
      font-size: 18px;
      opacity: 0.7;
      ${config.textShadows ? 'text-shadow: 0 1px 2px rgba(0,0,0,0.1);' : ''}
    }

    .customize-button {
      margin-top: 16px;
      padding: 8px 16px;
      background: ${colors.clockColor};
      color: ${colors.digitColor};
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-family: ${jazerNeonTheme.fonts.heading};
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .customize-button:hover {
      opacity: 1;
    }

    ${config.blinkingSeparator ? `
    @keyframes blink-separator {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    .blink-separator {
      animation: blink-separator 1s step-end infinite;
    }
    ` : ''}

    ${config.responsiveSizing ? `
    @container clock (max-width: 300px) {
      #clock { font-size: clamp(24px, 8cqw, 48px) !important; }
      #date { font-size: clamp(12px, 4cqw, 16px) !important; }
    }

    @container clock (min-width: 301px) and (max-width: 600px) {
      #clock { font-size: clamp(36px, 10cqw, 64px) !important; }
      #date { font-size: clamp(14px, 4.5cqw, 18px) !important; }
    }

    @container clock (min-width: 601px) {
      #clock { font-size: clamp(48px, 12cqw, 96px) !important; }
      #date { font-size: clamp(16px, 5cqw, 24px) !important; }
    }
    ` : ''}

    @media (prefers-color-scheme: dark) {
      ${config.appearance === 'system' ? `
        body {
          background: ${config.useTransparentBg ? 'transparent' : config.darkMode.backgroundColor};
          color: ${config.darkMode.textColor};
        }
        #clock {
          color: ${config.darkMode.clockColor};
        }
      ` : ''}
    }
  </style>
</head>
<body>
  <div id="clock"></div>
  ${config.showDate ? '<div id="date"></div>' : ''}
  ${config.showCustomizeButton ? '<button class="customize-button">Customize</button>' : ''}

  <script>
    ${generateClockScript(config)}
  </script>
</body>
</html>`;
};

export const generateClockScript = (config) => {
  const isSmoothClock = config.clockType === 'analog-smooth' || config.clockType === 'analog-trail';

  return `
  function updateClock() {
    const now = new Date();
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: ${config.showSeconds},
      hour12: ${config.is12Hour}${config.timezone && config.timezone !== 'local' ? `,
      timeZone: '${config.timezone}'` : ''}
    };

    let timeStr = now.toLocaleTimeString([], timeOptions);

    ${config.blinkingSeparator ? `
    // Apply blinking to separators
    const clockEl = document.getElementById('clock');
    clockEl.innerHTML = timeStr.split('').map(char =>
      char === ':' ? '<span class="blink-separator">' + char + '</span>' : char
    ).join('');
    ` : `
    document.getElementById('clock').textContent = timeStr;
    `}

    ${config.showDate ? `
      // Format date based on dateFormat config
      let dateStr;
      const tzOpts = ${config.timezone && config.timezone !== 'local' ? `{ timeZone: '${config.timezone}' }` : '{}'};

      switch ('${config.dateFormat || 'long'}') {
        case 'long':
          dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', ...tzOpts });
          break;
        case 'short':
          dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', ...tzOpts });
          break;
        case 'numeric':
          dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', ...tzOpts });
          break;
        case 'european':
          dateStr = now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', ...tzOpts });
          break;
        case 'iso':
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          dateStr = year + '-' + month + '-' + day;
          break;
        default:
          dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', ...tzOpts });
      }

      ${config.timezone ? `
      // Add timezone offset
      const tzOffset = ${config.timezone === 'local' || !config.timezone ? `
        (() => {
          const offset = -now.getTimezoneOffset();
          const hours = Math.floor(Math.abs(offset) / 60);
          const minutes = Math.abs(offset) % 60;
          const sign = offset >= 0 ? '+' : '-';
          return 'UTC' + sign + String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
        })()
      ` : `
        (() => {
          try {
            const formatter = new Intl.DateTimeFormat('en-US', {
              timeZone: '${config.timezone}',
              timeZoneName: 'short'
            });
            const parts = formatter.formatToParts(now);
            const tzPart = parts.find(p => p.type === 'timeZoneName');
            return tzPart ? tzPart.value : '';
          } catch (e) {
            return '';
          }
        })()
      `};
      document.getElementById('date').innerHTML = dateStr + '<br><span style="font-size: 0.85em; opacity: 0.6;">' + tzOffset + '</span>';
      ` : `
      document.getElementById('date').textContent = dateStr;
      `}
    ` : ''}
  }

  ${isSmoothClock ? `
  function animate() {
    updateClock();
    requestAnimationFrame(animate);
  }
  animate();
  ` : `
  setInterval(updateClock, 1000);
  updateClock();
  `}
`;
};
