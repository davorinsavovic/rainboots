import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, scroll to that element
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    // Otherwise scroll to top
    else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
