"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import { getPromptById } from "@/data/prompts";

interface PromptDetailProps {
  promptId: string;
}

const PromptDetail: React.FC<PromptDetailProps> = ({ promptId }) => {
  const prompt = getPromptById(promptId);
  
  if (!prompt) {
    return null; // This shouldn't happen because we check in the page component
  }
  
  // Rest of the component implementation from the original PromptDetail.tsx
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Mock logic to check if the prompt is a favorite
    // In a real app, you would check against user's saved favorites
    const storedFavorites = localStorage.getItem("favorites");
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    setIsFavorite(favorites.includes(promptId));
  }, [promptId]);

  const toggleFavorite = () => {
    // Mock logic to toggle favorite status
    // In a real app, you would update the user's favorites in the database
    const storedFavorites = localStorage.getItem("favorites");
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (isFavorite) {
      favorites = favorites.filter((id: string) => id !== promptId);
    } else {
      favorites.push(promptId);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{prompt.title}</h1>
            <p className="text-muted-foreground">{prompt.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {prompt.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Prompt</h2>
            <div className="bg-muted/5 rounded-md p-4 whitespace-pre-line">
              {prompt.content}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Example Usage</h2>
            <div className="bg-muted/5 rounded-md p-4 whitespace-pre-line">
              {prompt.example}
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <button
              onClick={toggleFavorite}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
            <span className="text-sm text-muted-foreground">
              Submitted by {prompt.authorName} on {prompt.createdAt}
            </span>
          </div>
        </div>
        
        <CommentSection promptId={promptId} />
      </main>
      <Footer />
    </div>
  );
};

export default PromptDetail;
