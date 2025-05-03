
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptCard from "@/components/PromptCard";
import { getFeaturedPrompts, getTrendingPrompts } from "@/data/prompts";

const Index = () => {
  const featuredPrompts = getFeaturedPrompts();
  const trendingPrompts = getTrendingPrompts();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
              <span className="gradient-text">Craft perfect prompts</span> for any 
              AI tool with ease
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover, copy, and customize prompt templates for ChatGPT, Midjourney, Claude, and more.
              Boost your AI productivity in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button size="lg" asChild className="flex-1">
                <Link to="/library">Browse Templates</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="flex-1">
                <Link to="/submit">Submit a Prompt</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-muted/50 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
              Templates for every creative need
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/library?category=writing" className="group">
                <div className="bg-white p-8 rounded-xl border shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                  <div className="bg-brand-light-purple p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">For Writers</h3>
                  <p className="text-muted-foreground text-sm">Blog outlines, story concepts, creative writing prompts</p>
                </div>
              </Link>

              <Link to="/library?category=design" className="group">
                <div className="bg-white p-8 rounded-xl border shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                  <div className="bg-brand-light-teal p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-teal"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="2"></circle><path d="M12 19c-4.2 0-7-1.67-7-5 0-1.62.76-3.1 2-4.1"></path><path d="M12 19c4.2 0 7-1.67 7-5 0-1.62-.76-3.1-2-4.1"></path><path d="M12 5v.2"></path><path d="M10 8.12A6 6 0 0 1 12 5"></path><path d="M14 8.12A6 6 0 0 0 12 5"></path></svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">For Designers</h3>
                  <p className="text-muted-foreground text-sm">Image generation, creative concepts, design variations</p>
                </div>
              </Link>

              <Link to="/library?category=coding" className="group">
                <div className="bg-white p-8 rounded-xl border shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                  <div className="bg-brand-light-orange p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-orange"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">For Developers</h3>
                  <p className="text-muted-foreground text-sm">Code snippets, debugging help, algorithm optimization</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Prompts Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Templates</h2>
              <Link to="/library" className="text-primary font-medium hover:underline">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="py-16 bg-muted/50 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up text-brand-purple">
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
              {trendingPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
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
              <p className="text-muted-foreground mb-6">
                Join our newsletter and receive hand-picked AI prompt templates, tips, and tricks directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
