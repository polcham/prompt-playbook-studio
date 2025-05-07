
import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Use dynamic import for App to reduce initial bundle size
const App = lazy(() => import('./App.tsx'));

// Use createRoot for concurrent mode rendering
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading application...</div>}>
      <App />
    </Suspense>
  </StrictMode>
);
