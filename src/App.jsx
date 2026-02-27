import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Blobs from './components/Blobs';
import OpeningAnimation from './components/OpeningAnimation';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if animation has been shown before
    const hasSeenAnimation = sessionStorage.getItem('hasSeenAnimation');

    if (hasSeenAnimation) {
      setShowAnimation(false);
      setShowContent(true);
    } else {
      // Show animation for first time visitors
      const animationTimer = setTimeout(() => {
        setShowAnimation(false);
        sessionStorage.setItem('hasSeenAnimation', 'true');
      }, 3500); // Total animation duration

      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 3600);

      return () => {
        clearTimeout(animationTimer);
        clearTimeout(contentTimer);
      };
    }
  }, []);

  return (
    <Router>
      {showAnimation && <OpeningAnimation />}

      {showContent && (
        <>
          {/* <Blobs /> */}
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
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
