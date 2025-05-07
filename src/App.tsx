
import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";

// Regular import for primary routes
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load secondary routes for better performance
const Library = lazy(() => import("./pages/Library"));
const PromptDetail = lazy(() => import("./pages/PromptDetail"));
const Submit = lazy(() => import("./pages/Submit"));
const Login = lazy(() => import("./pages/Login"));
const Favorites = lazy(() => import("./pages/Favorites"));

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
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
              
              {/* Wrap lazy-loaded routes with Suspense */}
              <Route path="/library" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                  <Library />
                </Suspense>
              } />
              <Route path="/prompt/:id" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                  <PromptDetail />
                </Suspense>
              } />
              <Route path="/submit" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                  <Submit />
                </Suspense>
              } />
              <Route path="/login" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                  <Login />
                </Suspense>
              } />
              <Route path="/favorites" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                  <Favorites />
                </Suspense>
              } />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </DarkModeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
