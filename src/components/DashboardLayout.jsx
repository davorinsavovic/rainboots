import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardGate from './DashboardGate';
import './DashboardLayout.css';

// Navigation items
const NAV_ITEMS = [
  {
    id: 'leads',
    label: 'Lead Intelligence',
    icon: '📊',
    path: '/dashboard/leads',
    description: 'AI-powered leads ranked by opportunity score',
    color: '#10b981',
  },
  {
    id: 'audit',
    label: 'Website Auditor',
    icon: '🔍',
    path: '/dashboard/audit',
    description: 'Analyze any website for conversion opportunities',
    color: '#f59e0b',
  },
  {
    id: 'blog',
    label: 'Blog Generator',
    icon: '✍️',
    path: '/dashboard/blog',
    description: 'Create SEO-optimized blog articles',
    color: '#8b5cf6',
  },
];

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentPath = location.pathname;
  const activeItem =
    NAV_ITEMS.find((item) => currentPath.includes(item.path)) || NAV_ITEMS[0];

  // Fetch stats for header
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/stats/leads');
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && sidebarCollapsed) {
        setSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Wrap everything in DashboardGate
  return (
    <DashboardGate>
      <div className='dashboard-layout' data-header-theme='dark'>
        {/* Mobile Menu Button */}
        <button
          className='mobile-menu-btn'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        {/* Sidebar */}
        <aside
          className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}
        >
          <div className='sidebar-header'>
            <div className='logo'>
              <span className='logo-icon'>🌧️</span>
              {!sidebarCollapsed && (
                <span className='logo-text'>Rainboots Tools</span>
              )}
            </div>
            <button
              className='sidebar-toggle'
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>

          <nav className='sidebar-nav'>
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath.includes(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  style={isActive ? { '--active-color': item.color } : {}}
                >
                  <span className='nav-icon'>{item.icon}</span>
                  {!sidebarCollapsed && (
                    <div className='nav-content'>
                      <span className='nav-label'>{item.label}</span>
                      <span className='nav-description'>
                        {item.description}
                      </span>
                    </div>
                  )}
                  {isActive && (
                    <span
                      className='active-indicator'
                      style={{ background: item.color }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className='sidebar-footer'>
            {!sidebarCollapsed && (
              <div className='footer-info'>
                <div className='footer-stats'>
                  <span>⚡ AI-Powered</span>
                  <span>🎯 Real-time Analysis</span>
                </div>
                <div className='footer-version'>v1.0.0</div>
              </div>
            )}
            {sidebarCollapsed && (
              <div className='footer-icons'>
                <span>⚡</span>
                <span>🎯</span>
              </div>
            )}
          </div>
        </aside>

        {/* Overlay for mobile */}
        {mobileMenuOpen && (
          <div
            className='mobile-overlay'
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className='dashboard-main'>
          <div className='dashboard-header'>
            <div className='header-left'>
              <h1 className='page-title'>{activeItem.label}</h1>
              <p className='page-description'>{activeItem.description}</p>
            </div>
            <div className='header-right'>
              <div className='user-info'>
                <span className='user-avatar'>👤</span>
                <span className='user-name'>Admin</span>
              </div>
            </div>
          </div>

          <div className='dashboard-content'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='content-wrapper'
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </DashboardGate>
  );
}
