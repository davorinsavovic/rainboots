import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [animationState, setAnimationState] = useState(null);

  const handleSplashClose = (savedState) => {
    console.log('Splash closing with state:', savedState);
    setShowSplash(false);
    if (savedState) {
      setAnimationState(savedState);
    }
  };

  return (
    <Router>
      {/* Splash Screen - shows first */}
      {showSplash && <SplashScreen onClose={handleSplashClose} />}

      {/* Main Content - shown after splash closes */}
      {!showSplash && (
        <>
          <Header />
          <Routes>
            <Route
              path='/'
              element={<Home initialAnimationState={animationState} />}
            />
            <Route path='/services' element={<Services />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
          </Routes>
          <Footer />
        </>
      )}
    </Router>
  );
}

export default App;
