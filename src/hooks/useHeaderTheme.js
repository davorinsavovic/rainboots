import { useEffect, useState, useRef } from 'react';

export default function useHeaderTheme() {
  const [theme, setTheme] = useState('light');
  const [scrolled, setScrolled] = useState(false);
  const themeRef = useRef(theme);
  const scrollTimeoutRef = useRef(null);

  // Track scroll state with debounce for better performance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Force theme update when scrolling back to top
      if (window.scrollY <= 50) {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          updateThemeBasedOnBackground();
        }, 50);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [scrolled]);

  const fallbackBrightnessDetection = () => {
    const headerHeight = 80;
    const x = window.innerWidth / 2;
    const y = headerHeight;

    const el = document.elementFromPoint(x, y);
    if (!el) return;

    let currentEl = el;
    let bgColor = null;
    let attempts = 0;

    while (currentEl && attempts < 15) {
      const style = window.getComputedStyle(currentEl);
      bgColor = style.backgroundColor;

      if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        break;
      }

      currentEl = currentEl.parentElement;
      attempts++;
    }

    if (bgColor) {
      const rgb = bgColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const brightness =
          (parseInt(rgb[0]) * 299 +
            parseInt(rgb[1]) * 587 +
            parseInt(rgb[2]) * 114) /
          1000;

        const newTheme = brightness < 140 ? 'dark' : 'light';

        if (themeRef.current !== newTheme) {
          themeRef.current = newTheme;
          setTheme(newTheme);
        }
      }
    }
  };

  const updateThemeBasedOnBackground = () => {
    if (window.scrollY > 50) return;

    const headerHeight = 80;

    // Get all sections that can control header theme
    const sections = document.querySelectorAll('[data-header-theme]');

    let activeTheme = null;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();

      // Check if section is under header area
      if (rect.top <= headerHeight && rect.bottom >= headerHeight) {
        activeTheme = section.dataset.headerTheme;
      }
    });

    if (activeTheme && themeRef.current !== activeTheme) {
      themeRef.current = activeTheme;
      setTheme(activeTheme);
      return;
    }

    // Fallback to brightness detection ONLY if no section found
    fallbackBrightnessDetection();
  };

  // Update theme on mount and when dependencies change
  useEffect(() => {
    updateThemeBasedOnBackground();

    window.addEventListener('resize', updateThemeBasedOnBackground);
    window.addEventListener('load', updateThemeBasedOnBackground);
    // Also update on any scroll that might change background elements
    window.addEventListener('scroll', updateThemeBasedOnBackground);

    return () => {
      window.removeEventListener('resize', updateThemeBasedOnBackground);
      window.removeEventListener('load', updateThemeBasedOnBackground);
    };
  }, []);

  return { theme, scrolled };
}
