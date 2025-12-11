// Brand Theme Generator
// Generates multiple preset design patterns from extracted brand colors

/**
 * Converts hex color to RGB
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calculate luminance of a color (0-1)
 */
const getLuminance = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Sort colors by luminance (darkest to lightest)
 */
const sortByLuminance = (colors) => {
  return [...colors].sort((a, b) => getLuminance(a) - getLuminance(b));
};

/**
 * Generate multiple preset patterns from brand colors
 * @param {Object} brandTheme - Theme object from BrandLogoUploader
 * @returns {Array} Array of preset theme objects
 */
export const generateBrandPresets = (brandTheme) => {
  if (!brandTheme || !brandTheme.palette || brandTheme.palette.length < 8) {
    return [];
  }

  const { palette, primary, accent } = brandTheme;
  const sorted = sortByLuminance(palette);
  const darkest = sorted[0];
  const lightest = sorted[sorted.length - 1];
  const midTones = sorted.slice(2, 6);

  const presets = [];

  // 1. Monochromatic Bold - Uses dominant color with light/dark variations
  presets.push({
    id: 'brand-monochrome',
    name: 'Brand Monochrome',
    description: 'Bold monochromatic using your primary brand color',
    backgroundColor: darkest,
    clockColor: primary,
    digitColor: lightest,
    textColor: lightest,
    texture: 'none',
    glow: true,
    category: 'brand'
  });

  // 2. Complementary Contrast - High contrast using opposite palette colors
  presets.push({
    id: 'brand-contrast',
    name: 'Brand Contrast',
    description: 'High contrast complementary colors',
    backgroundColor: sorted[0],
    clockColor: sorted[sorted.length - 2],
    digitColor: sorted[0],
    textColor: sorted[sorted.length - 1],
    texture: 'grid',
    glow: false,
    category: 'brand'
  });

  // 3. Vibrant Gradient - Uses the brightest colors
  presets.push({
    id: 'brand-vibrant',
    name: 'Brand Vibrant',
    description: 'Energetic and colorful',
    backgroundColor: midTones[0] || sorted[2],
    clockColor: palette[1],
    digitColor: lightest,
    textColor: palette[2],
    texture: 'dots',
    glow: true,
    category: 'brand'
  });

  // 4. Professional Subtle - Muted tones for professional look
  presets.push({
    id: 'brand-professional',
    name: 'Brand Professional',
    description: 'Sophisticated and subtle',
    backgroundColor: midTones[2] || sorted[4],
    clockColor: midTones[1] || sorted[3],
    digitColor: lightest,
    textColor: sorted[1],
    texture: 'none',
    glow: false,
    category: 'brand'
  });

  // 5. Dark Mode Optimized - Dark background with brand accents
  presets.push({
    id: 'brand-dark',
    name: 'Brand Dark',
    description: 'Dark theme with brand accents',
    backgroundColor: darkest,
    clockColor: accent,
    digitColor: darkest,
    textColor: midTones[midTones.length - 1] || lightest,
    texture: 'stars',
    glow: true,
    category: 'brand'
  });

  // 6. Light Mode Optimized - Light background with brand colors
  presets.push({
    id: 'brand-light',
    name: 'Brand Light',
    description: 'Clean light theme',
    backgroundColor: lightest,
    clockColor: primary,
    digitColor: lightest,
    textColor: darkest,
    texture: 'none',
    glow: false,
    category: 'brand'
  });

  // 7. Neon Brand - Bright brand colors with glow
  presets.push({
    id: 'brand-neon',
    name: 'Brand Neon',
    description: 'Glowing neon effect',
    backgroundColor: sorted[0],
    clockColor: palette[3],
    digitColor: lightest,
    textColor: palette[4],
    texture: 'noise',
    glow: true,
    category: 'brand'
  });

  // 8. Minimalist Brand - Clean and simple
  presets.push({
    id: 'brand-minimal',
    name: 'Brand Minimal',
    description: 'Clean minimalist design',
    backgroundColor: lightest,
    clockColor: darkest,
    digitColor: lightest,
    textColor: sorted[2],
    texture: 'none',
    glow: false,
    category: 'brand'
  });

  return presets;
};

/**
 * Get all available presets including brand-based ones
 * @param {Object} brandTheme - Optional brand theme object
 * @param {Array} staticPresets - Existing static presets
 * @returns {Array} Combined array of all presets
 */
export const getAllPresets = (brandTheme, staticPresets = []) => {
  const brandPresets = brandTheme ? generateBrandPresets(brandTheme) : [];
  return [...staticPresets, ...brandPresets];
};
