import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Register Service Worker for PWA / WebAPK installation
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      const swUrl = new URL('sw.js', window.location.href).href;
      navigator.serviceWorker
        .register(swUrl)
        .then((reg) => {
          console.log('Fame City PWA ready with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('PWA ServiceWorker registration notice:', err.message);
        });
    } catch (e) {
      console.warn('ServiceWorker load error:', e);
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
