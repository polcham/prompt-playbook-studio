import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptCard from "@/components/PromptCard";
import { getFeaturedPrompts, Prompt } from "@/data/prompts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

const Favorites = () => {
  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock authentication state - in a real app, this would come from your auth provider
  const isLoggedIn = false;

  useEffect(() => {
    // Mock API call to load favorites
    setTimeout(() => {
      // If not logged in, we'll have an empty list
      // Otherwise we'd load from an API
      const prompts = isLoggedIn ? getFeaturedPrompts().slice(0, 6) : [];
      setFavoritePrompts(prompts);
      setLoading(false);
    }, 500);
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-16 container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
            <div className="bg-muted/50 rounded-lg p-8 mb-6">
              <LogIn className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Sign in to view your favorites</h2>
              <p className="text-muted-foreground mb-6">
                Create an account to save your favorite prompts and access them from anywhere.
              </p>
              <Button asChild size="lg" className="w-full mb-4">
                <Link to="/login">Sign In</Link>
              </Button>
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
          <p className="text-muted-foreground mb-8">
            Prompts you've saved for quick access
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your favorites...</p>
            </div>
          ) : favoritePrompts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritePrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't added any prompts to your favorites yet.
              </p>
              <Button asChild>
                <Link to="/library">Browse Prompts</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
