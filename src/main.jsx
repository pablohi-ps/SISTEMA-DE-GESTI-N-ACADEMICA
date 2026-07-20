import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Interceptar llamadas API para anteponer la URL del backend si está configurada en producción
const originalFetch = window.fetch;
window.fetch = (input, init) => {
  if (typeof input === 'string') {
    const apiBase = import.meta.env.VITE_API_URL || '';
    if (input.startsWith('/api/') || input.startsWith('/uploads/')) {
      input = `${apiBase}${input}`;
    }
  }
  return originalFetch(input, init);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
