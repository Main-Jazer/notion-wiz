// Copied from App.jsx to satisfy dependency without modifying App.jsx
const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
};

export const generateHTML = (config) => {
  const iconMap = {
    plusMinus: { increment: '+', decrement: '-' },
    arrows: { increment: '↑', decrement: '↓' }
  };
  const icons = iconMap[config.preferredIcons] || iconMap.plusMinus;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(config.counterTitle)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      background: ${config.transparentBg ? 'transparent' : config.backgroundColor};
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .counter-container {
      text-align: ${config.centerText ? 'center' : 'left'};
      color: ${config.textColorLight};
      padding: ${config.counterSize === 'small' ? '1rem' : config.counterSize === 'large' ? '2rem' : config.counterSize === 'xlarge' ? '2.5rem' : '1.5rem'};
    }
    .counter-title {
      font-size: ${config.counterSize === 'small' ? '0.875rem' : config.counterSize === 'large' ? '1.125rem' : config.counterSize === 'xlarge' ? '1.25rem' : '1rem'};
      font-weight: bold;
      margin-bottom: 1rem;
      text-shadow: ${config.textShadows ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none'};
    }
    .counter-value {
      font-size: ${config.counterSize === 'small' ? '2.25rem' : config.counterSize === 'large' ? '6rem' : config.counterSize === 'xlarge' ? '8rem' : '3.75rem'};
      font-weight: bold;
      margin-bottom: 1.5rem;
      text-shadow: ${config.textShadows ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none'};
    }
    .counter-buttons {
      display: flex;
      gap: 1rem;
      justify-content: ${config.centerText ? 'center' : 'flex-start'};
    }
    button {
      font-size: ${config.counterSize === 'small' ? '1.5rem' : config.counterSize === 'large' ? '2.25rem' : config.counterSize === 'xlarge' ? '3rem' : '1.875rem'};
      padding: ${config.counterSize === 'small' ? '0.25rem 0.75rem' : config.counterSize === 'large' ? '0.5rem 1.25rem' : config.counterSize === 'xlarge' ? '0.75rem 1.5rem' : '0.5rem 1rem'};
      border-radius: 0.5rem;
      border: 2px solid currentColor;
      background: rgba(0,0,0,0.1);
      cursor: pointer;
      transition: opacity 0.2s;
    }
    button:hover { opacity: 0.8; }
    button.reset {
      font-size: 0.875rem;
      border-width: 1px;
      background: rgba(0,0,0,0.05);
    }
    @media (prefers-color-scheme: dark) {
      .counter-container { color: ${config.textColorDark}; }
      button { background: rgba(255,255,255,0.2); }
      button.reset { background: rgba(255,255,255,0.1); }
    }
  </style>
</head>
<body>
  <div class="counter-container">
    <div class="counter-title">${escapeHTML(config.counterTitle)}</div>
    <div class="counter-value" id="count">0</div>
    <div class="counter-buttons">
      <button onclick="changeCount(-1)">${icons.decrement}</button>
      <button onclick="changeCount(1)">${icons.increment}</button>
      ${!config.hideResetButton ? '<button class="reset" onclick="resetCount()">Reset</button>' : ''}
    </div>
  </div>
  <script>
    let count = parseInt(localStorage.getItem('counter_value') || '0');
    document.getElementById('count').textContent = count;
    
    function changeCount(delta) {
      count += delta;
      document.getElementById('count').textContent = count;
      localStorage.setItem('counter_value', count);
    }
    
    function resetCount() {
      count = 0;
      document.getElementById('count').textContent = count;
      localStorage.setItem('counter_value', count);
    }
  </script>
</body>
</html>`;
};

export const generateScript = () => '';
