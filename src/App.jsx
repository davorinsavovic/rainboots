import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import EmailTemplatesPage from './components/EmailTemplatesPage';
import { EmailTemplateSelector } from './components/EmailTemplateSelector';
import DashboardLayout from './components/DashboardLayout';
import EmailCampaigns from './components/EmailCampaigns'; // New parent component

// Wrapper component to handle splash screen logic
function AppContent() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [animationState, setAnimationState] = useState(null);
  const [hasAnimationPlayed, setHasAnimationPlayed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if splash should show (only on homepage and not mobile)
  useEffect(() => {
    const isHomePage = location.pathname === '/';
    const splashShown = sessionStorage.getItem('splashShown');
    const animationPlayed = sessionStorage.getItem('animationPlayed');

    if (isMobile || !isHomePage || splashShown) {
      setShowSplash(false);
    }

    if (animationPlayed) {
      setHasAnimationPlayed(true);
    }
  }, [location.pathname, isMobile]);

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

      {/* Email Campaigns - Parent Route with Submenu */}
      <Route path='email-campaigns' element={<EmailCampaigns />}>
        <Route
          index
          element={
            <Navigate to='/dashboard/email-campaigns/templates' replace />
          }
        />
        <Route path='templates' element={<EmailTemplatesPage />} />
        <Route path='send' element={<EmailTemplateSelector />} />
      </Route>

      {/* Legacy routes - redirect to new structure */}
      <Route
        path='templates'
        element={<Navigate to='/dashboard/email-campaigns/templates' replace />}
      />
      <Route
        path='marketing'
        element={<Navigate to='/dashboard/email-campaigns/send' replace />}
      />
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
      <Route
        path='/templates'
        element={<Navigate to='/dashboard/email-campaigns/templates' replace />}
      />
      <Route
        path='/marketing'
        element={<Navigate to='/dashboard/email-campaigns/send' replace />}
      />
    </>
  );

  // Show splash screen only on homepage, not mobile, and not already shown
  if (showSplash && !isMobile && location.pathname === '/') {
    return <SplashScreen onClose={handleSplashClose} />;
  }

  // Normal app view
  return (
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
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
