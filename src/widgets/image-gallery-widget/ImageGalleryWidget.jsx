import React, { useState, useEffect, useMemo } from 'react';

export const ImageGalleryWidget = ({ config, onCustomizeRequest }) => {
  const images = (config.images || []).filter(Boolean); // Ensure no empty strings
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [imageError, setImageError] = useState(false);
  const autoplayInterval = useMemo(() => {
    const parsed = parseFloat(config.scrollSpeed);
    const seconds = Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
    return seconds * 1000;
  }, [config.scrollSpeed]);

  // Subscribe to system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemPrefersDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Derive isDark from config and system preference
  const isDark = useMemo(() => {
    if (config.appearanceMode === 'dark') return true;
    if (config.appearanceMode === 'light') return false;
    // system mode
    return systemPrefersDark;
  }, [config.appearanceMode, systemPrefersDark]);

  useEffect(() => {
    let raf = requestAnimationFrame(() => {});
    if (images.length === 0) {
      raf = requestAnimationFrame(() => setCurrentImageIndex(0));
    } else {
      raf = requestAnimationFrame(() => {
        setCurrentImageIndex((prev) => Math.min(prev, images.length - 1));
      });
    }
    return () => cancelAnimationFrame(raf);
  }, [images.length]);

  // Handle autoplay
  useEffect(() => {
    if (config.animateGallerySpeedToggle && images.length > 1) {
      const speedMs = autoplayInterval;
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, speedMs);
      return () => clearInterval(interval);
    }
  }, [config.animateGallerySpeedToggle, images.length, autoplayInterval]);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-neutral-500">
        No images configured. Please add at least one image URL.
      </div>
    );
  }

  const handleNext = () => {
    setImageError(false); // Reset error on navigation
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setImageError(false); // Reset error on navigation
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const currentImage = images[currentImageIndex];

  const arrowColor = isDark ? config.arrowColorDark : config.arrowColorLight;
  const dotsColor = isDark ? config.dotsColorDark : config.dotsColorLight;
  const slideBg = config.transparentBackground ? 'transparent' : config.slideBackgroundColor;
  const boxShadow = config.dropShadows ? '0 4px 8px rgba(0,0,0,0.3)' : 'none';

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" 
      style={{ backgroundColor: slideBg, boxShadow: boxShadow }}
    >
      {/* Image Display */}
      {imageError ? (
        <div className="flex items-center justify-center h-full w-full bg-neutral-200 text-neutral-500">
          Error loading image.
        </div>
      ) : (
        <img
          src={currentImage}
          alt="Gallery Image"
          className="max-w-full max-h-full transition-opacity duration-500"
          style={{ objectFit: config.sizingMode === 'wrap' ? 'unset' : config.sizingMode, height: '100%' }}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      )}

      {/* Navigation Arrows */}
      {config.overlayArrows && images.length > 1 && (
        <>
          <button 
            onClick={handlePrev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white text-2xl"
            style={{ color: arrowColor }}
          >
            &lt;
          </button>
          <button 
            onClick={handleNext} 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white text-2xl"
            style={{ color: arrowColor }}
          >
            &gt;
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {config.dotsIndicator && images.length > 1 && (
        <div className="absolute bottom-4 flex gap-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`block w-3 h-3 rounded-full ${index === currentImageIndex ? 'opacity-100' : 'opacity-50'}`}
              style={{ backgroundColor: dotsColor, cursor: 'pointer' }}
              onClick={() => setCurrentImageIndex(index)}
            ></span>
          ))}
        </div>
      )}

      {/* Customization Button */}
      {config.showCustomizeButton && (
        <button
          className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white"
          onClick={() => onCustomizeRequest?.('imageManagement')}
        >
          Customize
        </button>
      )}
    </div>
  );
};
