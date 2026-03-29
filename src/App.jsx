import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
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
import Work from './pages/Work';
import Testimonials from './pages/Testimonials';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import BlogGenerator from './components/blogGenerator';
import WebsiteAudit from './components/WebsiteAudit';
import LeadsDashboard from './components/LeadsDashboard';
import DashboardLayout from './components/DashboardLayout';

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

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const splashShown = sessionStorage.getItem('splashShown');
      const animationPlayed = sessionStorage.getItem('animationPlayed');

      if (splashShown) setShowSplash(false);
      if (animationPlayed) setHasAnimationPlayed(true);
    }
  }, [isMobile]);

  const handleSplashClose = (savedState) => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');
    if (savedState) setAnimationState(savedState);
  };

  const handleAnimationPlayed = () => {
    setHasAnimationPlayed(true);
    sessionStorage.setItem('animationPlayed', 'true');
  };

  // Common routes that don't use dashboard layout
  const publicRoutes = (
    <>
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
      <Route path='/portfolio' element={<Portfolio />} />
      <Route path='/work' element={<Work />} />
      <Route path='/testimonials' element={<Testimonials />} />
      <Route path='/privacy' element={<PrivacyPolicy />} />
      <Route path='/terms' element={<TermsConditions />} />
    </>
  );

  // Dashboard routes (with sidebar layout)
  const dashboardRoutes = (
    <Route path='/dashboard' element={<DashboardLayout />}>
      <Route index element={<Navigate to='/dashboard/leads' replace />} />
      <Route path='leads' element={<LeadsDashboard />} />
      <Route path='audit' element={<WebsiteAudit />} />
      <Route path='blog' element={<BlogGenerator />} />
    </Route>
  );

  // Legacy routes redirect to dashboard
  const legacyRedirects = (
    <>
      <Route
        path='/blog-generator'
        element={<Navigate to='/dashboard/blog' replace />}
      />
      <Route
        path='/WebsiteAudit'
        element={<Navigate to='/dashboard/audit' replace />}
      />
      <Route
        path='/leads'
        element={<Navigate to='/dashboard/leads' replace />}
      />
    </>
  );

  // Mobile version (no splash screen)
  if (isMobile) {
    return (
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          {publicRoutes}
          {dashboardRoutes}
          {legacyRedirects}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
        <Footer />
      </Router>
    );
  }

  // Desktop version (with splash screen)
  return (
    <Router>
      <ScrollToTop />
      {showSplash && <SplashScreen onClose={handleSplashClose} />}
      {!showSplash && (
        <>
          <Header />
          <Routes>
            {publicRoutes}
            {dashboardRoutes}
            {legacyRedirects}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
          <Footer />
        </>
      )}
    </Router>
  );
}

export default App;
