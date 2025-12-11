import React, { useState, useRef } from 'react';
import { Upload, X, Loader, Check, Sparkles } from 'lucide-react';
import ColorThief from 'colorthief';
import { jazerNeonTheme } from '../theme/jazerNeonTheme'; // Import jazerNeonTheme
import { normalizeBrandTheme } from '../utils/brandTheme';

// Helper functions (could be moved to a utils file if shared)
const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};

const getLuminance = (hex) => {
    const hexToRgb = (h) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
    };
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const sortByLuminance = (colors) => {
    return [...colors].sort((a, b) => getLuminance(a) - getLuminance(b));
};

const BrandLogoUploader = ({ onColorsExtracted, onLogoUploaded }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [extractedTheme, setExtractedTheme] = useState(null); // Changed from extractedColors
    const [generatedThemes, setGeneratedThemes] = useState([]);
    const fileInputRef = useRef(null);
    const imgRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();

        reader.onload = (event) => {
            const dataUrl = event.target.result;
            setPreview(dataUrl);
            onLogoUploaded && onLogoUploaded(dataUrl); // Pass URL up immediately
        };

        reader.readAsDataURL(file);
    };

    const generateThemeVariations = (baseExtractedTheme) => {
        if (!baseExtractedTheme || !baseExtractedTheme.palette || baseExtractedTheme.palette.length === 0) {
            return [];
        }

        const sortedPalette = sortByLuminance(baseExtractedTheme.palette);
        const darkest = sortedPalette[0];
        const lightest = sortedPalette[sortedPalette.length - 1];
        const primary = baseExtractedTheme.primary || darkest;
        const secondary = baseExtractedTheme.secondary || sortedPalette[1] || darkest;
        const accent = baseExtractedTheme.accent;

        const variations = [];

        // Helper to merge extracted colors into jazerNeonTheme structure
        const createTheme = (overrides, isDarkOverride = null) => {
            const mergedTheme = {
                ...jazerNeonTheme, // Start with the full Jazer Neon theme
                colors: { // Override colors
                    ...jazerNeonTheme.colors,
                    primary: primary,
                    secondary: secondary,
                    accent: accent,
                    background: overrides.backgroundColor,
                    text: overrides.textColor,
                    palette: baseExtractedTheme.palette, // Keep the full extracted palette
                },
                ...overrides, // Apply specific overrides
            };
            // Dynamically determine isDark if not explicitly overridden
            mergedTheme.isDark = isDarkOverride !== null ? isDarkOverride : getLuminance(mergedTheme.colors.background) < 0.5;
            return normalizeBrandTheme(mergedTheme);
        };

        // Variation 1: Vibrant (similar to original primary theme)
        variations.push(createTheme({
            id: 'vibrant',
            name: 'Vibrant',
            backgroundColor: lightest,
            textColor: darkest,
            primaryColor: primary,
            secondaryColor: secondary,
            accentColor: accent,
            panelColor: primary,
            digitColor: lightest,
        }));

        // Variation 2: Dark Mode
        variations.push(createTheme({
            id: 'dark-mode',
            name: 'Dark Mode',
            backgroundColor: darkest,
            textColor: lightest,
            primaryColor: primary,
            secondaryColor: secondary,
            accentColor: accent,
            panelColor: darkest,
            digitColor: lightest,
        }, true)); // Explicitly set as dark mode

        // Variation 3: Light Mode (subtle version)
        variations.push(createTheme({
            id: 'light-mode',
            name: 'Light Mode',
            backgroundColor: lightest,
            textColor: darkest,
            primaryColor: primary,
            secondaryColor: secondary,
            accentColor: accent,
            panelColor: lightest,
            digitColor: darkest,
        }, false)); // Explicitly set as light mode
        
        return variations;
    };

    const extractColorsAndGenerateThemes = () => {
        if (!imgRef.current) return;

        const colorThief = new ColorThief();
        try {
            const dominantColor = colorThief.getColor(imgRef.current);
            const palette = colorThief.getPalette(imgRef.current, 8);

            if (!dominantColor || !palette || palette.length === 0) {
                setUploading(false);
                setPreview(null);
                return;
            }

            const hexPalette = palette.map(rgb => rgbToHex(rgb[0], rgb[1], rgb[2]));
            const hexDominant = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);

            const baseTheme = {
                ...jazerNeonTheme, // Start with Jazer Neon as base
                primary: hexDominant,
                secondary: hexPalette[1] || hexPalette[0],
                accent: hexPalette[2] || hexPalette[1],
                background: hexPalette[hexPalette.length - 1], // Lightest
                text: hexPalette[0], // Darkest
                palette: hexPalette,
                colors: { // Override specific colors in the colors sub-object
                    ...jazerNeonTheme.colors,
                    primary: hexDominant,
                    secondary: hexPalette[1] || hexPalette[0],
                    accent: hexPalette[2] || hexPalette[1],
                    // Other colors can be mapped here if desired
                }
            };

            const normalizedBaseTheme = normalizeBrandTheme(baseTheme);
            setExtractedTheme(normalizedBaseTheme); // Store the base extracted theme
            setGeneratedThemes(generateThemeVariations(normalizedBaseTheme)); // Generate variations
            setUploading(false);

            onColorsExtracted && onColorsExtracted(normalizedBaseTheme); // Notify parent with base theme
        } catch {
            // Silently fail and reset state
            setUploading(false);
            setPreview(null);
        }
    };

    return (
        <div className="p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg mb-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs uppercase tracking-wider text-purple-300 font-semibold">
                    Brand Logo Color Extraction
                </h4>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
            />

            {!preview ? (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-purple-400/50 rounded-lg hover:border-purple-400 hover:bg-purple-500/10 transition-all flex flex-col items-center gap-2 text-purple-300 hover:text-purple-200">
                    <Upload className="w-8 h-8" />
                    <span className="text-sm font-medium">Upload Brand Logo</span>
                    <span className="text-xs text-purple-400/70">Auto-extract colors for your widget</span>
                </button>
            ) : (
                <div className="space-y-3">
                    <div className="relative">
                        <img
                            ref={imgRef}
                            src={preview}
                            alt="Brand logo"
                            crossOrigin="anonymous" // Required for ColorThief to work with DataURLs or external images
                            onLoad={extractColorsAndGenerateThemes} // Call new function
                            className="w-full h-32 object-contain bg-white/5 rounded-lg"
                        />
                        <button
                            onClick={() => {
                                setPreview(null);
                                setExtractedTheme(null);
                                setGeneratedThemes([]);
                                onLogoUploaded && onLogoUploaded(null);
                                onColorsExtracted && onColorsExtracted(null);
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {uploading && (
                        <div className="flex items-center gap-2 text-purple-300 text-sm">
                            <Loader className="w-4 h-4 animate-spin" />
                            Extracting colors...
                        </div>
                    )}

                    {extractedTheme && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-green-400">
                                <Check className="w-3 h-3" />
                                Colors extracted successfully!
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {extractedTheme.palette.map((color, idx) => (
                                    <div key={idx} className="text-center">
                                        <div
                                            className="w-full h-10 rounded border border-white/20 shadow-lg"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                        <div className="text-[8px] text-white/50 mt-1 font-mono">{color}</div>
                                    </div>
                                ))}
                            </div>
                            
                            {generatedThemes.length > 0 && (
                                <div className="mt-4">
                                    <h5 className="text-xs uppercase tracking-wider text-purple-300 font-semibold mb-2">Theme Variations</h5>
                                    <div className="flex gap-2 justify-center">
                                        {generatedThemes.map(theme => (
                                            <button
                                                key={theme.id}
                                                onClick={() => onColorsExtracted && onColorsExtracted(normalizeBrandTheme(theme))}
                                                className="flex flex-col items-center p-2 rounded-lg border border-purple-500/30 hover:border-purple-500 transition-colors"
                                                title={`Apply ${theme.name} Theme`}
                                            >
                                                <div className="w-12 h-6 rounded-md mb-1" style={{ background: theme.backgroundColor, border: `1px solid ${theme.primaryColor}` }}></div>
                                                <span className="text-[10px] text-white/70">{theme.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Original Apply button, can be kept or removed if variations are sufficient */}
                            {/* <button
                                onClick={() => onColorsExtracted && onColorsExtracted(extractedTheme)}
                                className="w-full mt-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
                                Apply Original Extracted Colors
                            </button> */}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export { BrandLogoUploader };
