
import { MousePointerClick } from 'lucide-react';
import { jazerNeonTheme } from '../../theme/jazerNeonTheme';

const initialButton = {
  id: 'initial',
  label: 'Button',
  icon: '?',
  hideIcon: false,
  tooltip: '',
  behaviorType: 'custom',
  variant: 'solid',
  playlistText: '',
  url: 'https://indify.co',
  bgColor: '#8B5CF6',
  bgOpacity: 100,
  outlineColor: '#8B5CF6',
  textColor: '#F8F9FF',
  enableHoverHighlight: true,
  hoverBgColor: '#A78BFA',
  hoverTextColor: '#F8F9FF',
  size: 'medium',
  rounding: 'round',
};

export const newButtonGeneratorConfig = {
  id: 'newButtonGenerator',
  label: 'Button Generator',
  icon: 'MousePointerClick',
  description: 'Create customizable buttons with advanced styling and actions.',

  defaultConfig: {
    buttons: [initialButton],
    layout: 'horizontal',
    alignment: 'center',
    useTransparentBackground: false,
    setBackgroundColor: true,
    backgroundColor: jazerNeonTheme.colors.stardustWhite,
    appearanceMode: 'system',
    showHoverMenu: true,
    showCustomizeButton: true,
    macroMode: {
      enabled: true,
      actions: [
        { id: 'log', type: 'log', label: 'Log quick note', delay: 180 },
        { id: 'toggle', type: 'toggle', label: 'Toggle active state', delay: 160 },
        { id: 'openLink', type: 'openLink', label: 'Open linked page', delay: 220 }
      ],
      actionsText: [
        'log|Log quick note|180',
        'toggle|Toggle active state|160',
        'openLink|Open linked page|220'
      ].join('\n')
    },
    inputMode: {
      enabled: true,
      label: 'Add quick note',
      placeholder: 'Add quick note or intention...',
      hints: [
        'Add quick note',
        'Add task title',
        'Add pomodoro session notes'
      ]
    },
    cycleMode: {
      enabled: true,
      values: [
        { id: 'start', label: 'Start >', badge: 'Focus', color: '#8B5CF6' },
        { id: 'pause', label: 'Pause ||', badge: 'Rest', color: '#F59E0B' },
        { id: 'skip', label: 'Skip >>', badge: 'Move', color: '#06B6D4' },
        { id: 'complete', label: 'Complete Done', badge: 'Ship', color: '#10B981' }
      ],
      valuesText: [
        'Start >|Focus|#8B5CF6',
        'Pause |||Rest|#F59E0B',
        'Skip >>|Move|#06B6D4',
        'Complete Done|Ship|#10B981'
      ].join('\n')
    },
    toggleMode: {
      enabled: true,
      startActive: false,
      glowWhenActive: true,
      logToNotion: true
    },
    visuals: {
      enableParticleEffects: true,
      activeGlow: true,
      showProgressArc: true,
      badgesEnabled: true,
      badgeLabel: 'Logs today'
    },
    notionIntegration: {
      enabled: true,
      database: 'tasks',
      action: 'create',
      template: 'Daily Log',
      prefillPropertiesText: 'Status=In Progress;Owner=Me',
      logEntries: true,
      logDestination: 'Console Preview',
      unlockField: 'Mode',
      unlockValue: 'Focus',
      currentFieldValue: 'Focus',
      twoWay: {
        taskCompleted: false,
        limitReached: false,
        mode: 'Focus'
      },
      conditional: {
        label: 'If timer active',
        conditionMet: false,
        thenAction: 'Pause timer',
        elseAction: 'Start focus'
      }
    },
    dataAware: {
      enabled: true,
      metricLabel: 'Logs today',
      sampleValue: 3,
      goal: 5,
      warningThreshold: 2,
      statusIcon: '⚡',
      tasksIncomplete: false,
      pomodoroStreakActive: false,
      propertyDone: false,
      doneLabel: 'Marked Done',
      timerActive: false,
      streakBroken: false,
      projectTag: 'General',
      projectTagTarget: 'Music',
      musicTooltip: 'Logs in Music DB',
      projectTagColor: '#C026D3',
      dynamicLabelsText: 'Press Me\nLet\'s cook 🔥\nEnergy +1\nKeep grinding'
    }
  },

  sections: [
    {
      id: 'global',
      label: '1. WIDGET SURFACE',
      description: 'Dial in the canvas surrounding your buttons - transparency, background colors, and appearance mode.'
    },
    {
      id: 'layout',
      label: '2. BUTTON MODES',
      description: 'Modes create entire categories of button behavior.',
      notes: [
        {
          title: 'Action Mode',
          body: 'Executes a single action such as logging, toggling, or opening a link.'
        }
      ]
    },
    {
      id: 'macroInput',
      label: '3. MACRO + INPUT MODES',
      description: 'Macro Mode chains multiple actions, while Input Mode collects context before launching the macro.',
      notes: [
        {
          title: 'Macro Mode',
          body: 'Executes sequential actions such as logging, toggling, opening links or changing states.'
        },
        {
          title: 'Input Mode',
          body: 'Shows a miniature note field before running macros (quick note, task title, pomodoro notes, etc.).'
        }
      ]
    },
    {
      id: 'cycleToggle',
      label: '4. CYCLE + TOGGLE STATES',
      description: 'Each press can cycle through preset states or flip a persistent toggle with Notion logging.',
      notes: [
        {
          title: 'Cycle Mode',
          body: 'Cycle through styles/statuses/views each press (Start, Pause, Skip, Complete).'
        },
        {
          title: 'Toggle Mode',
          body: 'Button keeps an Active/Inactive state, glows while active, and logs state changes.'
        }
      ]
    },
    {
      id: 'notionIntegration',
      label: '5. NOTION INTEGRATION FEATURES',
      description: 'Connect each button to a Notion database, templates, structured logs, and two-way conditions.',
      notes: [
        { title: 'Connect to Database', body: 'Pick Tasks, Journal, Habits, or Pomodoros and choose Create, Update, or Toggle actions.' },
        { title: 'Templates and Prefill', body: 'Assign database templates and property defaults per button.' },
        { title: 'Two-Way Sync', body: 'Grey out or switch modes when Notion properties hit certain states (completed, limits, focus modes).' },
        { title: 'Conditional Actions', body: 'If property/value matches, route to alternate actions (pause vs start, etc.).' }
      ]
    },
    {
      id: 'visuals',
      label: '6. VISUAL & INTERACTIVE FEATURES',
      description: 'Make the button feel worth clicking with tactile feedback.',
      notes: [
        { title: 'Animated States', body: 'Pressed, held, activated, disabled, and completion bursts.' },
        { title: 'Particle or Trace Effects', body: 'Neon ripple, energy pulse, pixel burst, glow sweep, magnetic hover.' },
        { title: 'Active Duration Glow', body: 'Pulses, color shifts, and progress arcs while the macro runs.' },
        { title: 'Button Badges', body: 'Counts, status icons, warning dots, or data pills.' }
      ]
    },
    {
      id: 'dataAware',
      label: '7. DATA-AWARE BUTTONS',
      description: 'Buttons that adapt visually based on Notion data (counts, targets, warnings).',
      notes: [
        {
          title: 'Visual cues',
          body: 'Success aura on goal reached, warning glow when under target, metric badges.'
        }
      ]
    }
  ],

  fields: [
    { name: 'useTransparentBackground', label: 'Transparent Widget Background', type: 'boolean', section: 'global' },
    { name: 'setBackgroundColor', label: 'Set Widget Background Color', type: 'boolean', section: 'global' },
    { name: 'backgroundColor', label: 'Widget Background Color', type: 'color', section: 'global' },
    {
      name: 'appearanceMode',
      label: 'Dark/Light Appearance',
      type: 'select',
      section: 'global',
      options: [
        { label: 'Do Nothing', value: 'none' },
        { label: 'Use System Setting', value: 'system' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' }
      ]
    },
    { name: 'showHoverMenu', label: 'Show Hover Menu', type: 'boolean', section: 'global' },
    { name: 'showCustomizeButton', label: 'Show Customize Button', type: 'boolean', section: 'global' },
    {
      name: 'layout',
      label: 'Button Layout',
      type: 'select',
      section: 'layout',
      options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
        { label: 'Full Width', value: 'full-width' },
        { label: 'Vertical Stack', value: 'vertical-stack' },
        { label: 'Inline Cluster', value: 'inline-cluster' },
        { label: 'Linked Row', value: 'linked-row' },
        { label: 'Grid', value: 'grid' }
      ]
    },
    {
      name: 'alignment',
      label: 'Button Alignment',
      type: 'select',
      section: 'layout',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Space Evenly', value: 'space-evenly' }
      ]
    },
    { name: 'macroMode.enabled', label: 'Enable Macro Mode', type: 'boolean', section: 'macroInput' },
    { name: 'macroMode.actionsText', label: 'Macro Action Sequence (type|label|delay)', type: 'textarea', rows: 3, section: 'macroInput' },
    { name: 'inputMode.enabled', label: 'Enable Input Prompt', type: 'boolean', section: 'macroInput' },
    { name: 'inputMode.label', label: 'Input Prompt Label', type: 'text', section: 'macroInput' },
    { name: 'inputMode.placeholder', label: 'Input Placeholder', type: 'text', section: 'macroInput' },
    { name: 'inputMode.hints', label: 'Input Hints (one per line)', type: 'textarea', rows: 3, section: 'macroInput' },
    { name: 'cycleMode.enabled', label: 'Enable Cycle Mode', type: 'boolean', section: 'cycleToggle' },
    { name: 'cycleMode.valuesText', label: 'Cycle Presets (label|badge|color)', type: 'textarea', rows: 4, section: 'cycleToggle' },
    { name: 'toggleMode.enabled', label: 'Enable Toggle Mode', type: 'boolean', section: 'cycleToggle' },
    { name: 'toggleMode.startActive', label: 'Start Active', type: 'boolean', section: 'cycleToggle' },
    { name: 'toggleMode.glowWhenActive', label: 'Glow When Active', type: 'boolean', section: 'cycleToggle' },
    { name: 'toggleMode.logToNotion', label: 'Log Toggle State (Notion)', type: 'boolean', section: 'cycleToggle' },
    { name: 'notionIntegration.enabled', label: 'Enable Notion Integration', type: 'boolean', section: 'notionIntegration' },
    {
      name: 'notionIntegration.database',
      label: 'Database',
      type: 'select',
      section: 'notionIntegration',
      options: [
        { label: 'Tasks', value: 'tasks' },
        { label: 'Journal', value: 'journal' },
        { label: 'Habits', value: 'habits' },
        { label: 'Pomodoros', value: 'pomodoros' }
      ]
    },
    {
      name: 'notionIntegration.action',
      label: 'Action',
      type: 'select',
      section: 'notionIntegration',
      options: [
        { label: 'Create Row', value: 'create' },
        { label: 'Update Property', value: 'update' },
        { label: 'Toggle Checkbox', value: 'toggle' }
      ]
    },
    { name: 'notionIntegration.template', label: 'Template Name', type: 'text', section: 'notionIntegration' },
    { name: 'notionIntegration.prefillPropertiesText', label: 'Prefill Properties (key=value;key=value)', type: 'textarea', rows: 2, section: 'notionIntegration' },
    { name: 'notionIntegration.logEntries', label: 'Structured Logging', type: 'boolean', section: 'notionIntegration' },
    { name: 'notionIntegration.logDestination', label: 'Log Destination', type: 'text', section: 'notionIntegration' },
    { name: 'notionIntegration.unlockField', label: 'Unlock Field', type: 'text', section: 'notionIntegration' },
    { name: 'notionIntegration.unlockValue', label: 'Unlock Value', type: 'text', section: 'notionIntegration' },
    { name: 'notionIntegration.currentFieldValue', label: 'Current Field Value', type: 'text', section: 'notionIntegration' },
    { name: 'notionIntegration.twoWay.taskCompleted', label: 'Two-Way - Task Completed', type: 'boolean', section: 'notionIntegration' },
    { name: 'notionIntegration.twoWay.limitReached', label: 'Two-Way - Limit Reached', type: 'boolean', section: 'notionIntegration' },
    { name: 'notionIntegration.twoWay.mode', label: 'Two-Way - Mode Label', type: 'text', section: 'notionIntegration' },
    { name: 'notionIntegration.conditional.label', label: 'Conditional Label', type: 'text', section: 'notionIntegration' },
    { name: 'notionIntegration.conditional.conditionMet', label: 'Conditional – Condition Met', type: 'boolean', section: 'notionIntegration' },
    { name: 'notionIntegration.conditional.thenAction', label: 'Conditional – If True Action', type: 'text', section: 'notionIntegration' },
    { name: 'notionIntegration.conditional.elseAction', label: 'Conditional – If False Action', type: 'text', section: 'notionIntegration' },
    { name: 'visuals.enableParticleEffects', label: 'Enable Particle Effects', type: 'boolean', section: 'visuals' },
    { name: 'visuals.activeGlow', label: 'Active Duration Glow', type: 'boolean', section: 'visuals' },
    { name: 'visuals.showProgressArc', label: 'Show Progress Arc', type: 'boolean', section: 'visuals' },
    { name: 'visuals.badgesEnabled', label: 'Show Button Badges', type: 'boolean', section: 'visuals' },
    { name: 'visuals.badgeLabel', label: 'Badge Label', type: 'text', section: 'visuals' },
    { name: 'dataAware.enabled', label: 'Enable Data-Aware Styling', type: 'boolean', section: 'dataAware' },
    { name: 'dataAware.metricLabel', label: 'Metric Label', type: 'text', section: 'dataAware' },
    { name: 'dataAware.sampleValue', label: 'Sample value', type: 'number', section: 'dataAware' },
    { name: 'dataAware.goal', label: 'Goal target', type: 'number', section: 'dataAware' },
    { name: 'dataAware.warningThreshold', label: 'Warning threshold', type: 'number', section: 'dataAware' },
    { name: 'dataAware.statusIcon', label: 'Status Icon', type: 'text', section: 'dataAware' },
    { name: 'dataAware.tasksIncomplete', label: 'Mark as Tasks Incomplete', type: 'boolean', section: 'dataAware' },
    { name: 'dataAware.pomodoroStreakActive', label: 'Pomodoro Streak Active', type: 'boolean', section: 'dataAware' },
    { name: 'dataAware.propertyDone', label: 'Property Marked Done', type: 'boolean', section: 'dataAware' },
    { name: 'dataAware.doneLabel', label: 'Done Badge Label', type: 'text', section: 'dataAware' },
    { name: 'dataAware.timerActive', label: 'Timer Currently Active', type: 'boolean', section: 'dataAware' },
    { name: 'dataAware.streakBroken', label: 'Streak Broken', type: 'boolean', section: 'dataAware' },
    { name: 'dataAware.projectTag', label: 'Current Project Tag', type: 'text', section: 'dataAware' },
    { name: 'dataAware.projectTagTarget', label: 'Music Tag Target', type: 'text', section: 'dataAware' },
    { name: 'dataAware.musicTooltip', label: 'Music Tag Tooltip', type: 'text', section: 'dataAware' },
    { name: 'dataAware.projectTagColor', label: 'Music Tag Accent Color', type: 'color', section: 'dataAware' },
    { name: 'dataAware.dynamicLabelsText', label: 'Dynamic Labels (one per line)', type: 'textarea', rows: 4, section: 'dataAware' }
  ],
};
