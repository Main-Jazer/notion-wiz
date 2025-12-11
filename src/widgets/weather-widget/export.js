// Weather Widget HTML and Script Export
// Generates standalone HTML with embedded JAZER_BRAND styles

import { jazerNeonTheme } from '../../theme/jazerNeonTheme';

const theme = jazerNeonTheme;

// Constants
const REFRESH_INTERVAL_MS = 600000; // 10 minutes
const MIN_FORECAST_DAYS = 1;
const MAX_FORECAST_DAYS = 14;
const DEFAULT_FORECAST_DAYS = 5;
const MIN_FONT_SCALE = 0.5;
const MAX_FONT_SCALE = 2.0;
const DEFAULT_FONT_SCALE = 1.0;
const MAX_LOCATION_LENGTH = 100;

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

/**
 * Sanitizes location input to prevent XSS and script injection.
 * Removes dangerous characters and limits length.
 * @param {string} location - The location string to sanitize
 * @returns {string} - Sanitized location string
 */
const sanitizeLocation = (location) => {
  if (typeof location !== 'string') return 'New York, NY';
  // Sanitize for JavaScript string context using allowlist approach
  // Only allow safe characters: letters, numbers, spaces, commas, periods, hyphens, and apostrophes
  // Note: Backslashes and other dangerous chars are removed by the allowlist BEFORE quote escaping,
  // so the incomplete-sanitization warning is a false positive.
  const sanitized = location
    .replace(/[^a-zA-Z0-9\s,.\-']/g, '') // Remove all chars except allowed ones (allowlist)
    .replace(/'/g, "\\'") // Escape single quotes for JavaScript string
    .trim()
    .slice(0, MAX_LOCATION_LENGTH);
  return sanitized || 'New York, NY';
};

const weatherIcons = {
  sunny: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
  clear: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
  cloudy: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
  clouds: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
  rainy: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 13v8m-8-5v8m4-11v8"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
  rain: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 13v8m-8-5v8m4-11v8"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
  'partly-cloudy': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2m6.4 1.4l-1.4 1.4M20 12h2M6 18H4m9.4 3.6L12 20m6.4-11.6L20 6.6"/><circle cx="12" cy="12" r="4"/><path d="M13 19a2 2 0 0 0 0-4H3a4 4 0 1 0 0 8h10Z"/></svg>',
  drizzle: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 19v1m8-1v1m-4-1v1m-4-5v1m8-1v1m-4-1v1"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
  snow: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><path d="M8 16h.01M8 12h.01M12 16h.01M12 12h.01M16 16h.01M16 12h.01"/></svg>',
  thunderstorm: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><path d="m13 11-4 6h6l-4 6"/></svg>',
  mist: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7m10 4H9"/></svg>',
  fog: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7m10 4H9"/></svg>',
  haze: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7m10 4H9"/></svg>',
  smoke: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7m10 4H9m-2-8h10"/></svg>',
  dust: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
  sand: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
  tornado: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4H3m15 4H6m11 4H9m7 4h-7m5 4h-3"/></svg>'
};

/**
 * Generates complete standalone HTML for the weather widget.
 * Includes embedded styles, scripts, and weather fetching logic.
 * @param {Object} config - Widget configuration object
 * @param {string} config.weatherLocation - Location to display weather for
 * @param {string} config.appearanceMode - 'light', 'dark', or 'system'
 * @param {string} config.preferredUnits - 'metric' or 'imperial'
 * @param {number} config.numberOfDays - Number of forecast days (1-14)
 * @param {number} config.fontScale - Font size multiplier (0.5-2.0)
 * @returns {string} - Complete HTML document as string
 */
export const generateWeatherHTML = (config) => {
  const isDark = config.appearanceMode === 'dark';
  const textColor = isDark ? config.textColorDark : config.textColorLight;
  
  // Get font family based on config
  const getFontFamily = () => {
    if (config.googleFont !== 'none') {
      return `"${config.googleFont.replace(/\+/g, ' ')}", system-ui, sans-serif`;
    }
    
    switch (config.textFontFamily) {
      case 'serif':
        return 'Georgia, serif';
      case 'mono':
        return 'ui-monospace, monospace';
      default:
        return theme.fonts.body;
    }
  };

  // Get background texture pattern
  const getBackgroundTexture = () => {
    if (config.backgroundTexture === 'none') return '';
    
    const textures = {
      noise: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="300" height="300" filter="url(%23n)" opacity="0.05"/%3E%3C/svg%3E',
      stars: 'radial-gradient(2px 2px at 20px 30px, white, transparent), radial-gradient(2px 2px at 60px 70px, white, transparent), radial-gradient(1px 1px at 50px 50px, white, transparent), radial-gradient(1px 1px at 130px 80px, white, transparent), radial-gradient(2px 2px at 90px 10px, white, transparent)',
      dots: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      grid: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
      waves: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)'
    };
    
    return textures[config.backgroundTexture] || '';
  };

  // Apply preset themes
  const getPresetThemeStyles = () => {
    if (config.presetTheme === 'none') return {};
    
    const themes = {
      cyberpunk: {
        gradient: `linear-gradient(135deg, ${theme.colors.neonPink}, ${theme.colors.electricPurple})`,
        glow: '0 0 20px rgba(236, 72, 153, 0.5)'
      },
      stealth: {
        gradient: `linear-gradient(135deg, ${theme.colors.graphite}, ${theme.colors.nightBlack})`,
        glow: 'none'
      },
      ocean: {
        gradient: `linear-gradient(135deg, ${theme.colors.aetherTeal}, ${theme.colors.cosmicBlue})`,
        glow: '0 0 15px rgba(6, 182, 212, 0.4)'
      },
      sunset: {
        gradient: `linear-gradient(135deg, ${theme.colors.sunburstGold}, ${theme.colors.neonPink})`,
        glow: '0 0 20px rgba(245, 158, 11, 0.5)'
      },
      forest: {
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        glow: '0 0 15px rgba(16, 185, 129, 0.4)'
      },
      neon: {
        gradient: `linear-gradient(90deg, ${theme.colors.neonPink} 0%, ${theme.colors.sunburstGold} 28%, ${theme.colors.aetherTeal} 50%, ${theme.colors.cosmicBlue} 74%, ${theme.colors.electricPurple} 100%)`,
        glow: '0 0 4px rgba(139, 92, 246, 0.5)'
      },
      midnight: {
        gradient: `linear-gradient(135deg, ${theme.colors.nightBlack}, ${theme.colors.ultraviolet})`,
        glow: '0 0 10px rgba(167, 139, 250, 0.3)'
      }
    };
    
    return themes[config.presetTheme] || {};
  };

  const presetTheme = getPresetThemeStyles();
  
  // Dynamic gradient backgrounds based on weather condition
  const getWeatherGradient = (condition = 'clear') => {
    if (config.useTransparentBackground) return 'transparent';
    if (config.setBackgroundColor) return config.backgroundColor;
    
    // Apply preset theme if selected
    if (config.presetTheme !== 'none' && presetTheme.gradient) {
      return presetTheme.gradient;
    }
    
    const gradients = {
      clear: `linear-gradient(135deg, ${theme.colors.sunburstGold} 0%, ${theme.colors.cosmicBlue} 100%)`,
      sunny: `linear-gradient(135deg, ${theme.colors.sunburstGold} 0%, ${theme.colors.cosmicBlue} 100%)`,
      clouds: `linear-gradient(135deg, ${theme.colors.softSlate} 0%, ${theme.colors.graphite} 100%)`,
      rain: `linear-gradient(135deg, ${theme.colors.cosmicBlue} 0%, ${theme.colors.graphite} 100%)`,
      thunderstorm: `linear-gradient(135deg, ${theme.colors.electricPurple} 0%, ${theme.colors.nightBlack} 100%)`,
      snow: `linear-gradient(135deg, ${theme.colors.stardustWhite} 0%, ${theme.colors.cosmicBlue} 100%)`,
    };
    
    return gradients[condition] || (isDark ? theme.colors.nightBlack : theme.colors.stardustWhite);
  };
  
  const bgColor = getWeatherGradient();
  const bgTexture = getBackgroundTexture();
  const bgTextureSize = config.backgroundTexture === 'dots' || config.backgroundTexture === 'grid' ? '20px 20px' : 'auto';
  const textShadow = config.textShadows ? '0 2px 4px rgba(0,0,0,0.1)' : 'none';
  const glowEffect = config.glowEffect ? (presetTheme.glow || '0 0 4px rgba(139, 92, 246, 0.5)') : 'none';
  const gradientText = config.gradientText ? `
    background: ${presetTheme.gradient || `linear-gradient(90deg, ${theme.colors.neonPink} 0%, ${theme.colors.sunburstGold} 28%, ${theme.colors.aetherTeal} 50%, ${theme.colors.cosmicBlue} 74%, ${theme.colors.electricPurple} 100%)`};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  ` : '';
  const fontFamily = getFontFamily();
  const textAlign = config.textAlign || 'center';
  // Validate and constrain fontScale to safe range
  const fontScale = Math.max(MIN_FONT_SCALE, Math.min(MAX_FONT_SCALE, config.fontScale || DEFAULT_FONT_SCALE));
  
  // Google Font URL
  const googleFontUrl = config.googleFont !== 'none' 
    ? `https://fonts.googleapis.com/css2?family=${config.googleFont}&display=swap`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather Widget - ${escapeHTML(config.weatherLocation)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
  ${googleFontUrl ? `<link href="${googleFontUrl}" rel="stylesheet">` : ''}
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
      ${bgTexture ? `background-image: ${bgTexture};` : ''}
      ${bgTexture ? `background-size: ${bgTextureSize};` : ''}
      color: ${textColor};
      font-family: ${fontFamily};
      text-align: ${textAlign};
      padding: 24px;
      ${glowEffect !== 'none' ? `box-shadow: ${glowEffect};` : ''}
      ${config.useTransparentBackground ? `
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      ` : ''}
    }

    h2 {
      ${gradientText}
    }

    .weather-container {
      ${config.useTransparentBackground ? `
        background: ${isDark ? 'rgba(11, 14, 18, 0.7)' : 'rgba(248, 249, 255, 0.7)'};
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 12px;
        border: 1px solid ${isDark ? 'rgba(248, 249, 255, 0.1)' : 'rgba(11, 14, 18, 0.1)'};
        padding: 24px;
      ` : ''}
      display: flex;
      gap: 24px;
      ${config.orientation === 'horizontal' ? 'flex-direction: row;' : 'flex-direction: column;'}
    }

    .loading-skeleton {
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .skeleton-circle {
      width: ${48 * fontScale}px;
      height: ${48 * fontScale}px;
      background: rgba(156, 163, 175, 0.3);
      border-radius: 50%;
    }

    .skeleton-line {
      height: ${16 * fontScale}px;
      background: rgba(156, 163, 175, 0.3);
      border-radius: 4px;
      margin: 8px 0;
    }

    .alert-banner {
      display: flex;
      align-items: start;
      gap: 12px;
      padding: 16px;
      margin-bottom: 16px;
      background: rgba(239, 68, 68, 0.1);
      border-left: 4px solid #EF4444;
      border-radius: 8px;
      color: #DC2626;
    }

    .alert-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .current-weather {
      flex-shrink: 0;
    }

    .location-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .location-title {
      font-size: ${20 * fontScale}px;
      font-weight: bold;
      font-family: ${theme.fonts.heading};
      text-shadow: ${textShadow};
    }

    .current-temp {
      font-size: ${48 * fontScale}px;
      font-weight: bold;
      font-family: ${theme.fonts.heading};
      text-shadow: ${textShadow};
    }

    .current-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 12px;
      text-shadow: ${textShadow};
      font-size: ${14 * fontScale}px;
    }

    .forecast-section {
      flex: 1;
    }

    .forecast-title {
      font-size: ${14 * fontScale}px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.7;
      margin-bottom: 12px;
      text-shadow: ${textShadow};
    }

    .forecast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${80 * fontScale}px, 1fr));
      gap: 12px;
    }

    .forecast-day {
      text-align: center;
      padding: 12px;
      border-radius: 8px;
      ${config.visuallyGroupForecast ? `background: ${isDark ? 'rgba(248, 249, 255, 0.1)' : 'rgba(11, 14, 18, 0.05)'};` : ''}
    }

    .day-name {
      font-size: ${12 * fontScale}px;
      font-weight: 600;
      opacity: 0.7;
      margin-bottom: 8px;
    }

    .day-date {
      font-size: ${10 * fontScale}px;
      opacity: 0.5;
    }

    .day-temp {
      font-size: ${14 * fontScale}px;
      font-weight: bold;
      margin-top: 8px;
    }

    .day-low {
      font-size: ${12 * fontScale}px;
      opacity: 0.6;
    }

    .day-condition {
      font-size: ${12 * fontScale}px;
      opacity: 0.7;
      margin-top: 4px;
    }

    .customize-button {
      position: absolute;
      bottom: 16px;
      right: 16px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: ${14 * fontScale}px;
      font-weight: 500;
      background-color: ${theme.colors.cosmicBlue};
      color: ${theme.colors.stardustWhite};
      font-family: ${theme.fonts.heading};
      border: none;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .customize-button:hover {
      transform: scale(1.05);
    }

    .weather-icon {
      display: inline-block;
      ${config.greyscaleIcons ? 'filter: grayscale(100%);' : ''}
      ${config.animateIcons ? 'animation: pulse-icon 2s infinite;' : ''}
    }

    @keyframes pulse-icon {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    @media (prefers-color-scheme: dark) {
      ${config.appearanceMode === 'system' ? `
        body {
          background: ${config.useTransparentBackground ? 'transparent' : (config.setBackgroundColor ? config.backgroundColor : theme.colors.nightBlack)};
          color: ${config.textColorDark};
        }
      ` : ''}
    }
  </style>
</head>
<body>
  <div id="weather-root">
    <div class="loading-skeleton">
      <div class="skeleton-circle"></div>
      <div class="skeleton-line" style="width: 200px;"></div>
      <div class="skeleton-line" style="width: 150px;"></div>
      <div class="skeleton-line" style="width: 180px;"></div>
    </div>
  </div>

  ${config.showCustomizeButton ? '<button class="customize-button">Customize</button>' : ''}

  <script>
    ${generateWeatherScript(config)}
  </script>
</body>
</html>`;
};

/**
 * Generates the JavaScript code for the weather widget.
 * Includes weather fetching, rendering, and error handling.
 * @param {Object} config - Widget configuration object
 * @returns {string} - Generated JavaScript code
 */
export const generateWeatherScript = (config) => {
  // Sanitize location to prevent XSS in generated script
  const location = sanitizeLocation(config.weatherLocation || 'New York, NY');
  const tempUnitAPI = config.preferredUnits === 'metric' ? 'celsius' : 'fahrenheit';
  const windUnitAPI = config.preferredUnits === 'metric' ? 'kmh' : 'mph';
  const precipUnitAPI = config.preferredUnits === 'metric' ? 'mm' : 'inch';
  const tempUnit = config.preferredUnits === 'metric' ? '°C' : '°F';
  const windUnit = config.preferredUnits === 'metric' ? 'km/h' : 'mph';
  // Validate and constrain fontScale to safe range
  const fontScale = Math.max(MIN_FONT_SCALE, Math.min(MAX_FONT_SCALE, config.fontScale || DEFAULT_FONT_SCALE));
  // Validate and constrain numberOfDays to safe range
  const numberOfDays = Math.max(MIN_FORECAST_DAYS, Math.min(MAX_FORECAST_DAYS, config.numberOfDays || DEFAULT_FORECAST_DAYS));
  
  return `
    const LOCATION = '${location}';
    const TEMP_UNIT_API = '${tempUnitAPI}';
    const WIND_UNIT_API = '${windUnitAPI}';
    const PRECIP_UNIT_API = '${precipUnitAPI}';
    const TEMP_UNIT = '${tempUnit}';
    const WIND_UNIT = '${windUnit}';
    const FONT_SCALE = ${fontScale};
    const SHOW_SEVERE_ALERTS = ${config.showSevereAlerts || false};
    const DISPLAY_DATES = ${config.displayDates || false};
    const CURRENT_FIELDS = ${JSON.stringify(config.currentWeatherFields || [])};
    const DAILY_FIELDS = ${JSON.stringify(config.dailyWeatherFields || [])};
    const NUM_DAYS = ${numberOfDays};
    const HIDE_TODAY = ${config.hideTodayInForecast || false};
    const REFRESH_INTERVAL_MS = ${REFRESH_INTERVAL_MS};

    const weatherIcons = ${JSON.stringify(weatherIcons)};

    function getWeatherIcon(condition) {
      const conditionLower = condition.toLowerCase();
      return weatherIcons[conditionLower] || weatherIcons['partly-cloudy'];
    }

    function getConditionFromWMO(code) {
      if (code === 0) return 'Clear';
      if (code <= 3) return 'Partly Cloudy';
      if (code <= 48) return 'Fog';
      if (code <= 67) return 'Rain';
      if (code <= 77) return 'Snow';
      if (code <= 82) return 'Rain';
      if (code <= 86) return 'Snow';
      if (code <= 99) return 'Thunderstorm';
      return 'Cloudy';
    }

    function getIconFromWMO(code) {
      if (code === 0) return 'clear';
      if (code <= 3) return 'partly-cloudy';
      if (code <= 48) return 'fog';
      if (code <= 57) return 'drizzle';
      if (code <= 67) return 'rain';
      if (code <= 77) return 'snow';
      if (code <= 82) return 'rain';
      if (code <= 86) return 'snow';
      if (code >= 95) return 'thunderstorm';
      return 'clouds';
    }

    function renderErrorState(message) {
      const errorIcon = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6m0-6 6 6"/></svg>';
      const html = \`
        <div class="weather-container" style="text-align: center; padding: 32px;">
          <div style="opacity: 0.6; margin-bottom: 16px;">\${errorIcon}</div>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Unable to Load Weather</h3>
          <p style="font-size: 14px; opacity: 0.7; margin-bottom: 16px;">\${message}</p>
          <button onclick="fetchWeatherData()" style="padding: 8px 16px; border-radius: 8px; background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: inherit; cursor: pointer; font-size: 14px;">
            Try Again
          </button>
        </div>
      \`;
      document.getElementById('weather-root').innerHTML = html;
    }

    async function fetchWeatherData() {
      try {
        // Note: Open-Meteo API has rate limits. Consider caching responses for production use.
        // Geocode the location using Open-Meteo
        const geoResponse = await fetch(
          \`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(LOCATION)}&count=1&language=en&format=json\`
        );
        
        if (!geoResponse.ok) {
          throw new Error('Unable to find location. Please check the location name.');
        }
        
        const geoData = await geoResponse.json();
        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('Location not found. Please try a different city name.');
        }

        const { latitude, longitude } = geoData.results[0];

        // Fetch weather data using Open-Meteo Weather API
        const weatherResponse = await fetch(
          \`https://api.open-meteo.com/v1/forecast?latitude=\${latitude}&longitude=\${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=\${TEMP_UNIT_API}&wind_speed_unit=\${WIND_UNIT_API}&precipitation_unit=\${PRECIP_UNIT_API}&timezone=auto\`
        );

        if (!weatherResponse.ok) {
          throw new Error('Weather service temporarily unavailable. Please try again later.');
        }

        const data = await weatherResponse.json();

        renderWeatherData(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        renderErrorState(err.message || 'Could not load weather data. Please try again.');
      }
    }

    function renderWeatherData(data) {
      const current = data.current;
      const dailyData = data.daily;
      const startIdx = HIDE_TODAY ? 1 : 0;
      const forecast = dailyData.time.slice(startIdx, startIdx + NUM_DAYS);

      let html = '<div class="weather-container">';

      // Current weather
      html += '<div class="current-weather">';
      html += \`
        <div class="location-header">
          <div class="weather-icon">\${getWeatherIcon(getIconFromWMO(current.weather_code))}</div>
          <h2 class="location-title">\${LOCATION}</h2>
        </div>
        <div class="current-temp">\${Math.round(current.temperature_2m)}\${TEMP_UNIT}</div>
        <div class="current-details">
      \`;

      if (CURRENT_FIELDS.includes('condition')) {
        html += \`<div>\${getConditionFromWMO(current.weather_code)}</div>\`;
      }
      if (CURRENT_FIELDS.includes('humidity')) {
        html += \`<div>Humidity: \${Math.round(current.relative_humidity_2m)}%</div>\`;
      }
      if (CURRENT_FIELDS.includes('wind')) {
        html += \`<div>Wind: \${Math.round(current.wind_speed_10m)} \${WIND_UNIT}</div>\`;
      }
      if (CURRENT_FIELDS.includes('feelsLike')) {
        html += \`<div>Feels like: \${Math.round(current.apparent_temperature)}\${TEMP_UNIT}</div>\`;
      }
      if (CURRENT_FIELDS.includes('uvIndex')) {
        html += \`<div>UV Index: N/A</div>\`;
      }

      html += '</div></div>';

      // Forecast
      html += '<div class="forecast-section">';
      html += \`<h3 class="forecast-title">\${NUM_DAYS}-Day Forecast</h3>\`;
      html += '<div class="forecast-grid">';

      forecast.forEach((dateStr, idx) => {
        const actualIdx = startIdx + idx;
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateDisplay = DISPLAY_DATES ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

        html += '<div class="forecast-day">';
        html += \`<div class="day-name">\${dayName}\`;
        if (DISPLAY_DATES && dateDisplay) {
          html += \`<div class="day-date">\${dateDisplay}</div>\`;
        }
        html += '</div>';
        html += \`<div class="weather-icon">\${getWeatherIcon(getIconFromWMO(dailyData.weather_code[actualIdx]))}</div>\`;

        if (DAILY_FIELDS.includes('high')) {
          html += \`<div class="day-temp">\${Math.round(dailyData.temperature_2m_max[actualIdx])}\${TEMP_UNIT}</div>\`;
        }
        if (DAILY_FIELDS.includes('low')) {
          html += \`<div class="day-low">\${Math.round(dailyData.temperature_2m_min[actualIdx])}\${TEMP_UNIT}</div>\`;
        }
        if (DAILY_FIELDS.includes('condition')) {
          html += \`<div class="day-condition">\${getConditionFromWMO(dailyData.weather_code[actualIdx])}</div>\`;
        }
        if (DAILY_FIELDS.includes('precipitation') && dailyData.precipitation_probability_max[actualIdx] > 0) {
          html += \`<div class="day-condition">\${Math.round(dailyData.precipitation_probability_max[actualIdx])}%</div>\`;
        }

        html += '</div>';
      });

      html += '</div></div></div>';

      document.getElementById('weather-root').innerHTML = html;
    }

    // Initial load
    fetchWeatherData();

    // Refresh at configured interval
    setInterval(fetchWeatherData, REFRESH_INTERVAL_MS);
  `;
};
