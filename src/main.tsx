
import { createRoot } from 'react-dom/client'

import {
  BrowserRouter,
  // or Routes if using <Routes> component
} from 'react-router-dom';
import App from './App.tsx'

// Check if root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Error handlers (silent in production)
window.addEventListener('error', () => {
  // Silent error handling
});

window.addEventListener('unhandledrejection', () => {
  // Silent error handling
});

createRoot(rootElement).render(
 <BrowserRouter>
    <App />
  </BrowserRouter>
)


