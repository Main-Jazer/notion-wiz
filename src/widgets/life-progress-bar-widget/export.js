// Life Progress Widget HTML and Script Export
// Generates standalone HTML with embedded JAZER_BRAND styles

import { jazerNeonTheme } from '../../theme/jazerNeonTheme'; // Import jazerNeonTheme


export const generateHTML = (config) => {
  const isDark = config.appearanceMode === 'dark';
  const textColor = isDark ? config.textColorDark : config.textColorLight;
  const barColor = isDark ? config.barColorDark : config.barColorLight;
  const barBackground = isDark ? config.barBackgroundDark : config.barBackgroundLight;
  const bgColor = config.useTransparentBackground
    ? 'transparent'
    : (config.setBackgroundColor ? config.backgroundColor : (isDark ? jazerNeonTheme.colors.nightBlack : jazerNeonTheme.colors.stardustWhite));

  const barHeightMap = {
    small: 16,
    medium: 24,
    large: 32
  };
  const barHeightPx = barHeightMap[config.barHeight] || barHeightMap.medium;

  const progressBars = [];
  if (config.showYear) progressBars.push({ id: 'year', label: 'Year' });
  if (config.showMonth) progressBars.push({ id: 'month', label: 'Month' });
  if (config.showWeek) progressBars.push({ id: 'week', label: 'Week' });
  if (config.showDay) progressBars.push({ id: 'day', label: 'Day' });
  if (config.showLifetime) progressBars.push({ id: 'lifetime', label: 'Lifetime' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Life Progress Widget</title>
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
      color: ${textColor};
      font-family: ${jazerNeonTheme.fonts.body};
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container {
      max-width: 600px;
      width: 100%;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .title {
      font-size: 24px;
      font-weight: bold;
      font-family: ${jazerNeonTheme.fonts.heading};
    }

    .progress-item {
      margin-bottom: 16px;
    }

    .progress-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
    }

    .progress-value {
      font-size: 12px;
      opacity: 0.7;
      font-family: ${jazerNeonTheme.fonts.heading};
    }

    .progress-bar {
      width: 100%;
      height: ${barHeightPx}px;
      background-color: ${barBackground};
      border-radius: 9999px;
      overflow: hidden;
      position: relative;
      ${config.dropShadows ? 'box-shadow: 0 2px 4px rgba(0,0,0,0.1);' : ''}
    }

    .progress-fill {
      height: 100%;
      background: ${config.useGradientBars ? jazerNeonTheme.gradients.gradient : barColor};
      border-radius: 9999px;
      transition: width 0.5s ease;
      ${config.useGlowEffect ? `box-shadow: ${jazerNeonTheme.effects.glow};` : ''}
    }

    .footer {
      margin-top: 24px;
      text-align: center;
      font-size: 14px;
      opacity: 0.6;
    }

    .customize-button {
      position: absolute;
      bottom: 16px;
      right: 16px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      background-color: ${jazerNeonTheme.colors.cosmicBlue};
      color: ${jazerNeonTheme.colors.stardustWhite};
      font-family: ${jazerNeonTheme.fonts.heading};
      border: none;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .customize-button:hover {
      transform: scale(1.05);
    }

    @media (prefers-color-scheme: dark) {
      ${config.appearanceMode === 'system' ? `
        body {
          background: ${config.useTransparentBackground ? 'transparent' : (config.setBackgroundColor ? config.backgroundColor : jazerNeonTheme.colors.nightBlack)};
          color: ${config.textColorDark};
        }
        .progress-bar {
          background-color: ${config.barBackgroundDark};
        }
        .progress-fill {
          background: ${config.useGradientBars ? jazerNeonTheme.gradients.gradient : config.barColorDark};
        }
      ` : ''}
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
      </svg>
      <h1 class="title">Life Progress</h1>
    </div>

    ${progressBars.map(bar => `
      <div class="progress-item">
        <div class="progress-label">
          <span>${bar.label}</span>
          <span class="progress-value" id="${bar.id}-value">0.0%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" id="${bar.id}-fill" style="width: 0%"></div>
        </div>
      </div>
    `).join('')}

    ${config.showLifetime ? `
      <div class="footer">
        Based on life expectancy of ${config.lifeExpectancy} years
      </div>
    ` : ''}
  </div>

  ${config.showCustomizeButton ? '<button class="customize-button">Customize</button>' : ''}

  <script>
    ${generateScript(config)}
  </script>
</body>
</html>`;
};

export const generateScript = (config) => {
  return `
    function calculateProgress() {
      const now = new Date();

      // Year progress
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
      const yearProgress = ((now - yearStart) / (yearEnd - yearStart)) * 100;

      // Month progress
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const monthProgress = ((now - monthStart) / (monthEnd - monthStart)) * 100;

      // Week progress
      const dayOfWeek = now.getDay();
      const hourOfDay = now.getHours();
      const minuteOfHour = now.getMinutes();
      const totalWeekMinutes = 7 * 24 * 60;
      const passedWeekMinutes = dayOfWeek * 24 * 60 + hourOfDay * 60 + minuteOfHour;
      const weekProgress = (passedWeekMinutes / totalWeekMinutes) * 100;

      // Day progress
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const dayProgress = ((now - dayStart) / (dayEnd - dayStart)) * 100;

      // Lifetime progress
      const birthDate = new Date('${config.birthDate}');
      const lifeExpectancyMs = ${config.lifeExpectancy} * 365.25 * 24 * 60 * 60 * 1000;
      const lifeProgress = ((now - birthDate) / lifeExpectancyMs) * 100;

      // Update UI
      ${config.showYear ? `
        updateProgress('year', Math.min(yearProgress, 100));
      ` : ''}
      ${config.showMonth ? `
        updateProgress('month', Math.min(monthProgress, 100));
      ` : ''}
      ${config.showWeek ? `
        updateProgress('week', Math.min(weekProgress, 100));
      ` : ''}
      ${config.showDay ? `
        updateProgress('day', Math.min(dayProgress, 100));
      ` : ''}
      ${config.showLifetime ? `
        updateProgress('lifetime', Math.min(lifeProgress, 100));
      ` : ''}
    }

    function updateProgress(id, percentage) {
      const fillEl = document.getElementById(id + '-fill');
      const valueEl = document.getElementById(id + '-value');
      if (fillEl) fillEl.style.width = percentage + '%';
      if (valueEl) valueEl.textContent = percentage.toFixed(1) + '%';
    }

    // Initial calculation
    calculateProgress();

    // Update every minute
    setInterval(calculateProgress, 60000);
  `;
};
