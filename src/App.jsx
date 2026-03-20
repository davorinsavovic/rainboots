import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Outbound from './pages/Outbound';
import WebDevelopment from './pages/WebDevelopment';
import CustomerAcquisition from './pages/CustomerAcquisition';
import LifecycleStrategy from './pages/LifecycleStrategy';
import SocialMedia from './pages/SocialMedia';
import BrandIdentity from './pages/BrandIdentity';
import Portfolio from './pages/Portfolio';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import BlogGenerator from './blogGenerator';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [animationState, setAnimationState] = useState(null);
  const [hasAnimationPlayed, setHasAnimationPlayed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // If mobile, never show splash screen
      if (mobile) {
        setShowSplash(false);
        sessionStorage.setItem('splashShown', 'true');
      }
    };

    // Check on initial load
    checkMobile();

    // Check on resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Only check sessionStorage if not mobile
    if (!isMobile) {
      const splashShown = sessionStorage.getItem('splashShown');
      const animationPlayed = sessionStorage.getItem('animationPlayed');

      if (splashShown) {
        setShowSplash(false);
      }

      if (animationPlayed) {
        setHasAnimationPlayed(true);
      }
    }
  }, [isMobile]);

  const handleSplashClose = (savedState) => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');

    if (savedState) {
      setAnimationState(savedState);
    }
  };

  const handleAnimationPlayed = () => {
    setHasAnimationPlayed(true);
    sessionStorage.setItem('animationPlayed', 'true');
  };

  // If mobile, never show splash screen
  if (isMobile) {
    return (
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route
            path='/'
            element={
              <Home
                initialAnimationState={null}
                hasAnimationPlayed={true} // Treat as played on mobile
                onAnimationPlayed={handleAnimationPlayed}
              />
            }
          />
          <Route path='/services' element={<Services />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/outbound' element={<Outbound />} />
          <Route path='/web-development' element={<WebDevelopment />} />
          <Route path='/acquisition' element={<CustomerAcquisition />} />
          <Route path='/lifecycle' element={<LifecycleStrategy />} />
          <Route path='/social' element={<SocialMedia />} />
          <Route path='/branding' element={<BrandIdentity />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/terms' element={<TermsConditions />} />
          <Route path='/blog-generator' element={<BlogGenerator />} />
          <Route path='/portfolio' element={<Portfolio />} />
        </Routes>
        <Footer />
      </Router>
    );
  }

  // Desktop - show splash screen logic
  return (
    <Router>
      <ScrollToTop />
      {showSplash && <SplashScreen onClose={handleSplashClose} />}
      {!showSplash && (
        <>
          <Header />
          <Routes>
            <Route
              path='/'
              element={
                <Home
                  initialAnimationState={animationState}
                  hasAnimationPlayed={hasAnimationPlayed}
                  onAnimationPlayed={handleAnimationPlayed}
                />
              }
            />
            <Route path='/services' element={<Services />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/outbound' element={<Outbound />} />
            <Route path='/web-development' element={<WebDevelopment />} />
            <Route path='/acquisition' element={<CustomerAcquisition />} />
            <Route path='/lifecycle' element={<LifecycleStrategy />} />
            <Route path='/social' element={<SocialMedia />} />
            <Route path='/branding' element={<BrandIdentity />} />
            <Route path='/privacy' element={<PrivacyPolicy />} />
            <Route path='/terms' element={<TermsConditions />} />
            <Route path='/blog-generator' element={<BlogGenerator />} />
          </Routes>
          <Footer />
        </>
      )}
    </Router>
  );
}

export default App;
