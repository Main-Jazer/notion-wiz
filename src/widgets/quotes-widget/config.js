// Quotes Widget Configuration
// Enhanced with JAZER_BRAND integration and full feature set

export const quotesConfig = {
  id: 'quotes',
  label: 'Quotes',
  description: 'Dynamic quotes from Instagram with custom styling and typography.',

  defaultConfig: {
    // Content Source
    instagramAccount: 'positivemindsetdaily',
    quoteText: 'Design is how it works.',
    author: 'Steve Jobs',

    // Display Options
    showRefreshIcon: true,
    autoRefreshInterval: 0, // in minutes
    useQuoteAPI: true,

    // Background Options
    useTransparentBackground: false,
    setBackgroundColor: true,
    backgroundColor: 'jazerNeonTheme.colors.stardustWhite', // JAZER_BRAND.colors.stardustWhite - will be replaced

    // Typography Options
    quoteTextFont: 'body', // 'body' | 'heading' | 'serif' | 'mono'
    attributionFont: 'heading', // 'heading' | 'body' | 'serif' | 'mono'
    textAlign: 'center',
    textShadows: false,

    // Color Customization
    textColorLight: 'jazerNeonTheme.colors.nightBlack', // JAZER_BRAND.colors.nightBlack - will be replaced
    textColorDark: 'jazerNeonTheme.colors.stardustWhite', // JAZER_BRAND.colors.stardustWhite - will be replaced
    quoteBackgroundLight: 'jazerNeonTheme.colors.stardustWhite', // JAZER_BRAND.colors.stardustWhite - will be replaced
    quoteBackgroundDark: 'jazerNeonTheme.ui.deepSpace', // JAZER_BRAND.ui.deepSpace - will be replaced
    refreshIconColor: 'jazerNeonTheme.colors.electricPurple', // JAZER_BRAND.colors.electricPurple - will be replaced
    authorColor: 'jazerNeonTheme.colors.aetherTeal', // JAZER_BRAND.colors.aetherTeal - will be replaced

    // Appearance Settings
    appearanceMode: 'system', // 'do-nothing' | 'system' | 'light' | 'dark'

    // Visual Effects
    gradientQuoteText: false,
    gradientQuoteCardBorder: false,
    glowQuoteCard: false,
    glowRefreshIconHover: false,
    useGradientRefreshIcon: false,

    // Additional Features
    showHoverMenu: true,
    showCustomizeButton: true,

    // Legacy
    fontSize: 32,
    glowEffect: false,
    gradientText: false
  },

  fields: [
    // Content Source Section
    {
      name: 'instagramAccount',
      label: 'Instagram Account',
      type: 'text',
      section: 'contentSource',
      placeholder: 'positivemindsetdaily'
    },
    {
      name: 'quoteText',
      label: 'Quote Text',
      type: 'textarea',
      section: 'contentSource'
    },
    {
      name: 'author',
      label: 'Author',
      type: 'text',
      section: 'contentSource'
    },

    // Display Options Section
    {
      name: 'showRefreshIcon',
      label: 'Show Refresh Icon',
      type: 'boolean',
      section: 'displayOptions'
    },
    {
      name: 'useQuoteAPI',
      label: 'Fetch Quotes from API',
      type: 'boolean',
      section: 'displayOptions'
    },
    {
      name: 'autoRefreshInterval',
      label: 'Auto-refresh Interval',
      type: 'select',
      section: 'displayOptions',
      options: [
        { label: 'Disabled', value: 0 },
        { label: '1 Minute', value: 1 },
        { label: '5 Minutes', value: 5 },
        { label: '15 Minutes', value: 15 },
        { label: '30 Minutes', value: 30 },
        { label: '60 Minutes', value: 60 },
      ]
    },

    // Background Section
    {
      name: 'useTransparentBackground',
      label: 'Transparent Background',
      type: 'boolean',
      section: 'background'
    },
    {
      name: 'setBackgroundColor',
      label: 'Set Background Color',
      type: 'boolean',
      section: 'background'
    },
    {
      name: 'backgroundColor',
      label: 'Background Color',
      type: 'color',
      section: 'background'
    },

    // Typography Section
    {
      name: 'quoteTextFont',
      label: 'Quote Text Font',
      type: 'select',
      section: 'typography',
      options: [
        { label: 'Default (Body)', value: 'body' },
        { label: 'Heading', value: 'heading' },
        { label: 'Serif', value: 'serif' },
        { label: 'Mono', value: 'mono' }
      ]
    },
    {
      name: 'attributionFont',
      label: 'Attribution Font',
      type: 'select',
      section: 'typography',
      options: [
        { label: 'Default (Heading)', value: 'heading' },
        { label: 'Body', value: 'body' },
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
      name: 'textShadows',
      label: 'Text Shadows',
      type: 'boolean',
      section: 'typography'
    },

    // Color Customization Section
    {
      name: 'textColorLight',
      label: 'Text Color (Light Mode)',
      type: 'color',
      section: 'colors'
    },
    {
      name: 'textColorDark',
      label: 'Text Color (Dark Mode)',
      type: 'color',
      section: 'colors'
    },
    {
      name: 'quoteBackgroundLight',
      label: 'Quote Background (Light)',
      type: 'color',
      section: 'colors'
    },
    {
      name: 'quoteBackgroundDark',
      label: 'Quote Background (Dark)',
      type: 'color',
      section: 'colors'
    },
    {
      name: 'refreshIconColor',
      label: 'Refresh Icon Color',
      type: 'color',
      section: 'colors'
    },
    {
      name: 'authorColor',
      label: 'Author Color',
      type: 'color',
      section: 'colors'
    },

    // Appearance Section
    {
      name: 'appearanceMode',
      label: 'Appearance Mode',
      type: 'select',
      section: 'appearance',
      options: [
        { label: 'Do Nothing', value: 'do-nothing' },
        { label: 'Use System Setting', value: 'system' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' }
      ]
    },

    // Visual Effects Section
    {
      name: 'gradientQuoteText',
      label: 'Gradient Quote Text',
      type: 'boolean',
      section: 'effects'
    },
    {
      name: 'gradientQuoteCardBorder',
      label: 'Gradient Quote Card Border',
      type: 'boolean',
      section: 'effects'
    },
    {
      name: 'glowQuoteCard',
      label: 'Glow Effect on Quote Card',
      type: 'boolean',
      section: 'effects'
    },
    {
      name: 'glowRefreshIconHover',
      label: 'Glow on Refresh Icon Hover',
      type: 'boolean',
      section: 'effects'
    },
    {
      name: 'useGradientRefreshIcon',
      label: 'Use Gradient for Refresh Icon',
      type: 'boolean',
      section: 'effects'
    },

    // Additional Features Section
    {
      name: 'showHoverMenu',
      label: 'Show Hover Menu',
      type: 'boolean',
      section: 'features'
    },
    {
      name: 'showCustomizeButton',
      label: 'Show Customize Button',
      type: 'boolean',
      section: 'features'
    }
  ]
};
