import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Outbound from './pages/Outbound';
import WebDevelopment from './pages/WebDevelopment';
import CustomerAcquisition from './pages/CustomerAcquisition';
import LifecycleStrategy from './pages/LifecycleStrategy';
import SocialMedia from './pages/SocialMedia';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [animationState, setAnimationState] = useState(null);
  const [hasAnimationPlayed, setHasAnimationPlayed] = useState(false);

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    const animationPlayed = sessionStorage.getItem('animationPlayed');

    if (splashShown) {
      // Skip splash if already shown in this session
      setShowSplash(false);
    }

    if (animationPlayed) {
      // Animation has already played in this session
      setHasAnimationPlayed(true);
    }
  }, []);

  const handleSplashClose = (savedState) => {
    setShowSplash(false);
    // Mark splash as shown in this session
    sessionStorage.setItem('splashShown', 'true');

    if (savedState) {
      setAnimationState(savedState);
    }
  };

  const handleAnimationPlayed = () => {
    setHasAnimationPlayed(true);
    sessionStorage.setItem('animationPlayed', 'true');
  };

  return (
    <Router>
      {/* Splash Screen - only shows if not shown in this session */}
      {showSplash && <SplashScreen onClose={handleSplashClose} />}

      {/* Main Content - shown after splash closes */}
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
          </Routes>
          <Footer />
        </>
      )}
    </Router>
  );
}

export default App;
