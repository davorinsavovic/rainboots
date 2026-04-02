// frontend/src/config.js
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Helper to get full URL
export const getApiUrl = (endpoint) => {
  const base = API_BASE_URL;
  // Remove trailing slash if present
  const cleanBase = base.replace(/\/$/, '');
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
};

// For debugging (remove in production)
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
