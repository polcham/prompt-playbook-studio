import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptCard from "@/components/PromptCard";
import { getFeaturedPrompts, getTrendingPrompts } from "@/data/prompts";

// Lazy load the newsletter form to improve initial page load
const NewsletterForm = lazy(() => import("@/components/NewsletterForm"));
const Index = () => {
  const [featuredPrompts, setFeaturedPrompts] = useState([]);
  const [trendingPrompts, setTrendingPrompts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // Simulate data fetching with priority
    setFeaturedPrompts(getFeaturedPrompts());
    setTrendingPrompts(getTrendingPrompts());
    setIsLoaded(true);
  }, []);
  return <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
              <span className="gradient-text">Browse Prompts</span> for any 
              AI tool with ease
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover, copy, and customize prompt templates for ChatGPT, Midjourney, Claude, and more.
              Boost your AI productivity in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button size="lg" asChild className="flex-1">
                <Link to="/library">Browse Prompts
              </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="flex-1">
                <Link to="/submit">Submit a Prompt</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Prompts Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Prompts</h2>
              <Link to="/library" className="text-primary font-medium hover:underline">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPrompts.map((prompt, index) => <PromptCard key={prompt.id} prompt={prompt} priority={index < 3} // Prioritize loading for first 3 items
            />)}
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="py-16 bg-muted/50 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up text-brand-purple" aria-hidden="true">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline>
                  </svg>
                  Trending Now
                </span>
              </h2>
              <Link to="/library" className="text-primary font-medium hover:underline">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPrompts.map(prompt => <PromptCard key={prompt.id} prompt={prompt} />)}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center border border-primary/20">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Get weekly prompt inspiration
              </h2>
              <p className="text-muted-foreground mb-6">Join our newsletter and receive hand-picked AI prompt templates, tips and tricks directly to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Suspense fallback={<div className="w-full flex gap-3">
                    <div className="skeleton h-10 flex-grow"></div>
                    <div className="skeleton h-10 w-24"></div>
                  </div>}>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Input type="email" placeholder="Enter your email" className="flex-grow" aria-label="Email address for newsletter" />
                    <Button>Subscribe</Button>
                  </div>
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default Index;