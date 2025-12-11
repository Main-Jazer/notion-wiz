// Countdown Widget HTML and Script Export
// Generates standalone HTML with embedded JAZER_BRAND styles

import { jazerNeonTheme } from '../../theme/jazerNeonTheme'; // Import jazerNeonTheme

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

export const generateHTML = (config) => {
  const isDark = config.appearance === 'dark';
  const colors = isDark ? config.darkMode : config.lightMode;
  const bgColor = config.useTransparentBg ? 'transparent' : (isDark ? jazerNeonTheme.colors.nightBlack : jazerNeonTheme.colors.stardustWhite);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Countdown - ${escapeHTML(config.eventTitle)}</title>
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
      background: ${bgColor};
      color: ${colors.textColor};
      font-family: ${jazerNeonTheme.fonts.body};
      display: flex;
      flex-direction: column;
      align-items: ${config.textAlign === 'left' ? 'flex-start' : config.textAlign === 'right' ? 'flex-end' : 'center'};
      justify-content: center;
      padding: 32px;
      text-align: ${config.textAlign};
    }

    #event-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 24px;
      ${config.textShadows ? `text-shadow: 0 0 ${jazerNeonTheme.effects.glowBlur} rgba(0,0,0,0.1);` : ''}
    }

    #countdown-display {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .countdown-unit {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 8px;
    }

    .countdown-digit {
      background: ${colors.panelColor};
      color: ${colors.digitColor};
      font-size: 2.5rem;
      padding: 12px 20px;
      border-radius: 8px;
      min-width: 80px;
      text-align: center;
      font-weight: bold;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      position: relative;
      ${config.textShadows ? `text-shadow: 0 0 ${jazerNeonTheme.effects.glowBlur} rgba(0,0,0,0.3);` : ''}
    }

    .countdown-digit::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 2px;
      background: rgba(0,0,0,0.1);
    }

    .countdown-label {
      font-size: 0.75rem;
      margin-top: 8px;
      opacity: 0.7;
      text-transform: uppercase;
      font-weight: bold;
      letter-spacing: 0.05em;
    }

    #label {
      margin-top: 16px;
      font-size: 0.875rem;
      opacity: 0.6;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    #confetti-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }

    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(360deg);
      }
    }

    @media (prefers-color-scheme: dark) {
      ${config.appearance === 'system' ? `
        body {
          background: ${config.useTransparentBg ? 'transparent' : config.darkMode.backgroundColor};
          color: ${config.darkMode.textColor};
        }
        .countdown-digit {
          background: ${config.darkMode.panelColor};
          color: ${config.darkMode.digitColor};
        }
      ` : ''}
    }
  </style>
</head>
<body>
  <h2 id="event-title">${escapeHTML(config.eventTitle)}</h2>
  <div id="countdown-display"></div>
  ${config.showToGoLabel ? '<div id="label"></div>' : ''}
  <div id="confetti-container"></div>

  <script>
    ${generateScript(config)}
  </script>
</body>
</html>`;
};

export const generateScript = (config) => {
  const isDark = config.appearance === 'dark';
  const colors = isDark ? config.darkMode : config.lightMode;

  return `
    const config = ${JSON.stringify(config)};
    const colors = ${JSON.stringify(colors)};
    const JAZER_BRAND_COLORS = ${JSON.stringify(jazerNeonTheme.colors)};

    let confettiActive = false;
    let confettiStartTime = null;

    function calculateTimeLeft() {
      const now = new Date();
      const target = new Date(config.targetDate);
      const diff = target - now;

      if (diff <= 0) {
        if (config.stopAtZero) {
          triggerConfetti();
          return { finished: true };
        }
        return calculateUnits(Math.abs(diff), true);
      }

      return calculateUnits(diff, false);
    }

    function calculateUnits(ms, isPast) {
      const s = Math.floor(ms / 1000);
      const m = Math.floor(s / 60);
      const h = Math.floor(m / 60);
      const d = Math.floor(h / 24);

      return {
        finished: false,
        isPast,
        days: d,
        hours: h % 24,
        minutes: m % 60,
        seconds: s % 60
      };
    }

    function triggerConfetti() {
      if (confettiActive || config.confettiDuration === 'never') return;
      confettiActive = true;
      confettiStartTime = Date.now();

      const container = document.getElementById('confetti-container');
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = \`
          position: absolute;
          left: \${Math.random() * 100}%;
          top: -10px;
          width: 10px;
          height: 10px;
          background: \${Object.values(JAZER_BRAND_COLORS)[i % Object.values(JAZER_BRAND_COLORS).length]};
          animation: fall \${2 + Math.random() * 3}s linear infinite;
          opacity: 0.8;
          border-radius: 2px;
        \`;
        container.appendChild(confetti);
      }

      const durations = { '1min': 60000, '5min': 300000, '10min': 600000, '1hour': 3600000 };
      if (config.confettiDuration !== 'forever') {
        setTimeout(() => {
          container.innerHTML = '';
          confettiActive = false;
        }, durations[config.confettiDuration]);
      }
    }

    function updateCountdown() {
      const timeLeft = calculateTimeLeft();
      const display = document.getElementById('countdown-display');

      if (timeLeft.finished) {
        display.innerHTML = '<div style="font-size: 2rem; font-weight: bold;">🎉 Event Started!</div>';
        return;
      }

      const units = [];
      if (config.showDay) units.push({ value: timeLeft.days, label: 'Days' });
      if (config.showHour) units.push({ value: timeLeft.hours, label: 'Hours' });
      if (config.showMinute) units.push({ value: timeLeft.minutes, label: 'Min' });
      if (config.showSecond) units.push({ value: timeLeft.seconds, label: 'Sec' });

      display.innerHTML = units.map(u => \`
        <div class="countdown-unit">
          <div class="countdown-digit">\${String(u.value).padStart(2, '0')}</div>
          <span class="countdown-label">\${u.label}</span>
        </div>
      \`).join('');

      if (config.showToGoLabel) {
        document.getElementById('label').textContent = timeLeft.isPast ? 'Ago' : 'To Go';
      }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
  `;
};
