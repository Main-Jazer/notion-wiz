// Quotes Widget HTML and Script Export
// Generates standalone HTML with embedded JAZER_BRAND styles

import { jazerNeonTheme } from '../../theme/jazerNeonTheme';

const theme = jazerNeonTheme;

const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
};

const getFontFamily = (fontType) => {
  const fontMap = {
    body: theme.fonts.body,
    heading: theme.fonts.heading,
    serif: 'ui-serif, Georgia, serif',
    mono: 'ui-monospace, "Courier New", monospace'
  };
  return fontMap[fontType] || theme.fonts.body;
};

export const generateHTML = (config) => {
  const isDark = config.appearanceMode === 'dark';
  const textColor = isDark ? config.textColorDark : config.textColorLight;
  const quoteBackground = isDark ? config.quoteBackgroundDark : config.quoteBackgroundLight;
  const bgColor = config.useTransparentBackground
    ? 'transparent'
    : (config.setBackgroundColor ? config.backgroundColor : quoteBackground);

  const textShadow = config.textShadows ? '0 2px 4px rgba(0,0,0,0.1)' : 'none';

  const quoteTextStyle = `
    font-size: ${config.fontSize}px;
    font-family: ${getFontFamily(config.quoteTextFont)};
    font-style: italic;
    line-height: 1.6;
    text-shadow: ${textShadow};
    ${config.gradientQuoteText ? `
      background: ${theme.gradients.gradient};
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    ` : `color: ${textColor};`}
  `;

  const quoteCardStyle = `
    background: ${bgColor};
    color: ${textColor};
    text-align: ${config.textAlign};
    padding: 48px;
    border-radius: 16px;
    max-width: 768px;
    width: 100%;
    ${config.gradientQuoteCardBorder ? `
      border: 2px solid transparent;
      background-image: ${theme.gradients.gradient}, ${bgColor};
      background-origin: border-box;
      background-clip: padding-box, border-box;
    ` : ''}
    ${config.glowQuoteCard ? `box-shadow: ${theme.effects.glow};` : ''}
  `;

  const refreshButtonStyle = `
    margin-top: 16px;
    padding: 12px;
    border-radius: 50%;
    background-color: ${config.useGradientRefreshIcon ? 'transparent' : `${config.refreshIconColor}20`};
    border: ${config.useGradientRefreshIcon ? `2px solid ${config.refreshIconColor}` : 'none'};
    color: ${config.refreshIconColor};
    cursor: pointer;
    transition: all 0.3s ease;
    ${config.useGradientRefreshIcon ? `
      background: ${theme.gradients.gradient};
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    ` : ''}
  `;

  const instagramSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`;
  const refreshSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.79 2.8L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.79-2.8L21 16"/><path d="M21 21v-5h-5"/></svg>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(config.author)} - Quote Widget</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${bgColor};
      font-family: ${theme.fonts.body};
      padding: 32px;
    }

    .quote-card {
      ${quoteCardStyle}
    }

    .quote-text {
      ${quoteTextStyle}
      margin-bottom: 24px;
    }

    .attribution {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .author {
      font-family: ${getFontFamily(config.attributionFont)};
      color: ${config.authorColor};
      font-size: 14px;
      font-weight: bold;
      opacity: 0.7;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: ${textShadow};
    }

    .instagram-link {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      opacity: 0.5;
      color: ${textColor};
      text-decoration: none;
      transition: opacity 0.3s ease;
    }

    .instagram-link:hover {
      opacity: 1;
      text-decoration: underline;
    }

    .refresh-button {
      ${refreshButtonStyle}
      display: block;
      margin-left: auto;
      margin-right: auto;
    }

    .refresh-button:hover {
      transform: scale(1.1);
      ${config.glowRefreshIconHover ? `filter: drop-shadow(${theme.effects.glow});` : ''}
    }

    .refresh-button:active {
      transform: scale(0.95);
    }

    .customize-button {
      position: absolute;
      bottom: 16px;
      right: 16px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      background-color: ${theme.colors.cosmicBlue};
      color: ${theme.colors.stardustWhite};
      font-family: ${theme.fonts.heading};
      border: none;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .customize-button:hover {
      transform: scale(1.05);
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .loading {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(4px);
      border-radius: 16px;
      z-index: 10;
    }

    .loading-text {
      font-size: 20px;
      font-weight: bold;
      font-family: ${theme.fonts.heading};
    }

    @media (prefers-color-scheme: dark) {
      ${config.appearanceMode === 'system' ? `
        body { background: ${config.quoteBackgroundDark}; }
        .quote-card { background: ${config.quoteBackgroundDark}; color: ${config.textColorDark}; }
        .instagram-link { color: ${config.textColorDark}; }
      ` : ''}
    }
  </style>
</head>
<body>
  <div class="quote-card" id="quote-card">
    <div id="loading" class="loading" style="display: none;">
      <span class="loading-text">Loading...</span>
    </div>

    <p class="quote-text" id="quote-text">
      "${escapeHTML(config.quoteText)}"
    </p>

    <div class="attribution">
      <span class="author" id="author">
        — ${escapeHTML(config.author)}
      </span>

      ${config.instagramAccount ? `
        <a href="https://www.instagram.com/${escapeHTML(config.instagramAccount)}"
           target="_blank"
           rel="noopener noreferrer"
           class="instagram-link">
          ${instagramSVG}
          @${escapeHTML(config.instagramAccount)}
        </a>
      ` : ''}
    </div>

    ${config.showRefreshIcon ? `
      <button class="refresh-button" id="refresh-btn" onclick="fetchQuote()">
        ${refreshSVG}
      </button>
    ` : ''}
  </div>

  ${config.showCustomizeButton ? `
    <button class="customize-button">
      Customize
    </button>
  ` : ''}

  <script>
    ${generateScript(config)}
  </script>
</body>
</html>`;
};

export const generateScript = () => {
  return `
    const exampleQuotes = [
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
      { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
      { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
      { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" }
    ];

    function fetchQuote() {
      const loading = document.getElementById('loading');
      const quoteText = document.getElementById('quote-text');
      const author = document.getElementById('author');

      loading.style.display = 'flex';

      setTimeout(() => {
        const randomQuote = exampleQuotes[Math.floor(Math.random() * exampleQuotes.length)];
        quoteText.textContent = '"' + randomQuote.text + '"';
        author.textContent = '— ' + randomQuote.author;
        loading.style.display = 'none';
      }, 500);
    }
  `;
};
