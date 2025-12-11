import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Plus, Edit, Trash2, Copy, Palette, ChevronDown, ChevronUp, X, Check, Loader2, Sparkles, Database, ListChecks, Link2, BookOpen, Info
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useTheme } from '../../hooks/useTheme';

const initialButton = {
  id: nanoid(),
  label: 'Button',
  icon: '✨',
  hideIcon: false,
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

const defaultCycleModes = [
  { id: 'focus', label: 'Start >', badge: 'Focus', color: '#8B5CF6' },
  { id: 'pause', label: 'Pause ||', badge: 'Rest', color: '#F59E0B' },
  { id: 'skip', label: 'Skip >>', badge: 'Move', color: '#06B6D4' },
  { id: 'complete', label: 'Complete Done', badge: 'Ship', color: '#10B981' }
];

const defaultMacroActions = [
  { id: 'log', type: 'log', label: 'Log quick note', delay: 180 },
  { id: 'toggle', type: 'toggle', label: 'Toggle active state', delay: 160 },
  { id: 'openLink', type: 'openLink', label: 'Open linked page', delay: 220 }
];

const CUSTOMIZATION_GUIDE = [
  {
    title: 'Button Modes',
    description: 'Modes create entire categories of button behavior so every press feels intentional.',
    items: [
      { title: 'Action Mode', body: 'Executes a single action (log, toggle, open link, trigger webhook, etc.).' },
      { title: 'Macro Mode', body: 'Chains multiple actions together so one press can log, toggle, and open a link in sequence.' },
      { title: 'Input Mode', body: 'Prompts for a quick note, pomodoro intention, or task title before running the macro.' },
      { title: 'Cycle Mode', body: 'Each press cycles through presets (Start, Pause, Skip, Complete) with matching badges and colors.' },
      { title: 'Toggle Mode', body: 'Maintains an on/off state with glow + data logging so you can see whether the button is active.' }
    ]
  },
  {
    title: 'Visual & Interactive Touches',
    description: 'Micro-interactions make the widget feel premium.',
    items: [
      { title: 'Animated States', body: 'Pressed, held, activated, disabled, and completion bursts to match the action being taken.' },
      { title: 'Particles & Traces', body: 'Neon ripple, energy pulse, pixel burst, glow sweep, or magnetic hover trails.' },
      { title: 'Active Duration Glow', body: 'While macros run the button slowly pulses, shifts color, or shows a progress arc.' },
      { title: 'Badges', body: 'Counts, streak icons, warning dots, and data pills keep the button status visible.' }
    ]
  },
  {
    title: 'Data-Aware Reactions',
    description: 'Let Notion data change the way the button behaves or looks.',
    items: [
      { title: 'Task Pressure', body: "If today's tasks are incomplete the button shifts to warning red." },
      { title: 'Streak Glow', body: 'When pomodoro streak continues the button gets a brighter glow.' },
      { title: 'Done State', body: 'Marking a database property as Done swaps in a green check pill.' },
      { title: 'Unlocks', body: 'When a field equals a value, the button can unlock a new animation or action.' }
    ]
  },
  {
    title: 'Notion Integration',
    description: 'The serious power comes from two-way Notion sync.',
    items: [
      { title: 'Connect a Database', body: 'Point to Tasks, Journal, Habits, or Pomodoros and choose create, update, or toggle actions.' },
      { title: 'Templates + Prefill', body: 'Apply a template per button and pre-fill tags, owners, and dates.' },
      { title: 'Advanced Logging', body: 'Capture button ID, widget ID, timestamps, and user-entered text for every press.' },
      { title: 'Two-Way Rules', body: 'Check Notion data before acting so limits, completed flags, or custom focus modes change the outcome.' }
    ]
  },
  {
    title: 'Smart Logic',
    description: 'Conditional flows prevent accidental presses.',
    items: [
      { title: 'If/Else Branching', body: 'If a timer is active, pause it. Otherwise start focus. Same button, two outcomes.' },
      { title: 'Data-Driven UI', body: 'Swap label, icon, color, or tooltip whenever a Notion property changes.' }
    ]
  },
  {
    title: 'Layout-Level Controls',
    description: 'Organize multiple buttons into purposeful groups.',
    items: [
      { title: 'Button Groups', body: 'Vertical stacks, inline clusters, grids, or rows with spacers keep things tidy.' },
      { title: 'Linked Buttons', body: 'Pomodoro Start -> Pause -> Log Session -> Complete Task all sharing one state.' },
      { title: 'Variants', body: 'Text, icon-only, icon + text, capsule, circular, floating orb, outline, or ghost styles.' }
    ]
  },
  {
    title: 'Wow Moments',
    description: 'Moments of surprise drive engagement.',
    items: [
      { title: 'Energy Charge Ring', body: 'Every press charges a ring that wraps the button.' },
      { title: 'Streak Transform', body: 'As the streak grows the glow, color, and animation intensity evolve.' },
      { title: 'Secret Long Press', body: 'Holding for two seconds can unlock a different action or log.' },
      { title: 'Morphing States', body: 'Square -> circle, icon -> checkmark, text -> animated success message.' },
      { title: 'Dynamic Labels', body: 'Rotate label text: "Press Me" -> "Let\'s cook" -> "Energy +1" -> "Keep grinding".' }
    ]
  },
  {
    title: 'Button Library',
    description: 'Build a catalog so users can drag in what they need.',
    items: [
      { title: 'Examples', body: 'Log Button, Task Toggle, Cycle/Pomodoro button, Create Page, Template trigger, Counter, Mode Switcher, Theme Toggle, Playlist, Navigation, Meta/Macro, and Secret long-press buttons.' }
    ]
  }
];

const createButtonState = () => ({
  cycleIndex: 0,
  isActive: false,
  badgeCount: 0,
  awaitingInput: false,
  inputValue: '',
  macroLog: [],
  animationKey: 0,
  lastCompleteAt: 0,
  isRecentlyCompleted: false,
  isProcessing: false,
  lastLoggedStatus: null,
  energyCharge: 0,
  secretUnlocked: false,
  counterValue: 0,
  playlistIndex: 0,
  modeIndex: 0,
  themeMode: 'dark',
  cycleStep: 0,
  dynamicLabelIndex: 0,
  timerRunning: false
});

const parseLines = (text = '') =>
  text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

const getPlaylistItems = (button) => parseLines(button.playlistText || '');

const parseCycleString = (text) =>
  parseLines(text).map(line => {
    const [label = '', badge = '', color = ''] = line.split('|');
    return {
      id: `${label}-${badge}`.trim() || nanoid(),
      label: label.trim(),
      badge: badge.trim(),
      color: color.trim()
    };
  }).filter(item => item.label);

const parseMacroString = (text) =>
  parseLines(text).map((line, index) => {
    const [type = 'log', label = 'Action', delay = '200'] = line.split('|');
    return {
      id: `${type}-${index}`,
      type: type.trim() || 'log',
      label: label.trim() || 'Action',
      delay: Number(delay) || 200
    };
  }).filter(item => item.type);

const parsePrefillProperties = (text = '') =>
  text
    .split(/;|\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(pair => {
      const [key = '', ...rest] = pair.split('=');
      return {
        key: key.trim(),
        value: rest.join('=').trim()
      };
    })
    .filter(item => item.key);

const wait = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));
export const ButtonGeneratorWidget = ({ config, onConfigChange, onCustomizeRequest, brandTheme }) => {
  const { theme, getColor } = useTheme();
  const [buttons, setButtons] = useState(config.buttons || [initialButton]);
  const [activeButtonId, setActiveButtonId] = useState(null);
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [buttonStates, setButtonStates] = useState({});
  const [structuredLog, setStructuredLog] = useState([]);
  const longPressTimers = useRef({});
  const structuredLogIdRef = useRef(0);
  const getNextLogId = () => {
    structuredLogIdRef.current += 1;
    return structuredLogIdRef.current;
  };
  const [showGuide, setShowGuide] = useState(false);
  const resolvedBrandTheme = brandTheme || config.brandThemeSnapshot;
  const handleCustomizeNavigation = (sectionId) => {
    if (onCustomizeRequest) {
      onCustomizeRequest(sectionId);
    } else {
      setShowGuide(true);
    }
  };

  const activeIndex = activeButtonId ? buttons.findIndex(b => b.id === activeButtonId) : -1;

  const BUTTON_PRESETS = useMemo(() => ({
    jazerNeon: {
      bgColor: getColor('electricPurple'),
      outlineColor: getColor('electricPurple'),
      textColor: getColor('stardustWhite'),
      hoverBgColor: getColor('ultraviolet')
    },
    cosmicBlue: {
      bgColor: getColor('cosmicBlue'),
      outlineColor: getColor('cosmicBlue'),
      textColor: getColor('stardustWhite'),
      hoverBgColor: getColor('aetherTeal')
    },
    neonPink: {
      bgColor: getColor('neonPink'),
      outlineColor: getColor('neonPink'),
      textColor: getColor('stardustWhite'),
      hoverBgColor: '#EC4899'
    },
    purple: { bgColor: '#6940A5', outlineColor: '#6940A5', textColor: '#FFFFFF', hoverBgColor: '#8B5CF6', hoverTextColor: '#FFFFFF' },
    blue: { bgColor: '#0B6E99', outlineColor: '#0B6E99', textColor: '#FFFFFF', hoverBgColor: '#2D9CDB', hoverTextColor: '#FFFFFF' },
    red: { bgColor: '#E03E3E', outlineColor: '#E03E3E', textColor: '#FFFFFF', hoverBgColor: '#EB5757', hoverTextColor: '#FFFFFF' },
    green: { bgColor: '#0F7B6C', outlineColor: '#0F7B6C', textColor: '#FFFFFF', hoverBgColor: '#27AE60', hoverTextColor: '#FFFFFF' },
    yellow: { bgColor: '#DFAB01', outlineColor: '#DFAB01', textColor: '#FFFFFF', hoverBgColor: '#F2C94C', hoverTextColor: '#FFFFFF' },
    orange: { bgColor: '#D9730D', outlineColor: '#D9730D', textColor: '#FFFFFF', hoverBgColor: '#F2994A', hoverTextColor: '#FFFFFF' },
    pink: { bgColor: '#AD1A72', outlineColor: '#AD1A72', textColor: '#FFFFFF', hoverBgColor: '#D946A6', hoverTextColor: '#FFFFFF' },
    brown: { bgColor: '#64473A', outlineColor: '#64473A', textColor: '#FFFFFF', hoverBgColor: '#8B6F47', hoverTextColor: '#FFFFFF' },
    grey: { bgColor: '#9B9A97', outlineColor: '#9B9A97', textColor: '#FFFFFF', hoverBgColor: '#BDBDBD', hoverTextColor: '#FFFFFF' },
    black: { bgColor: '#000000', outlineColor: '#000000', textColor: '#FFFFFF', hoverBgColor: '#333333', hoverTextColor: '#FFFFFF' }
  }), [getColor]);

  useEffect(() => {
    let raf = requestAnimationFrame(() => setButtons(config.buttons || [initialButton]));
    return () => cancelAnimationFrame(raf);
  }, [config.buttons]);

  useEffect(() => {
    let raf = requestAnimationFrame(() => {
      setButtonStates(prev => {
        const next = {};
        buttons.forEach(btn => {
          next[btn.id] = prev[btn.id] || createButtonState();
        });
        return next;
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [buttons]);

  useEffect(() => {
    onConfigChange('buttons', buttons);
  }, [buttons, onConfigChange]);

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

  useEffect(() => {
    if (!showGuide || typeof window === 'undefined') return;
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setShowGuide(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showGuide]);

  const updateButtonState = useCallback((buttonId, updater) => {
    setButtonStates(prev => {
      const current = prev[buttonId] || createButtonState();
      const nextPartial = typeof updater === 'function' ? updater(current) : updater;
      return {
        ...prev,
        [buttonId]: { ...current, ...nextPartial }
      };
    });
  }, []);

  const macroActions = useMemo(() => {
    if (config.macroMode?.actionsText) {
      return parseMacroString(config.macroMode.actionsText);
    }
    if (Array.isArray(config.macroMode?.actions)) {
      return config.macroMode.actions;
    }
    return defaultMacroActions;
  }, [config.macroMode]);

  const cyclePresets = useMemo(() => {
    if (config.cycleMode?.valuesText) {
      const parsed = parseCycleString(config.cycleMode.valuesText);
      return parsed.length ? parsed : defaultCycleModes;
    }
    if (Array.isArray(config.cycleMode?.values)) {
      return config.cycleMode.values;
    }
    return defaultCycleModes;
  }, [config.cycleMode]);

  const inputHints = useMemo(() => {
    if (Array.isArray(config.inputMode?.hints)) return config.inputMode.hints;
    return parseLines(config.inputMode?.hints);
  }, [config.inputMode]);

  const dataAwareMeta = useMemo(() => {
    if (!config.dataAware?.enabled) return null;
    const value = Number(config.dataAware.sampleValue ?? 0);
    const goal = Number(config.dataAware.goal ?? 0);
    const warning = Number(config.dataAware.warningThreshold ?? 0);
    let status = 'neutral';
    if (goal && value >= goal) status = 'success';
    else if (value <= warning) status = 'warning';
    return {
      value,
      goal,
      warning,
      status,
      icon: config.dataAware.statusIcon || '⚡',
      tasksIncomplete: Boolean(config.dataAware.tasksIncomplete),
      pomodoroStreakActive: Boolean(config.dataAware.pomodoroStreakActive),
      propertyDone: Boolean(config.dataAware.propertyDone),
      doneLabel: config.dataAware.doneLabel || 'Marked Done',
      timerActive: Boolean(config.dataAware.timerActive),
      streakBroken: Boolean(config.dataAware.streakBroken),
      projectTag: config.dataAware.projectTag || 'General',
      projectTagTarget: config.dataAware.projectTagTarget || 'Music',
      musicTooltip: config.dataAware.musicTooltip || 'Logs in Music DB',
      projectTagColor: config.dataAware.projectTagColor || '#C026D3',
      dynamicLabels: parseLines(config.dataAware.dynamicLabelsText)
    };
  }, [config.dataAware]);

  const notionMeta = useMemo(() => {
    const settings = config.notionIntegration;
    if (!settings?.enabled) return null;
    const databaseLabel = {
      tasks: 'Tasks database',
      journal: 'Journal database',
      habits: 'Habits database',
      pomodoros: 'Pomodoros database'
    }[settings.database] || 'Custom database';
    const actionLabel = {
      create: 'Create row',
      update: 'Update property',
      toggle: 'Toggle checkbox'
    }[settings.action] || 'Custom action';
    const prefill = parsePrefillProperties(settings.prefillPropertiesText || '');
    const conditionState = settings.conditional?.conditionMet;
    const conditionResolved = settings.twoWay?.taskCompleted ? false : conditionState;
    const conditionalAction = settings.conditional
      ? (conditionResolved ? settings.conditional.thenAction : settings.conditional.elseAction)
      : null;

    return {
      databaseLabel,
      actionLabel,
      prefill,
      template: settings.template,
      logEntries: settings.logEntries,
      logDestination: settings.logDestination || 'Console Preview',
      unlockField: settings.unlockField,
      unlockValue: settings.unlockValue,
      currentFieldValue: settings.currentFieldValue,
      unlockReady: Boolean(
        settings.unlockField &&
        settings.unlockValue &&
        settings.currentFieldValue &&
        settings.unlockValue === settings.currentFieldValue
      ),
      limitReached: Boolean(settings.twoWay?.limitReached),
      taskCompleted: Boolean(settings.twoWay?.taskCompleted),
      mode: settings.twoWay?.mode,
      conditionalLabel: settings.conditional?.label,
      conditionalAction,
      conditionResolved
    };
  }, [config.notionIntegration]);

  const brandKitInfo = useMemo(() => {
    if (!resolvedBrandTheme) return null;
    const swatches = [
      { label: 'Background', color: resolvedBrandTheme.backgroundColor || resolvedBrandTheme.background },
      { label: 'Primary', color: resolvedBrandTheme.clockColor || resolvedBrandTheme.primary },
      { label: 'Accent', color: resolvedBrandTheme.accentColor || resolvedBrandTheme.secondary },
      { label: 'Text', color: resolvedBrandTheme.textColor || resolvedBrandTheme.text }
    ].filter(item => item.color);
    const palette = Array.isArray(resolvedBrandTheme.palette) ? resolvedBrandTheme.palette.slice(0, 6) : [];
    return {
      label: resolvedBrandTheme.presetName || resolvedBrandTheme.name || 'Custom Brand Kit',
      swatches,
      palette,
      appliedAt: resolvedBrandTheme.appliedAt
    };
  }, [resolvedBrandTheme]);

  const widgetBg = config.useTransparentBackground ? 'transparent' : config.backgroundColor;
  const handleAddButton = () => {
    setButtons([...buttons, { ...initialButton, id: nanoid() }]);
  };

  const handleDuplicateButton = (id) => {
    const buttonToDuplicate = buttons.find(b => b.id === id);
    if (buttonToDuplicate) {
      setButtons([...buttons, { ...buttonToDuplicate, id: nanoid() }]);
    }
  };

  const handleDeleteButton = (id) => {
    if (buttons.length > 1 && window.confirm('Are you sure you want to delete this button?')) {
      setButtons(buttons.filter(button => button.id !== id));
      if (activeButtonId === id) setActiveButtonId(buttons[0]?.id || null);
    }
  };

  const handleMoveButton = (id, direction) => {
    const index = buttons.findIndex(b => b.id === id);
    if (index === -1) return;
    const newButtons = [...buttons];
    if (direction === 'up' && index > 0) {
      [newButtons[index - 1], newButtons[index]] = [newButtons[index], newButtons[index - 1]];
    } else if (direction === 'down' && index < newButtons.length - 1) {
      [newButtons[index + 1], newButtons[index]] = [newButtons[index], newButtons[index + 1]];
    }
    setButtons(newButtons);
  };

  const handleButtonChange = (id, key, value) => {
    setButtons(buttons.map(button =>
      button.id === id ? { ...button, [key]: value } : button
    ));
  };

  const handleApplyPreset = (id, preset) => {
    const newPreset = BUTTON_PRESETS[preset];
    if (!newPreset) return;
    setButtons(buttons.map(button =>
      button.id === id ? {
        ...button,
        bgColor: newPreset.bgColor,
        outlineColor: newPreset.outlineColor,
        textColor: newPreset.textColor,
        hoverBgColor: newPreset.hoverBgColor || newPreset.bgColor,
        hoverTextColor: newPreset.hoverTextColor || newPreset.textColor,
      } : button
    ));
  };

  const handleCopyStyleToOthers = (id) => {
    const sourceButton = buttons.find(b => b.id === id);
    if (!sourceButton) return;
    const { id: _ignoredId, label: _label, url: _url, ...styleToCopy } = sourceButton;
    setButtons(buttons.map(button =>
      button.id === id ? button : { ...button, ...styleToCopy }
    ));
  };

  const runMacroSequence = useCallback(async (buttonId, button, inputValue) => {
    if (!config.macroMode?.enabled) return;
    for (const action of macroActions) {
      const note = `${action.label}${inputValue ? ` - ${inputValue}` : ''}`;
      updateButtonState(buttonId, state => ({
        ...state,
        macroLog: [...state.macroLog.slice(-3), `${new Date().toLocaleTimeString()} - ${note}`]
      }));

      if (action.type === 'toggle') {
        updateButtonState(buttonId, state => ({
          ...state,
          isActive: !state.isActive,
          lastLoggedStatus: !state.isActive ? 'Active' : 'Inactive'
        }));
      }

      if (action.type === 'openLink' && button.url && typeof window !== 'undefined') {
        window.open(button.url, '_blank', 'noopener,noreferrer');
      }

      await wait(action.delay || 200);
    }
  }, [config.macroMode?.enabled, macroActions, updateButtonState]);

  const executeButtonAction = async (buttonId) => {
    if (notionMeta?.limitReached) return;
    const button = buttons.find(b => b.id === buttonId);
    if (!button) return;
    const currentState = buttonStates[buttonId] || createButtonState();
    const inputValue = currentState.inputValue || '';
    const cyclePresetForLog = config.cycleMode?.enabled && cyclePresets.length
      ? cyclePresets[currentState.cycleIndex % cyclePresets.length]
      : null;
    const playlistItems = getPlaylistItems(button);
    const timestamp = new Date().toLocaleTimeString();

    updateButtonState(buttonId, state => ({ ...state, isProcessing: true, awaitingInput: false }));
    if (notionMeta?.conditionalAction) {
      updateButtonState(buttonId, state => ({
        ...state,
        macroLog: [...state.macroLog.slice(-3), `${timestamp} - ${notionMeta.conditionalAction}`]
      }));
    }

    if (button.behaviorType === 'createPage') {
      updateButtonState(buttonId, state => ({
        ...state,
        macroLog: [...state.macroLog.slice(-3), `${timestamp} - Create page in ${notionMeta?.databaseLabel}`]
      }));
    }

    if (button.behaviorType === 'template') {
      updateButtonState(buttonId, state => ({
        ...state,
        macroLog: [...state.macroLog.slice(-3), `${timestamp} - Template ${notionMeta?.template || 'Default'} applied`]
      }));
    }

    if (config.macroMode?.enabled || button.behaviorType === 'meta') {
      await runMacroSequence(buttonId, button, inputValue);
    } else if (button.url && typeof window !== 'undefined') {
      window.open(button.url, '_blank', 'noopener,noreferrer');
    }

    if (config.cycleMode?.enabled && cyclePresets.length > 0) {
      updateButtonState(buttonId, state => ({
        ...state,
        cycleIndex: (state.cycleIndex + 1) % cyclePresets.length
      }));
    }

    if (config.toggleMode?.enabled) {
      updateButtonState(buttonId, state => {
        const nextActive = !state.isActive;
        if (config.toggleMode.logToNotion && typeof window !== 'undefined') {
          console.log(`[Notion Log] ${button.label} is now ${nextActive ? 'Active' : 'Inactive'}`);
        }
        return {
          ...state,
          isActive: nextActive,
          lastLoggedStatus: nextActive ? 'Active' : 'Inactive'
        };
      });
    }

    updateButtonState(buttonId, state => {
      let macroLog = state.macroLog;
      const pushLog = (message) => {
        macroLog = [...macroLog.slice(-3), `${timestamp} - ${message}`];
      };

      const nextState = {
        ...state,
        badgeCount: state.badgeCount + 1,
        animationKey: Date.now(),
        lastCompleteAt: Date.now(),
        isRecentlyCompleted: true,
        isProcessing: false,
        inputValue: '',
        awaitingInput: false
      };

      switch (button.behaviorType) {
        case 'cycle': {
          const nextStep = (state.cycleStep + 1) % 3;
          nextState.cycleStep = nextStep;
          nextState.timerRunning = nextStep !== 0;
          pushLog(['Start focus', 'Pause timer', 'Skip break'][nextStep]);
          break;
        }
        case 'counter':
          nextState.counterValue = state.counterValue + 1;
          pushLog(`Counter ${nextState.counterValue}`);
          break;
        case 'modeSwitcher': {
          const nextMode = (state.modeIndex + 1) % 3;
          nextState.modeIndex = nextMode;
          pushLog(`Mode switched to ${['Focus', 'Break', 'Deep'][nextMode]}`);
          break;
        }
        case 'themeToggle':
          nextState.themeMode = state.themeMode === 'dark' ? 'light' : 'dark';
          pushLog(`Theme ${nextState.themeMode}`);
          break;
        case 'playlist':
          if (playlistItems.length) {
            const nextIndex = (state.playlistIndex + 1) % playlistItems.length;
            nextState.playlistIndex = nextIndex;
            pushLog(`Now playing ${playlistItems[nextIndex]}`);
          }
          break;
        case 'navigation':
          pushLog('Opened Notion page');
          break;
        case 'meta':
          pushLog('Meta macro executed');
          break;
        case 'secret':
          if (state.secretUnlocked) pushLog('Secret macro executed');
          break;
        default:
          break;
      }

      if (dataAwareMeta?.streakBroken) {
        nextState.counterValue = 0;
        pushLog('Streak reset');
      }
      if (dataAwareMeta?.projectTag === dataAwareMeta?.projectTagTarget) {
        pushLog('Logged to Music DB');
      }
      if (dataAwareMeta?.dynamicLabels?.length) {
        nextState.dynamicLabelIndex = (state.dynamicLabelIndex + 1) % dataAwareMeta.dynamicLabels.length;
      }
      nextState.energyCharge = Math.min(100, state.energyCharge + 20);
      nextState.macroLog = macroLog;
      return nextState;
    });

    setTimeout(() => {
      updateButtonState(buttonId, state => {
        if (!state.isRecentlyCompleted) return state;
        return { ...state, isRecentlyCompleted: false };
      });
    }, 900);

    if (notionMeta?.logEntries) {
      let actionLabel = notionMeta.conditionalAction || (config.macroMode?.enabled ? 'Macro sequence' : 'Direct action');
      switch (button.behaviorType) {
        case 'createPage':
          actionLabel = 'Create Page';
          break;
        case 'template':
          actionLabel = 'Apply Template';
          break;
        case 'counter':
          actionLabel = 'Increment Counter';
          break;
        case 'playlist':
          actionLabel = 'Cycle Playlist';
          break;
        case 'modeSwitcher':
          actionLabel = 'Switch Mode';
          break;
        case 'themeToggle':
          actionLabel = 'Toggle Theme';
          break;
        case 'navigation':
          actionLabel = 'Open Page';
          break;
        case 'meta':
          actionLabel = 'Meta Macro';
          break;
        case 'secret':
          actionLabel = 'Secret Action';
          break;
        default:
          break;
      }
      if (dataAwareMeta?.projectTag === dataAwareMeta?.projectTagTarget) {
        actionLabel += ' · Music DB';
      }
      const playlistLogTrack = playlistItems.length
        ? playlistItems[(currentState.playlistIndex + (button.behaviorType === 'playlist' ? 1 : 0)) % playlistItems.length]
        : '';
      const entry = {
        id: `${buttonId}-${getNextLogId()}`,
        buttonLabel: button.label,
        timestamp,
        action: actionLabel,
        database: notionMeta.databaseLabel,
        destination: notionMeta.logDestination,
        mode: notionMeta.mode || cyclePresetForLog?.badge || 'Default',
        userInput: inputValue || 'n/a',
        behavior: button.behaviorType,
        playlist: playlistLogTrack
      };
      setStructuredLog(prev => [...prev.slice(-4), entry]);
    }
  };
  const handleMainButtonClick = (buttonId) => {
    const state = buttonStates[buttonId] || createButtonState();
    const button = buttons.find(b => b.id === buttonId);
    if (!button) return;
    if (notionMeta?.limitReached) {
      updateButtonState(buttonId, prev => ({
        ...prev,
        macroLog: [...prev.macroLog.slice(-3), `${new Date().toLocaleTimeString()} - Limit reached via two-way sync.`],
        awaitingInput: false
      }));
      return;
    }
    if (notionMeta?.taskCompleted) {
      updateButtonState(buttonId, prev => ({
        ...prev,
        macroLog: [...prev.macroLog.slice(-3), `${new Date().toLocaleTimeString()} - Task already completed in Notion.`],
        awaitingInput: false
      }));
      return;
    }
    if (button.behaviorType === 'secret' && !state.secretUnlocked) {
      updateButtonState(buttonId, prev => ({
        ...prev,
        macroLog: [...prev.macroLog.slice(-3), `${new Date().toLocaleTimeString()} - Hold to unlock secret action.`],
        awaitingInput: false
      }));
      return;
    }
    if (config.inputMode?.enabled) {
      if (!state.awaitingInput) {
        updateButtonState(buttonId, { awaitingInput: true });
        return;
      }
      if (!state.inputValue?.trim()) {
        return;
      }
    }
    executeButtonAction(buttonId);
  };

  const handleInputChange = (buttonId, value) => {
    updateButtonState(buttonId, { inputValue: value });
  };

  const handleInputSubmit = (buttonId) => {
    const value = buttonStates[buttonId]?.inputValue?.trim();
    if (!value) return;
    executeButtonAction(buttonId);
  };

  const handleInputCancel = (buttonId) => {
    updateButtonState(buttonId, { awaitingInput: false, inputValue: '' });
  };

  const handlePressStart = (buttonId) => {
    if (longPressTimers.current[buttonId]) {
      clearTimeout(longPressTimers.current[buttonId]);
    }
    longPressTimers.current[buttonId] = setTimeout(() => {
      updateButtonState(buttonId, state => ({
        ...state,
        secretUnlocked: true,
        macroLog: [...state.macroLog.slice(-3), `${new Date().toLocaleTimeString()} - Secret channel unlocked`]
      }));
      delete longPressTimers.current[buttonId];
    }, 2000);
  };

  const handlePressEnd = (buttonId) => {
    if (longPressTimers.current[buttonId]) {
      clearTimeout(longPressTimers.current[buttonId]);
      delete longPressTimers.current[buttonId];
    }
  };

  const getBehaviorPresentation = (button, state, playlistItems, meta) => {
    const overrides = {};
    switch (button.behaviorType) {
      case 'cycle': {
        const steps = ['Start Pomodoro', 'Pause', 'Skip Break'];
        overrides.label = steps[state.cycleStep % steps.length];
        overrides.icon = state.cycleStep === 1 ? '⏸' : state.cycleStep === 2 ? '⏭' : (button.icon || '▶');
        overrides.tooltip = state.timerRunning ? 'Pause focus timer' : 'Start focus timer';
        if (meta?.timerActive && !state.timerRunning) {
          overrides.label = 'Pause';
          overrides.icon = '⏸';
        }
        break;
      }
      case 'createPage':
        overrides.icon = button.icon || '📄';
        overrides.tooltip = 'Creates a Notion page';
        break;
      case 'template':
        overrides.icon = button.icon || '🧩';
        overrides.tooltip = 'Runs the selected template';
        break;
      case 'counter':
        overrides.label = `${button.label} ${state.counterValue}`;
        overrides.tooltip = 'Adds to counter';
        break;
      case 'modeSwitcher': {
        const modes = ['Focus', 'Break', 'Deep Work'];
        overrides.label = modes[state.modeIndex % modes.length];
        overrides.tooltip = `Switch to ${overrides.label} mode`;
        break;
      }
      case 'themeToggle':
        overrides.label = `Theme: ${state.themeMode === 'dark' ? 'Dark' : 'Light'}`;
        overrides.icon = state.themeMode === 'dark' ? '🌙' : '☀️';
        overrides.tooltip = 'Toggle theme';
        break;
      case 'playlist': {
        const items = playlistItems;
        if (items.length) {
          overrides.label = items[state.playlistIndex % items.length];
        }
        overrides.tooltip = 'Cycle playlist tracks';
        overrides.icon = button.icon || '🎵';
        break;
      }
      case 'navigation':
        overrides.icon = button.icon || '🔗';
        overrides.tooltip = button.url || 'Opens Notion page';
        break;
      case 'meta':
        overrides.tooltip = 'Runs macro sequence';
        overrides.icon = button.icon || '🧠';
        break;
      case 'secret':
        if (!state.secretUnlocked) {
          overrides.label = 'Hold to unlock';
          overrides.tooltip = 'Hold for 2 seconds to reveal secret';
        } else {
          overrides.tooltip = 'Secret macro ready';
        }
        break;
      default:
        break;
    }
    return overrides;
  };

  const getButtonStyle = (button, cyclePreset, state, options = {}) => {
    const { isLinkedRow = false, isFirst = false, isLast = false } = options;
    const borderRadius = button.rounding === 'none' ? '0px' : button.rounding === 'slight' ? '8px' : '9999px';
    const sizePadding = button.size === 'small' ? '8px 16px' : button.size === 'large' ? '16px 32px' : '12px 24px';
    const fontSize = button.size === 'small' ? '0.875rem' : button.size === 'large' ? '1.25rem' : '1rem';
    const outlineWidth = button.outlineColor === 'transparent' ? '0px' : '1px';
    const baseBg = `${button.bgColor}${button.bgOpacity < 100 ? Math.round(255 * (button.bgOpacity / 100)).toString(16).padStart(2, '0') : ''}`;
    const variant = button.variant || 'solid';

    const style = {
      backgroundColor: cyclePreset?.color || baseBg,
      color: button.textColor,
      border: `${outlineWidth} solid ${button.outlineColor}`,
      borderRadius,
      padding: sizePadding,
      fontSize,
      fontFamily: 'inherit',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: state.isProcessing ? 'not-allowed' : 'pointer',
      width: config.layout === 'full-width' ? '100%' : 'auto',
      textAlign: 'center',
      boxShadow: config.showHoverMenu ? `0 0 ${theme.effects.glowBlur} rgba(0,0,0,0.2)` : 'none',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    };

    switch (variant) {
      case 'text':
        style.backgroundColor = 'transparent';
        style.border = 'none';
        style.padding = '6px 12px';
        break;
      case 'icon':
        style.width = '48px';
        style.height = '48px';
        style.padding = '0';
        style.borderRadius = '16px';
        break;
      case 'iconText':
        style.padding = '10px 18px';
        break;
      case 'capsule':
        style.borderRadius = '999px';
        break;
      case 'circular':
        style.borderRadius = '999px';
        style.width = '64px';
        style.height = '64px';
        style.padding = '0';
        break;
      case 'orb':
        style.borderRadius = '999px';
        style.boxShadow = '0 0 25px rgba(147, 197, 253, 0.35)';
        style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), transparent), ' + (cyclePreset?.color || baseBg);
        break;
      case 'outline':
        style.backgroundColor = 'transparent';
        style.border = `1px solid ${button.outlineColor || button.textColor}`;
        style.color = button.outlineColor || button.textColor;
        break;
      case 'ghost':
        style.backgroundColor = 'transparent';
        style.border = '1px dashed rgba(255,255,255,0.4)';
        style.color = button.textColor || '#FFFFFF';
        break;
      default:
        break;
    }

    if (isLinkedRow) {
      style.borderRadius = isFirst ? '999px 0 0 999px' : isLast ? '0 999px 999px 0' : '0';
      style.marginLeft = isFirst ? '0' : '-1px';
    }

    if (config.toggleMode?.enabled && state.isActive && config.toggleMode.glowWhenActive) {
      style.boxShadow = '0 0 20px rgba(139,92,246,0.6)';
    }

    if (dataAwareMeta) {
      if (dataAwareMeta.tasksIncomplete) {
        style.backgroundColor = '#B91C1C';
        style.border = '1px solid #7F1D1D';
        style.color = '#FFFFFF';
      }
      if (dataAwareMeta.status === 'success') {
        style.boxShadow = '0 0 22px rgba(16,185,129,0.4)';
      } else if (dataAwareMeta.status === 'warning') {
        style.boxShadow = '0 0 18px rgba(249,115,22,0.35)';
      }
      if (dataAwareMeta.pomodoroStreakActive) {
        style.boxShadow = '0 0 26px rgba(236,72,153,0.45)';
      }
      if (dataAwareMeta.projectTag === dataAwareMeta.projectTagTarget) {
        style.backgroundColor = dataAwareMeta.projectTagColor;
        style.color = '#FFFFFF';
      }
      if (dataAwareMeta.streakBroken) {
        style.outline = '2px dashed rgba(249,115,22,0.8)';
        style.outlineOffset = '2px';
      }
    }

    if (notionMeta?.limitReached) {
      style.filter = 'grayscale(0.55)';
      style.opacity = 0.6;
      style.cursor = 'not-allowed';
    }

    if (notionMeta?.unlockField) {
      style.border = `1px solid ${notionMeta.unlockReady ? '#10B981' : '#FCD34D'}`;
      if (notionMeta.unlockReady) {
        style.boxShadow = '0 0 24px rgba(16,185,129,0.45)';
      }
    }

    if (button.behaviorType === 'themeToggle') {
      style.backgroundColor = state.themeMode === 'dark' ? '#0F172A' : '#F8FAFC';
      style.color = state.themeMode === 'dark' ? '#F8FAFC' : '#0F172A';
    }

    return style;
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full p-4 transition-colors relative"
      style={{
        backgroundColor: widgetBg,
        color: isDark ? theme.colors.stardustWhite : theme.colors.nightBlack,
      }}
    >
      <div
        className={
          config.layout === 'vertical' || config.layout === 'vertical-stack'
            ? 'flex flex-col gap-4 w-full'
            : config.layout === 'inline-cluster'
              ? 'flex gap-3 flex-nowrap overflow-x-auto w-full'
              : config.layout === 'grid'
                ? 'grid gap-4 w-full'
                : config.layout === 'linked-row'
                  ? 'flex gap-0 w-full'
                  : 'flex flex-wrap gap-4'
        }
        style={{
          justifyContent:
            config.layout === 'inline-cluster'
              ? 'flex-start'
              : config.alignment === 'space-evenly' ? 'space-evenly'
              : config.alignment === 'center' ? 'center'
              : config.alignment === 'left' ? 'flex-start' : 'flex-end',
          width: config.layout === 'full-width' || config.layout === 'grid' || config.layout === 'inline-cluster' ? '100%' : 'auto',
          gridTemplateColumns: config.layout === 'grid' ? 'repeat(auto-fit, minmax(180px, 1fr))' : undefined
        }}
      >
        {buttons.map((button, index) => {
          const state = buttonStates[button.id] || createButtonState();
          const cyclePreset = config.cycleMode?.enabled && cyclePresets.length
            ? cyclePresets[state.cycleIndex % cyclePresets.length]
            : null;
          const playlistItems = getPlaylistItems(button);
          let buttonLabel = cyclePreset?.label || button.label;
          let buttonIcon = cyclePreset?.icon || button.icon;
          let buttonTooltip = button.tooltip || '';
          const variant = button.variant || 'solid';
          if (dataAwareMeta?.dynamicLabels?.length) {
            buttonLabel = dataAwareMeta.dynamicLabels[state.dynamicLabelIndex % dataAwareMeta.dynamicLabels.length] || buttonLabel;
          }
          const behaviorPresentation = getBehaviorPresentation(button, state, playlistItems, dataAwareMeta);
          if (behaviorPresentation.label) buttonLabel = behaviorPresentation.label;
          if (behaviorPresentation.icon) buttonIcon = behaviorPresentation.icon;
          if (behaviorPresentation.tooltip) buttonTooltip = behaviorPresentation.tooltip;
          if (dataAwareMeta?.projectTag === dataAwareMeta?.projectTagTarget) {
            buttonIcon = '🎵';
            buttonTooltip = dataAwareMeta.musicTooltip;
          }
          const showLabel = variant !== 'icon';
          const ariaLabel = buttonTooltip || buttonLabel;
          const badgeValue = config.visuals?.badgesEnabled
            ? Math.max(state.badgeCount, Number(config.dataAware?.sampleValue ?? 0))
            : null;
          const showComplete = Boolean(state.isRecentlyCompleted);
          const buttonClass = [
            'button-live-preview',
            config.visuals?.activeGlow && state.isActive ? 'button-live-preview--active' : '',
            state.isProcessing ? 'button-live-preview--processing' : '',
            showComplete ? 'button-live-preview--complete' : '',
            dataAwareMeta?.pomodoroStreakActive ? 'button-live-preview--streak' : '',
            notionMeta?.limitReached ? 'button-live-preview--limited' : ''
          ].filter(Boolean).join(' ');

          return (
            <div
              key={button.id}
              className="group relative"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('buttonId', button.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const draggedButtonId = e.dataTransfer.getData('buttonId');
                const draggedIndex = buttons.findIndex(b => b.id === draggedButtonId);
                const dropIndex = buttons.findIndex(b => b.id === button.id);
                if (draggedIndex === dropIndex) return;
                const newButtons = [...buttons];
                const [removed] = newButtons.splice(draggedIndex, 1);
                newButtons.splice(dropIndex, 0, removed);
                setButtons(newButtons);
              }}
            >
              <button
                type="button"
                aria-pressed={config.toggleMode?.enabled ? state.isActive : undefined}
                className={buttonClass}
                title={buttonTooltip || undefined}
                aria-label={ariaLabel}
                style={{
                  ...getButtonStyle(button, cyclePreset, state, {
                    isLinkedRow: config.layout === 'linked-row',
                    isFirst: index === 0,
                    isLast: index === buttons.length - 1
                  }),
                  '--hover-bg': button.enableHoverHighlight ? button.hoverBgColor : 'inherit',
                  '--hover-text': button.enableHoverHighlight ? button.hoverTextColor : 'inherit',
                }}
                disabled={state.isProcessing}
                onClick={() => handleMainButtonClick(button.id)}
                onMouseDown={() => handlePressStart(button.id)}
                onMouseUp={() => handlePressEnd(button.id)}
                onMouseLeave={() => handlePressEnd(button.id)}
                onTouchStart={() => handlePressStart(button.id)}
                onTouchEnd={() => handlePressEnd(button.id)}
              >
                {!button.hideIcon && <span className="text-lg">{buttonIcon}</span>}
                {showLabel && <span>{buttonLabel}</span>}
                {state.isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                {config.visuals?.showProgressArc && state.isActive && (
                  <span className="button-progress-ring" />
                )}
                {config.visuals?.enableParticleEffects && (
                  <span key={state.animationKey} className="button-ripple" />
                )}
                {state.energyCharge > 0 && (
                  <span
                    className="button-energy-ring"
                    style={{ background: `conic-gradient(#8B5CF6 ${state.energyCharge * 3.6}deg, transparent 0deg)` }}
                  />
                )}
                {config.visuals?.badgesEnabled && (
                  <span className="button-badge">{badgeValue}</span>
                )}
                {dataAwareMeta?.propertyDone && (
                  <span className="button-done-pill">
                    <Check className="w-3 h-3" />
                    <span>{dataAwareMeta.doneLabel}</span>
                  </span>
                )}
                {notionMeta?.unlockField && (
                  <span className={`button-unlock-pill ${notionMeta.unlockReady ? 'button-unlock-pill--ready' : ''}`}>
                    {notionMeta.unlockReady ? 'Unlocked' : `Locked: ${notionMeta.unlockValue || 'value'}`}
                  </span>
                )}
                {showComplete && (
                  <span className="button-complete">
                    <Check className="w-4 h-4" />
                  </span>
                )}
                {notionMeta?.limitReached && (
                  <span className="button-limit-overlay">Limit reached</span>
                )}
                {button.behaviorType === 'secret' && state.secretUnlocked && (
                  <span className="button-secret-pill">Secret ready</span>
                )}
              </button>

              {cyclePreset?.badge && (
                <div className="mt-1 text-[11px] text-center text-purple-300 font-semibold">
                  {cyclePreset.badge}
                </div>
              )}
              {notionMeta?.mode && (
                <div className="text-[10px] text-center text-sky-300 mt-0.5">
                  Mode: {notionMeta.mode}
                </div>
              )}

              {button.behaviorType === 'playlist' && playlistItems.length > 0 && (
                <div className="text-[10px] text-center text-sky-300 mt-1">
                  Now playing: {playlistItems[state.playlistIndex % playlistItems.length]}
                </div>
              )}

              {config.toggleMode?.enabled && (
                <div className="text-[11px] text-center mt-1" style={{ color: state.isActive ? '#10B981' : '#F87171' }}>
                  {state.isActive ? 'Active - Logging' : 'Inactive'}
                </div>
              )}

              {config.dataAware?.enabled && (
                <div className={`mt-1 text-[11px] flex items-center gap-1 justify-center ${dataAwareMeta?.status === 'warning' ? 'text-amber-400' : dataAwareMeta?.status === 'success' ? 'text-emerald-400' : 'text-neutral-400'}`}>
                  <span>{dataAwareMeta?.icon || '⚡'}</span>
                  <span>
                    {(config.dataAware.metricLabel || 'Metric')}: {badgeValue}/{config.dataAware.goal || 0}
                  </span>
                </div>
              )}

              {config.inputMode?.enabled && state.awaitingInput && (
                <div className="mt-2 w-full bg-white/10 border border-white/20 rounded-lg p-3 space-y-2">
                  <label className="text-[11px] uppercase tracking-wide text-neutral-200 font-semibold">
                    {config.inputMode.label || 'Add quick note'}
                  </label>
                  <input
                    type="text"
                    value={state.inputValue}
                    onChange={(e) => handleInputChange(button.id, e.target.value)}
                    placeholder={config.inputMode.placeholder}
                    className="w-full bg-black/20 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-purple-400 outline-none"
                  />
                  {inputHints.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {inputHints.map(hint => (
                        <button
                          type="button"
                          key={hint}
                          className="text-[10px] px-2 py-1 bg-white/5 rounded-full text-neutral-300 border border-white/10 hover:border-purple-400"
                          onClick={() => handleInputChange(button.id, hint)}
                        >
                          {hint}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 bg-purple-600 text-white rounded px-3 py-1.5 text-xs font-semibold hover:bg-purple-500"
                      onClick={() => handleInputSubmit(button.id)}
                    >
                      Run Macro
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs rounded border border-white/20 text-neutral-300 hover:text-white"
                      onClick={() => handleInputCancel(button.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {state.macroLog.length > 0 && (
                <div className="mt-2 text-[11px] text-neutral-300 bg-white/5 rounded p-2 space-y-1 max-w-xs">
                  {state.macroLog.slice(-3).map((entry, idx) => (
                    <div key={`${button.id}-log-${idx}`} className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-purple-300" />
                      <span>{entry}</span>
                    </div>
                  ))}
                </div>
              )}
              {button.behaviorType === 'secret' && state.secretUnlocked && (
                <div className="mt-2 text-[11px] text-purple-200 bg-purple-900/30 border border-purple-500/40 rounded p-2">
                  Secret UI unlocked! Tap to run hidden macros.
                </div>
              )}

              <div className="absolute top-0 right-0 p-1 bg-neutral-800 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                <button onClick={() => handleDuplicateButton(button.id)} className="p-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs"><Copy className="w-3 h-3" /></button>
                <button onClick={() => handleCopyStyleToOthers(button.id)} className="p-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-xs"><Palette className="w-3 h-3" /></button>
                <button onClick={() => setActiveButtonId(button.id)} className="p-1 rounded bg-gray-500 hover:bg-gray-600 text-white text-xs"><Edit className="w-3 h-3" /></button>
                <button onClick={() => handleDeleteButton(button.id)} className="p-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs"><Trash2 className="w-3 h-3" /></button>
                <button onClick={() => handleMoveButton(button.id, 'up')} disabled={index === 0} className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-xs disabled:opacity-50"><ChevronUp className="w-3 h-3" /></button>
                <button onClick={() => handleMoveButton(button.id, 'down')} disabled={index === buttons.length - 1} className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-xs disabled:opacity-50"><ChevronDown className="w-3 h-3" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {brandKitInfo && (
        <div className="mt-8 w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">Brand Kit</p>
              <p className="text-sm font-semibold text-white">{brandKitInfo.label}</p>
              {brandKitInfo.appliedAt && (
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Synced {new Date(brandKitInfo.appliedAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-xs px-3 py-1.5 rounded-md border border-white/20 text-neutral-200 hover:border-purple-400 transition-colors"
                onClick={() => setShowGuide(true)}
              >
                Guide
              </button>
              <button
                type="button"
                className="text-xs px-3 py-1.5 rounded-md border border-white/20 text-neutral-200 hover:border-purple-400 transition-colors"
                onClick={() => handleCustomizeNavigation('global')}
              >
                Surface Settings
              </button>
            </div>
          </div>
          <p className="text-[11px] text-neutral-400">
            Colors pulled from your Brand Theme Generator snapshot are powering this widget.
          </p>
          {brandKitInfo.swatches.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {brandKitInfo.swatches.map(({ label, color }) => (
                <div key={`${label}-${color}`} className="p-2 rounded-lg bg-black/30 border border-white/10">
                  <div className="h-10 rounded-md border border-white/10 mb-1" style={{ backgroundColor: color || '#0B0E12' }} />
                  <div className="text-[10px] uppercase text-neutral-400">{label}</div>
                  <div className="text-[11px] font-mono text-neutral-200">{color || '--'}</div>
                </div>
              ))}
            </div>
          )}
          {brandKitInfo.palette.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {brandKitInfo.palette.map((color, idx) => (
                <div key={`${color}-${idx}`} className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full border border-white/15" style={{ backgroundColor: color }} />
                  <span className="text-[9px] text-neutral-400 mt-1">{color}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {notionMeta && (
        <div className="mt-6 w-full max-w-2xl bg-black/30 border border-white/10 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">Notion Integration</p>
              <p className="text-base font-semibold text-white">{notionMeta.databaseLabel}</p>
              <div className="flex items-center gap-3 text-sm text-neutral-300 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Database className="w-4 h-4 text-purple-300" />
                  {notionMeta.actionLabel}
                </span>
                <span className="flex items-center gap-1">
                  <Link2 className="w-4 h-4 text-purple-300" />
                  {notionMeta.template || 'No template selected'}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="ml-auto text-xs px-3 py-1.5 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-colors"
              onClick={() => handleCustomizeNavigation('notionIntegration')}
            >
              Customize Sync
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase text-neutral-400">Prefill Properties</div>
            <div className="flex flex-wrap gap-2">
              {notionMeta.prefill.length > 0 ? (
                notionMeta.prefill.map(({ key, value }) => (
                  <span key={`${key}-${value}`} className="px-2 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-neutral-200">
                    {key}: <span className="text-white">{value || 'value'}</span>
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-neutral-500">No prefill properties configured.</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg border ${notionMeta.unlockReady ? 'border-emerald-400 bg-emerald-500/10' : 'border-amber-300/50 bg-amber-500/10'}`}>
              <div className="text-xs uppercase text-neutral-200 flex justify-between">
                <span>Unlock Field</span>
                <span>{notionMeta.unlockReady ? 'Unlocked' : 'Locked'}</span>
              </div>
              <div className="text-sm font-semibold text-white mt-1">
                {notionMeta.unlockField || 'No field selected'}
              </div>
              {!notionMeta.unlockReady && notionMeta.unlockValue && (
                <div className="text-xs text-neutral-300 mt-1">
                  Waiting for <span className="font-semibold">{notionMeta.unlockValue}</span> (current: {notionMeta.currentFieldValue || 'n/a'})
                </div>
              )}
            </div>
            {notionMeta.conditionalLabel && (
              <div className="p-3 rounded-lg border border-purple-400/30 bg-purple-500/10">
                <div className="text-xs uppercase text-neutral-200 flex justify-between">
                  <span>{notionMeta.conditionalLabel}</span>
                  <span>{notionMeta.conditionResolved ? 'Condition Met' : 'Waiting'}</span>
                </div>
                <div className="text-sm text-white mt-1">
                  {notionMeta.conditionalAction || 'No fallback action configured'}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs uppercase text-neutral-400">
              <span><ListChecks className="w-3 h-3 inline mr-1" /> Structured Log Preview</span>
              <span>{structuredLog.length}/5 entries</span>
            </div>
            {structuredLog.length === 0 ? (
              <div className="text-[11px] text-neutral-500 bg-white/5 rounded-lg px-3 py-2">
                Run the button to see the Notion payload preview.
              </div>
            ) : (
              <div className="space-y-1">
                {structuredLog.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between text-[11px] bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-neutral-200">
                    <span>{entry.timestamp} - {entry.buttonLabel}{entry.behavior ? ` (${entry.behavior})` : ''}</span>
                    <span className="text-purple-300">{entry.action}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="text-[10px] text-neutral-400">
              Destination: <span className="text-neutral-200">{notionMeta.logDestination}</span>
            </div>
          </div>
        </div>
      )}
      {activeButtonId && (
        <div className="mt-8 p-4 border rounded-lg shadow-lg bg-white w-full max-w-lg z-20">
          <h3 className="font-bold text-lg mb-4 flex justify-between items-center">
            Edit Button: {buttons.find(b => b.id === activeButtonId)?.label}
            <button onClick={() => setActiveButtonId(null)} className="text-neutral-500 hover:text-neutral-700"><X className="w-4 h-4" /></button>
          </h3>
          {activeIndex !== -1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Label</label>
                <input type="text" value={buttons[activeIndex].label} onChange={(e) => handleButtonChange(activeButtonId, 'label', e.target.value)} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Icon</label>
                <input type="text" value={buttons[activeIndex].icon} onChange={(e) => handleButtonChange(activeButtonId, 'icon', e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., ✨" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={buttons[activeIndex].hideIcon} onChange={(e) => handleButtonChange(activeButtonId, 'hideIcon', e.target.checked)} /> Hide Icon
              </label>
              <div>
                <label className="block text-sm font-medium text-neutral-700">URL</label>
                <input type="url" value={buttons[activeIndex].url} onChange={(e) => handleButtonChange(activeButtonId, 'url', e.target.value)} className="w-full p-2 border rounded-md" placeholder="https://domain.ext/path" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Color Presets</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(BUTTON_PRESETS).map(preset => (
                    <button
                      key={preset}
                      onClick={() => handleApplyPreset(activeButtonId, preset)}
                      className="px-3 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: BUTTON_PRESETS[preset].bgColor,
                        color: BUTTON_PRESETS[preset].textColor
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-700 border-b pb-1">Advanced Colors</h4>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Background Color</label>
                  <input type="color" value={buttons[activeIndex].bgColor} onChange={(e) => handleButtonChange(activeButtonId, 'bgColor', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Background Opacity ({buttons[activeIndex].bgOpacity}%)</label>
                  <input type="range" min="0" max="100" value={buttons[activeIndex].bgOpacity} onChange={(e) => handleButtonChange(activeButtonId, 'bgOpacity', parseInt(e.target.value, 10))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Outline Color</label>
                  <input type="color" value={buttons[activeIndex].outlineColor} onChange={(e) => handleButtonChange(activeButtonId, 'outlineColor', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Text Color</label>
                  <input type="color" value={buttons[activeIndex].textColor} onChange={(e) => handleButtonChange(activeButtonId, 'textColor', e.target.value)} />
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={buttons[activeIndex].enableHoverHighlight} onChange={(e) => handleButtonChange(activeButtonId, 'enableHoverHighlight', e.target.checked)} /> Enable Hover Highlight
                </label>
                {buttons[activeIndex].enableHoverHighlight && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Hover Background Color</label>
                      <input type="color" value={buttons[activeIndex].hoverBgColor} onChange={(e) => handleButtonChange(activeButtonId, 'hoverBgColor', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Hover Text Color</label>
                      <input type="color" value={buttons[activeIndex].hoverTextColor} onChange={(e) => handleButtonChange(activeButtonId, 'hoverTextColor', e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-700 border-b pb-1">Layout Options</h4>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Size</label>
                  <select value={buttons[activeIndex].size} onChange={(e) => handleButtonChange(activeButtonId, 'size', e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Corner Rounding</label>
                  <select value={buttons[activeIndex].rounding} onChange={(e) => handleButtonChange(activeButtonId, 'rounding', e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="none">None</option>
                    <option value="slight">Slight</option>
                    <option value="round">Round</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <button onClick={handleAddButton} className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add Button
      </button>

      {config.showCustomizeButton && (
        <button
          className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-semibold bg-purple-600 text-white shadow-lg hover:scale-105 transition-transform"
          onClick={() => handleCustomizeNavigation('macroInput')}
        >
          Customize Modes
        </button>
      )}
      {showGuide && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-h-full overflow-y-auto w-full max-w-4xl bg-[#0B0E12] border border-white/15 rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-300" />
                  Configuration Playbook
                </p>
                <p className="text-xl font-semibold text-white">Customize every mode</p>
                <p className="text-sm text-neutral-300">
                  Use this quick reference whenever the Customize button is unavailable.
                </p>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 text-xs rounded-md border border-white/20 text-neutral-200 hover:text-white hover:border-purple-400 transition-colors flex items-center gap-1"
                onClick={() => setShowGuide(false)}
              >
                <X className="w-3 h-3" /> Close
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {CUSTOMIZATION_GUIDE.map((section) => (
                <div key={section.title} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-purple-300 mt-1" />
                    <div>
                      <div className="text-sm font-semibold text-white">{section.title}</div>
                      <p className="text-xs text-neutral-300">{section.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-1 text-xs text-neutral-200">
                    {section.items.map((item) => (
                      <li key={`${section.title}-${item.title}`}>
                        <span className="font-semibold text-white">{item.title}:</span> {item.body}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`
        .button-live-preview {
          position: relative;
          outline: none;
          border: none;
          overflow: hidden;
          background: transparent;
        }
        .button-live-preview:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .button-live-preview--processing {
          opacity: 0.85;
        }
        .button-live-preview--active {
          animation: activeGlow 2.2s ease-in-out infinite;
        }
        .button-badge {
          position: absolute;
          top: 6px;
          right: 10px;
          background: rgba(0,0,0,0.3);
          padding: 2px 6px;
          border-radius: 999px;
          font-size: 10px;
          line-height: 1;
          border: 1px solid rgba(255,255,255,0.3);
        }
        .button-progress-ring {
          position: absolute;
          inset: 4px;
          border-radius: 999px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: rgba(255,255,255,0.7);
          animation: progressSpin 2.4s linear infinite;
          pointer-events: none;
        }
        .button-ripple {
          position: absolute;
          inset: -20%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 60%);
          animation: ripple 0.8s ease-out;
          pointer-events: none;
        }
        .button-energy-ring {
          position: absolute;
          inset: -6px;
          border-radius: 999px;
          background: conic-gradient(#8B5CF6 0deg, transparent 0deg);
          opacity: 0.7;
          transition: background 0.3s ease;
          pointer-events: none;
        }
        .button-live-preview--complete::after {
          content: '';
        }
        .button-complete {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(16,185,129,0.2);
          animation: completePop 0.4s ease forwards;
        }
        .button-done-pill {
          position: absolute;
          bottom: 6px;
          left: 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 6px;
          border-radius: 999px;
          font-size: 10px;
          background: rgba(16,185,129,0.15);
          color: #059669;
          border: 1px solid rgba(16,185,129,0.35);
        }
        .button-done-pill svg {
          width: 12px;
          height: 12px;
        }
        .button-unlock-pill {
          position: absolute;
          top: 6px;
          left: 10px;
          padding: 2px 6px;
          border-radius: 999px;
          font-size: 10px;
          border: 1px solid rgba(251,191,36,0.6);
          background: rgba(251,191,36,0.15);
          color: #FBBF24;
        }
        .button-unlock-pill--ready {
          border-color: rgba(16,185,129,0.7);
          background: rgba(16,185,129,0.2);
          color: #10B981;
        }
        .button-limit-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(11,14,18,0.65);
          color: #F87171;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .button-live-preview--streak {
          animation: streakGlow 1.8s ease-in-out infinite;
        }
        .button-live-preview--limited {
          opacity: 0.55;
        }
        .button-secret-pill {
          position: absolute;
          top: 6px;
          right: 10px;
          padding: 2px 6px;
          font-size: 10px;
          border-radius: 999px;
          background: rgba(168,85,247,0.2);
          border: 1px solid rgba(168,85,247,0.5);
          color: #E9D5FF;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        @keyframes activeGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(139,92,246,0.45); }
          50% { box-shadow: 0 0 24px rgba(59,130,246,0.55); }
        }
        @keyframes streakGlow {
          0%, 100% { box-shadow: 0 0 18px rgba(59,130,246,0.45); }
          50% { box-shadow: 0 0 30px rgba(236,72,153,0.55); }
        }
        @keyframes ripple {
          from { transform: scale(0.6); opacity: 0.8; }
          to { transform: scale(1.2); opacity: 0; }
        }
        @keyframes progressSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes completePop {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
