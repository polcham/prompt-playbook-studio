
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { AuthProvider } from "./contexts/AuthContext";

// Lazy load UI components to reduce initial bundle size
const TooltipProvider = lazy(() => import("@/components/ui/tooltip").then(module => ({ 
  default: module.TooltipProvider 
})));
const Toaster = lazy(() => import("@/components/ui/toaster").then(module => ({ 
  default: module.Toaster 
})));
const Sonner = lazy(() => import("@/components/ui/sonner").then(module => ({ 
  default: module.Toaster 
})));

// Regular import for primary route
import Index from "./pages/Index";

// Lazy load all other pages for better performance
const NotFound = lazy(() => import("./pages/NotFound"));
const Library = lazy(() => import("./pages/Library"));
const PromptDetail = lazy(() => import("./pages/PromptDetail"));
const Submit = lazy(() => import("./pages/Submit"));
const Login = lazy(() => import("./pages/Login"));
const Favorites = lazy(() => import("./pages/Favorites"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

// Initialize QueryClient with better caching strategy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (previously cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <TooltipProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  
                  {/* Wrap lazy-loaded routes with Suspense */}
                  <Route path="*" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <NotFound />
                    </Suspense>
                  } />
                  <Route path="/library" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Library />
                    </Suspense>
                  } />
                  <Route path="/prompt/:id" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <PromptDetail />
                    </Suspense>
                  } />
                  <Route path="/submit" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Submit />
                    </Suspense>
                  } />
                  <Route path="/login" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Login />
                    </Suspense>
                  } />
                  <Route path="/favorites" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Favorites />
                    </Suspense>
                  } />
                </Routes>
                
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
