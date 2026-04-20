import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

async function prepare() {
  const { worker } = await import('./api/browser.ts');
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { 
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js` 
    },
  });
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
