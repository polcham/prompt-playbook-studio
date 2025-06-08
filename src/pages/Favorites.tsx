import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptCard from "@/components/PromptCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Prompt } from "@/data/prompts";

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const isLoggedIn = !!user;

  // Fetch user's favorites from Supabase
  const { data: favoritePrompts = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // First get favorite prompt IDs
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('prompt_id')
        .eq('user_id', user.id);
      
      if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError);
        return [];
      }
      
      if (!favorites || favorites.length === 0) {
        return [];
      }
      
      // Then get the prompts for those IDs
      const promptIds = favorites.map(fav => fav.prompt_id);
      const { data: prompts, error: promptsError } = await supabase
        .from('prompts')
        .select('*')
        .in('id', promptIds);
      
      if (promptsError) {
        console.error('Error fetching prompts:', promptsError);
        return [];
      }
      
      // Transform the data to match Prompt interface
      return prompts?.map(prompt => ({
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        content: prompt.content,
        tool: prompt.tool as "chatgpt" | "midjourney" | "claude" | "dall-e" | "other",
        category: prompt.category,
        tags: prompt.tags,
        authorName: prompt.author_name,
        trending: false,
        createdAt: prompt.created_at,
        likes: 0
      })) || [];
    },
    enabled: !!user
  });

  const loading = authLoading || favoritesLoading;

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
