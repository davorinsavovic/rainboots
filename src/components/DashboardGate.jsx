import { useState, useEffect } from 'react';
import './DashboardGate.css';

export default function DashboardGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem('dashboard_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get password from environment variables (Vite uses import.meta.env)
    const correctPassword = import.meta.env.VITE_DASHBOARD_PASSWORD;

    // If no password is set in .env, use a default for development
    if (!correctPassword) {
      console.warn('⚠️ VITE_DASHBOARD_PASSWORD not set in .env');
      console.warn('Using default password: admin123');
      console.warn('Please set VITE_DASHBOARD_PASSWORD in your .env file');

      if (password === 'admin123') {
        authenticate();
      } else {
        showError();
      }
      return;
    }

    if (password === correctPassword) {
      authenticate();
    } else {
      showError();
    }
  };

  const authenticate = () => {
    sessionStorage.setItem('dashboard_auth', 'true');
    setIsAuthenticated(true);
    setError('');
  };

  const showError = () => {
    setError('Incorrect password');
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setPassword('');
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className='dashboard-gate'>
      <div className='gate-rain-container'>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className='gate-rain-drop'
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 60 + 30}px`,
              animation: `gate-fall ${Math.random() * 1.5 + 0.7}s linear ${Math.random() * 3}s infinite`,
              opacity: Math.random() * 0.3 + 0.05,
            }}
          />
        ))}
      </div>

      <div className='gate-content'>
        <div className={`gate-card ${shake ? 'shake' : ''}`}>
          <div className='gate-logo'>🌧️</div>
          <h1 className='gate-title'>Rainboots Dashboard</h1>
          <p className='gate-subtitle'>Internal tools — team access only</p>

          <form onSubmit={handleSubmit}>
            <input
              type='password'
              className='gate-input'
              placeholder='Enter dashboard password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              autoFocus
            />
            {error && <p className='gate-error'>{error}</p>}
            <button type='submit' className='gate-btn'>
              Unlock Dashboard →
            </button>
          </form>

          <p className='gate-hint'>
            Default password: admin123 (change in .env file)
          </p>
        </div>
      </div>
    </div>
  );
}
