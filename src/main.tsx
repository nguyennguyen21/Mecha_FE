
import { createRoot } from 'react-dom/client'

import {
  BrowserRouter,
  // or Routes if using <Routes> component
} from 'react-router-dom';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
 <BrowserRouter>
    <App />
  </BrowserRouter>
)


