// JAZER_BRAND constants
import { jazerNeonTheme } from '../../theme/jazerNeonTheme'; // Import jazerNeonTheme

export const counterConfig = {
  id: 'counter',
  label: 'Counter',
  description: 'Track habits and count things',
  defaultConfig: {
    counterTitle: 'Counter',
    preferredIcons: 'plusMinus',
    counterSize: 'medium',
    centerText: true,
    textShadows: false,
    transparentBg: false,
    backgroundColor: jazerNeonTheme.colors.stardustWhite,
    hideResetButton: false,
    step: 1,
    minValue: null,
    maxValue: null,
    resetValue: 0,
    textColorLight: jazerNeonTheme.colors.nightBlack,
    textColorDark: jazerNeonTheme.colors.stardustWhite,
    appearanceMode: 'system',
    showHoverMenu: true,
    showCustomizeButton: true
  },
  fields: [
    { name: 'counterTitle', label: 'Counter Title', type: 'text', section: 'settings' },
    { name: 'preferredIcons', label: 'Preferred Icons', type: 'select', section: 'settings', options: [
      { label: 'Plus and Minus', value: 'plusMinus' },
      { label: 'Arrows', value: 'arrows' }
    ]},
    { name: 'counterSize', label: 'Counter Size', type: 'select', section: 'settings', options: [
      { label: 'Small', value: 'small' },
      { label: 'Medium', value: 'medium' },
      { label: 'Large', value: 'large' },
      { label: 'X-Large', value: 'xlarge' }
    ]},
    { name: 'centerText', label: 'Center Text', type: 'boolean', section: 'style' }, // Changed to boolean
    { name: 'textShadows', label: 'Text Shadows', type: 'boolean', section: 'style' }, // Changed to boolean
    { name: 'transparentBg', label: 'Use Transparent Background', type: 'boolean', section: 'style' }, // Changed to boolean
    { name: 'backgroundColor', label: 'Background Color', type: 'color', section: 'style' },
    { name: 'hideResetButton', label: 'Hide Reset Button', type: 'boolean', section: 'behavior' }, // Changed to boolean
    { name: 'step', label: 'Step', type: 'number', section: 'behavior' },
    { name: 'minValue', label: 'Min Value', type: 'number', section: 'behavior' },
    { name: 'maxValue', label: 'Max Value', type: 'number', section: 'behavior' },
    { name: 'resetValue', label: 'Reset Value', type: 'number', section: 'behavior' },
    { name: 'textColorLight', label: 'Text Color (Light Mode)', type: 'color', section: 'colors' },
    { name: 'textColorDark', label: 'Text Color (Dark Mode)', type: 'color', section: 'colors' },
    { name: 'appearanceMode', label: 'Dark/Light Appearance', type: 'select', section: 'appearance', options: [
      { label: 'Do Nothing', value: 'none' },
      { label: 'Use System Setting', value: 'system' },
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' }
    ]},
    { name: 'showHoverMenu', label: 'Show Hover Menu', type: 'boolean', section: 'features' }, // Changed to boolean
    { name: 'showCustomizeButton', label: 'Show Customize Button', type: 'boolean', section: 'features' } // Changed to boolean
  ]
};