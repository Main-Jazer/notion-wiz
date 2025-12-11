// Weather Widget Configuration
// Enhanced with JAZER_BRAND integration

import { jazerNeonTheme } from '../../theme/jazerNeonTheme';

export const weatherConfig = {
  id: 'weather',
  label: 'Weather',
  description: 'Dynamic weather widget with forecast and customization.',

  // Define sections for better organization
  sections: [
    { id: 'locationSettings', label: 'Location Settings', icon: '📍', order: 1 },
    { id: 'displayConfiguration', label: 'Display Configuration', icon: '📊', order: 2 },
    { id: 'forecastOptions', label: 'Forecast Options', icon: '📅', order: 3 },
    { id: 'layoutOptions', label: 'Layout Options', icon: '📐', order: 4 },
    { id: 'appearance', label: 'Appearance', icon: '🎨', order: 5 },
    { id: 'typography', label: 'Typography', icon: '🔤', order: 6 },
    { id: 'background', label: 'Background', icon: '🖼️', order: 7 },
    { id: 'theme', label: 'Preset Themes', icon: '🎭', order: 8 },
    { id: 'effects', label: 'Effects', icon: '✨', order: 9 },
    { id: 'features', label: 'Additional Features', icon: '⚙️', order: 10 }
  ],

  defaultConfig: {
    // Location Settings
    weatherLocation: 'Austin, TX',
    useGeolocation: true,
    preferredUnits: 'imperial', // 'imperial' | 'metric'
    numberOfDays: 5,

    // Display Configuration
    currentWeatherFields: ['temperature', 'condition', 'humidity', 'wind'],
    dailyWeatherFields: ['high', 'low', 'condition', 'precipitation'],

    // Forecast Options
    hideTodayInForecast: false,
    displayDates: false,

    // Layout Options
    orientation: 'auto', // 'auto' | 'horizontal' | 'compact' | 'wide'
    widgetSize: 'medium', // 'small' | 'medium' | 'large' | 'xlarge'

    // Visual Options
    animateIcons: true,
    greyscaleIcons: false,
    textShadows: false,
    fontScale: 1.0,

    // Appearance - Flat color properties for direct access
    appearanceMode: 'system', // 'light' | 'dark' | 'system'
    useTransparentBackground: false,
    textColorLight: jazerNeonTheme.colors.graphite,
    textColorDark: jazerNeonTheme.colors.stardustWhite,
    backgroundColor: jazerNeonTheme.colors.nightBlack,
    setBackgroundColor: false,
    
    // Nested theme config (for backward compatibility)
    theme: {
      light: {
        textColor: jazerNeonTheme.colors.graphite,
        backgroundColor: jazerNeonTheme.colors.stardustWhite
      },
      dark: {
        textColor: jazerNeonTheme.colors.stardustWhite,
        backgroundColor: jazerNeonTheme.colors.nightBlack
      }
    },

    // Typography
    textFontFamily: 'default', // 'default' | 'serif' | 'mono'
    googleFont: 'none',
    textAlign: 'center', // 'left' | 'center' | 'right'

    // Background
    backgroundTexture: 'none', // 'none' | 'noise' | 'stars' | 'dots' | 'grid' | 'waves'

    // Preset Theme
    presetTheme: 'none',

    // Effects
    glowEffect: false,
    gradientText: false,

    // Additional Features
    visuallyGroupForecast: false,
    showHoverMenu: true,
    showCustomizeButton: true,
    timeFormat: '12h', // '12h' | '24h'
    showSevereAlerts: true
  },

  // Validation rules
  validation: {
    weatherLocation: {
      required: true,
      type: 'string',
      minLength: 2
    },
    currentWeatherFields: {
      required: true,
      type: 'array',
      minItems: 1,
      maxItems: 6
    },
    dailyWeatherFields: {
      required: true,
      type: 'array',
      minItems: 1
    },
    numberOfDays: {
      type: 'number',
      min: 3,
      max: 10
    },
    fontScale: {
      type: 'number',
      min: 0.8,
      max: 1.2,
      step: 0.1
    }
  },

  fields: [
    // ===== Location Settings Section =====
    {
      name: 'weatherLocation',
      label: 'Weather Location',
      type: 'text',
      section: 'locationSettings',
      placeholder: 'City, State or ZIP',
      helpText: 'Uses free Open-Meteo API - no key required',
      required: true
    },
    {
      name: 'useGeolocation',
      label: 'Auto-Detect Location',
      type: 'boolean',
      section: 'locationSettings',
      helpText: 'Automatically detect user location (requires permission)'
    },
    {
      name: 'preferredUnits',
      label: 'Preferred Units',
      type: 'select',
      section: 'locationSettings',
      options: [
        { label: 'Imperial (°F, mph)', value: 'imperial' },
        { label: 'Metric (°C, km/h)', value: 'metric' }
      ]
    },
    {
      name: 'numberOfDays',
      label: 'Number of Days',
      type: 'select',
      section: 'locationSettings',
      options: [
        { label: '3 Days', value: 3 },
        { label: '5 Days', value: 5 },
        { label: '7 Days', value: 7 },
        { label: '10 Days', value: 10 }
      ]
    },

    // ===== Display Configuration Section =====
    {
      name: 'currentWeatherFields',
      label: 'Current Weather Fields',
      type: 'multiselect',
      section: 'displayConfiguration',
      helpText: 'Select 1-6 fields to display',
      maxItems: 6,
      options: [
        { label: 'Temperature', value: 'temperature' },
        { label: 'Condition', value: 'condition' },
        { label: 'Humidity', value: 'humidity' },
        { label: 'Wind Speed', value: 'wind' },
        { label: 'Feels Like', value: 'feelsLike' },
        { label: 'UV Index', value: 'uvIndex' },
        { label: 'Cloud Cover', value: 'cloudCover' },
        { label: 'Pressure', value: 'pressure' },
        { label: 'Visibility', value: 'visibility' },
        { label: 'Sunrise', value: 'sunrise' },
        { label: 'Sunset', value: 'sunset' }
      ]
    },
    {
      name: 'dailyWeatherFields',
      label: 'Daily Weather Fields',
      type: 'multiselect',
      section: 'displayConfiguration',
      options: [
        { label: 'High Temp', value: 'high' },
        { label: 'Low Temp', value: 'low' },
        { label: 'Condition', value: 'condition' },
        { label: 'Precipitation', value: 'precipitation' },
        { label: 'Wind', value: 'wind' },
        { label: 'UV Index', value: 'uvIndex' },
        { label: 'Humidity', value: 'humidity' },
        { label: 'Sunrise', value: 'sunrise' },
        { label: 'Sunset', value: 'sunset' }
      ]
    },

    // ===== Forecast Options Section =====
    {
      name: 'hideTodayInForecast',
      label: 'Hide Today in Forecast',
      type: 'boolean',
      section: 'forecastOptions',
      helpText: 'Show forecast starting from tomorrow'
    },
    {
      name: 'displayDates',
      label: 'Display Dates',
      type: 'boolean',
      section: 'forecastOptions',
      helpText: 'Show dates alongside day names'
    },

    // ===== Layout Options Section =====
    {
      name: 'orientation',
      label: 'Orientation',
      type: 'select',
      section: 'layoutOptions',
      options: [
        { label: 'Auto (Responsive)', value: 'auto' },
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Compact', value: 'compact' },
        { label: 'Wide', value: 'wide' }
      ]
    },
    {
      name: 'widgetSize',
      label: 'Widget Size',
      type: 'select',
      section: 'layoutOptions',
      helpText: 'Control the overall dimensions of the widget',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Extra Large', value: 'xlarge' }
      ]
    },

    // ===== Appearance Section =====
    {
      name: 'appearanceMode',
      label: 'Appearance Mode',
      type: 'select',
      section: 'appearance',
      helpText: 'Control light/dark mode behavior',
      options: [
        { label: 'Use System Setting', value: 'system' },
        { label: 'Light Mode', value: 'light' },
        { label: 'Dark Mode', value: 'dark' }
      ]
    },
    {
      name: 'useTransparentBackground',
      label: 'Transparent Background',
      type: 'boolean',
      section: 'appearance',
      helpText: 'Override background colors with transparency'
    },
    {
      name: 'theme.light.textColor',
      label: 'Light Mode - Text Color',
      type: 'color',
      section: 'appearance',
      dependsOn: { field: 'useTransparentBackground', value: false }
    },
    {
      name: 'theme.light.backgroundColor',
      label: 'Light Mode - Background Color',
      type: 'color',
      section: 'appearance',
      dependsOn: { field: 'useTransparentBackground', value: false }
    },
    {
      name: 'theme.dark.textColor',
      label: 'Dark Mode - Text Color',
      type: 'color',
      section: 'appearance',
      dependsOn: { field: 'useTransparentBackground', value: false }
    },
    {
      name: 'theme.dark.backgroundColor',
      label: 'Dark Mode - Background Color',
      type: 'color',
      section: 'appearance',
      dependsOn: { field: 'useTransparentBackground', value: false }
    },
    {
      name: 'animateIcons',
      label: 'Animate Weather Icons',
      type: 'boolean',
      section: 'appearance'
    },
    {
      name: 'greyscaleIcons',
      label: 'Greyscale Icons',
      type: 'boolean',
      section: 'appearance'
    },
    {
      name: 'textShadows',
      label: 'Text Shadows',
      type: 'boolean',
      section: 'appearance',
      helpText: 'Add subtle shadows for better readability'
    },
    {
      name: 'fontScale',
      label: 'Font Scale',
      type: 'range',
      section: 'appearance',
      min: 0.8,
      max: 1.2,
      step: 0.1
    },

    // ===== Typography Section =====
    {
      name: 'textFontFamily',
      label: 'Base Font Style',
      type: 'select',
      section: 'typography',
      options: [
        { label: 'Default (Sans-serif)', value: 'default' },
        { label: 'Serif', value: 'serif' },
        { label: 'Monospace', value: 'mono' }
      ]
    },
    {
      name: 'googleFont',
      label: 'Google Font Override',
      type: 'select',
      section: 'typography',
      helpText: 'Apply a custom Google Font (overrides base font)',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Orbitron (Futuristic)', value: 'Orbitron' },
        { label: 'Righteous (Retro)', value: 'Righteous' },
        { label: 'Caveat (Handwritten)', value: 'Caveat' },
        { label: 'Permanent Marker (Bold)', value: 'Permanent+Marker' },
        { label: 'Monoton (Art Deco)', value: 'Monoton' },
        { label: 'Press Start 2P (Pixel)', value: 'Press+Start+2P' }
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

    // ===== Background Section =====
    {
      name: 'backgroundTexture',
      label: 'Background Texture',
      type: 'select',
      section: 'background',
      helpText: 'Add a subtle pattern overlay',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Noise', value: 'noise' },
        { label: 'Stars', value: 'stars' },
        { label: 'Dots Pattern', value: 'dots' },
        { label: 'Grid', value: 'grid' },
        { label: 'Waves', value: 'waves' }
      ]
    },

    // ===== Preset Theme Section =====
    {
      name: 'presetTheme',
      label: 'Preset Theme',
      type: 'select',
      section: 'theme',
      helpText: 'Quick-apply a pre-designed theme (overrides custom colors)',
      options: [
        { label: 'None (Use Custom Settings)', value: 'none' },
        { label: 'Cyberpunk', value: 'cyberpunk' },
        { label: 'Stealth', value: 'stealth' },
        { label: 'Ocean', value: 'ocean' },
        { label: 'Sunset', value: 'sunset' },
        { label: 'Forest', value: 'forest' },
        { label: 'Neon', value: 'neon' },
        { label: 'Midnight', value: 'midnight' }
      ]
    },

    // ===== Effects Section =====
    {
      name: 'glowEffect',
      label: 'Neon Glow Effect',
      type: 'boolean',
      section: 'effects',
      helpText: 'Add a subtle glow around elements'
    },
    {
      name: 'gradientText',
      label: 'Gradient Text',
      type: 'boolean',
      section: 'effects',
      helpText: 'Apply color gradients to text'
    },

    // ===== Additional Features Section =====
    {
      name: 'visuallyGroupForecast',
      label: 'Visually Group Forecast',
      type: 'boolean',
      section: 'features',
      helpText: 'Add visual separation between forecast days'
    },
    {
      name: 'timeFormat',
      label: 'Time Format',
      type: 'select',
      section: 'features',
      options: [
        { label: '12-hour (AM/PM)', value: '12h' },
        { label: '24-hour', value: '24h' }
      ]
    },
    {
      name: 'showSevereAlerts',
      label: 'Show Severe Weather Alerts',
      type: 'boolean',
      section: 'features',
      helpText: 'Display warnings for severe weather conditions'
    },
    {
      name: 'showHoverMenu',
      label: 'Show Hover Menu',
      type: 'boolean',
      section: 'features',
      helpText: 'Display interactive menu on hover'
    },
    {
      name: 'showCustomizeButton',
      label: 'Show Customize Button',
      type: 'boolean',
      section: 'features',
      helpText: 'Show button to open customization panel'
    }
  ]
};
