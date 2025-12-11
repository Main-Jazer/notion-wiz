// Clock Widget Configuration
// Enhanced with JAZER_BRAND integration

import { jazerNeonTheme } from '../../theme/jazerNeonTheme'; // Import jazerNeonTheme

export const clockConfig = {
  id: 'clock',
  label: 'Clock',
  description: 'Advanced customizable clock with multiple styles.',

  defaultConfig: {
    // Time Display
    is12Hour: true,
    showDate: true,
    showSeconds: false,
    timezone: 'local', // local or IANA timezone string
    blinkingSeparator: false,
    dateFormat: 'long', // long, short, numeric, iso, custom

    // Clock Style
    clockSize: 'large', // small, medium, large, xlarge
    clockType: 'digital-solid', // analog-dots, analog-numbers, analog-planets, analog-smooth, analog-tick,
    // analog-trail, digital-roulette, digital-solid, flip-clock
    responsiveSizing: false, // Use container queries for responsive sizing

    // Analog Clock Customization
    handShape: 'classic', // classic, arrow, modern, minimalist
    faceMarkers: 'dots', // dots, numbers, roman, lines, none

    // Typography
    digitFontFamily: 'default', // default, impact, serif
    textFontFamily: 'default', // default, serif, mono
    googleFont: 'none', // none, orbitron, righteousretro, caveat, permanentmarker, monoton
    textAlign: 'center', // left, center, right
    textShadows: false,

    // Background
    useTransparentBg: false,
    bgColor: jazerNeonTheme.colors.stardustWhite,
    backgroundTexture: 'none', // none, noise, stars, dots, grid, waves

    // Interactive Mode
    widgetMode: 'clock', // clock, timer, stopwatch

    // Preset Theme
    presetTheme: 'none', // none, cyberpunk, stealth, ocean, sunset, forest, neon

    // Appearance Mode
    appearance: 'system', // system, light, dark

    // Light Mode Colors
    lightMode: {
      clockColor: jazerNeonTheme.colors.graphite,
      digitColor: jazerNeonTheme.colors.stardustWhite,
      textColor: jazerNeonTheme.colors.graphite,
      backgroundColor: jazerNeonTheme.colors.stardustWhite
    },

    // Dark Mode Colors
    darkMode: {
      clockColor: jazerNeonTheme.colors.ultraviolet,
      digitColor: jazerNeonTheme.colors.stardustWhite,
      textColor: jazerNeonTheme.colors.stardustWhite,
      backgroundColor: jazerNeonTheme.colors.nightBlack
    },

    // Additional Features
    showHoverMenu: false,
    showCustomizeButton: false,

    // Effects
    glowEffect: false,
    gradientText: false
  },

  fields: [
    // Time Display Section
    { name: 'is12Hour', label: '12-Hour Format', type: 'boolean', section: 'time' },
    { name: 'showDate', label: 'Show Date', type: 'boolean', section: 'time' },
    { name: 'showSeconds', label: 'Show Seconds', type: 'boolean', section: 'time' },
    {
      name: 'timezone',
      label: 'Timezone',
      type: 'select',
      section: 'time',
      options: [
        { label: 'Local (System)', value: 'local' },
        { label: 'UTC', value: 'UTC' },
        { label: 'Eastern (New York)', value: 'America/New_York' },
        { label: 'Central (Chicago)', value: 'America/Chicago' },
        { label: 'Mountain (Denver)', value: 'America/Denver' },
        { label: 'Pacific (Los Angeles)', value: 'America/Los_Angeles' },
        { label: 'London', value: 'Europe/London' },
        { label: 'Paris', value: 'Europe/Paris' },
        { label: 'Berlin', value: 'Europe/Berlin' },
        { label: 'Tokyo', value: 'Asia/Tokyo' },
        { label: 'Hong Kong', value: 'Asia/Hong_Kong' },
        { label: 'Sydney', value: 'Australia/Sydney' },
        { label: 'Dubai', value: 'Asia/Dubai' },
        { label: 'Mumbai', value: 'Asia/Kolkata' }
      ]
    },
    { name: 'blinkingSeparator', label: 'Blinking Separator (:)', type: 'boolean', section: 'time' },
    {
      name: 'dateFormat',
      label: 'Date Format',
      type: 'select',
      section: 'time',
      options: [
        { label: 'Long (Monday, January 1, 2025)', value: 'long' },
        { label: 'Short (Mon, Jan 1, 2025)', value: 'short' },
        { label: 'Numeric (01/01/2025)', value: 'numeric' },
        { label: 'European (01.01.2025)', value: 'european' },
        { label: 'ISO (2025-01-01)', value: 'iso' }
      ]
    },

    // Style Section
    {
      name: 'clockSize',
      label: 'Clock Size',
      type: 'select',
      section: 'style',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'X-Large', value: 'xlarge' }
      ]
    },
    {
      name: 'clockType',
      label: 'Clock Type',
      type: 'select',
      section: 'style',
      options: [
        { label: 'Digital Solid', value: 'digital-solid' },
        { label: 'Digital Roulette', value: 'digital-roulette' },
        { label: 'Flip Clock', value: 'flip-clock' },
        { label: 'Analog Smooth', value: 'analog-smooth' },
        { label: 'Analog Tick', value: 'analog-tick' },
        { label: 'Analog Trail', value: 'analog-trail' },
        { label: 'Analog Dots', value: 'analog-dots' },
        { label: 'Analog Numbers', value: 'analog-numbers' },
        { label: 'Analog Planets', value: 'analog-planets' }
      ]
    },
    { name: 'responsiveSizing', label: 'Responsive Sizing (Container Queries)', type: 'boolean', section: 'style' },

    // Analog Customization Section
    {
      name: 'handShape',
      label: 'Hand Shape (Analog Only)',
      type: 'select',
      section: 'analog',
      options: [
        { label: 'Classic', value: 'classic' },
        { label: 'Arrow', value: 'arrow' },
        { label: 'Modern', value: 'modern' },
        { label: 'Minimalist', value: 'minimalist' }
      ]
    },
    {
      name: 'faceMarkers',
      label: 'Face Markers (Analog Only)',
      type: 'select',
      section: 'analog',
      options: [
        { label: 'Dots', value: 'dots' },
        { label: 'Numbers', value: 'numbers' },
        { label: 'Roman Numerals', value: 'roman' },
        { label: 'Lines', value: 'lines' },
        { label: 'None', value: 'none' }
      ]
    },

    // Typography Section
    {
      name: 'digitFontFamily',
      label: 'Digit Font',
      type: 'select',
      section: 'typography',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Impact', value: 'impact' },
        { label: 'Serif', value: 'serif' }
      ]
    },
    {
      name: 'textFontFamily',
      label: 'Text Font',
      type: 'select',
      section: 'typography',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Serif', value: 'serif' },
        { label: 'Mono', value: 'mono' }
      ]
    },
    {
      name: 'textAlign',
      label: 'Text Alignment',
      type: 'select',
      section: 'typography',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ]
    },
    {
      name: 'googleFont',
      label: 'Google Font Style',
      type: 'select',
      section: 'typography',
      options: [
        { label: 'None (Default)', value: 'none' },
        { label: 'Orbitron (Futuristic)', value: 'Orbitron' },
        { label: 'Righteous (Retro)', value: 'Righteous' },
        { label: 'Caveat (Handwritten)', value: 'Caveat' },
        { label: 'Permanent Marker (Bold)', value: 'Permanent+Marker' },
        { label: 'Monoton (Art Deco)', value: 'Monoton' },
        { label: 'Press Start 2P (Pixel)', value: 'Press+Start+2P' }
      ]
    },
    { name: 'textShadows', label: 'Text Shadows', type: 'boolean', section: 'typography' },

    // Background Section
    { name: 'useTransparentBg', label: 'Transparent Background', type: 'boolean', section: 'background' },
    {
      name: 'backgroundTexture',
      label: 'Background Texture',
      type: 'select',
      section: 'background',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Noise', value: 'noise' },
        { label: 'Stars', value: 'stars' },
        { label: 'Dots Pattern', value: 'dots' },
        { label: 'Grid', value: 'grid' },
        { label: 'Waves', value: 'waves' }
      ]
    },

    // Interactive Mode Section
    {
      name: 'widgetMode',
      label: 'Widget Mode',
      type: 'select',
      section: 'interactive',
      options: [
        { label: 'Clock', value: 'clock' },
        { label: 'Timer', value: 'timer' },
        { label: 'Stopwatch', value: 'stopwatch' }
      ]
    },

    // Theme Section
    {
      name: 'presetTheme',
      label: 'Preset Theme',
      type: 'select',
      section: 'theme',
      options: [
        { label: 'None (Custom)', value: 'none' },
        { label: 'Cyberpunk', value: 'cyberpunk' },
        { label: 'Stealth', value: 'stealth' },
        { label: 'Ocean', value: 'ocean' },
        { label: 'Sunset', value: 'sunset' },
        { label: 'Forest', value: 'forest' },
        { label: 'Neon', value: 'neon' },
        { label: 'Midnight', value: 'midnight' }
      ]
    },

    // Appearance Section
    {
      name: 'appearance',
      label: 'Appearance Mode',
      type: 'select',
      section: 'appearance',
      options: [
        { label: 'System Setting', value: 'system' },
        { label: 'Light Mode', value: 'light' },
        { label: 'Dark Mode', value: 'dark' }
      ]
    },

    // Additional Features
    { name: 'showHoverMenu', label: 'Show Hover Menu', type: 'boolean', section: 'features' },
    { name: 'showCustomizeButton', label: 'Show Customize Button', type: 'boolean', section: 'features' },

    // Effects (for brand kit compatibility)
    { name: 'glowEffect', label: 'Neon Glow Effect', type: 'boolean', section: 'effects' },
    { name: 'gradientText', label: 'Gradient Text', type: 'boolean', section: 'effects' }
  ]
};
