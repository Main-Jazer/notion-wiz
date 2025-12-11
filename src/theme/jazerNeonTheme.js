// src/theme/jazerNeonTheme.js

const JAZER_BRAND_COLORS = {
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
};

const JAZER_UI_COLORS = {
  deepSpace: '#1A1D29',
  nebulaPurple: '#2D1B4E',
  glass: 'rgba(255, 255, 255, 0.1)',
};

const JAZER_FONTS = {
  heading: '"Orbitron", system-ui, sans-serif',
  body: '"Montserrat", system-ui, sans-serif'
};

const JAZER_FONT_FAMILY = '"Montserrat", system-ui, sans-serif';

const JAZER_SIZES = {
  h1: '64px',
  h2: '40px',
  h3: '28px',
  body: '18px',
  bodyLarge: '20px',
  small: '16px'
};

const JAZER_EFFECTS = {
  letterSpacing: '0.03em',
  letterSpacingLarge: '0.04em',
  glowBlur: '4px',
  glowBlurSubtle: '2px',
  glow: '0 0 4px rgba(139, 92, 246, 0.5)',
  glowStrong: '0 0 8px rgba(139, 92, 246, 0.5)',
};

const JAZER_GRADIENTS = {
  gradient: 'linear-gradient(90deg, #EC4899 0%, #F59E0B 28%, #06B6D4 50%, #3B82F6 74%, #8B5CF6 100%)',
  borderGradient: 'linear-gradient(to right, #EC4899, #3B82F6)',
};

const JAZER_LOGO_PATHS = {
  minWidth: 160,
  minWidthPrint: 30,
  clearSpace: '1em',
  paths: {
    svg: '/images/JaZeR BrandKit_OnSite/Logo_Primary_Full-Color.svg',
    gif: '/images/JaZeR_Logo_OFFICIAL.gif',
    favicon: '/images/JaZeR BrandKit_OnSite/favicon.svg'
  }
};

// Export JAZER_BRAND for direct use in widgets
export const JAZER_BRAND = {
  colors: JAZER_BRAND_COLORS,
  ui: JAZER_UI_COLORS,
  fonts: JAZER_FONTS,
  fontFamily: JAZER_FONT_FAMILY,
  sizes: JAZER_SIZES,
  glowBlur: JAZER_EFFECTS.glowBlur,
  glowBlurSubtle: JAZER_EFFECTS.glowBlurSubtle,
  glow: JAZER_EFFECTS.glow,
  glowStrong: JAZER_EFFECTS.glowStrong,
  gradient: JAZER_GRADIENTS.gradient,
  borderGradient: JAZER_GRADIENTS.borderGradient,
  logo: JAZER_LOGO_PATHS,
};

export const jazerNeonTheme = {
  id: 'jazer-neon',
  name: 'JaZeR Neon',
  colors: JAZER_BRAND_COLORS,
  ui: JAZER_UI_COLORS,
  fonts: JAZER_FONTS,
  fontFamily: JAZER_FONT_FAMILY,
  sizes: JAZER_SIZES,
  effects: JAZER_EFFECTS,
  gradients: JAZER_GRADIENTS,
  logo: JAZER_LOGO_PATHS,
  fontLinks: `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Orbitron:wght@400;700&family=Roboto&family=Open+Sans&display=swap" rel="stylesheet">
  `,
  cssVariables: `:root {
    --jazer-electric-purple: ${JAZER_BRAND_COLORS.electricPurple};
    --jazer-cosmic-blue: ${JAZER_BRAND_COLORS.cosmicBlue};
    --jazer-neon-pink: ${JAZER_BRAND_COLORS.neonPink};
    --jazer-sunburst-gold: ${JAZER_BRAND_COLORS.sunburstGold};
    --jazer-aether-teal: ${JAZER_BRAND_COLORS.aetherTeal};
    --jazer-ultraviolet: ${JAZER_BRAND_COLORS.ultraviolet};
    --jazer-night-black: ${JAZER_BRAND_COLORS.nightBlack};
    --jazer-stardust-white: ${JAZER_BRAND_COLORS.stardustWhite};
    --jazer-graphite: ${JAZER_BRAND_COLORS.graphite};
    --jazer-soft-slate: ${JAZER_BRAND_COLORS.softSlate};
    
    --jazer-glow-blur: ${JAZER_EFFECTS.glowBlur};
    --jazer-glow-purple: ${JAZER_EFFECTS.glow};
  }`,
  extraCSS: `
  body {
    background-color: ${JAZER_BRAND_COLORS.nightBlack};
    color: ${JAZER_BRAND_COLORS.stardustWhite};
    font-family: ${JAZER_FONT_FAMILY};
  }

  .neon-text { 
    font-family: "${JAZER_FONTS.heading}", system-ui, sans-serif; 
    color: ${JAZER_BRAND_COLORS.stardustWhite}; 
    text-shadow: ${JAZER_EFFECTS.glow}; 
    letter-spacing: ${JAZER_EFFECTS.letterSpacing}; 
  }
  .neon-gradient-text { 
    font-family: "${JAZER_FONTS.heading}", system-ui, sans-serif; 
    background: ${JAZER_GRADIENTS.gradient}; 
    -webkit-background-clip: text; 
    background-clip: text; 
    color: transparent; 
    text-shadow: ${JAZER_EFFECTS.glow}; 
    letter-spacing: ${JAZER_EFFECTS.letterSpacing}; 
  }
  h1, h2, h3 { letter-spacing: ${JAZER_EFFECTS.letterSpacing}; font-family: "${JAZER_FONTS.heading}", system-ui, sans-serif; } 
  h1 { font-size: ${JAZER_SIZES.h1}; }
  h2 { font-size: ${JAZER_SIZES.h2}; color: ${JAZER_BRAND_COLORS.electricPurple}; }
  h3 { font-size: ${JAZER_SIZES.h3}; color: ${JAZER_BRAND_COLORS.cosmicBlue}; } 
  
  button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid ${JAZER_BRAND_COLORS.cosmicBlue}; outline-offset: 2px; }
  
  /* Scrollbar */
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: ${JAZER_BRAND_COLORS.nightBlack}; }
  ::-webkit-scrollbar-thumb { background: ${JAZER_BRAND_COLORS.graphite}; border-radius: 5px; border: 1px solid ${JAZER_BRAND_COLORS.nightBlack}; }
  ::-webkit-scrollbar-thumb:hover { background: ${JAZER_BRAND_COLORS.softSlate}; }
  
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes roulette { 
    0% { transform: translateY(-20px); opacity: 0; } 
    100% { transform: translateY(0); opacity: 1; } 
  }
  `
};
