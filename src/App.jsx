import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Clock, Quote, Timer, Palette,
  Download, Copy, Layout, Code, Image as ImageIcon,
  BarChart3, MousePointerClick, Hash, Hourglass,
  List as ListIcon, Settings, ExternalLink, Briefcase,
  AlertTriangle, Sparkles, Check, X, ArrowLeft, CloudSun,
  ChevronUp, ChevronDown, Plus, Minus, Instagram, RefreshCcw,
  ChevronLeft, ChevronRight, Search, HelpCircle, Link as LinkIcon,
  Trash2, Copy as CopyIcon, CornerDownRight, ArrowUp, ArrowDown,
  Eye, EyeOff, MoreHorizontal, CloudRain, Sun, Moon, Wind,
  Droplets, Thermometer, MapPin, Lock, Calendar, Activity,
  MousePointer, Zap, Type, Loader, Rocket, Upload, Star, Menu
} from 'lucide-react';
import ColorThief from 'colorthief';

// New components for modernization
import { GlobalNavigation } from './components/GlobalNavigation';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ToastProvider, useToast } from './components/Toast';

import { counterConfig } from './widgets/counter-widget/config';
import { CounterWidget } from './widgets/counter-widget/CounterWidget';
import { generateHTML as generateCounterHTML, generateScript as generateCounterScript } from './widgets/counter-widget/export';

import { imageGalleryConfig } from './widgets/image-gallery-widget/config';
import { ImageGalleryWidget } from './widgets/image-gallery-widget/ImageGalleryWidget';
import { generateHTML as generateImageGalleryHTML, generateScript as generateImageGalleryScript } from './widgets/image-gallery-widget/export';

import { quotesConfig } from './widgets/quotes-widget/config';
import { QuotesWidget } from './widgets/quotes-widget/QuotesWidget';
import { generateHTML as generateQuotesHTML, generateScript as generateQuotesScript } from './widgets/quotes-widget/export';

import { weatherConfig } from './widgets/weather-widget/config';
import { WeatherWidget } from './widgets/weather-widget/WeatherWidget';
import { generateWeatherHTML, generateWeatherScript } from './widgets/weather-widget/export';

import { clockConfig } from './widgets/clock-widget/config';
import { ClockWidget } from './widgets/clock-widget/ClockWidget';
import { generateClockHTML, generateClockScript } from './widgets/clock-widget/export';

import { countdownConfig } from './widgets/countdown-widget/config';
import { CountdownWidget } from './widgets/countdown-widget/CountdownWidget';
import { generateHTML as generateCountdownHTML, generateScript as generateCountdownScript } from './widgets/countdown-widget/export';

// Button generator - named import
import { ButtonGeneratorWidget } from './widgets/new-button-generator-widget/ButtonGeneratorWidget';
import { newButtonGeneratorConfig } from './widgets/new-button-generator-widget/config';
import { generateHTML as generateButtonHTML, generateScript as generateButtonScript } from './widgets/new-button-generator-widget/export';

import { BrandLogoUploader } from './components/BrandLogoUploader';
import BrandThemeGenerator from './components/BrandThemeGenerator';
import { normalizeBrandTheme } from './utils/brandTheme';

// --- CONSTANTS & CONFIG ---

const FONT_SIZES = { small: 16, medium: 32, large: 48, xlarge: 64 };
const EXPORT_ANIMATION_DURATION = 300;
const DEBOUNCE_DELAY = 300;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 120;

// Button presets based on Notion's color palette
const BUTTON_PRESETS = {
  black: { bg: '#000000', text: '#FFFFFF', outline: '#000000' },
  grey: { bg: '#9B9A97', text: '#FFFFFF', outline: '#9B9A97' },
  yellow: { bg: '#DFAB01', text: '#FFFFFF', outline: '#DFAB01' },
  purple: { bg: '#6940A5', text: '#FFFFFF', outline: '#6940A5' },
  brown: { bg: '#64473A', text: '#FFFFFF', outline: '#64473A' },
  green: { bg: '#0F7B6C', text: '#FFFFFF', outline: '#0F7B6C' },
  pink: { bg: '#AD1A72', text: '#FFFFFF', outline: '#AD1A72' },
  orange: { bg: '#D9730D', text: '#FFFFFF', outline: '#D9730D' },
  blue: { bg: '#0B6E99', text: '#FFFFFF', outline: '#0B6E99' },
  red: { bg: '#E03E3E', text: '#FFFFFF', outline: '#E03E3E' },
};

// Common emojis for quick selection
const COMMON_EMOJIS = [
  "😊", "🚀", "🎨", "💼", "🔗", "📅", "✨", "⭐", "🔥", "💡",
  "📚", "📝", "📧", "💬", "📞", "📍", "🏠", "💻", "📱", "📸",
  "🎥", "🎧", "🎵", "🎮", "🕹️", "🎲", "🏆", "🥇", "⚽", "🏀",
  "❤️", "👍", "👋", "🙌", "👏", "🤝", "👀", "🧠", "💪", "⚡",
  "🛑", "✅", "❌", "❓", "❗", "➡️", "⬅️", "⬆️", "⬇️", "🔗"
];


const BUTTON_ARCHETYPES = [
  {
    id: 'cycle',
    label: 'Cycle Button',
    description: 'Pomodoro start / pause / skip break',
    icon: '⏱',
    config: {
      label: 'Pomodoro Cycle',
      icon: '⏱',
      tooltip: 'Cycle focus, pause, skip',
      behaviorType: 'cycle',
      variant: 'capsule'
    }
  },
  {
    id: 'createPage',
    label: 'Create Page Button',
    description: 'Creates a Notion page entry',
    icon: '📄',
    config: {
      label: 'Create Page',
      icon: '📄',
      tooltip: 'Creates a Notion page',
      behaviorType: 'createPage',
      variant: 'outline'
    }
  },
  {
    id: 'template',
    label: 'Template Button',
    description: 'Applies a database template',
    icon: '🧩',
    config: {
      label: 'Apply Template',
      icon: '🧩',
      tooltip: 'Runs assigned template',
      behaviorType: 'template',
      variant: 'ghost'
    }
  },
  {
    id: 'counter',
    label: 'Counter Button',
    description: 'Counts presses and displays value',
    icon: '🔢',
    config: {
      label: 'Log Count',
      icon: '🔢',
      tooltip: 'Adds to counter',
      behaviorType: 'counter',
      variant: 'solid'
    }
  },
  {
    id: 'modeSwitcher',
    label: 'Mode Switcher',
    description: 'Switches focus/break modes',
    icon: '🔀',
    config: {
      label: 'Mode Switch',
      icon: '🔀',
      tooltip: 'Switches mode',
      behaviorType: 'modeSwitcher',
      variant: 'capsule'
    }
  },
  {
    id: 'themeToggle',
    label: 'Theme Toggle',
    description: 'Toggles light / dark theme',
    icon: '🌓',
    config: {
      label: 'Theme Toggle',
      icon: '🌓',
      tooltip: 'Toggles theme',
      behaviorType: 'themeToggle',
      variant: 'orb'
    }
  },
  {
    id: 'playlist',
    label: 'Playlist Button',
    description: 'Cycles through playlist names',
    icon: '🎵',
    config: {
      label: 'Playlist',
      icon: '🎵',
      tooltip: 'Cycle playlist tracks',
      behaviorType: 'playlist',
      variant: 'circular',
      playlistText: 'Lo-fi Beats\nHyperfocus Mix\nBreak Vibes'
    }
  },
  {
    id: 'navigation',
    label: 'Navigation Button',
    description: 'Opens a Notion page',
    icon: '🔗',
    config: {
      label: 'Open Notion',
      icon: '🔗',
      tooltip: 'Opens linked Notion page',
      behaviorType: 'navigation',
      variant: 'outline'
    }
  },
  {
    id: 'meta',
    label: 'Meta Button',
    description: 'Runs macro sequences',
    icon: '🧠',
    config: {
      label: 'Meta Macro',
      icon: '🧠',
      tooltip: 'Runs macro playlist',
      behaviorType: 'meta',
      variant: 'solid'
    }
  },
  {
    id: 'secret',
    label: 'Secret Button',
    description: 'Long-press unlocks a hidden UI',
    icon: '🕵️',
    config: {
      label: 'Secret Button',
      icon: '🕵️',
      tooltip: 'Hold for 2 seconds',
      behaviorType: 'secret',
      variant: 'ghost'
    }
  }
];

const CONFIG_SECTION_BATCH = 4;

const JAZER_BRAND = {
  // ===== OFFICIAL BRAND COLORS (all 10) =====
  colors: {
    // Primary Palette
    electricPurple: '#8B5CF6',
    cosmicBlue: '#3B82F6',
    neonPink: '#EC4899',
    sunburstGold: '#F59E0B',
    aetherTeal: '#06B6D4',
    ultraviolet: '#A78BFA',
    nightBlack: '#0B0E12',
    stardustWhite: '#F8F9FF',
    graphite: '#1F2937',
    softSlate: '#94A3B8',
  },

  // ===== CUSTOM UI COLORS (non-brand, keep for UI functionality) =====
  ui: {
    deepSpace: '#1A1D29', // Background variant
    nebulaPurple: '#2D1B4E', // Background variant
    glass: 'rgba(255, 255, 255, 0.1)', // Glassmorphism
  },

  // ===== TYPOGRAPHY =====
  fonts: {
    heading: '"Orbitron", system-ui, sans-serif',
    body: '"Montserrat", system-ui, sans-serif'
  },

  fontFamily: '"Montserrat", system-ui, sans-serif',

  sizes: {
    h1: '64px',
    h2: '40px',
    h3: '28px',
    body: '18px',
    bodyLarge: '20px',
    small: '16px'
  },

  // ===== EFFECTS (brand-spec compliant) =====
  letterSpacing: '0.03em', // 3% spacing for headlines
  letterSpacingLarge: '0.04em', // 4% for extra large

  glowBlur: '4px', // ✅ FIXED: was 15px
  glowBlurSubtle: '2px',
  glow: '0 0 4px rgba(139, 92, 246, 0.5)', // ✅ FIXED: now uses 4px
  glowStrong: '0 0 8px rgba(139, 92, 246, 0.5)',

  // ===== GRADIENTS =====
  gradient: 'linear-gradient(90deg, #EC4899 0%, #F59E0B 28%, #06B6D4 50%, #3B82F6 74%, #8B5CF6 100%)',
  borderGradient: 'linear-gradient(to right, #EC4899, #3B82F6)',

  // ===== LOGO SPECIFICATIONS =====
  logo: {
    minWidth: 160, // px - digital minimum
    minWidthPrint: 30, // mm - print minimum
    clearSpace: '1em', // Padding equal to height of "J"
    paths: {
      svg: '/images/JaZeR BrandKit_OnSite/Logo_Primary_Full-Color.svg',
      gif: '/images/JaZeR_Logo_OFFICIAL.gif',
      favicon: '/images/JaZeR BrandKit_OnSite/favicon.svg'
    }
  }
};

// --- UTILITIES ---

const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Enhanced utility functions for config encoding and color conversion
const encodeConfig = (obj) => {
  return btoa(encodeURIComponent(JSON.stringify(obj)));
};

const decodeConfig = (str) => {
  try {
    return JSON.parse(decodeURIComponent(atob(str)));
  } catch {
    // Silently fail for invalid configs
    return null;
  }
};

const loadStoredBrandTheme = () => {
  if (typeof window === 'undefined') return null;
  const savedTheme = window.localStorage.getItem('jazer_global_brand_theme');
  const isActive = window.localStorage.getItem('jazer_global_brand_active');
  if (savedTheme && isActive === 'true') {
    try {
      return normalizeBrandTheme(JSON.parse(savedTheme));
    } catch {
      return null;
    }
  }
  const extractedTheme = window.localStorage.getItem('jazer_brand_theme');
  if (extractedTheme) {
    try {
      return normalizeBrandTheme(JSON.parse(extractedTheme));
    } catch {
      return null;
    }
  }
  return null;
};

const resolveThemeColors = (config, isDark) => {
  if (config.appearanceMode === 'none') return { bg: config.bgColor || 'transparent', text: config.textColor || '#000' };
  const bg = config.backgroundMode === 'transparent' ? 'transparent' : (isDark ? '#0B0E12' : config.bgColor || '#FFFFFF');
  const text = isDark ? (config.darkTextColor || '#FFFFFF') : (config.lightTextColor || '#37352F');
  return { bg, text };
};

// --- ERROR BOUNDARY ---

class WidgetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Widget Error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-red-50 p-8 text-center rounded-xl">
          <div>
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-red-900 mb-2">Widget Error</h3>
            <p className="text-sm text-red-700 mb-4">{this.state.error?.message || 'Something went wrong'}</p>
            <button onClick={() => this.setState({ hasError: false })} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
              Reset Widget
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- BRAND KITS ---

const BRAND_KITS = {
  none: {
    id: 'none',
    label: 'None / Custom',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    headingFontFamily: 'ui-sans-serif, system-ui, sans-serif',
    bgColor: '#ffffff',
    textColor: '#37352f',
    accentColor: '#e16259',
    fontLinks: '',
    cssVariables: '',
    extraCSS: ''
  },
  jazer: {
    id: 'jazer',
    label: 'JaZeR Neon',
    fontFamily: '"Montserrat", system-ui, sans-serif',
    headingFontFamily: '"Orbitron", system-ui, sans-serif',
    bgColor: JAZER_BRAND.colors.nightBlack,
    textColor: JAZER_BRAND.colors.stardustWhite,
    accentColor: JAZER_BRAND.colors.electricPurple,
    logoPath: JAZER_BRAND.logo.paths.svg,
    logoGif: JAZER_BRAND.logo.paths.gif,
    faviconPath: JAZER_BRAND.logo.paths.favicon,
    fontLinks: `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Orbitron:wght@400;700&family=Roboto&family=Open+Sans&display=swap" rel="stylesheet">
    `,
    cssVariables: `:root {
      --jazer-electric-purple: ${JAZER_BRAND.colors.electricPurple};
      --jazer-cosmic-blue: ${JAZER_BRAND.colors.cosmicBlue};
      --jazer-neon-pink: ${JAZER_BRAND.colors.neonPink};
      --jazer-sunburst-gold: ${JAZER_BRAND.colors.sunburstGold};
      --jazer-aether-teal: ${JAZER_BRAND.colors.aetherTeal};
      --jazer-ultraviolet: ${JAZER_BRAND.colors.ultraviolet};
      --jazer-night-black: ${JAZER_BRAND.colors.nightBlack};
      --jazer-stardust-white: ${JAZER_BRAND.colors.stardustWhite};
      --jazer-graphite: ${JAZER_BRAND.colors.graphite};
      --jazer-soft-slate: ${JAZER_BRAND.colors.softSlate};
      
      --jazer-glow-blur: ${JAZER_BRAND.glowBlur};
      --jazer-glow-purple: ${JAZER_BRAND.glow};
    }`,
    extraCSS: `
    body {
      background-color: ${JAZER_BRAND.colors.nightBlack};
      color: ${JAZER_BRAND.colors.stardustWhite};
      font-family: ${JAZER_BRAND.fontFamily};
    }

    .neon-text { 
      font-family: "Orbitron", system-ui, sans-serif; 
      color: ${JAZER_BRAND.colors.stardustWhite}; 
      text-shadow: ${JAZER_BRAND.glow}; 
      letter-spacing: ${JAZER_BRAND.letterSpacing}; 
    }
    .neon-gradient-text { 
      font-family: "Orbitron", system-ui, sans-serif; 
      background: ${JAZER_BRAND.gradient}; 
      -webkit-background-clip: text; 
      background-clip: text; 
      color: transparent; 
      text-shadow: ${JAZER_BRAND.glow}; 
      letter-spacing: ${JAZER_BRAND.letterSpacing}; 
    }
    h1, h2, h3 { letter-spacing: ${JAZER_BRAND.letterSpacing}; font-family: "Orbitron", system-ui, sans-serif; } 
    h1 { font-size: ${JAZER_BRAND.sizes.h1}; }
    h2 { font-size: ${JAZER_BRAND.sizes.h2}; color: ${JAZER_BRAND.colors.electricPurple}; }
    h3 { font-size: ${JAZER_BRAND.sizes.h3}; color: ${JAZER_BRAND.colors.cosmicBlue}; } 
    
    button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid ${JAZER_BRAND.colors.cosmicBlue}; outline-offset: 2px; }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 10px; }
    ::-webkit-scrollbar-track { background: ${JAZER_BRAND.colors.nightBlack}; }
    ::-webkit-scrollbar-thumb { background: ${JAZER_BRAND.colors.graphite}; border-radius: 5px; border: 1px solid ${JAZER_BRAND.colors.nightBlack}; }
    ::-webkit-scrollbar-thumb:hover { background: ${JAZER_BRAND.colors.softSlate}; }
    
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes roulette { 
      0% { transform: translateY(-20px); opacity: 0; } 
      100% { transform: translateY(0); opacity: 1; } 
    }
    `
  }
};

// --- HELPER COMPONENTS ---

const BrandColorPalette = () => (
  <div className="p-4 bg-gray-900 rounded-lg mb-4">
    <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3">JaZeR Brand Colors</h4>
    <div className="grid grid-cols-5 gap-2">
      {Object.entries(JAZER_BRAND.colors).map(([name, color]) => (
        <div key={name} className="text-center">
          <div
            className="w-full h-10 rounded mb-1 border border-white/10"
            style={{ backgroundColor: color }}
            title={name}
          />
          <div className="text-[8px] text-white/50 truncate">{name}</div>
        </div>
      ))}
    </div>
  </div>
);


// Emoji Picker Component with Search
const EmojiPicker = ({ onSelect, onClose }) => {
  const [search, setSearch] = useState("");
  const filtered = COMMON_EMOJIS.filter(e => e.includes(search));

  return (
    <div className="absolute z-50 bg-[#1A1D29] border border-gray-700 rounded-lg shadow-xl w-64 max-h-60 flex flex-col top-full left-0 mt-1">
      <div className="p-2 border-b border-gray-700">
        <div className="relative">
          <Search size={12} className="absolute left-2 top-2 text-gray-500" />
          <input
            autoFocus
            className="w-full bg-[#0B0E12] pl-7 pr-2 py-1 text-xs text-white rounded border border-gray-700 outline-none focus:border-purple-500"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 p-2 overflow-y-auto">
        {filtered.map((emoji, i) => (
          <button
            key={i}
            className="text-lg hover:bg-gray-700 rounded p-1"
            onClick={() => { onSelect(emoji); onClose(); }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

// Enhanced Button Manager Component
const ButtonManager = ({ value, onChange }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const pickerRef = useRef(null);
  const idCounterRef = useRef(0);
  const behaviorOptions = useMemo(() => [
    { value: 'custom', label: 'Custom' },
    ...BUTTON_ARCHETYPES.map(template => ({
      value: template.config.behaviorType || template.id,
      label: template.label
    }))
  ], []);
  const variantOptions = [
    { value: 'solid', label: 'Solid' },
    { value: 'text', label: 'Text Only' },
    { value: 'icon', label: 'Icon Only' },
    { value: 'iconText', label: 'Icon + Text' },
    { value: 'capsule', label: 'Capsule' },
    { value: 'circular', label: 'Circular' },
    { value: 'orb', label: 'Floating Orb' },
    { value: 'outline', label: 'Outline' },
    { value: 'ghost', label: 'Ghost' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateButton = (idx, updates) => {
    const newButtons = [...value];
    newButtons[idx] = { ...newButtons[idx], ...updates };
    onChange(newButtons);
  };

  const baseButtonProps = {
    label: 'New Button',
    url: '',
    icon: '✨',
    hideIcon: false,
    colorPreset: 'grey',
    backgroundColor: '#9B9A97',
    backgroundOpacity: 100,
    outlineColor: '#9B9A97',
    textColor: '#FFFFFF',
    hoverBackgroundColor: '#FFFFFF',
    hoverTextColor: '#9B9A97',
    enableHoverHighlight: true,
    tooltip: '',
    behaviorType: 'custom',
    variant: 'solid',
    playlistText: ''
  };

  const makeButtonId = () => {
    idCounterRef.current += 1;
    return `btn-${idCounterRef.current}`;
  };

  const addButton = () => {
    const newBtn = {
      id: makeButtonId(),
      ...baseButtonProps
    };
    onChange([...value, newBtn]);
    setActiveIndex(value.length);
  };

  const addButtonFromTemplate = (template) => {
    const newBtn = {
      id: makeButtonId(),
      ...baseButtonProps,
      ...template.config
    };
    onChange([...value, newBtn]);
    setActiveIndex(value.length);
  };

  const duplicateButton = (idx, e) => {
    e.stopPropagation();
    const newButtons = [...value];
    const clone = { ...value[idx], id: makeButtonId() };
    newButtons.splice(idx + 1, 0, clone);
    onChange(newButtons);
  };

  const deleteButton = (idx, e) => {
    e.stopPropagation();
    const newButtons = value.filter((_, i) => i !== idx);
    onChange(newButtons);
    if (activeIndex === idx) setActiveIndex(null);
  };

  const copyStyle = (idx, e) => {
    e.stopPropagation();
    const source = value[idx];
    const newButtons = value.map(b => ({
      ...b,
      colorPreset: source.colorPreset,
      backgroundColor: source.backgroundColor,
      backgroundOpacity: source.backgroundOpacity,
      outlineColor: source.outlineColor,
      textColor: source.textColor,
      hoverBackgroundColor: source.hoverBackgroundColor,
      hoverTextColor: source.hoverTextColor,
      enableHoverHighlight: source.enableHoverHighlight
    }));
    onChange(newButtons);
  };

  const applyPreset = (idx, presetName) => {
    const p = BUTTON_PRESETS[presetName];
    updateButton(idx, {
      colorPreset: presetName,
      backgroundColor: p.bg,
      outlineColor: p.outline,
      textColor: p.text,
      hoverBackgroundColor: '#FFFFFF',
      hoverTextColor: p.bg
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {value.map((btn, idx) => {
          return (
            <div key={btn.id} className="bg-[#1A1D29] border border-gray-700 rounded-lg overflow-hidden transition-all hover:border-gray-600">
            <div
              className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-xs border border-white/10"
                  style={{ backgroundColor: btn.backgroundColor, color: btn.textColor }}
                >
                  {btn.icon || ''}
                </div>
                <span className="text-xs font-medium text-gray-200 truncate max-w-[100px]">{btn.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="p-1 text-gray-500 hover:text-white hover:bg-gray-700 rounded"
                  onClick={(e) => copyStyle(idx, e)}
                  title="Copy style to all"
                >
                  <CornerDownRight size={12} />
                </button>
                <button
                  className="p-1 text-gray-500 hover:text-white hover:bg-gray-700 rounded"
                  onClick={(e) => duplicateButton(idx, e)}
                  title="Duplicate"
                >
                  <CopyIcon size={12} />
                </button>
                <button
                  className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-900/30 rounded"
                  onClick={(e) => deleteButton(idx, e)}
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
                <ChevronRight
                  size={12}
                  style={{
                    transform: activeIndex === idx ? 'rotate(90deg)' : 'none',
                    transition: '0.2s',
                    color: '#718096'
                  }}
                />
              </div>
            </div>

            {activeIndex === idx && (
              <div className="p-3 bg-[#111318] border-t border-gray-800 flex flex-col gap-3 animate-in slide-in-from-top-2">
                <div className="flex gap-2">
                  <div style={{ width: '50px', position: 'relative' }} ref={pickerRef}>
                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Icon</label>
                    <button
                      className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs text-center hover:border-purple-500 transition-colors"
                      onClick={() => setShowEmojiPicker(showEmojiPicker === idx ? null : idx)}
                    >
                      {btn.icon || '+'}
                    </button>
                    {showEmojiPicker === idx && <EmojiPicker onSelect={(emoji) => updateButton(idx, { icon: emoji })} onClose={() => setShowEmojiPicker(null)} />}
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Label</label>
                    <input
                      className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs outline-none focus:border-purple-500 transition-colors"
                      value={btn.label}
                      onChange={(e) => updateButton(idx, { label: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 flex justify-between">URL <HelpCircle size={10} className="opacity-50" /></label>
                  <div className="relative">
                    <input
                      className="w-full bg-[#0f1115] border border-gray-700 text-blue-400 p-1.5 pl-6 rounded text-xs outline-none focus:border-purple-500"
                      placeholder="https://..."
                      value={btn.url}
                      onChange={(e) => updateButton(idx, { url: e.target.value })}
                    />
                    <LinkIcon size={10} className="absolute left-2 top-2 text-gray-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Button Type</label>
                    <select
                      className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs outline-none focus:border-purple-500"
                      value={btn.behaviorType || 'custom'}
                      onChange={(e) => updateButton(idx, { behaviorType: e.target.value })}
                    >
                      {behaviorOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Variant</label>
                    <select
                      className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs outline-none focus:border-purple-500"
                      value={btn.variant || 'solid'}
                      onChange={(e) => updateButton(idx, { variant: e.target.value })}
                    >
                      {variantOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Tooltip</label>
                  <input
                    className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs outline-none focus:border-purple-500"
                    value={btn.tooltip || ''}
                    onChange={(e) => updateButton(idx, { tooltip: e.target.value })}
                    placeholder="Describe the action..."
                  />
                </div>

                {btn.behaviorType === 'playlist' && (
                  <div>
                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Playlist Items (one per line)</label>
                    <textarea
                      className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs outline-none focus:border-purple-500"
                      rows={3}
                      value={btn.playlistText || ''}
                      onChange={(e) => updateButton(idx, { playlistText: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-purple-500"
                    checked={btn.hideIcon}
                    onChange={(e) => updateButton(idx, { hideIcon: e.target.checked })}
                  />
                  <span className="text-xs text-gray-400">Hide Icon</span>
                </div>

                <div className="border-t border-gray-800 pt-2">
                  <label className="text-[9px] uppercase font-bold text-gray-500 mb-2 block">Quick Colors</label>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(BUTTON_PRESETS).map(p => (
                      <div
                        key={p}
                        className={`w-4 h-4 rounded-full cursor-pointer border border-white/10 transition-transform hover:scale-110 ${btn.colorPreset === p ? 'ring-1 ring-white' : ''}`}
                        style={{ backgroundColor: BUTTON_PRESETS[p].bg }}
                        onClick={() => applyPreset(idx, p)}
                        title={p}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-2 space-y-2">
                  <label className="text-[9px] uppercase font-bold text-purple-400 flex items-center gap-1">
                    <Palette size={10} /> Custom Styles
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-1">Bg Color</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={btn.backgroundColor}
                          onChange={e => updateButton(idx, { backgroundColor: e.target.value, colorPreset: null })}
                          className="w-5 h-5 rounded cursor-pointer bg-transparent p-0 border-none"
                        />
                        <span className="text-[9px] font-mono text-gray-400">{btn.backgroundColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-1">Opacity {btn.backgroundOpacity}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={btn.backgroundOpacity}
                        onChange={e => updateButton(idx, { backgroundOpacity: Number(e.target.value) })}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-1">Text Color</label>
                      <input
                        type="color"
                        value={btn.textColor}
                        onChange={e => updateButton(idx, { textColor: e.target.value, colorPreset: null })}
                        className="w-full h-5 rounded cursor-pointer bg-transparent p-0 border border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-1">Outline</label>
                      <input
                        type="color"
                        value={btn.outlineColor}
                        onChange={e => updateButton(idx, { outlineColor: e.target.value, colorPreset: null })}
                        className="w-full h-5 rounded cursor-pointer bg-transparent p-0 border border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      className="accent-purple-500"
                      checked={btn.enableHoverHighlight}
                      onChange={e => updateButton(idx, { enableHoverHighlight: e.target.checked })}
                    />
                    <span className="text-xs text-gray-400">Enable Hover Highlight</span>
                  </div>

                  {btn.enableHoverHighlight && (
                    <div className="grid grid-cols-2 gap-2 pl-2 border-l border-purple-500/20">
                      <div>
                        <label className="text-[9px] text-gray-500 mb-1 block">Hover Bg</label>
                        <input
                          type="color"
                          value={btn.hoverBackgroundColor}
                          onChange={e => updateButton(idx, { hoverBackgroundColor: e.target.value })}
                          className="w-full h-5 rounded cursor-pointer bg-transparent p-0 border border-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-500 mb-1 block">Hover Text</label>
                        <input
                          type="color"
                          value={btn.hoverTextColor}
                          onChange={e => updateButton(idx, { hoverTextColor: e.target.value })}
                          className="w-full h-5 rounded cursor-pointer bg-transparent p-0 border border-gray-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          );
        })}
      </div>
      <div className="p-3 bg-[#0F1115] border border-gray-800 rounded-lg space-y-2">
        <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">Quick Templates</div>
        <div className="grid grid-cols-2 gap-2">
          {BUTTON_ARCHETYPES.map(template => (
            <button
              key={template.id}
              className="p-2 rounded-lg border border-white/10 bg-white/5 hover:border-purple-400 hover:bg-purple-500/10 transition flex items-center gap-2 text-left"
              onClick={() => addButtonFromTemplate(template)}
            >
              <span className="text-lg">{template.icon}</span>
              <div>
                <div className="text-xs font-semibold text-white">{template.label}</div>
                <div className="text-[10px] text-gray-400">{template.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={addButton}
        className="w-full py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs font-bold text-purple-300 flex items-center justify-center gap-2 transition-all"
      >
        <Plus size={14} /> Add Button
      </button>
    </div>
  );
};

// Enhanced WidgetField Component - Supports all field types
const WidgetField = React.memo(({ field, value, onChange }) => {
  if (field.locked) {
    return (
      <div className="flex justify-between items-center py-1 opacity-50">
        <span className="text-sm text-gray-300">{field.label}</span>
        <span className="text-xs text-gray-500">🔒 Premium</span>
      </div>
    );
  }

  if (field.type === 'boolean') {
    return (
      <div className="flex justify-between items-center py-1">
        <span className="text-sm text-gray-300">{field.label}</span>
        <button
          onClick={() => onChange(!value)}
          className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${value ? 'bg-purple-600' : 'bg-gray-700'}`}
        >
          <div className={`w-3 h-3 rounded-full bg-white shadow-md transform transition-transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <select
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-gray-800 text-white text-sm p-2 rounded border border-gray-700 outline-none focus:border-purple-500"
          style={{ pointerEvents: 'auto' }}
        >
          {field.options.map(o => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'color') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || '#000000'}
            onChange={e => onChange(e.target.value)}
            className="w-8 h-8 rounded bg-transparent border-none cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="flex-1 bg-gray-800 text-white text-xs p-2 rounded border border-gray-700"
          />
        </div>
      </div>
    );
  }

  if (field.type === 'text' || field.type === 'number' || field.type === 'date' || field.type === 'datetime-local') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <input
          type={field.type}
          value={value}
          onChange={e => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
          min={field.min}
          max={field.max}
          className="w-full bg-gray-800 text-white text-sm p-2 rounded border border-gray-700 outline-none focus:border-purple-500 transition-colors"
        />
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={field.rows || 4}
          className="w-full bg-gray-800 text-white text-sm p-2 rounded border border-gray-700 outline-none focus:border-purple-500"
        />
      </div>
    );
  }

  // NEW: checkbox-list field type
  if (field.type === 'checkbox-list') {
    const toggle = (optionValue) => {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    };

    return (
      <div className="space-y-2">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <div className="bg-gray-900 rounded border border-gray-700 p-2 space-y-1">
          {field.options.map(opt => {
            const isChecked = (value || []).includes(opt.value);
            return (
              <div
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                onClick={() => toggle(opt.value)}
              >
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${isChecked ? 'bg-purple-600 border-purple-600' : 'border-gray-500'}`}>
                  {isChecked && <Check size={10} className="text-white" />}
                </div>
                <span className="text-xs text-gray-300">{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // NEW: bar-list field type (for Life Progress)
  if (field.type === 'bar-list') {
    const move = (idx, dir) => {
      const newItems = [...value];
      if (dir === -1 && idx > 0) {
        [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
      } else if (dir === 1 && idx < newItems.length - 1) {
        [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
      }
      onChange(newItems);
    };

    const toggle = (idx) => {
      const n = [...value];
      n[idx].enabled = !n[idx].enabled;
      onChange(n);
    };

    return (
      <div className="space-y-2">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <div className="bg-gray-900 rounded border border-gray-700 overflow-hidden">
          {value.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 border-b border-gray-800 last:border-0 hover:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggle(i)}
                  className={`w-4 h-4 flex items-center justify-center rounded border ${item.enabled ? 'bg-purple-600 border-purple-600' : 'border-gray-500'}`}
                >
                  {item.enabled && <Check size={12} className="text-white" />}
                </button>
                <span className={`text-xs ${item.enabled ? 'text-white' : 'text-gray-500'}`}>{item.label}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => move(i, -1)}
                  className="p-1 hover:text-white text-gray-500 disabled:opacity-20"
                  disabled={i === 0}
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  className="p-1 hover:text-white text-gray-500 disabled:opacity-20"
                  disabled={i === value.length - 1}
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // NEW: button-manager field type
  if (field.type === 'button-manager') {
    return <ButtonManager value={value || []} onChange={onChange} />;
  }

  // NEW: multiselect field type
  if (field.type === 'multiselect') {
    const toggle = (optionValue) => {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        // Check maxItems limit
        if (field.maxItems && currentValues.length >= field.maxItems) {
          return; // Don't add more items if max reached
        }
        onChange([...currentValues, optionValue]);
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400 font-bold">{field.label}</label>
          {field.maxItems && (
            <span className="text-xs text-gray-500">
              {(value || []).length}/{field.maxItems} selected
            </span>
          )}
        </div>
        {field.helpText && (
          <p className="text-xs text-gray-500">{field.helpText}</p>
        )}
        <div className="bg-gray-900 rounded border border-gray-700 p-2 space-y-1 max-h-64 overflow-y-auto">
          {field.options.map(opt => {
            const isChecked = (value || []).includes(opt.value);
            const isDisabled = field.maxItems && !isChecked && (value || []).length >= field.maxItems;
            return (
              <div
                key={opt.value}
                className={`flex items-center gap-2 p-1 rounded ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'}`}
                onClick={() => !isDisabled && toggle(opt.value)}
              >
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${isChecked ? 'bg-purple-600 border-purple-600' : 'border-gray-500'}`}>
                  {isChecked && <Check size={10} className="text-white" />}
                </div>
                <span className="text-xs text-gray-300">{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
});

const FlipCard = ({ value, label, colors, size }) => (
  <div className="inline-flex flex-col items-center mx-1">
    <div style={{
      width: `${size * 0.7}px`,
      height: `${size}px`,
      background: colors.clockColor || '#333',
      borderRadius: '8px',
      color: colors.digitColor || '#fff',
      fontSize: `${size * 0.65}px`,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.3)' }}></div>
      {String(value).padStart(2, '0')}
    </div>
    {label && <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7, textTransform: 'uppercase' }}>{label}</div>}
  </div>
);

const AnalogClock = ({ time, size, type, colors, config }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const center = size / 2;
  const clockRadius = size * 0.45;

  // Generate hour markers based on type
  const renderMarkers = () => {
    const markers = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * (Math.PI / 180);
      const x = center + Math.sin(angle) * clockRadius * 0.85;
      const y = center - Math.cos(angle) * clockRadius * 0.85;

      if (type === 'dots') {
        markers.push(
          <circle key={i} cx={x} cy={y} r={size * 0.015} fill={colors.clockColor} opacity="0.5" />
        );
      } else if (type === 'numbers') {
        markers.push(
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontSize={size * 0.08} fill={colors.clockColor} fontWeight="bold">
            {i === 0 ? 12 : i}
          </text>
        );
      } else if (type === 'planets') {
        const planetSizes = [8, 6, 7, 5, 9, 6, 8, 5, 6, 7, 5, 6];
        markers.push(
          <circle key={i} cx={x} cy={y} r={size * 0.01 * planetSizes[i] / 5}
            fill={colors.clockColor} opacity="0.6" />
        );
      }
    }
    return markers;
  };

  // Hand styles based on type
  const getHandProps = (handType) => {
    if (type === 'trail') {
      return { strokeLinecap: 'round', strokeWidth: handType === 'second' ? size * 0.01 : size * 0.02, opacity: 0.7 };
    }
    return { strokeLinecap: 'round', strokeWidth: handType === 'hour' ? size * 0.04 : handType === 'minute' ? size * 0.03 : size * 0.01 };
  };

  return (
    <svg width={size} height={size} style={{ filter: config.glowEffect ? `drop-shadow(0 0 ${JAZER_BRAND.glowBlur} ${colors.clockColor})` : 'none' }}>
      {/* Clock face */}
      <circle cx={center} cy={center} r={clockRadius}
        fill="none" stroke={colors.clockColor}
        strokeWidth={size * 0.01} opacity="0.2" />

      {/* Markers */}
      {renderMarkers()}

      {/* Hour hand */}
      <line
        x1={center} y1={center}
        x2={center + Math.sin(hourAngle * Math.PI / 180) * clockRadius * 0.5}
        y2={center - Math.cos(hourAngle * Math.PI / 180) * clockRadius * 0.5}
        stroke={colors.clockColor}
        {...getHandProps('hour')}
      />

      {/* Minute hand */}
      <line
        x1={center} y1={center}
        x2={center + Math.sin(minuteAngle * Math.PI / 180) * clockRadius * 0.75}
        y2={center - Math.cos(minuteAngle * Math.PI / 180) * clockRadius * 0.75}
        stroke={colors.clockColor}
        {...getHandProps('minute')}
      />

      {/* Second hand */}
      {config.showSeconds && (
        <line
          x1={center} y1={center}
          x2={center + Math.sin(secondAngle * Math.PI / 180) * clockRadius * 0.85}
          y2={center - Math.cos(secondAngle * Math.PI / 180) * clockRadius * 0.85}
          stroke={type === 'trail' ? colors.textColor : colors.clockColor}
          {...getHandProps('second')}
          style={type === 'tick' ? { transition: 'all 0.05s ease' } : {}}
        />
      )}

      {/* Center dot */}
      <circle cx={center} cy={center} r={size * 0.02} fill={colors.clockColor} />
    </svg>
  );
};

// --- WIDGET REGISTRY ---

const WIDGET_REGISTRY = {
  clock: {
    ...clockConfig,
    icon: <Clock className="w-4 h-4" />,
    Component: ClockWidget,
    generateHTML: generateClockHTML,
    generateScript: generateClockScript
  },
  weather: {
    ...weatherConfig,
    icon: <CloudSun className="w-4 h-4" />,
    Component: WeatherWidget,
    generateHTML: generateWeatherHTML,
    generateScript: generateWeatherScript
  },
  countdown: {
    ...countdownConfig,
    icon: <Hourglass className="w-4 h-4" />,
    Component: CountdownWidget,
    generateHTML: generateCountdownHTML,
    generateScript: generateCountdownScript
  },
  counter: {
    ...counterConfig,
    icon: <Hash className="w-4 h-4" />,
    Component: CounterWidget,
    generateHTML: generateCounterHTML,
    generateScript: generateCounterScript
  },
  imageGallery: { // Changed from 'gallery' to 'imageGallery'
    ...imageGalleryConfig,
    icon: <ImageIcon className="w-4 h-4" />,
    Component: ImageGalleryWidget,
    generateHTML: generateImageGalleryHTML,
    generateScript: generateImageGalleryScript
  },
  newButtonGenerator: {
    ...newButtonGeneratorConfig,
    icon: <MousePointerClick className="w-4 h-4" />,
    Component: ButtonGeneratorWidget,
    generateHTML: generateButtonHTML,
    generateScript: generateButtonScript
  },
  quotes: {
    ...quotesConfig,
    icon: <Quote className="w-4 h-4" />,
    Component: QuotesWidget,
    generateHTML: generateQuotesHTML,
    generateScript: generateQuotesScript
  },
  simpleList: {
    id: 'simpleList',
    label: 'List',
    icon: <ListIcon className="w-4 h-4" />,
    defaultConfig: { title: 'To Do', items: 'Task 1\nTask 2', accentColor: JAZER_BRAND.colors.cosmicBlue, textColor: JAZER_BRAND.colors.graphite, bgColor: JAZER_BRAND.colors.stardustWhite },
    fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'items', label: 'Items', type: 'textarea' }, { name: 'accentColor', label: 'Accent', type: 'color' }],
    Component: ({ config }) => {
      const items = (config.items || '').split('\n').filter(Boolean);
      return (
        <div className="h-full w-full p-6 overflow-y-auto" style={{ background: config.bgColor, color: config.textColor }}>
          <h3 className="font-bold mb-4 pb-2 border-b-2 text-lg" style={{ borderColor: config.accentColor }}>{config.title}</h3>
          <ul className="space-y-2">
            {items.map((it, i) => (
              <li key={i} className="flex gap-2 items-center">
                <div className="w-4 h-4 border rounded" style={{ borderColor: config.accentColor }}></div>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    },
    generateHTML: (config) => `
      <div style="padding:24px; height:100%; overflow-y:auto; background:${config.bgColor}; color:${config.textColor};">
        <h3 style="font-weight:bold; margin-bottom:16px; padding-bottom:8px; border-bottom:2px solid ${config.accentColor};">${escapeHTML(config.title)}</h3>
        <ul style="list-style:none; padding:0; margin:0;">
          ${(config.items || '').split('\n').filter(Boolean).map(i => `<li style="display:flex; gap:12px; margin-bottom:8px; cursor:pointer; align-items:center;" onclick="this.style.opacity = this.style.opacity === '0.5' ? '1' : '0.5'"><div style="width:16px; height:16px; border:2px solid ${config.accentColor}; border-radius:4px;"></div><span>${escapeHTML(i)}</span></li>`).join('')}
        </ul>
      </div>
    `,
    generateScript: () => ``
  },
  pomodoro: {
    id: 'pomodoro',
    label: 'Pomodoro',
    icon: <Timer className="w-4 h-4" />,
    defaultConfig: { workTime: 25, breakTime: 5, accentColor: JAZER_BRAND.colors.neonPink, textColor: JAZER_BRAND.colors.graphite, bgColor: JAZER_BRAND.colors.stardustWhite },
    fields: [{ name: 'workTime', label: 'Work', type: 'number' }, { name: 'breakTime', label: 'Break', type: 'number' }, { name: 'accentColor', label: 'Color', type: 'color' }],
    Component: ({ config }) => {
      const workMinutes = Math.max(1, parseInt(config.workTime, 10) || 25);
      const breakMinutes = Math.max(1, parseInt(config.breakTime, 10) || 5);
      const workSeconds = workMinutes * 60;
      const breakSeconds = breakMinutes * 60;
      const [remaining, setRemaining] = useState(workSeconds);
      const [isRunning, setIsRunning] = useState(false);
      const [isWorkPhase, setIsWorkPhase] = useState(true);
      const phaseRef = useRef(isWorkPhase);

      useEffect(() => {
        phaseRef.current = isWorkPhase;
      }, [isWorkPhase]);

      useEffect(() => {
        setIsRunning(false);
        setIsWorkPhase(true);
        phaseRef.current = true;
        setRemaining(workSeconds);
      }, [workSeconds, breakSeconds]);

      useEffect(() => {
        if (!isRunning) return undefined;
        const interval = setInterval(() => {
          setRemaining((prev) => {
            if (prev > 1) {
              return prev - 1;
            }
            const nextPhaseIsWork = !phaseRef.current;
            phaseRef.current = nextPhaseIsWork;
            setIsWorkPhase(nextPhaseIsWork);
            return nextPhaseIsWork ? workSeconds : breakSeconds;
          });
        }, 1000);
        return () => clearInterval(interval);
      }, [isRunning, workSeconds, breakSeconds]);

      const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
      };

      const toggleTimer = () => {
        setIsRunning((prev) => !prev);
      };

      const resetTimer = () => {
        setIsRunning(false);
        setIsWorkPhase(true);
        phaseRef.current = true;
        setRemaining(workSeconds);
      };

      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center" style={{ background: config.bgColor, color: config.textColor }}>
          <div className="text-sm font-semibold uppercase tracking-widest" style={{ color: config.accentColor }}>
            {isWorkPhase ? 'Work' : 'Break'} Session
          </div>
          <div className="text-5xl font-bold tabular-nums">{formatTime(remaining)}</div>
          <div className="flex gap-3">
            <button
              className="px-6 py-2 rounded-full text-white font-semibold"
              style={{ background: config.accentColor }}
              onClick={toggleTimer}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              className="px-6 py-2 rounded-full border font-semibold"
              style={{ borderColor: config.accentColor, color: config.accentColor }}
              onClick={resetTimer}
            >
              Reset
            </button>
          </div>
        </div>
      );
    },
    generateHTML: (config) => `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:16px; text-align:center;">
        <div id="phase" style="font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:0.2em; color:${config.accentColor};">Work Session</div>
        <div id="timer" style="font-size:48px; font-weight:bold; margin-bottom:8px; font-family:'Courier New', monospace;">${String(config.workTime).padStart(2, '0')}:00</div>
        <div style="display:flex; gap:12px;">
          <button onclick="togglePomodoro()" id="btn" style="background:${config.accentColor}; color:white; border:none; padding:10px 24px; border-radius:999px; font-weight:bold; cursor:pointer;">Start</button>
          <button onclick="resetPomodoro()" style="background:transparent; color:${config.accentColor}; border:2px solid ${config.accentColor}; padding:10px 24px; border-radius:999px; font-weight:bold; cursor:pointer;">Reset</button>
        </div>
      </div>
    `,
    generateScript: (config) => `
      (function() {
        const workMinutes = Math.max(1, parseInt(${JSON.stringify(config.workTime)}, 10) || 25);
        const breakMinutes = Math.max(1, parseInt(${JSON.stringify(config.breakTime)}, 10) || 5);
        const workSeconds = workMinutes * 60;
        const breakSeconds = breakMinutes * 60;
        let remaining = workSeconds;
        let isRunning = false;
        let isWorkPhase = true;
        let timerId = null;
        const timerEl = document.getElementById('timer');
        const phaseEl = document.getElementById('phase');
        const btn = document.getElementById('btn');

        function format(seconds) {
          const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
          const secs = (seconds % 60).toString().padStart(2, '0');
          return mins + ':' + secs;
        }

        function updateDisplay() {
          timerEl.textContent = format(remaining);
          phaseEl.textContent = (isWorkPhase ? 'Work' : 'Break') + ' Session';
        }

        function switchPhase() {
          isWorkPhase = !isWorkPhase;
          remaining = isWorkPhase ? workSeconds : breakSeconds;
          updateDisplay();
        }

        function tick() {
          if (remaining > 0) {
            remaining -= 1;
            updateDisplay();
          } else {
            switchPhase();
          }
        }

        window.togglePomodoro = function togglePomodoro() {
          isRunning = !isRunning;
          btn.textContent = isRunning ? 'Pause' : 'Start';
          if (isRunning) {
            timerId = setInterval(tick, 1000);
          } else if (timerId) {
            clearInterval(timerId);
            timerId = null;
  }
};

        window.resetPomodoro = function resetPomodoro() {
          if (timerId) {
            clearInterval(timerId);
            timerId = null;
          }
          isRunning = false;
          isWorkPhase = true;
          remaining = workSeconds;
          btn.textContent = 'Start';
          updateDisplay();
        };

        updateDisplay();
      })();
    `
  },
};

const WIDGET_CATEGORIES = {
  clock: 'Time & Productivity',
  countdown: 'Time & Productivity',
  pomodoro: 'Time & Productivity',
  simpleList: 'Time & Productivity',
  weather: 'Data & Information',
  quotes: 'Data & Information',
  counter: 'Interactive',
  newButtonGenerator: 'Interactive',
  imageGallery: 'Media'
};

// --- EXPORT MODAL COMPONENT ---

const ExportModal = ({ isOpen, onClose, widgetDef, config }) => {
  const linkUrl = useMemo(() => {
    if (!isOpen) return '';
    const encoded = encodeConfig(config);
    return `${window.location.origin}${window.location.pathname}?embed=1&widget=${widgetDef.id}&config=${encoded}`;
  }, [isOpen, config, widgetDef]);

  if (!isOpen) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(linkUrl);
    alert("Link copied! Paste into Notion using /embed");
  };

  const copyCode = () => {
    const html = widgetDef.generateHTML ? widgetDef.generateHTML(config) : `<!-- ${widgetDef.label} Widget -->`;
    const script = widgetDef.generateScript ? widgetDef.generateScript(config) : '';
    const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${widgetDef.label} Widget</title>
    <style>
      body { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; }
    </style>
</head>
<body>
    ${html}
    <script>${script}</script>
</body>
</html>`;
    navigator.clipboard.writeText(fullCode);
    alert("HTML Code copied!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-[#1A1D29] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0E12]">
          <h3 className="text-white font-bold text-xl font-mono flex items-center gap-2">
            <Rocket className="text-purple-500" /> GET WIDGET
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Embed Link (Recommended)</h4>
            <div className="bg-[#0B0E12] p-4 rounded-xl border border-gray-800 flex gap-2 items-center">
              <input
                readOnly
                value={linkUrl}
                className="bg-transparent w-full text-sm text-purple-300 outline-none font-mono truncate"
              />
              <button
                onClick={copyLink}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors"
              >
                Copy Link
              </button>
            </div>
            <p className="text-xs text-gray-500">
              In Notion, type <code className="bg-gray-800 px-1 rounded">/embed</code> and paste this URL.
              Requires this app to be hosted publicly.
            </p>
          </div>
          <div className="border-t border-white/5 pt-6 space-y-4">
            <h4 className="text-lg font-bold text-white">Standalone Code</h4>
            <button
              onClick={copyCode}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Code size={16} /> Copy HTML Code
            </button>
            <p className="text-xs text-gray-500">
              Copy the full HTML code and save it as a .html file. Host it on GitHub Pages, Netlify, or Vercel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- FILE: WidgetLandingPage.jsx ---

// Resizable Preview Panel Component
const ResizablePreviewPanel = ({ 
  activeBrandId,
  config,
  activeWidgetId,
  debouncedConfig,
  handleConfigChange, 
  brandTheme, 
  ActiveWidget,
  showExport,
  setShowExport,
  onCustomizeRequest
}) => {
  const [previewWidth, setPreviewWidth] = useState(800);
  const [previewHeight, setPreviewHeight] = useState(450);
  const [isResizing, setIsResizing] = useState(false);
  const previewContainerRef = useRef(null);
  const previewBrandTheme = brandTheme || debouncedConfig?.brandThemeSnapshot || config.brandThemeSnapshot;
  const presetSizes = useMemo(() => ([
    { id: 'phone', label: 'Phone', width: 360, height: 640 },
    { id: 'tablet', label: 'Tablet', width: 820, height: 640 },
    { id: 'desktop', label: 'Desktop', width: 1100, height: 640 }
  ]), []);

  const startResize = (direction, e) => {
    e.preventDefault();
    setIsResizing(direction);
  };

  const applyPresetSize = (preset) => {
    setPreviewWidth(preset.width);
    setPreviewHeight(preset.height);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !previewContainerRef.current) return;
      
      const container = previewContainerRef.current.getBoundingClientRect();
      
      if (isResizing === 'horizontal' || isResizing === 'both') {
        const newWidth = Math.max(300, Math.min(1600, e.clientX - container.left - 40));
        setPreviewWidth(newWidth);
      }
      
      if (isResizing === 'vertical' || isResizing === 'both') {
        const newHeight = Math.max(200, Math.min(1000, e.clientY - container.top - 40));
        setPreviewHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div 
      ref={previewContainerRef}
      className="flex-1 flex flex-col relative h-full" 
      style={{ backgroundColor: 'var(--jazer-night-black)' }}
    >
      <div className="flex-1 flex items-center justify-center p-8" style={{
        background: activeBrandId === 'jazer' ? `radial-gradient(circle at 50% 10%, ${JAZER_BRAND.ui.nebulaPurple} 0%, ${JAZER_BRAND.colors.nightBlack} 100%)` : '#f5f5f5',
        boxShadow: activeBrandId === 'jazer' ? JAZER_BRAND.glow : 'none'
      }}>
        <div
          className="shadow-2xl rounded-xl overflow-hidden relative group"
          style={{
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
            maxWidth: '100%',
            maxHeight: 'min(80vh, 720px)',
            backgroundColor: config.bgColor,
            border: '2px solid var(--jazer-cosmic-blue)',
            boxShadow: 'var(--jazer-glow-blue), 0 20px 40px rgba(0,0,0,0.4)',
            transition: isResizing ? 'none' : 'all 0.2s ease'
          }}
        >
          <div className="absolute top-3 left-3 z-20 flex gap-2">
            {presetSizes.map((preset) => {
              const isActive = Math.round(previewWidth) === preset.width && Math.round(previewHeight) === preset.height;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPresetSize(preset)}
                  className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.3em] border transition ${isActive ? 'border-white text-white bg-white/20' : 'border-white/20 text-white/70 bg-black/30 hover:border-white/40 hover:text-white'}`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <WidgetErrorBoundary key={activeWidgetId}>
            <ActiveWidget.Component
              config={debouncedConfig}
              onConfigChange={handleConfigChange}
              brand={JAZER_BRAND}
              brandTheme={previewBrandTheme}
              onCustomizeRequest={onCustomizeRequest}
            />
          </WidgetErrorBoundary>
          
          {/* Resize Handles */}
          {/* Right handle */}
          <div
            onMouseDown={(e) => startResize('horizontal', e)}
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--jazer-electric-purple))',
            }}
          >
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-l"
              style={{ backgroundColor: 'var(--jazer-electric-purple)', boxShadow: 'var(--jazer-glow-purple)' }}
            />
          </div>
          
          {/* Bottom handle */}
          <div
            onMouseDown={(e) => startResize('vertical', e)}
            className="absolute left-0 right-0 bottom-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'linear-gradient(180deg, transparent, var(--jazer-electric-purple))',
            }}
          >
            <div 
              className="absolute left-1/2 -translate-x-1/2 bottom-0 h-1 w-12 rounded-t"
              style={{ backgroundColor: 'var(--jazer-electric-purple)', boxShadow: 'var(--jazer-glow-purple)' }}
            />
          </div>
          
          {/* Corner handle */}
          <div
            onMouseDown={(e) => startResize('both', e)}
            className="absolute right-0 bottom-0 w-6 h-6 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'var(--jazer-electric-purple)',
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              boxShadow: 'var(--jazer-glow-purple)'
            }}
          />
          
          {/* Size indicator */}
          <div 
            className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              backgroundColor: 'rgba(139, 92, 246, 0.9)',
              color: 'var(--jazer-stardust-white)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {previewWidth} × {previewHeight}
          </div>
        </div>
      </div>

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        widgetDef={ActiveWidget}
        config={config}
      />
    </div>
  );
};

// Export WIDGET_REGISTRY for use in GlobalNavigation
export { WIDGET_REGISTRY };

function WidgetLandingPage({ onSelect, onBrandGenerator, setSearchInputRef }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputLocalRef = useRef(null);

  // Set search input ref for parent keyboard shortcuts
  useEffect(() => {
    if (setSearchInputRef && searchInputLocalRef.current) {
      setSearchInputRef(searchInputLocalRef.current);
    }
  }, [setSearchInputRef]);

  const widgetList = useMemo(() => (
    Object.values(WIDGET_REGISTRY).map(widget => ({
      ...widget,
      category: WIDGET_CATEGORIES[widget.id] || 'Other'
    }))
  ), []);

  const categories = useMemo(() => (
    ['all', ...Array.from(new Set(widgetList.map(widget => widget.category)))]
  ), [widgetList]);

  const featuredWidgetIds = ['weather', 'clock', 'newButtonGenerator'];
  const featuredWidgets = useMemo(
    () => widgetList.filter(widget => featuredWidgetIds.includes(widget.id)),
    [widgetList]
  );

  const filteredWidgets = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return widgetList.filter(widget => {
      const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
      const matchesQuery = !normalizedQuery ||
        [widget.label, widget.description]
          .filter(Boolean)
          .some(text => text.toLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesQuery;
    });
  }, [widgetList, selectedCategory, searchQuery]);

  const widgetBadges = {
    weather: 'Most Advanced',
    clock: 'Fan Favorite',
    countdown: 'New Animation',
    newButtonGenerator: 'Workflow Booster',
    imageGallery: 'Creator Ready',
    quotes: 'API Connected',
    pomodoro: 'Focus Mode'
  };

  const heroStats = [
    { label: 'Widgets', value: '9', subLabel: 'Final list' },
    { label: 'Categories', value: '4', subLabel: 'Time, Data, Media, Interactive' },
    { label: 'API Integrations', value: '2', subLabel: 'Weather + Quotes' },
    { label: 'Brand Kits', value: '∞', subLabel: 'Generator-powered' }
  ];

  const howItWorks = [
    {
      icon: <Layout className="w-5 h-5 text-purple-300" />,
      title: 'Choose a widget',
      copy: 'Clock, Weather, Buttons, and more with presets tuned to Notion.'
    },
    {
      icon: <Palette className="w-5 h-5 text-cyan-300" />,
      title: 'Apply your brand',
      copy: 'Upload a logo once and sync its palette across every widget.'
    },
    {
      icon: <Download className="w-5 h-5 text-pink-300" />,
      title: 'Export / embed',
      copy: 'Copy the embed link or HTML snippet directly into Notion.'
    }
  ];

  const testimonials = [
    {
      quote: '“The builder finally feels as premium as the widgets themselves. I can move from idea to embedded widget in minutes.”',
      author: 'Nara · Product Ops'
    },
    {
      quote: '“Brand kit syncing blew my mind—upload logo, click apply, every widget updates instantly.”',
      author: 'Lewis · Creator'
    },
    {
      quote: '“Favorite part is the Button Generator. Macro + toggle modes mean I can run my workflows without leaving Notion.”',
      author: 'Mika · Studio Lead'
    }
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-16 py-8 flex flex-col items-center" style={{ backgroundColor: 'var(--jazer-night-black)', color: 'var(--jazer-stardust-white)' }}>
      <div className="w-full max-w-6xl space-y-14">
        {/* Hero */}
        <section className="space-y-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-3 py-1 text-[11px] uppercase tracking-[0.3em] rounded-full border border-white/15 text-neutral-300">Final Widget List v1.2</span>
            <span className="px-3 py-1 text-[11px] uppercase tracking-[0.3em] rounded-full border border-white/15 text-neutral-300">JaZeR Neon Ready</span>
          </div>
          <div className="inline-flex items-center justify-center p-3 rounded-full animate-pulse-neon mx-auto" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--jazer-electric-purple)' }}>
            <Sparkles className="w-8 h-8" style={{ color: 'var(--jazer-electric-purple)' }} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight gradient-text neon-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Design-grade Notion Widgets
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--jazer-soft-slate)' }}>
            Shuttle nine premium widgets—clock, weather, pomodoro, button generator, and more—directly into Notion. Every control respects the JaZeR neon system, responsive layouts, and your custom brand kit.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onSelect('clock')}
              className="px-8 py-3 rounded-full text-sm font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300 w-full sm:w-auto text-center"
            >
              Start Building
            </button>
            <button
              onClick={onBrandGenerator}
              className="px-8 py-3 rounded-full text-sm font-bold tracking-[0.2em] uppercase border border-white/20 text-neutral-200 hover:border-cyan-400 hover:text-white transition flex items-center gap-2 justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 w-full sm:w-auto"
            >
              <Palette className="w-4 h-4" /> Sync Brand Kit
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl border border-white/10 bg-white/5">
                <div className="text-3xl font-black">{stat.value}</div>
                <div className="text-xs uppercase tracking-[0.3em] text-neutral-400 mt-1">{stat.label}</div>
                <p className="text-[11px] text-neutral-400 mt-1">{stat.subLabel}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured widgets */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">Spotlight</p>
              <h2 className="text-2xl font-bold">Featured widgets</h2>
            </div>
            <button
              onClick={() => onSelect('weather')}
              className="px-4 py-2 rounded-full border border-white/15 text-sm text-neutral-200 hover:border-purple-300 hover:text-white transition flex items-center gap-2 self-start sm:self-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
            >
              Explore builder <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible">
            {featuredWidgets.map(widget => (
              <div key={widget.id} className="rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur min-w-[260px] snap-center md:min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 text-purple-200">
                    {widget.icon}
                  </div>
                  {widgetBadges[widget.id] && (
                    <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-widest bg-purple-500/20 border border-purple-400 text-purple-200">
                      {widgetBadges[widget.id]}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{widget.label}</h3>
                <p className="text-sm text-neutral-300 mb-6">{widget.description || `Create a beautiful ${widget.label.toLowerCase()} widget for your Notion pages.`}</p>
                <button
                  onClick={() => onSelect(widget.id)}
                  className="w-full py-2 rounded-lg border border-white/15 text-sm font-semibold text-white hover:border-purple-400 transition"
                >
                  Customize {widget.label}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Widget directory */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div
              className="flex gap-2 w-full overflow-x-auto pb-2 pr-4"
              style={{ WebkitOverflowScrolling: 'touch' }}
              role="tablist"
              aria-label="Widget categories"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest border transition ${selectedCategory === category ? 'border-purple-400 text-white bg-purple-500/20' : 'border-white/15 text-neutral-300 hover:border-purple-300 hover:text-white'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400`}
                  aria-pressed={selectedCategory === category}
                  role="tab"
                >
                  {category === 'all' ? 'All widgets' : category}
                </button>
              ))}
            </div>
            <div className="relative ml-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                ref={searchInputLocalRef}
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search widgets..."
                className="pl-9 pr-3 py-2 rounded-full bg-white/5 border border-interactive text-sm text-white placeholder:text-neutral-500 focus-ring"
                aria-label="Search widgets"
              />
            </div>
          </div>

          <div className="py-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWidgets.map(widget => (
              <div key={widget.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-purple-200">
                    {widget.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{widget.label}</h3>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">{widget.category}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-300 flex-1">{widget.description || `Create a ${widget.label.toLowerCase()} widget.`}</p>
                <button
                  onClick={() => onSelect(widget.id)}
                  className="mt-4 w-full py-2 rounded-lg bg-purple-500/20 border border-purple-400 text-sm font-semibold text-purple-50 hover:bg-purple-500/30 transition"
                >
                  Build {widget.label}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Brand kit call to action */}
        <section className="p-1 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
          <div className="rounded-2xl bg-[#0F111C] p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-start w-full">
            <div className="flex-1 space-y-4 w-full">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-purple-500/20 border border-purple-300/40">
                  <Sparkles className="w-6 h-6 text-purple-200" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">Brand Kit</p>
                  <h3 className="text-2xl font-bold">Generate once, sync everywhere</h3>
                </div>
              </div>
              <p className="text-sm text-neutral-200 max-w-2xl">
                Upload a logo, capture its palette, and notch it into every widget automatically. The generator writes to local storage so your theme loads every time you reopen the builder.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-neutral-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  8+ curated presets per brand
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Auto-applies to light + dark modes
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Palette chips ready for export
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  One-click re-launch from builder
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <button
                onClick={onBrandGenerator}
                className="px-8 py-3 rounded-full font-bold tracking-[0.2em] uppercase bg-white text-black hover:scale-105 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Launch Generator
              </button>
              <button
                onClick={() => onSelect('newButtonGenerator')}
                className="px-8 py-3 rounded-full font-bold tracking-[0.2em] uppercase border border-white/20 text-white hover:border-cyan-300 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Preview With Buttons
              </button>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">Workflow</p>
            <h2 className="text-2xl font-bold">How builders ship faster</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {howItWorks.map((step) => (
              <div key={step.title} className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-neutral-300">{step.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="space-y-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">Loved by teams</p>
            <h2 className="text-2xl font-bold">Feedback from early builders</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((item) => (
              <div key={item.author} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5">
                <p className="text-sm text-neutral-200 leading-relaxed">{item.quote}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-neutral-400">{item.author}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center pt-8 text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} JaZeR. Built for the Notion Wiz community.</p>
        </footer>
      </div>
    </div>
  );
}

// --- FILE: NotionWidgetBuilder.jsx ---

const applyBrandThemeToConfig = (baseConfig, theme) => {
  if (!theme) return baseConfig;
  const updated = { ...baseConfig };

  updated.brandThemeSnapshot = {
    ...theme,
    appliedAt: theme.appliedAt || new Date().toISOString()
  };

  if (theme.backgroundColor) {
    updated.bgColor = theme.backgroundColor;
    if (updated.backgroundColor !== undefined) {
      updated.backgroundColor = theme.backgroundColor;
    }
  }

  if (theme.textColor && updated.textColor !== undefined) {
    updated.textColor = theme.textColor;
  }

  if (theme.accentColor && updated.accentColor !== undefined) {
    updated.accentColor = theme.accentColor;
  }

  if (updated.lightMode) {
    updated.lightMode = {
      ...updated.lightMode,
      backgroundColor: theme.backgroundColor || updated.lightMode.backgroundColor,
      clockColor: theme.clockColor || updated.lightMode.clockColor,
      digitColor: theme.digitColor || theme.clockColor || updated.lightMode.digitColor,
      textColor: theme.textColor || updated.lightMode.textColor
    };
  }

  if (updated.darkMode) {
    updated.darkMode = {
      ...updated.darkMode,
      backgroundColor: theme.backgroundColor || updated.darkMode.backgroundColor,
      clockColor: theme.clockColor || updated.darkMode.clockColor,
      digitColor: theme.digitColor || theme.clockColor || updated.darkMode.digitColor,
      textColor: theme.textColor || updated.darkMode.textColor
    };
  }

  if (theme.glow !== undefined && updated.glowEffect !== undefined) {
    updated.glowEffect = theme.glow;
  }

  if (theme.texture && updated.backgroundTexture !== undefined) {
    updated.backgroundTexture = theme.texture;
  }

  return updated;
};

const applyBrandToConfig = (baseConfig, brandId, customTheme) => {
  if (brandId === 'custom' && customTheme) {
    return applyBrandThemeToConfig(baseConfig, customTheme);
  }

  if (brandId === 'none') {
    const cleared = { ...baseConfig };
    delete cleared.brandThemeSnapshot;
    return cleared;
  }

  const brand = BRAND_KITS[brandId];
  if (!brand) {
    const cleared = { ...baseConfig };
    delete cleared.brandThemeSnapshot;
    return cleared;
  }

  const newConfig = { ...baseConfig };
  delete newConfig.brandThemeSnapshot;
  if (brand.fontFamily) newConfig.fontFamily = brand.fontFamily;
  if (brand.bgColor) newConfig.bgColor = brand.bgColor;
  if (brand.textColor) newConfig.textColor = brand.textColor;
  if (brand.accentColor) newConfig.accentColor = brand.accentColor;

  if (brandId === 'jazer') {
    if (newConfig.glowEffect !== undefined) newConfig.glowEffect = true;
    if (newConfig.gradientText !== undefined) newConfig.gradientText = true;
  }

  return newConfig;
};

function NotionWidgetBuilder({ initialWidgetId, onBack, globalBrandTheme, onBrandThemeUpdate, onLaunchBrandGenerator }) {
  const normalizedGlobalTheme = useMemo(
    () => (globalBrandTheme ? normalizeBrandTheme(globalBrandTheme) : null),
    [globalBrandTheme]
  );
  const [activeWidgetId, setActiveWidgetId] = useState(initialWidgetId);
  const [activeBrandId, setActiveBrandId] = useState(normalizedGlobalTheme ? 'custom' : 'none');
  const [config, setConfig] = useState(() => {
    const defaultConfig = WIDGET_REGISTRY[initialWidgetId].defaultConfig;
    return normalizedGlobalTheme ? applyBrandThemeToConfig(defaultConfig, normalizedGlobalTheme) : defaultConfig;
  });
  const [brandTheme, setBrandTheme] = useState(normalizedGlobalTheme); // Store extracted brand colors
  const [expandedSections, setExpandedSections] = useState({});
  const [configSearch, setConfigSearch] = useState('');
  const sectionRefs = useRef({});
  const configPanelRef = useRef(null);
  const infiniteScrollRef = useRef(null);
  const tabMenuRef = useRef(null);
  const [highlightedSection, setHighlightedSection] = useState(null);
  const [panelPulse, setPanelPulse] = useState(false);
  const [visibleSectionCount, setVisibleSectionCount] = useState(CONFIG_SECTION_BATCH);
  const [showTabMenu, setShowTabMenu] = useState(false);
  const [widgetSearch, setWidgetSearch] = useState('');
  const [navFilter, setNavFilter] = useState('all');
  const [pinnedWidgets, setPinnedWidgets] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem('notion_wiz_pins');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // EXPORT STATES
  const [showExport, setShowExport] = useState(false);
  const getIsDesktop = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  }, []);
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [isSidebarOpen, setIsSidebarOpen] = useState(getIsDesktop);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let previous = getIsDesktop();
    const handleResize = () => {
      const next = getIsDesktop();
      if (next !== previous) {
        previous = next;
        setIsDesktop(next);
        setIsSidebarOpen(next);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getIsDesktop]);

  const debouncedConfig = useDebounce(config, DEBOUNCE_DELAY);
  const effectiveBrandTheme = brandTheme || normalizedGlobalTheme;
  const hasCustomBrandTheme = Boolean(effectiveBrandTheme);
  const customBrandLabel = effectiveBrandTheme?.presetName || effectiveBrandTheme?.name || 'Custom Brand Theme';
  const ActiveWidget = WIDGET_REGISTRY[activeWidgetId];
  const sectionOutline = useMemo(() => {
    if (!ActiveWidget?.sections) return [];
    return ActiveWidget.sections
      .map((section) => {
        const controlCount = ActiveWidget.fields.filter(
          (field) => (field.section || 'general') === section.id
        ).length;
        return { ...section, controlCount };
      })
      .filter((section) => section.controlCount > 0);
  }, [ActiveWidget]);

  useEffect(() => {
    // Load JaZeR brand fonts: Orbitron (headings) and Montserrat (body)
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Orbitron:wght@400;700&family=Roboto&family=Open+Sans&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    sectionRefs.current = {};
  }, [activeWidgetId]);

  useEffect(() => {
    if (!showTabMenu) return undefined;
    const handleClick = (event) => {
      if (!tabMenuRef.current) return;
      if (!tabMenuRef.current.contains(event.target)) {
        setShowTabMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showTabMenu]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('notion_wiz_pins', JSON.stringify(pinnedWidgets));
    } catch {
      // ignore
    }
  }, [pinnedWidgets]);

  // Update brandTheme when globalBrandTheme changes
  const toggleSection = useCallback((sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: prev[sectionId] === false ? true : false
    }));
  }, []);

  const isSectionOpen = useCallback((sectionId) => expandedSections[sectionId] !== false, [expandedSections]);

  const handleWidgetChange = (id) => {
    setActiveWidgetId(id);
    setVisibleSectionCount(CONFIG_SECTION_BATCH);
    const base = WIDGET_REGISTRY[id].defaultConfig;
    const themedConfig = applyBrandToConfig(base, activeBrandId, effectiveBrandTheme);
    setConfig(themedConfig);
    setShowExport(false);
    setWidgetSearch('');
  };

  const handleBrandChange = (brandId) => {
    const currentDefault = applyBrandToConfig(
      WIDGET_REGISTRY[activeWidgetId].defaultConfig,
      activeBrandId,
      effectiveBrandTheme
    );
    const hasCustomizations = JSON.stringify(config) !== JSON.stringify(currentDefault);

    if (hasCustomizations && !window.confirm('Applying a brand kit will override your current customizations. Continue?')) {
      return;
    }

    setActiveBrandId(brandId);
    setConfig(prev => applyBrandToConfig(prev, brandId, effectiveBrandTheme));
  };

  // Helper to get nested property value
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  // Helper to set nested property value
  const setNestedValue = (obj, path, value) => {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((acc, part) => {
      if (!acc[part]) acc[part] = {};
      return acc[part];
    }, obj);
    target[last] = value;
    return obj;
  };

  const handleConfigChange = useCallback((key, value) => {
    if (key.includes('.')) {
      setConfig(prev => {
        const newConfig = { ...prev };
        setNestedValue(newConfig, key, value);
        return newConfig;
      });
      return;
    }

    if (key === 'lightMode' || key === 'darkMode') {
      setConfig(prev => ({
        ...prev,
        [key]: { ...prev[key], ...value }
      }));
      return;
    }

    setConfig(prev => {
      let nextValue = value;
      if (typeof prev[key] === 'number' && typeof value === 'string') {
        const parsed = parseInt(value, 10);
        nextValue = Number.isNaN(parsed) ? prev[key] : parsed;
      }
      return { ...prev, [key]: nextValue };
    });
  }, []);

  const handleConfigSearchChange = useCallback((value) => {
    setConfigSearch(value);
    if (value.trim()) {
      setVisibleSectionCount(Number.MAX_SAFE_INTEGER);
    } else {
      setVisibleSectionCount(CONFIG_SECTION_BATCH);
    }
  }, []);

  const syncBrandTheme = useCallback((theme) => {
    const normalized = theme ? normalizeBrandTheme(theme) : null;
    if (normalized) {
      setBrandTheme(normalized);
      setActiveBrandId('custom');
      onBrandThemeUpdate?.(normalized);
      try {
        localStorage.setItem('jazer_global_brand_theme', JSON.stringify(normalized));
        localStorage.setItem('jazer_global_brand_active', 'true');
      } catch {
        // no-op if storage is unavailable
      }
      return;
    }

    setBrandTheme(null);
    setActiveBrandId(prev => (prev === 'custom' ? 'none' : prev));
    onBrandThemeUpdate?.(null);
    try {
        localStorage.removeItem('jazer_global_brand_theme');
        localStorage.removeItem('jazer_global_brand_active');
      } catch {
        // ignore storage errors
      }
  }, [onBrandThemeUpdate]);

  const navFilters = useMemo(() => ['all', 'pinned', ...Array.from(new Set(Object.values(WIDGET_CATEGORIES)))], []);

  const filteredWidgets = useMemo(() => {
    const query = widgetSearch.trim().toLowerCase();
    const pinIndex = (id) => pinnedWidgets.indexOf(id);
    return Object.values(WIDGET_REGISTRY)
      .map(w => ({
        ...w,
        category: WIDGET_CATEGORIES[w.id] || 'Other',
        isPinned: pinnedWidgets.includes(w.id)
      }))
      .filter(w => {
        if (!query) return true;
        const haystack = [w.label, w.description].filter(Boolean).map(val => String(val).toLowerCase());
        return haystack.some(text => text.includes(query));
      })
      .filter(w => {
        if (navFilter === 'all') return true;
        if (navFilter === 'pinned') return w.isPinned;
        return w.category === navFilter;
      })
      .sort((a, b) => {
        const aPin = pinIndex(a.id);
        const bPin = pinIndex(b.id);
        if (aPin !== bPin) {
          if (aPin === -1) return 1;
          if (bPin === -1) return -1;
          return aPin - bPin;
        }
        return a.label.localeCompare(b.label);
      });
  }, [widgetSearch, navFilter, pinnedWidgets]);

  const togglePinned = useCallback((id) => {
    setPinnedWidgets(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  }, []);

  const tabSections = useMemo(() => {
    return [
      { id: 'brandControls', label: 'Brand Kit' },
      { id: 'appearanceControls', label: 'Surface' },
      ...sectionOutline.map(section => ({ id: section.id, label: section.label }))
    ];
  }, [sectionOutline]);

  const configSectionsRender = useMemo(() => {
    if (!ActiveWidget) {
      return { nodes: [], total: 0 };
    }

    const query = configSearch.trim().toLowerCase();
    const sections = ActiveWidget.sections
      ? ActiveWidget.sections.map(s => s.id)
      : [...new Set(ActiveWidget.fields.map(f => f.section))].filter(Boolean);
    const generalFields = ActiveWidget.fields.filter(f => !f.section);
    if (generalFields.length > 0 && !sections.includes('general')) {
      sections.unshift('general');
    }

    const filterBySearch = (field) => {
      if (!query) return true;
      const haystack = [
        field.label,
        field.name,
        field.placeholder,
        field.section
      ].filter(Boolean).map(val => String(val).toLowerCase());
      return haystack.some(text => text.includes(query));
    };

    const sectionNodes = sections.map(section => {
      const sectionFields = section === 'general'
        ? generalFields
        : ActiveWidget.fields.filter(f => f.section === section);
      if (sectionFields.length === 0) return null;

      let sectionTitle = section;
      let sectionConfig = null;
      if (ActiveWidget.sections) {
        sectionConfig = ActiveWidget.sections.find(s => s.id === section);
        sectionTitle = sectionConfig ? sectionConfig.label : section;
      } else {
        const sectionTitles = {
          time: 'Time Display',
          style: 'Clock Style',
          analog: 'Analog Customization',
          typography: 'Typography',
          background: 'Background',
          interactive: 'Interactive Mode',
          theme: 'Preset Themes',
          appearance: 'Appearance Mode',
          features: 'Additional Features',
          effects: 'Visual Effects',
          event: 'Event Setup',
          units: 'Time Units',
          completion: 'Completion',
          general: 'General Settings'
        };
        sectionTitle = sectionTitles[section] || section;
      }

      const sectionTitleLower = sectionTitle.toLowerCase();
      const descriptionMatches = query && sectionConfig?.description?.toLowerCase().includes(query);
      const notesMatch = query && sectionConfig?.notes?.some(note =>
        [note.title, note.body].filter(Boolean).some(text => text.toLowerCase().includes(query))
      );
      const sectionMatchesSearch = query && (sectionTitleLower.includes(query) || descriptionMatches || notesMatch);
      const filteredFields = sectionMatchesSearch ? sectionFields : sectionFields.filter(filterBySearch);
      if (filteredFields.length === 0) return null;

      const open = query ? true : isSectionOpen(section);

      return (
        <div
          key={section}
          ref={(el) => { if (el) sectionRefs.current[section] = el; }}
          className={`border border-white/10 rounded-lg bg-white/5 overflow-hidden ${highlightedSection === section ? 'ring-2 ring-purple-400' : ''}`}
        >
          <button
            type="button"
            onClick={() => toggleSection(section)}
            className="w-full px-3 py-2 flex items-center justify-between text-left text-sm font-semibold text-white"
          >
            <div className="flex flex-col text-left">
              <span>{sectionTitle}</span>
              {sectionConfig?.description && (
                <span className="text-[11px] font-normal text-neutral-400">{sectionConfig.description}</span>
              )}
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
          {open && (
            <div className="p-3 space-y-3 border-t border-white/5">
              {sectionConfig?.notes?.length > 0 && (
                <div className="space-y-2 text-[11px] text-neutral-300 bg-white/5 rounded p-2">
                  {sectionConfig.notes.map((note) => (
                    <div key={`${section}-${note.title}`} className="space-y-1">
                      <div className="text-xs font-semibold text-white">{note.title}</div>
                      {note.body && <p>{note.body}</p>}
                    </div>
                  ))}
                </div>
              )}
              {filteredFields.map(f => {
                let field = f;
                if (f.name === 'presetTheme' && brandTheme && activeWidgetId === 'clock') {
                  const brandPresets = [
                    { label: '--- Brand-Based Themes ---', value: '__separator__', disabled: true },
                    { label: 'Brand Monochrome', value: 'brand-monochrome' },
                    { label: 'Brand Contrast', value: 'brand-contrast' },
                    { label: 'Brand Vibrant', value: 'brand-vibrant' },
                    { label: 'Brand Professional', value: 'brand-professional' },
                    { label: 'Brand Dark', value: 'brand-dark' },
                    { label: 'Brand Light', value: 'brand-light' },
                    { label: 'Brand Neon', value: 'brand-neon' },
                    { label: 'Brand Minimal', value: 'brand-minimal' }
                  ];
                  field = {
                    ...f,
                    options: [...f.options, ...brandPresets]
                  };
                }

                return (
                  <WidgetField
                    key={f.name}
                    field={field}
                    value={f.name.includes('.') ? getNestedValue(config, f.name) : config[f.name]}
                    onChange={(val) => handleConfigChange(f.name, val)}
                  />
                );
              })}
            </div>
          )}
        </div>
      );
    }).filter(Boolean);

    if (sectionNodes.length === 0) {
      return {
        nodes: [
          <div key="empty" className="text-xs text-neutral-400 italic">
            {query ? `No settings match "${configSearch}".` : 'No configurable settings available.'}
          </div>
        ],
        total: 0
      };
    }

    const limitedSections = query ? sectionNodes : sectionNodes.slice(0, visibleSectionCount);

    return {
      nodes: limitedSections,
      total: sectionNodes.length
    };
  }, [
    ActiveWidget,
    activeWidgetId,
    brandTheme,
    config,
    configSearch,
    handleConfigChange,
    highlightedSection,
    isSectionOpen,
    toggleSection,
    visibleSectionCount
  ]);

  const { nodes: configSectionNodes, total: totalSectionCount } = configSectionsRender;
  const hasMoreSections = !configSearch.trim() && totalSectionCount > visibleSectionCount;

  useEffect(() => {
    if (configSearch.trim()) return;
    if (visibleSectionCount >= totalSectionCount) return;
    const raf = typeof window !== 'undefined'
      ? window.requestAnimationFrame
      : null;
    const runCheck = () => {
      const panel = configPanelRef.current;
      if (!panel) return;
      if (panel.scrollHeight <= panel.clientHeight + 40) {
        setVisibleSectionCount((prev) => Math.min(prev + CONFIG_SECTION_BATCH, totalSectionCount));
      }
    };

    if (raf) {
      raf(runCheck);
      return () => {};
    }
    runCheck();
  }, [configSearch, totalSectionCount, visibleSectionCount]);

  useEffect(() => {
    if (!hasMoreSections) return undefined;
    const sentinel = infiniteScrollRef.current;
    if (!sentinel) return undefined;
    const root = configPanelRef.current || null;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisibleSectionCount((prev) => Math.min(prev + CONFIG_SECTION_BATCH, totalSectionCount));
        }
      },
      {
        root,
        threshold: 0.25
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreSections, totalSectionCount]);

  const focusSection = useCallback((sectionId) => {
    if (!sectionId || !sectionRefs.current[sectionId]) return false;
    sectionRefs.current[sectionId].scrollIntoView({ behavior: 'smooth', block: 'center' });
    setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
    setHighlightedSection(sectionId);
    setTimeout(() => {
      setHighlightedSection((current) => current === sectionId ? null : current);
    }, 1500);
    return true;
  }, []);

  const handleCustomizeRequest = useCallback((sectionId) => {
    const found = focusSection(sectionId);
    if (!found && sectionId) {
      setVisibleSectionCount(Number.MAX_SAFE_INTEGER);
      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
          setTimeout(() => focusSection(sectionId), 80);
        });
      }
    } else if (!sectionId && configPanelRef.current) {
      configPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setPanelPulse(true);
    setTimeout(() => setPanelPulse(false), 1200);
  }, [focusSection]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans" style={{ backgroundColor: 'var(--jazer-night-black)', color: 'var(--jazer-stardust-white)' }}>
      {!isDesktop && isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          aria-label="Close widget list overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* SIDEBAR */}
      <div
        className={`${isDesktop ? 'relative w-full lg:w-72' : 'fixed inset-y-0 left-0 w-72 max-w-[85vw] transform transition-transform duration-300 z-40'} flex flex-col h-full min-h-0`}
        style={{ backgroundColor: 'var(--jazer-graphite)', borderRight: '1px solid var(--jazer-soft-slate)', transform: isDesktop || isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="p-4 space-y-3" style={{ borderBottom: '1px solid var(--jazer-soft-slate)' }}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Builder</p>
              <h1 className="text-lg font-bold flex items-center gap-2 gradient-text neon-text">
                <Layout className="w-5 h-5" style={{ color: 'var(--jazer-electric-purple)' }} /> {ActiveWidget?.label || 'Widget'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {!isDesktop && (
                <button
                  type="button"
                  aria-label="Close widget list"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-full border border-white/15 text-neutral-200 hover:border-purple-400 hover:text-white transition"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button aria-label="Navigate back to home" onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border border-white/10 text-neutral-300 hover:border-purple-400 hover:text-white transition-colors">
                <ArrowLeft className="w-3 h-3" /> Exit
              </button>
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 leading-snug">
            Choose a widget to edit. Use search or pin your frequent favorites for faster access.
          </p>
        </div>
        <div className="px-4 py-3 border-b border-white/5 space-y-2">
          <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={widgetSearch}
                  onChange={(e) => setWidgetSearch(e.target.value)}
                  placeholder="Search widgets..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:border-purple-400 focus:ring-0"
                />
          </div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500">
            <span>{filteredWidgets.length} results</span>
            <span className="text-neutral-400">Pin favorites for quick access</span>
          </div>
        </div>
        <div className="px-4 py-2 border-b border-white/5 flex flex-wrap gap-2">
          {navFilters.map(filter => {
            const label = filter === 'all' ? 'All Widgets' : filter === 'pinned' ? 'Pinned' : filter;
            const isActive = navFilter === filter;
            const disabled = filter === 'pinned' && pinnedWidgets.length === 0;
            return (
              <button
                key={filter}
                type="button"
                disabled={disabled}
                onClick={() => setNavFilter(filter)}
                className={`text-[10px] px-3 py-1.5 rounded-full border transition ${isActive ? 'border-purple-400 text-white bg-purple-500/20' : 'border-white/10 text-neutral-300 hover:border-purple-300 hover:text-white'} ${disabled ? 'opacity-30 cursor-not-allowed' : ''} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400`}
                aria-pressed={isActive}
              >
                {label}
              </button>
            );
          })}
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {filteredWidgets.length === 0 ? (
            <div className="text-xs text-neutral-400 bg-white/5 border border-white/10 rounded-xl p-4">
              No widgets match your search. Try a different phrase or reset filters.
            </div>
          ) : (
            filteredWidgets.map(w => {
              const shortDescription = w.description || `Customize the ${w.label} widget.`;
              const isActive = activeWidgetId === w.id;
              return (
                <div
                  key={w.id}
                  className={`border rounded-xl p-3 flex items-start gap-3 transition ${isActive ? 'border-purple-400 bg-purple-500/15 shadow-lg shadow-purple-900/30' : 'border-white/10 bg-white/5 hover:border-purple-300/70'}`}
                >
                  <button
                    type="button"
                    onClick={() => handleWidgetChange(w.id)}
                    className="flex-1 text-left flex items-start gap-3"
                  >
                    <div className={`pt-1 px-2 py-1 rounded-lg text-sm ${isActive ? 'text-purple-300' : 'text-neutral-300'}`}>
                      {w.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{w.label}</span>
                        {isActive && <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400 text-purple-200">Active</span>}
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-snug">{shortDescription}</p>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500">{w.category}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    aria-label={w.isPinned ? 'Unpin widget' : 'Pin widget'}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinned(w.id);
                    }}
                    className={`p-1.5 rounded-full border ${w.isPinned ? 'border-amber-300 text-amber-200 bg-amber-500/10' : 'border-white/10 text-neutral-400 hover:border-amber-200 hover:text-amber-200'}`}
                  >
                    <Star className="w-3.5 h-3.5" fill={w.isPinned ? '#FCD34D' : 'none'} />
                  </button>
                </div>
              );
            })
          )}
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: 'var(--jazer-night-black)' }}>
        <div className="border-b border-white/10 bg-[#10121A] px-4 py-4 sm:px-6 sm:py-6 space-y-4">
          {!isDesktop && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="px-3 py-1.5 rounded-full border border-white/15 text-xs uppercase tracking-[0.3em] flex items-center gap-2 text-neutral-200 hover:border-purple-300 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
              >
                <Layout className="w-3 h-3" /> Widgets
              </button>
              <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">Preview</span>
            </div>
          )}
          <ResizablePreviewPanel
            activeBrandId={activeBrandId}
            config={config}
            activeWidgetId={activeWidgetId}
            debouncedConfig={debouncedConfig}
            handleConfigChange={handleConfigChange}
            brandTheme={brandTheme}
            ActiveWidget={ActiveWidget}
            showExport={showExport}
            setShowExport={setShowExport}
            onCustomizeRequest={handleCustomizeRequest}
          />
        </div>

        <div className="flex-1 flex flex-col border-t border-white/5 bg-[#0F1115] min-h-0">
          <div className="lg:sticky lg:top-0 z-10 border-b border-white/10 bg-[#0A0C12]/95 backdrop-blur-md px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="text-xs font-bold uppercase tracking-[0.4em] text-neutral-500">Configure</div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative" ref={tabMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowTabMenu((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 text-[11px] rounded-full border border-white/15 text-neutral-200 hover:border-purple-300 hover:text-white transition"
                  aria-expanded={showTabMenu}
                >
                  <Menu className="w-4 h-4" />
                  Sections
                </button>
                {showTabMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#0C0F16] border border-white/10 rounded-xl shadow-lg shadow-black/40 p-2 space-y-1 max-h-72 overflow-y-auto custom-scrollbar">
                    {tabSections.map(tab => {
                      const isActive = highlightedSection === tab.id || (tab.id === 'brandControls' && !highlightedSection);
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            handleCustomizeRequest(tab.id);
                            setShowTabMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-[12px] transition ${
                            isActive
                              ? 'bg-purple-500/20 border border-purple-400 text-white'
                              : 'bg-white/5 border border-white/5 text-neutral-200 hover:border-purple-300 hover:text-white'
                          }`}
                        >
                          <span>{tab.label}</span>
                          {isActive && <span className="text-[10px] uppercase tracking-wide text-purple-200">Active</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button aria-label="Get export code" onClick={() => setShowExport(true)} className="text-[11px] px-3 py-1.5 rounded-full border border-pink-400/60 text-white bg-pink-500/20 hover:bg-pink-500/30 transition flex items-center gap-1">
                <Download className="w-3 h-3" /> Export
              </button>
            </div>
          </div>

          <div
            ref={configPanelRef}
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-8 transition-all"
            style={{
              outline: panelPulse ? '2px solid var(--jazer-electric-purple)' : 'none',
              outlineOffset: panelPulse ? '2px' : '0',
              overscrollBehavior: 'contain',
              paddingBottom: !isDesktop ? '8rem' : undefined
            }}
          >
            <section
              ref={(el) => { if (el) sectionRefs.current['brandControls'] = el; }}
              className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Brand Kit</p>
                  <h3 className="text-base font-semibold text-white">Global Palette</h3>
                </div>
                <div className="flex items-center gap-2">
                  <select aria-label="Select brand kit" value={activeBrandId} onChange={(e) => handleBrandChange(e.target.value)} className="bg-[#0B0E12] border border-white/10 rounded-full text-xs text-white px-3 py-1.5">
                    <option value="none">None</option>
                    <option value="jazer">JaZeR Neon</option>
                    {hasCustomBrandTheme && (
                      <option value="custom">{customBrandLabel}</option>
                    )}
                  </select>
                  {onLaunchBrandGenerator && (
                    <button
                      type="button"
                      onClick={onLaunchBrandGenerator}
                      className="text-[11px] px-3 py-1.5 rounded-full border border-cyan-400/60 text-cyan-100 hover:border-cyan-200 transition"
                    >
                      Launch Generator
                    </button>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-3">
                  {activeBrandId === 'jazer' && (
                    <div className="p-3 bg-purple-500/10 border border-purple-400/40 rounded-xl text-xs text-purple-100 space-y-1">
                      <div className="font-semibold flex items-center gap-2"><Sparkles className="w-3 h-3" /> Official JaZeR Kit</div>
                      <p className="text-purple-200/80">Orbitron & Montserrat fonts, neon gradient accents, and night-mode canvas.</p>
                    </div>
                  )}
                  {activeBrandId === 'custom' && effectiveBrandTheme && (
                    <div className="p-3 bg-cyan-500/10 border border-cyan-400/40 rounded-xl text-xs text-cyan-100 space-y-2">
                      <div className="font-semibold flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> {customBrandLabel}
                      </div>
                      <p className="text-cyan-100/80">Widgets are synced with your logo palette.</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Background', color: effectiveBrandTheme.backgroundColor || effectiveBrandTheme.background },
                          { label: 'Primary', color: effectiveBrandTheme.clockColor || effectiveBrandTheme.primary },
                          { label: 'Digits', color: effectiveBrandTheme.digitColor || effectiveBrandTheme.secondary },
                          { label: 'Text', color: effectiveBrandTheme.textColor || effectiveBrandTheme.text }
                        ].map(({ label, color }) => (
                          <div key={label} className="text-center">
                            <div className="h-10 rounded border border-white/20" style={{ backgroundColor: color || '#0B0E12' }} />
                            <div className="mt-1 text-[9px] uppercase text-neutral-400">{label}</div>
                            <div className="text-[9px] font-mono text-neutral-300">{color || '--'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {activeBrandId === 'custom' && effectiveBrandTheme?.palette?.length > 0 && (
                  <div className="bg-[#0B0E12] border border-white/10 rounded-xl p-3">
                    <div className="text-[10px] uppercase text-neutral-500 mb-2">Palette Swatches</div>
                    <div className="grid grid-cols-5 gap-2">
                      {effectiveBrandTheme.palette.map((color, idx) => (
                        <div key={`${color}-${idx}`} className="text-center">
                          <div className="w-full h-10 rounded border border-white/10" style={{ backgroundColor: color }} />
                          <div className="text-[8px] text-neutral-400 truncate mt-1">{color}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeBrandId === 'jazer' && <BrandColorPalette />}
              </div>
            </section>

            <section
              ref={(el) => { if (el) sectionRefs.current['appearanceControls'] = el; }}
              className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Surface</p>
                  <h3 className="text-base font-semibold text-white">Canvas & Appearance</h3>
                </div>
                {config.fontSize !== undefined && (
                  <div className="text-[11px] text-neutral-400">
                    {config.fontSize}px
                  </div>
                )}
              </div>
              {config.fontSize !== undefined && (
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="block text-xs font-medium text-neutral-400">Font Size</label>
                  </div>
                  <input aria-label="Font size slider" type="range" min={MIN_FONT_SIZE} max={MAX_FONT_SIZE} value={config.fontSize} onChange={(e) => handleConfigChange('fontSize', parseInt(e.target.value))} className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-purple-500" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Background</label>
                  <div className="flex items-center gap-2 border border-white/10 p-2 rounded-lg">
                    <input aria-label="Background color" type="color" value={config.bgColor} onChange={(e) => handleConfigChange('bgColor', e.target.value)} className="w-8 h-8 rounded border-none" />
                    <span className="text-[10px] font-mono text-neutral-400">{config.bgColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Text</label>
                  <div className="flex items-center gap-2 border border-white/10 p-2 rounded-lg">
                    <input aria-label="Text color" type="color" value={config.textColor || '#000000'} onChange={(e) => handleConfigChange('textColor', e.target.value)} className="w-8 h-8 rounded border-none" />
                    <span className="text-[10px] font-mono text-neutral-400">{config.textColor}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase">
                <span className="flex items-center gap-2"><Search className="w-3 h-3" /> Quick Find</span>
                {configSearch && (
                  <button
                    type="button"
                    onClick={() => handleConfigSearchChange('')}
                    className="text-[10px] text-neutral-300 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={configSearch}
                  onChange={(e) => handleConfigSearchChange(e.target.value)}
                  placeholder="Search labels, sections, or controls..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:border-purple-400 focus:ring-0"
                />
              </div>
              {sectionOutline.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sectionOutline.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => handleCustomizeRequest(section.id)}
                      className={`px-3 py-1.5 rounded-full border text-[11px] ${highlightedSection === section.id ? 'border-purple-400 text-white bg-purple-500/20' : 'border-white/10 text-neutral-300 hover:border-purple-300 hover:text-white'}`}
                    >
                      {section.label} · {section.controlCount}
                    </button>
                  ))}
                </div>
              )}
            </section>

          <BrandLogoUploader
            onColorsExtracted={(theme) => {
              if (!theme) {
                syncBrandTheme(null);
                setConfig(prev => {
                  if (!prev.brandThemeSnapshot) return prev;
                  const next = { ...prev };
                  delete next.brandThemeSnapshot;
                  return next;
                });
                return;
              }

              const snapshot = normalizeBrandTheme(theme, { appliedAt: new Date().toISOString() });
              if (!snapshot) return;

              // Save brand theme for generating dynamic presets
              syncBrandTheme(snapshot);

              // Apply extracted colors to widget configuration
              const newConfig = {
                ...config,
                brandThemeSnapshot: snapshot
              };
              const backgroundColor = snapshot.backgroundColor || snapshot.background;
              const textColor = snapshot.textColor || snapshot.text;
              const contrastBackground = snapshot.text || snapshot.textColor || '#0B0E12';
              const contrastText = snapshot.background || snapshot.backgroundColor || '#F8F9FF';
              const primaryColor = snapshot.clockColor || snapshot.primary || snapshot.primaryColor;
              const secondaryColor = snapshot.digitColor || snapshot.secondary || snapshot.secondaryColor || primaryColor;
              const accentColor = snapshot.accentColor || snapshot.accent || primaryColor;
              const palette = Array.isArray(snapshot.palette) ? snapshot.palette : [];

              // ===== WIDGETS WITH LIGHTMODE/DARKMODE OBJECTS =====
              if (activeWidgetId === 'clock') {
                newConfig.lightMode = {
                  ...newConfig.lightMode,
                  textColor,
                  panelColor: backgroundColor,
                  digitColor: primaryColor,
                  clockColor: primaryColor,
                  backgroundColor
                };
                newConfig.darkMode = {
                  ...newConfig.darkMode,
                  textColor: contrastText,
                  panelColor: contrastBackground,
                  digitColor: secondaryColor,
                  clockColor: accentColor,
                  backgroundColor: contrastBackground
                };
                newConfig.bgColor = backgroundColor;
              } 
              
              else if (activeWidgetId === 'countdown') {
                newConfig.lightMode = {
                  ...newConfig.lightMode,
                  textColor,
                  panelColor: backgroundColor,
                  digitColor: primaryColor,
                  backgroundColor
                };
                newConfig.darkMode = {
                  ...newConfig.darkMode,
                  textColor: contrastText,
                  panelColor: contrastBackground,
                  digitColor: secondaryColor,
                  backgroundColor: contrastBackground
                };
                newConfig.bgColor = backgroundColor;
              } 
              
              else if (activeWidgetId === 'quotes') {
                newConfig.lightMode = {
                  ...newConfig.lightMode,
                  textColor,
                  authorColor: secondaryColor,
                  backgroundColor
                };
                newConfig.darkMode = {
                  ...newConfig.darkMode,
                  textColor: contrastText,
                  authorColor: accentColor,
                  backgroundColor: contrastBackground
                };
                newConfig.bgColor = backgroundColor;
              } 
              
              // ===== WIDGETS WITH SEPARATE COLOR PROPS =====
              if (activeWidgetId === 'counter') {
                newConfig.lightTextColor = textColor;
                newConfig.darkTextColor = contrastBackground;
                newConfig.bgColor = backgroundColor;
              } 
              
              else if (activeWidgetId === 'weather') {
                newConfig.bgColor = backgroundColor;
                newConfig.textColor = textColor;
                newConfig.accentColor = accentColor;
              } 
              
              else if (activeWidgetId === 'imageGallery') {
                newConfig.bgColor = backgroundColor;
              }
              
              // ===== BUTTON GENERATOR (SPECIAL CASE) =====
              else if (activeWidgetId === 'newButtonGenerator') {
                // Apply to all buttons using full color palette
                const paletteSource = palette.length > 0 ? palette : [primaryColor, accentColor, textColor].filter(Boolean);
                if (newConfig.buttons && Array.isArray(newConfig.buttons)) {
                  newConfig.buttons = newConfig.buttons.map((btn, idx) => ({
                    ...btn,
                    backgroundColor: paletteSource[idx % paletteSource.length] || primaryColor,
                    textColor,
                    outlineColor: accentColor,
                    hoverBackgroundColor: backgroundColor,
                    hoverTextColor: paletteSource[idx % paletteSource.length] || primaryColor
                  }));
                }
                newConfig.bgColor = backgroundColor;
              }
              
              // ===== INLINE WIDGETS =====
              else if (activeWidgetId === 'simpleList') {
                newConfig.bgColor = backgroundColor;
                newConfig.textColor = textColor;
                newConfig.accentColor = accentColor;
              } 
              
              else if (activeWidgetId === 'pomodoro') {
                newConfig.bgColor = backgroundColor;
                newConfig.textColor = textColor;
                newConfig.accentColor = accentColor;
              } 
              
              // ===== FALLBACK FOR ANY FUTURE WIDGETS =====
              else {
                newConfig.bgColor = backgroundColor;
                newConfig.textColor = textColor;
                if (newConfig.accentColor !== undefined) {
                  newConfig.accentColor = accentColor;
                }
              }

              setConfig(newConfig);
            }}
          />

          {/* Fields - Grouped by Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase">
              <Settings className="w-3 h-3" /> Widget Controls
            </div>

            {configSectionNodes}
            {hasMoreSections && (
              <div
                ref={infiniteScrollRef}
                className="py-4 text-center text-[11px] text-neutral-400"
              >
                Keep scrolling to load more controls...
              </div>
            )}
          </div>

          <div className="space-y-3 mt-8">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">
              <Palette className="w-3 h-3" /> Light Mode Colors
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Text Color</label>
              <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded">
                <input type="color" value={config.lightMode?.textColor || JAZER_BRAND.colors.graphite} onChange={(e) => handleConfigChange('lightMode', { textColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-none" />
                <span className="text-[10px] font-mono text-neutral-400">{config.lightMode?.textColor || JAZER_BRAND.colors.graphite}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Panel Color</label>
              <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded">
                <input type="color" value={config.lightMode?.panelColor || JAZER_BRAND.colors.stardustWhite} onChange={(e) => handleConfigChange('lightMode', { panelColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-none" />
                <span className="text-[10px] font-mono text-neutral-400">{config.lightMode?.panelColor || JAZER_BRAND.colors.stardustWhite}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Digit Color</label>
              <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded">
                <input type="color" value={config.lightMode?.digitColor || JAZER_BRAND.colors.nightBlack} onChange={(e) => handleConfigChange('lightMode', { digitColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-none" />
                <span className="text-[10px] font-mono text-neutral-400">{config.lightMode?.digitColor || JAZER_BRAND.colors.nightBlack}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-8">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">
              <Palette className="w-3 h-3" /> Dark Mode Colors
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Text Color</label>
              <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded">
                <input type="color" value={config.darkMode?.textColor || JAZER_BRAND.colors.stardustWhite} onChange={(e) => handleConfigChange('darkMode', { textColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-none" />
                <span className="text-[10px] font-mono text-neutral-400">{config.darkMode?.textColor || JAZER_BRAND.colors.stardustWhite}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Panel Color</label>
              <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded">
                <input type="color" value={config.darkMode?.panelColor || JAZER_BRAND.colors.graphite} onChange={(e) => handleConfigChange('darkMode', { panelColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-none" />
                <span className="text-[10px] font-mono text-neutral-400">{config.darkMode?.panelColor || JAZER_BRAND.colors.graphite}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Digit Color</label>
              <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded">
                <input type="color" value={config.darkMode?.digitColor || JAZER_BRAND.colors.stardustWhite} onChange={(e) => handleConfigChange('darkMode', { digitColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-none" />
                <span className="text-[10px] font-mono text-neutral-400">{config.darkMode?.digitColor || JAZER_BRAND.colors.stardustWhite}</span>
              </div>
            </div>
          </div>

          <hr className="border-neutral-100" />
          {/* Clock Specific Colors */}
          {activeWidgetId === 'clock' && (
            <>
              <hr className="border-neutral-100 my-4" />
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                💡 <strong>Advanced Clock Features:</strong> Full light/dark mode support, 7+ clock styles, and custom fonts available in the full version.
              </div>
            </>
          )}

        </div>
        {!isDesktop && (
          <div className="fixed bottom-4 left-4 right-4 z-30 flex items-center gap-3 bg-[#0A0C12]/95 border border-white/10 rounded-full px-4 py-2 shadow-lg shadow-black/40 backdrop-blur">
            <button
              type="button"
              onClick={() => setShowTabMenu(true)}
              className="flex-1 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.3em] border border-white/15 text-neutral-200 hover:border-purple-300 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
            >
              Sections
            </button>
            <button
              type="button"
              onClick={() => setShowExport(true)}
              className="flex-1 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.3em] border border-white/15 text-neutral-200 hover:border-pink-300 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300"
            >
              Export
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}

// --- FILE: Main.jsx (Entry Point) ---

export default function App() {
  // Embed mode detection
  const search = useMemo(() => new URLSearchParams(window.location.search), []);
  const isEmbedMode = search.get('embed') === '1';
  const urlWidgetId = search.get('widget');
  const urlConfigStr = search.get('config');

  // State management
  const [view, setView] = useState('landing'); // 'landing' | 'builder' | 'brand-generator'
  const [selectedWidgetId, setSelectedWidgetId] = useState('clock');
  const [globalBrandTheme, setGlobalBrandTheme] = useState(() => loadStoredBrandTheme());
  const [returnView, setReturnView] = useState('landing');
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [searchInputRef, setSearchInputRef] = useState(null);

  const navigateToBuilder = (id) => {
    setSelectedWidgetId(id);
    setView('builder');
  };

  const navigateToBrandGenerator = () => {
    setReturnView(view);
    setView('brand-generator');
  };

  const navigateToHome = () => {
    setView('landing');
  };

  const handleBrandGeneratorBack = useCallback(() => {
    setView(returnView || 'landing');
  }, [returnView]);

  const handleThemeGenerated = (theme) => {
    setGlobalBrandTheme(theme ? normalizeBrandTheme(theme) : null);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+k': () => {
      // Quick widget switcher - for now just go to landing
      navigateToHome();
    },
    'cmd+e': () => {
      // Open export - only works in builder view
      if (view === 'builder') {
        // Trigger export modal - we'll need to pass this down
      }
    },
    'cmd+b': () => {
      navigateToBrandGenerator();
    },
    'cmd+/': () => {
      // Focus search input
      if (searchInputRef) {
        searchInputRef.focus();
      }
    },
    '?': (e) => {
      // Don't trigger in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      setShowShortcutsHelp(true);
    },
    'Escape': () => {
      setShowShortcutsHelp(false);
    }
  }, !isEmbedMode); // Disable shortcuts in embed mode

  // Handle embed mode first (before normal app render)
  if (isEmbedMode && urlWidgetId && WIDGET_REGISTRY[urlWidgetId]) {
    const widgetDef = WIDGET_REGISTRY[urlWidgetId];
    let widgetConfig = widgetDef.defaultConfig || {};

    // Decode config from URL if provided
    if (urlConfigStr) {
      const decoded = decodeConfig(urlConfigStr);
      widgetConfig = decoded || widgetConfig;
    }

    const theme = resolveThemeColors(widgetConfig, false);
    const WidgetComponent = widgetDef.Component;

    return (
      <div style={{
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: 'sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div className="w-full h-full">
          <WidgetComponent config={widgetConfig} brandTheme={widgetConfig.brandThemeSnapshot} />
        </div>
      </div>
    );
  }

  const brandLabel = globalBrandTheme?.presetName || globalBrandTheme?.name || 'Custom Brand Theme';
  const builderThemeKey = globalBrandTheme
    ? `${globalBrandTheme.presetName || globalBrandTheme.name || 'custom'}-${globalBrandTheme.appliedAt || globalBrandTheme.backgroundColor || 'base'}`
    : 'none';

  return (
    <ToastProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;700&family=Montserrat:wght@400;600&display=swap');
        ${BRAND_KITS.jazer.extraCSS}
      `}</style>

      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--jazer-night-black)' }}>
        <GlobalNavigation
          currentView={view}
          onNavigateHome={navigateToHome}
          onNavigateBuilder={() => navigateToBuilder(selectedWidgetId || 'clock')}
          onNavigateBrand={navigateToBrandGenerator}
          onOpenHelp={() => setShowShortcutsHelp(true)}
          selectedWidgetId={selectedWidgetId}
          selectedWidgetLabel={WIDGET_REGISTRY[selectedWidgetId]?.label || ''}
          hasBrandTheme={Boolean(globalBrandTheme)}
          brandLabel={brandLabel}
        />
        <div className="flex-1 w-full">
          {view === 'landing' ? (
            <WidgetLandingPage 
              onSelect={navigateToBuilder} 
              onBrandGenerator={navigateToBrandGenerator}
              setSearchInputRef={setSearchInputRef}
            />
          ) : view === 'brand-generator' ? (
            <WidgetErrorBoundary>
              <BrandThemeGenerator 
                onBack={handleBrandGeneratorBack} 
                onThemeGenerated={handleThemeGenerated}
              />
            </WidgetErrorBoundary>
          ) : (
            <NotionWidgetBuilder
              key={builderThemeKey}
              initialWidgetId={selectedWidgetId}
              onBack={navigateToHome}
              globalBrandTheme={globalBrandTheme}
              onBrandThemeUpdate={handleThemeGenerated}
              onLaunchBrandGenerator={navigateToBrandGenerator}
            />
          )}
        </div>
        
        {/* Keyboard shortcuts help modal */}
        <KeyboardShortcutsHelp 
          isOpen={showShortcutsHelp} 
          onClose={() => setShowShortcutsHelp(false)} 
        />
      </div>
    </ToastProvider>
  );
}
