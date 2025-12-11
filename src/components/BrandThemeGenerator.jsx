import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Download, Palette, Check, Copy, 
  RefreshCcw, Eye, EyeOff, ChevronRight, ArrowLeft,
  Clock, Quote, Hash, ImageIcon, BarChart3, Hourglass, 
  MousePointerClick, CloudSun
} from 'lucide-react';
import { BrandLogoUploader } from './BrandLogoUploader';
import { generateBrandPresets } from '../utils/brandThemeGenerator';
import { JAZER_BRAND } from '../theme/jazerNeonTheme';
import { normalizeBrandTheme } from '../utils/brandTheme';

const WIDGET_ICONS = {
  clock: Clock,
  quotes: Quote,
  counter: Hash,
  imageGallery: ImageIcon,
  countdown: Hourglass,
  newButtonGenerator: MousePointerClick,
  weather: CloudSun
};

const loadSavedBrandTheme = () => {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem('jazer_brand_theme');
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    if (parsed && parsed.palette && Array.isArray(parsed.palette) && parsed.palette.length > 0) {
      return normalizeBrandTheme(parsed);
    }
    window.localStorage.removeItem('jazer_brand_theme');
  } catch {
    window.localStorage.removeItem('jazer_brand_theme');
  }
  return null;
};

const BrandThemeGenerator = ({ onBack, onThemeGenerated }) => {
  console.log('[BrandThemeGenerator v2] Component loaded - Dec 4 2024');
  const [brandTheme, setBrandTheme] = useState(() => loadSavedBrandTheme());
  const generatedPresets = useMemo(
    () => (brandTheme ? generateBrandPresets(brandTheme) : []),
    [brandTheme]
  );
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const selectedPreset = useMemo(() => {
    if (!generatedPresets.length) return null;
    if (selectedPresetId) {
      const match = generatedPresets.find((preset) => preset.id === selectedPresetId);
      if (match) return match;
    }
    return generatedPresets[0];
  }, [generatedPresets, selectedPresetId]);
  const [showPreview, setShowPreview] = useState(true);
  const [appliedToWidgets, setAppliedToWidgets] = useState(false);

  const handleColorsExtracted = (theme) => {
    if (!theme) {
      setBrandTheme(null);
      setSelectedPresetId(null);
      return;
    }

    const normalized = normalizeBrandTheme(theme);
    setBrandTheme(normalized);
    setSelectedPresetId(null);

    // Save to localStorage
    try {
      localStorage.setItem('jazer_brand_theme', JSON.stringify(normalized));
    } catch {
      // Silently fail if localStorage is not available
    }
  };

  const handleApplyToAllWidgets = () => {
    if (!brandTheme) return;

    // Use selectedPreset if available, otherwise use base brandTheme
    const baseTheme = selectedPreset
      ? {
        ...brandTheme,
        ...selectedPreset,
        palette: brandTheme?.palette || selectedPreset.palette
      }
      : brandTheme;
    const themeToApply = normalizeBrandTheme(baseTheme, {
      presetName: selectedPreset?.name ?? baseTheme?.presetName,
      name: selectedPreset?.name ?? baseTheme?.name
    });

    // Store in localStorage with a global key
    localStorage.setItem('jazer_global_brand_theme', JSON.stringify(themeToApply));
    localStorage.setItem('jazer_global_brand_active', 'true');

    // Notify parent component
    if (onThemeGenerated) {
      onThemeGenerated(themeToApply);
    }

    setAppliedToWidgets(true);

    // Reset after 3 seconds
    setTimeout(() => setAppliedToWidgets(false), 3000);
  };

  const handleClearBrandTheme = () => {
    if (!window.confirm('This will remove your custom brand theme from all widgets. Continue?')) {
      return;
    }

    setBrandTheme(null);
    setSelectedPresetId(null);
    localStorage.removeItem('jazer_brand_theme');
    localStorage.removeItem('jazer_global_brand_theme');
    localStorage.removeItem('jazer_global_brand_active');

    if (onThemeGenerated) {
      onThemeGenerated(null);
    }
  };

  const handleDownloadTheme = () => {
    if (!brandTheme) return;

    const themeData = {
      name: 'Custom Brand Theme',
      timestamp: new Date().toISOString(),
      colors: brandTheme,
      presets: generatedPresets
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brand-theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyColorToClipboard = (color) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <div
      className="min-h-screen p-8 md:p-16 animate-fadeIn"
      style={{
        backgroundColor: '#000000',
        color: '#F8F9FF'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-3 rounded-xl transition-all hover:scale-105 btn-ghost"
              style={{
                background: 'var(--bg-card)',
                border: '2px solid var(--border-cyan)',
                color: 'var(--jazer-cyan)'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1
                className="text-4xl md:text-5xl font-black tracking-tight animate-float"
                style={{
                  fontFamily: 'var(--font-primary)',
                  background: 'var(--gradient-text)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textTransform: 'uppercase'
                }}
              >
                Brand Theme Generator
              </h1>
              <p
                className="text-lg mt-2"
                style={{
                  color: 'var(--text-gray)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                Extract colors from your logo and apply them to all widgets
              </p>
            </div>
          </div>

          {brandTheme && (
            <div className="flex gap-3">
              <button
                onClick={handleDownloadTheme}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all hover:scale-105 animate-glow"
                style={{
                  background: 'var(--gradient-accent)',
                  color: 'white',
                  border: '2px solid var(--border-pink)',
                  fontFamily: 'var(--font-secondary)',
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em'
                }}
              >
                <Download className="w-4 h-4" />
                Export Theme
              </button>
              <button
                onClick={handleClearBrandTheme}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-gray)',
                  border: '2px solid var(--border-default)',
                  fontFamily: 'var(--font-secondary)',
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em'
                }}
              >
                <RefreshCcw className="w-4 h-4" />
                Clear Theme
              </button>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Uploader */}
          <div className="space-y-6 animate-fadeInUp">
            <div className="glass-card"
              style={{
                border: '2px solid var(--border-cyan)',
                boxShadow: 'var(--shadow-cyan)'
              }}
            >
              <BrandLogoUploader onColorsExtracted={handleColorsExtracted} />

              {brandTheme && brandTheme.palette && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3
                      className="text-sm font-bold uppercase tracking-wider"
                      style={{
                        color: 'var(--text-gray)',
                        fontFamily: 'var(--font-secondary)'
                      }}
                    >
                      Extracted Colors
                    </h3>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="p-1 rounded transition-colors"
                      style={{ color: 'var(--text-gray)' }}
                    >
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {showPreview && brandTheme.palette && Array.isArray(brandTheme.palette) && (
                    <div className="grid grid-cols-4 gap-3">
                      {brandTheme.palette.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => copyColorToClipboard(color)}
                          className="group relative text-center transition-transform hover:scale-110"
                          title={`Click to copy ${color}`}
                        >
                          <div
                            className="w-full h-16 rounded-lg border-2 transition-all"
                            style={{
                              backgroundColor: color,
                              borderColor: 'rgba(255, 255, 255, 0.2)'
                            }}
                          />
                          <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                          >
                            <Copy className="w-4 h-4" style={{ color: 'white' }} />
                          </div>
                          <div
                            className="text-[9px] font-mono mt-1"
                            style={{ color: 'var(--text-gray)' }}
                          >
                            {color}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Apply to All Widgets Button */}
                  <button
                    onClick={handleApplyToAllWidgets}
                    disabled={appliedToWidgets}
                    className="w-full py-5 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
                    style={{
                      background: appliedToWidgets
                        ? 'linear-gradient(135deg, #00f2ea 0%, #4facfe 100%)'
                        : 'var(--gradient-accent)',
                      color: 'white',
                      fontFamily: 'var(--font-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: appliedToWidgets ? '2px solid var(--jazer-cyan)' : '2px solid var(--border-pink)',
                      boxShadow: appliedToWidgets ? 'var(--shadow-cyan)' : 'var(--shadow-card)'
                    }}
                  >
                    {appliedToWidgets ? (
                      <>
                        <Check className="w-6 h-6" />
                        {selectedPreset ? `${selectedPreset.name} Applied!` : 'Theme Applied!'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        {selectedPreset ? `Apply ${selectedPreset.name}` : 'Apply to All Widgets'}
                      </>
                    )}
                  </button>

                  <p
                    className="text-xs text-center"
                    style={{ color: 'var(--text-gray)' }}
                  >
                    {selectedPreset
                      ? `This will apply "${selectedPreset.name}" preset to all widgets`
                      : 'This will set your brand colors as the default for all widgets'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Presets */}
          <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="glass-card"
              style={{
                border: '2px solid var(--border-purple)',
                boxShadow: 'var(--shadow-purple)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Palette
                  className="w-7 h-7"
                  style={{ color: 'var(--jazer-purple)' }}
                />
                <h3
                  className="text-2xl font-black"
                  style={{
                    fontFamily: 'var(--font-primary)',
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em'
                  }}
                >
                  Generated Presets ({generatedPresets.length})
                </h3>
              </div>

              {generatedPresets.length === 0 ? (
                <div
                  className="text-center py-16 rounded-xl border-2 border-dashed"
                  style={{
                    borderColor: 'var(--border-cyan)',
                    color: 'var(--text-gray)',
                    background: 'rgba(0, 242, 234, 0.05)'
                  }}
                >
                  <Sparkles className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--jazer-cyan)', opacity: 0.6 }} />
                  <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-secondary)', color: 'white' }}>
                    Upload a logo to generate presets
                  </p>
                  <p className="text-sm mt-2" style={{ fontFamily: 'var(--font-body)' }}>
                    8 unique color schemes will be created automatically
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {generatedPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPresetId(preset.id)}
                      className="w-full text-left p-5 rounded-xl transition-all hover:scale-[1.02]"
                      style={{
                        background: selectedPreset?.id === preset.id
                          ? 'var(--gradient-card)'
                          : 'var(--bg-card)',
                        border: `2px solid ${
                          selectedPreset?.id === preset.id
                            ? 'var(--jazer-cyan)'
                            : 'var(--border-default)'
                        }`,
                        boxShadow: selectedPreset?.id === preset.id ? 'var(--shadow-cyan)' : 'none'
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4
                            className="font-bold text-sm"
                            style={{
                              color: 'white',
                              fontFamily: 'var(--font-secondary)'
                            }}
                          >
                            {preset.name}
                          </h4>
                          <p
                            className="text-xs mt-1"
                            style={{ color: 'var(--text-gray)' }}
                          >
                            {preset.description}
                          </p>
                        </div>
                        {selectedPreset?.id === preset.id && (
                          <Check
                            className="w-5 h-5"
                            style={{ color: 'var(--jazer-cyan)' }}
                          />
                        )}
                      </div>

                      <div className="flex gap-2">
                        <div 
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: preset.backgroundColor }}
                          title={`Background: ${preset.backgroundColor}`}
                        />
                        <div 
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: preset.clockColor }}
                          title={`Primary: ${preset.clockColor}`}
                        />
                        <div 
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: preset.digitColor }}
                          title={`Digits: ${preset.digitColor}`}
                        />
                        <div 
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: preset.textColor }}
                          title={`Text: ${preset.textColor}`}
                        />
                      </div>

                      {preset.glow && (
                        <div
                          className="mt-2 text-xs flex items-center gap-2"
                          style={{ color: 'var(--jazer-cyan)' }}
                        >
                          <Sparkles className="w-3 h-3" />
                          Includes glow effect
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Widget Coverage */}
        {brandTheme && (
          <div className="glass-card animate-fadeInUp"
            style={{
              border: '2px solid var(--border-pink)',
              boxShadow: 'var(--shadow-pink)',
              animationDelay: '0.2s'
            }}
          >
            <h3
              className="text-2xl font-black mb-6 flex items-center gap-3"
              style={{
                fontFamily: 'var(--font-primary)',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}
            >
              <Sparkles
                className="w-7 h-7"
                style={{ color: 'var(--jazer-pink)' }}
              />
              Widgets Using Your Brand Theme
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(WIDGET_ICONS).map(([key, IconEntry]) => {
                const IconComponent = IconEntry;
                return (
                  <div
                    key={key}
                    className="p-5 rounded-xl text-center transition-all hover:scale-105"
                    style={{
                      background: 'var(--bg-card)',
                      border: '2px solid var(--border-cyan)',
                      boxShadow: '0 4px 12px rgba(0, 242, 234, 0.1)'
                    }}
                  >
                    <IconComponent
                      className="w-10 h-10 mx-auto mb-3"
                      style={{ color: brandTheme?.primary || 'var(--jazer-cyan)' }}
                    />
                    <div
                      className="text-sm font-bold capitalize"
                      style={{
                        color: 'white',
                        fontFamily: 'var(--font-secondary)'
                      }}
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div
                      className="text-xs mt-1 font-medium"
                      style={{
                        color: 'var(--jazer-cyan)',
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      Theme Active
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-6 p-5 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(255, 0, 110, 0.1))',
                border: '2px solid var(--border-purple)'
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: 'white',
                  fontFamily: 'var(--font-body)'
                }}
              >
                💡 <strong style={{ color: 'var(--jazer-cyan)', fontWeight: 700 }}>Pro Tip:</strong> Your brand theme is saved locally and will be automatically applied to all widgets. You can always come back here to update or clear your theme.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000000;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--jazer-purple);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--jazer-cyan);
        }
      `}</style>
    </div>
  );
};

export default BrandThemeGenerator;
