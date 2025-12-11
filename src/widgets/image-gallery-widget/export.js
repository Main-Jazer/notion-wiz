// JAZER_BRAND constants
import { jazerNeonTheme } from '../../theme/jazerNeonTheme'; // Import jazerNeonTheme

// Copied from App.jsx to satisfy dependency without modifying App.jsx
const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
};

export const generateHTML = (config) => {
  const images = config.images.filter(Boolean);
  if (images.length === 0) {
    return `<div style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; color: ${jazerNeonTheme.colors.softSlate};">No images configured.</div>`;
  }

  const arrowColor = config.appearanceMode === 'dark' ? config.arrowColorDark : config.arrowColorLight;
  const dotsColor = config.appearanceMode === 'dark' ? config.dotsColorDark : config.dotsColorLight;
  const slideBg = config.transparentBackground ? 'transparent' : config.slideBackgroundColor;
  const boxShadow = config.dropShadows ? '0 4px 8px rgba(0,0,0,0.3)' : 'none';

  const scrollSpeedMs = parseFloat(config.scrollSpeed) * 1000;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Gallery Widget</title>
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        .gallery-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${slideBg};
            box-shadow: ${boxShadow};
            overflow: hidden;
        }
        .gallery-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: ${config.sizingMode === 'wrap' ? 'unset' : config.sizingMode};
            display: none; /* Controlled by JS */
            transition: opacity 0.5s ease-in-out;
            position: absolute;
            height: 100%;
        }
        .gallery-image.active { display: block; opacity: 1; }
        .gallery-nav-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(0,0,0,0.5);
            color: ${arrowColor};
            padding: 8px 12px;
            border-radius: 9999px;
            cursor: pointer;
            font-size: 1.5rem;
            line-height: 1;
            border: none;
            z-index: 10;
        }
        .gallery-nav-arrow.left { left: 1rem; }
        .gallery-nav-arrow.right { right: 1rem; }
        .gallery-dots {
            position: absolute;
            bottom: 1rem;
            display: flex;
            gap: 0.5rem;
            z-index: 10;
        }
        .gallery-dot {
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 9999px;
            background-color: ${dotsColor};
            opacity: 0.5;
            cursor: pointer;
        }
        .gallery-dot.active { opacity: 1; }
    </style>
</head>
<body>
    <div class="gallery-container">
        ${images.map((src, index) => `<img src="${escapeHTML(src)}" class="gallery-image ${index === 0 ? 'active' : ''}" alt="Gallery Image ${index + 1}">`).join('')}
        
        ${config.overlayArrows && images.length > 1 ? `
          <button class="gallery-nav-arrow left" onclick="prevImage()">\u003c/button>
          <button class="gallery-nav-arrow right" onclick="nextImage()">\u003e</button>
        ` : ''}

        ${config.dotsIndicator && images.length > 1 ? `
          <div class="gallery-dots">
            ${images.map((_, index) => `<span class="gallery-dot ${index === 0 ? 'active' : ''}" onclick="goToImage(${index})"></span>`).join('')}
          </div>
        ` : ''}
    </div>
    <script>
        const images = ${JSON.stringify(images)};
        let currentIndex = 0;
        const galleryImages = document.querySelectorAll('.gallery-image');
        const galleryDots = document.querySelectorAll('.gallery-dot');
        const animateGallery = ${config.animateGallerySpeedToggle};
        const scrollSpeed = ${scrollSpeedMs};
        let intervalId;

        function updateGallery() {
            galleryImages.forEach((img, idx) => {
                img.classList.toggle('active', idx === currentIndex);
            });
            galleryDots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            updateGallery();
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateGallery();
        }

        function goToImage(index) {
            currentIndex = index;
            updateGallery();
        }

        if (animateGallery && images.length > 1) {
            intervalId = setInterval(nextImage, scrollSpeed);
        }

        // Initial display
        updateGallery();

        // Clear interval on window unload to prevent memory leaks (important for iframes)
        window.addEventListener('beforeunload', () => {
          if (intervalId) clearInterval(intervalId);
        });
    </script>
</body>
</html>`;
};

export const generateScript = () => {
  // The actual script is embedded directly in generateImageGalleryHTML for simplicity
  // For external script, the logic would be similar but wrapped in a function/IIFE
  return ''; 
};