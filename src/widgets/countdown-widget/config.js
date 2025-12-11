// Countdown Widget Configuration
// Enhanced with JAZER_BRAND integration

import { jazerNeonTheme } from '../../theme/jazerNeonTheme'; // Import jazerNeonTheme

export const countdownConfig = {
  id: 'countdown',
  label: 'Countdown',
  description: 'Event countdowns with flip cards and confetti',

  defaultConfig: {
    // Event Configuration
    eventTitle: 'Project Launch',
    targetDate: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 16),
    format24h: true,
    ignoreTimezone: true,
    timezone: 'UTC',
    recurringType: 'none', // 'none', 'daily', 'weekly', 'monthly'
    recurringEndDate: null,

    // Aesthetic Style
    countdownStyle: 'flip-countdown', // 'text-only', 'flip-countdown'

    // Time Units (individual toggles)
    showYear: false,
    showMonth: true,
    showWeek: false,
    showDay: true,
    showHour: true,
    showMinute: true,
    showSecond: true,

    // Completion Settings
    confettiDuration: '5min', // 'never', '1min', '5min', '10min', '1hour', 'forever'
    stopAtZero: true,
    completionMessage: '🎉 Event Started!',
    redirectOnComplete: false,
    redirectUrl: '',
    showToGoLabel: true, // Show "X days to go" / "X days ago"

    // Typography
    digitFontFamily: 'default', // 'default', 'impact', 'serif'
    textFontFamily: 'default', // 'default', 'serif', 'mono'
    textAlign: 'center',
    textShadows: false,

    // Background
    useTransparentBg: true,

    // Appearance Mode
    appearance: 'system', // 'system', 'light', 'dark'

    // Light Mode Colors
    lightMode: {
      textColor: jazerNeonTheme.colors.graphite,
      panelColor: jazerNeonTheme.colors.stardustWhite,
      digitColor: jazerNeonTheme.colors.nightBlack
    },

    // Dark Mode Colors
    darkMode: {
      textColor: jazerNeonTheme.colors.stardustWhite,
      panelColor: jazerNeonTheme.colors.graphite,
      digitColor: jazerNeonTheme.colors.stardustWhite
    },

    // Additional Features
    showHoverMenu: false,
    showCustomizeButton: false
  },

  fields: [
    // EVENT SETUP SECTION
    { name: 'eventTitle', label: 'Event Title', type: 'text', section: 'event' },
    { name: 'targetDate', label: 'Target Date & Time', type: 'datetime-local', section: 'event' },
    { name: 'format24h', label: '24-Hour Format', type: 'boolean', section: 'event' },
    { name: 'ignoreTimezone', label: 'Ignore Timezone', type: 'boolean', section: 'event' },
          {
            name: 'timezone',
            label: 'Timezone',
            type: 'select',
            section: 'event',
            options: [
              { label: 'UTC', value: 'UTC' },
              { label: 'EST (UTC-5)', value: 'America/New_York' },
              { label: 'PST (UTC-8)', value: 'America/Los_Angeles' },
              { label: 'GMT', value: 'Europe/London' },
              { label: 'CET (UTC+1)', value: 'Europe/Paris' },
              { label: 'JST (UTC+9)', value: 'Asia/Tokyo' }
            ]
          },
          {
            name: 'recurringType',
            label: 'Recurring',
            type: 'select',
            section: 'event',
            options: [
              { label: 'None', value: 'none' },
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' }
            ]
          },
          { name: 'recurringEndDate', label: 'Recurring End Date', type: 'datetime-local', section: 'event', condition: (config) => config.recurringType !== 'none' },
    
        // STYLE SECTION
        {      name: 'countdownStyle',
      label: 'Countdown Style',
      type: 'select',
      section: 'style',
      options: [
        { label: 'Text Only', value: 'text-only' },
        { label: 'Flip Countdown', value: 'flip-countdown' }
      ]
    },
    {
      name: 'textAlign',
      label: 'Text Alignment',
      type: 'select',
      section: 'style',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ]
    },

    // TIME UNITS SECTION
    { name: 'showYear', label: 'Show Years', type: 'boolean', section: 'units' },
    { name: 'showMonth', label: 'Show Months', type: 'boolean', section: 'units' },
    { name: 'showWeek', label: 'Show Weeks', type: 'boolean', section: 'units' },
    { name: 'showDay', label: 'Show Days', type: 'boolean', section: 'units' },
    { name: 'showHour', label: 'Show Hours', type: 'boolean', section: 'units' },
    { name: 'showMinute', label: 'Show Minutes', type: 'boolean', section: 'units' },
    { name: 'showSecond', label: 'Show Seconds', type: 'boolean', section: 'units' },

    // COMPLETION SECTION
    {
      name: 'confettiDuration',
      label: 'Confetti Duration',
      type: 'select',
      section: 'completion',
      options: [
        { label: 'Never', value: 'never' },
        { label: '1 Minute', value: '1min' },
        { label: '5 Minutes', value: '5min' },
        { label: '10 Minutes', value: '10min' },
        { label: '1 Hour', value: '1hour' },
        { label: 'Forever', value: 'forever' }
      ]
    },
    { name: 'stopAtZero', label: 'Stop at Zero', type: 'boolean', section: 'completion' },
    { name: 'completionMessage', label: 'Completion Message', type: 'text', section: 'completion' },
    { name: 'redirectOnComplete', label: 'Redirect on Completion', type: 'boolean', section: 'completion' },
    { name: 'redirectUrl', label: 'Redirect URL', type: 'text', section: 'completion', condition: (config) => config.redirectOnComplete },
    { name: 'showToGoLabel', label: 'Show "To Go/Ago" Label', type: 'boolean', section: 'completion' },

    // TYPOGRAPHY SECTION
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
    { name: 'textShadows', label: 'Text Shadows', type: 'boolean', section: 'typography' },

    // BACKGROUND SECTION
    { name: 'useTransparentBg', label: 'Transparent Background', type: 'boolean', section: 'background' },

    // APPEARANCE SECTION
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

    // FEATURES SECTION
    { name: 'showHoverMenu', label: 'Show Hover Menu', type: 'boolean', section: 'features' },
    { name: 'showCustomizeButton', label: 'Show Customize Button', type: 'boolean', section: 'features' }
  ]
};
