/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // JaZeR Brand Color Palette
      colors: {
        jazer: {
          'electric-purple': '#8B5CF6',
          'cosmic-blue': '#3B82F6',
          'neon-pink': '#EC4899',
          'sunburst-gold': '#F59E0B',
          'aether-teal': '#06B6D4',
          'ultraviolet': '#A78BFA',
          'night-black': '#0B0E12',
          'stardust-white': '#F8F9FF',
          'graphite': '#1F2937',
          'soft-slate': '#94A3B8',
        }
      },
      // JaZeR Brand Typography
      fontFamily: {
        'heading': ['"Orbitron"', 'system-ui', 'sans-serif'],
        'body': ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
      // JaZeR Brand Effects
      boxShadow: {
        'neon-purple': '0 0 4px rgba(139, 92, 246, 0.6)',
        'neon-blue': '0 0 4px rgba(59, 130, 246, 0.6)',
        'neon-pink': '0 0 4px rgba(236, 72, 153, 0.6)',
        'neon-gold': '0 0 4px rgba(245, 158, 11, 0.6)',
        'neon-strong': '0 0 8px rgba(139, 92, 246, 0.6)',
      },
      backgroundImage: {
        'jazer-gradient': 'linear-gradient(90deg, #EC4899 0%, #F59E0B 28%, #06B6D4 50%, #3B82F6 74%, #8B5CF6 100%)',
        'jazer-gradient-purple-blue': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
      },
      letterSpacing: {
        'brand': '0.03em',
        'brand-large': '0.04em',
      }
    },
  },
  plugins: [],
}