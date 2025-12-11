# JaZeR Notion Widget Builder 🚀  
Widget builder for beautiful, fully custom Notion embeds

Build clean, highly customizable widgets for your Notion workspace. Design clocks, countdowns, weather panels, image galleries, and more using a visual builder with optional JaZeR presets.

> **Brand-Compliant. Vite. React 19. TailwindCSS.**

---

## ✨ Core Features

- 🎨 **8 Widget Types**  
  Clock, Countdown, Counter, Weather, Image Gallery, Quotes, Life Progress, Button Generator

- ⚡ **Visual Builder**  
  Live preview with real-time customization and a resizable canvas

- 🌈 **Theme & Brand System**  
  Start from JaZeR’s cyberpunk presets or create your own minimal, pastel, dark, or bold themes from scratch

- 📦 **Export-Ready Output**  
  Generate standalone HTML files ready to be embedded in Notion

- 🎯 **Deep Customization**  
  Colors, fonts, sizes, spacing, animations, and widget-specific behavior

- 📱 **Responsive by Design**  
  Works smoothly on desktop, tablet, and mobile

- ♿ **Accessible**  
  WCAG AA-conscious design with proper contrast and focus states

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Move into the client app directory
cd notion-widget-builder-version2/notion-widget-builder-version2.client

# Install dependencies
npm install

# Start the development server
npm run dev
Build for Production
bash
Copy code
# Create a production build
npm run build

# Preview the production build
npm run preview
📦 Available Widgets
Clock
Analog, digital, and flip variants with full control over color, typography, and layout.

Countdown
Track launches, deadlines, and events with flexible display formats.

Counter
Increment/decrement counters for habits, metrics, and goals.

Weather
Show current conditions and multi-day forecasts in a compact or full layout.

Image Gallery
Grids, carousels, and hero-style galleries for showcasing visuals.

Quotes
Rotating or static quotes for inspiration, affirmations, or reminders.

Life Progress
Progress bars for year, quarter, projects, or custom milestones.

Button Generator
Build reusable, styled CTA buttons for linking out from Notion.

🎯 Using Widgets in Notion
1. Build Your Widget
Choose a widget type from the landing page.

Adjust theme, colors, fonts, and component settings in the configuration panel.

Preview all changes in real time in the live canvas.

2. Export
Click “Get Code”.

Download the generated HTML file or copy the code snippet.

Deploy or host the file using one of the deployment options below.

3. Embed in Notion
In your Notion page, type /embed.

Paste the URL of your hosted widget.

Resize the embed block to fit your layout.

🌐 Deployment Options
Vercel (Recommended)
bash
Copy code
npm i -g vercel
npm run build
vercel --prod
Netlify
Connect your repository to Netlify.

Set Build command: npm run build

Set Publish directory: dist

GitHub Pages
Build the project:

bash
Copy code
npm run build
Deploy the dist folder to a gh-pages branch.

🛠️ Tech Stack
Frontend: React 19.2.0

Build Tool: Vite (rolldown-vite 7.2.5)

Styling: TailwindCSS 4.1.17

Icons: Lucide React 0.554.0

🧪 Development Scripts
bash
Copy code
# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
🎨 JaZeR Brand Presets
The app ships with first-class support for the official JaZeR brand system as an optional preset you can apply or remix.

Color Palette (10 Colors)
Primary:
Electric Purple #8B5CF6, Cosmic Blue #3B82F6

Accent:
Neon Pink #EC4899, Sunburst Gold #F59E0B

Support:
Aether Teal #06B6D4, Ultraviolet #A78BFA

Neutrals:
Night Black #0B0E12, Stardust White #F8F9FF,
Graphite #1F2937, Soft Slate #94A3B8

Typography
Headings: Orbitron (400, 700), ~3% letter-spacing

Body: Montserrat (400, 500, 700)

Visual Effects
Neon-friendly shadows and glows

Gradient utilities (full spectrum and purple–blue)

Logo usage rules (minimum width 160px, clear space)

📚 For full details, see:

BRAND_GUIDELINES.md – complete brand specs

BRAND_IMPLEMENTATION_SUMMARY.md – how they’re applied here

🧩 Using Brand Elements in Code
jsx
Copy code
// Tailwind utility usage with JaZeR preset
<h1 className="font-heading text-6xl bg-jazer-gradient-purple-blue">
  JaZeR Notion Widget Builder
</h1>

<button className="bg-jazer-electric-purple shadow-neon-purple">
  Launch Builder
</button>
jsx
Copy code
// CSS variables
<div style={{ color: 'var(--jazer-cosmic-blue)' }}>
  Custom theme powered by JaZeR presets.
</div>
jsx
Copy code
// JavaScript constants
import { JAZER_BRAND } from './App.jsx';

const color = JAZER_BRAND.colors.electricPurple;
📄 License
[Your License Here]

👤 Author
JaZeR — Creative Systems, UI, & Innovation

📚 Additional Documentation
BRAND_GUIDELINES.md – Full brand specifications

BRAND_IMPLEMENTATION_SUMMARY.md – Implementation overview

FEATURE_VALIDATION_REPORT.md – Feature documentation

IMPROVEMENTS_APPLIED.md – Changelog

🤝 Contributing
Contributions, issues, and feature requests are welcome.

Please ensure all pull requests and new components either:

Use the JaZeR brand presets correctly, or

Are theme-agnostic and compatible with the existing customization system.

Copy code
