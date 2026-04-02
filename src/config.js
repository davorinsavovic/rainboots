// frontend/src/config.js
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Helper to ensure proper URL formatting
export const getApiUrl = (endpoint) => {
  const base = API_BASE;
  // Remove trailing slash from base if exists
  const cleanBase = base.replace(/\/$/, '');
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
};

// For debugging - remove in production
console.log('API_BASE:', API_BASE);
console.log('Mode:', import.meta.env.MODE);
