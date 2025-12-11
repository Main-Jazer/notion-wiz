// JAZER_BRAND constants
import { jazerNeonTheme } from '../../theme/jazerNeonTheme'; // Import jazerNeonTheme

export const imageGalleryConfig = {
  id: 'imageGallery',
  label: 'Image Gallery',
  description: 'Dynamic image gallery with advanced controls.',
  defaultConfig: {
    // Image Management
    images: ['https://images.unsplash.com/photo-1472214103451-9374bd1c798e', 'https://images.unsplash.com/photo-1506744038136-462a42ee7a1b'], // Placeholder images
    captions: [],
    minImagesRequired: 1, // Minimum one image required to display gallery

    // Image Display Options
    sizingMode: 'cover', // 'contain', 'cover', 'wrap'

    // Animation Controls
    animateGallerySpeedToggle: false, // Initially disabled/locked
    scrollSpeed: '1s', // '3s', '2s', '1s', '0.5s', '0.3s', '0.2s', '0.1s'

    // Navigation
    dotsIndicator: true,
    overlayArrows: false, // Initially locked

    // Style Options
    slideBackgroundColor: jazerNeonTheme.colors.stardustWhite,
    textColor: jazerNeonTheme.colors.nightBlack,
    dropShadows: false,
    transparentBackground: false, // Initially locked
    setBackgroundColor: true,

    // Color Customization
    arrowColorLight: jazerNeonTheme.colors.graphite,
    arrowColorDark: jazerNeonTheme.colors.stardustWhite,
    dotsColorLight: jazerNeonTheme.colors.graphite,
    dotsColorDark: jazerNeonTheme.colors.stardustWhite,
    appearanceMode: 'system', // Do nothing, Use system setting, Light, Dark

    // Additional Features
    showHoverMenu: true,
    showCustomizeButton: true
  },
  fields: [
    // Image Management
    { name: 'images', label: 'Image URLs (one per line)', type: 'textarea', section: 'imageManagement' },
    { name: 'captions', label: 'Image Captions (one per line)', type: 'textarea', section: 'imageManagement' },
    // No direct field for minImagesRequired, it's a validation rule.

    // Image Display Options
    { name: 'sizingMode', label: 'Image Sizing Mode', type: 'select', section: 'imageDisplay', options: [
      { label: 'Contain', value: 'contain' },
      { label: 'Cover', value: 'cover' },
      { label: 'Wrap Around Image Size', value: 'wrap' }
    ]},

    // Animation Controls
    { name: 'animateGallerySpeedToggle', label: 'Animate Gallery Speed', type: 'boolean', section: 'animationControls' },
    { name: 'scrollSpeed', label: 'Scroll Speed', type: 'select', section: 'animationControls', options: [
      { label: 'Very Slow (3s)', value: '3s' },
      { label: 'Slow (2s)', value: '2s' },
      { label: 'Regular (1s)', value: '1s' },
      { label: 'Fast (0.5s)', value: '0.5s' },
      { label: 'Very Fast (0.3s)', value: '0.3s' },
      { label: 'Extremely Fast (0.2s)', value: '0.2s' },
      { label: 'Warp Speed (0.1s)', value: '0.1s' }
    ]},

    // Navigation
    { name: 'dotsIndicator', label: 'Show Dots Indicator', type: 'boolean', section: 'navigation' },
    { name: 'overlayArrows', label: 'Show Overlay Arrows', type: 'boolean', section: 'navigation' },

    // Style Options
    { name: 'slideBackgroundColor', label: 'Slide Background Color', type: 'color', section: 'style' },
    { name: 'textColor', label: 'Text Color', type: 'color', section: 'style' }, // For any potential text overlays
    { name: 'dropShadows', label: 'Drop Shadows', type: 'boolean', section: 'style' },
    { name: 'transparentBackground', label: 'Transparent Background', type: 'boolean', section: 'style' },
    { name: 'setBackgroundColor', label: 'Set Background Color', type: 'boolean', section: 'style' },

    // Color Customization
    { name: 'arrowColorLight', label: 'Arrow Color (Light Mode)', type: 'color', section: 'colors' },
    { name: 'arrowColorDark', label: 'Arrow Color (Dark Mode)', type: 'color', section: 'colors' },
    { name: 'dotsColorLight', label: 'Dots Color (Light Mode)', type: 'color', section: 'colors' },
    { name: 'dotsColorDark', label: 'Dots Color (Dark Mode)', type: 'color', section: 'colors' },
    { name: 'appearanceMode', label: 'Dark/Light Appearance', type: 'select', section: 'appearance', options: [
      { label: 'Do Nothing', value: 'none' },
      { label: 'Use System Setting', value: 'system' },
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' }
    ]},

    // Additional Features
    { name: 'showHoverMenu', label: 'Show Hover Menu', type: 'boolean', section: 'features' },
    { name: 'showCustomizeButton', label: 'Show Customize Button', type: 'boolean', section: 'features' }
  ]
};