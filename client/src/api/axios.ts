import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Sends the httpOnly cookie on Chrome/Firefox
});

// ─── In-memory token store (Safari Bearer fallback) ───────────────────────────
// Safari on iOS/iPadOS blocks cross-origin httpOnly cookies (ITP).
// As a fallback, the server returns the JWT in the login response body.
// We store it in memory (NOT localStorage — avoid XSS risk) and inject it
// into every request via Authorization: Bearer so Safari-based clients work.
let _inMemoryToken: string | null = null;

export const tokenStore = {
  set: (token: string) => { _inMemoryToken = token; },
  clear: () => { _inMemoryToken = null; },
  get: () => _inMemoryToken,
};

// Interceptor: inject Bearer token if available (Safari fallback)
api.interceptors.request.use((config) => {
  if (_inMemoryToken) {
    config.headers.set('Authorization', `Bearer ${_inMemoryToken}`);
  }
  return config;
});

export default api;
