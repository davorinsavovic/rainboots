import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export default function useHeaderTheme() {
  const [theme, setTheme] = useState('light');
  const [scrolled, setScrolled] = useState(false);
  const themeRef = useRef(theme);
  const location = useLocation();

  const fallbackBrightnessDetection = useCallback(() => {
    const x = window.innerWidth / 2;
    const y = 80;
    const el = document.elementFromPoint(x, y);
    if (!el) return;

    let currentEl = el;
    let bgColor = null;
    let attempts = 0;

    while (currentEl && attempts < 15) {
      const style = window.getComputedStyle(currentEl);
      bgColor = style.backgroundColor;
      if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') break;
      currentEl = currentEl.parentElement;
      attempts++;
    }

    if (!bgColor) return;
    const rgb = bgColor.match(/\d+/g);
    if (!rgb || rgb.length < 3) return;

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
  }, []);

  const updateThemeBasedOnBackground = useCallback(() => {
    if (window.scrollY > 50) return;

    const headerHeight = 80;
    const sections = document.querySelectorAll('[data-header-theme]');
    let activeTheme = null;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= headerHeight && rect.bottom >= headerHeight) {
        activeTheme = section.dataset.headerTheme;
      }
    });

    if (activeTheme) {
      if (themeRef.current !== activeTheme) {
        themeRef.current = activeTheme;
        setTheme(activeTheme);
      }
      return;
    }

    fallbackBrightnessDetection();
  }, [fallbackBrightnessDetection]);

  // Re-run after every route change, using rAF to wait for paint
  useEffect(() => {
    // Scroll to top first (if you do this on nav), then detect
    // Two rAF calls: first fires before paint, second fires after
    let rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => {
        updateThemeBasedOnBackground();
      });
    });

    return () => cancelAnimationFrame(rafId);
  }, [location.pathname, updateThemeBasedOnBackground]);

  // Scroll + resize listeners (unchanged)
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
      if (!isScrolled) {
        updateThemeBasedOnBackground();
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateThemeBasedOnBackground);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateThemeBasedOnBackground);
    };
  }, [updateThemeBasedOnBackground]);

  return { theme, scrolled };
}
