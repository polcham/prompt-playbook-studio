import { useState } from "react";
import { Link } from "react-router-dom";
import { Prompt } from "@/data/prompts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Heart, MessageSquare, Bookmark, BookmarkCheck } from "lucide-react";
import AuthPrompt from "./AuthPrompt";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PromptCardProps {
  prompt: Prompt;
  priority?: boolean;
}

const PromptCard = ({ prompt, priority = false }: PromptCardProps) => {
  const [copied, setCopied] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authAction, setAuthAction] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isLoggedIn = !!user;

  // Fetch like and comment counts
  const { data: likeCount = 0 } = useQuery({
    queryKey: ["likes", prompt.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("prompt_id", prompt.id);
      return count || 0;
    },
  });

  const { data: commentCount = 0 } = useQuery({
    queryKey: ["comments", prompt.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("prompt_id", prompt.id);
      return count || 0;
    },
  });

  // Check if user has liked this prompt
  const { data: isLiked = false } = useQuery({
    queryKey: ["like", prompt.id, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", user.id)
        .eq("prompt_id", prompt.id)
        .single();

      return !!data;
    },
    enabled: !!user,
  });

  // Check if prompt is in favorites
  const { data: isFavorite = false } = useQuery({
    queryKey: ["favorite", prompt.id, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("prompt_id", prompt.id)
        .single();

      return !!data;
    },
    enabled: !!user,
  });

  // Add to favorites mutation
  const addToFavorites = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      return await supabase.from("favorites").insert({
        user_id: user.id,
        prompt_id: prompt.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite", prompt.id, user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Added to favorites!");
    },
    onError: (error) => {
      toast.error("Failed to add to favorites");
      console.error("Favorite error:", error);
    },
  });

  // Remove from favorites mutation
  const removeFromFavorites = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      return await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("prompt_id", prompt.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite", prompt.id, user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Removed from favorites");
    },
    onError: (error) => {
      toast.error("Failed to remove from favorites");
      console.error("Unfavorite error:", error);
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast.success("Copied to clipboard!", {
      id: `copy-${prompt.id}`, // Prevent duplicate toasts
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Like/unlike mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      if (isLiked) {
        return await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("prompt_id", prompt.id);
      } else {
        return await supabase.from("likes").insert({
          user_id: user.id,
          prompt_id: prompt.id,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["like", prompt.id, user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["likes", prompt.id] });
      toast.success(isLiked ? "Removed like" : "Liked!");
    },
    onError: (error) => {
      toast.error("Failed to update like");
      console.error("Like error:", error);
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      setAuthAction("like prompts");
      setShowAuthPrompt(true);
      return;
    }

    likeMutation.mutate();
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      setAuthAction("add prompts to favorites");
      setShowAuthPrompt(true);
      return;
    }

    if (isFavorite) {
      removeFromFavorites.mutate();
    } else {
      addToFavorites.mutate();
    }
  };

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case "chatgpt":
        return (
          <div
            className="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal"
            aria-label="ChatGPT prompt"
          >
            C
          </div>
        );
      case "midjourney":
        return (
          <div
            className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple"
            aria-label="Midjourney prompt"
          >
            M
          </div>
        );
      case "claude":
        return (
          <div
            className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange"
            aria-label="Claude prompt"
          >
            C
          </div>
        );
      case "dall-e":
        return (
          <div
            className="w-6 h-6 rounded-full bg-brand-pink/20 flex items-center justify-center text-brand-pink"
            aria-label="DALL-E prompt"
          >
            D
          </div>
        );
      default:
        return (
          <div
            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
            aria-label="AI prompt"
          >
            A
          </div>
        );
    }
  };

  return (
    <>
      <Card
        className={cn(
          "card-hover h-full flex flex-col",
          priority ? "" : "animate-fade-in"
        )}
      >
        <CardContent className="pt-6 pb-2 flex-grow">
          <div className="flex items-center justify-between mb-3">
            {getToolIcon(prompt.tool)}
            {prompt.trending && (
              <Badge
                variant="outline"
                className="text-xs flex gap-1 items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-trending-up"
                  aria-hidden="true"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
                <span>Trending</span>
              </Badge>
            )}
          </div>
          <Link to={`/prompt/${prompt.id}`}>
            <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
              {prompt.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {prompt.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {prompt.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Social stats */}
          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1 transition-colors",
                isLiked ? "text-red-500" : "hover:text-primary"
              )}
              aria-label={`Like this prompt (${likeCount} likes)`}
            >
              <Heart
                className={cn("h-3 w-3", isLiked && "fill-current")}
                aria-hidden="true"
              />
              <span>{likeCount}</span>
            </button>

            <Link
              to={`/prompt/${prompt.id}`}
              className="flex items-center gap-1 hover:text-primary transition-colors"
              aria-label={`View ${commentCount} comments`}
            >
              <MessageSquare className="h-3 w-3" aria-hidden="true" />
              <span>{commentCount}</span>
            </Link>

            <button
              onClick={handleFavorite}
              className={cn(
                "flex items-center gap-1 transition-colors",
                isFavorite ? "text-primary" : "hover:text-primary"
              )}
              aria-label={
                isFavorite ? "Remove from favorites" : "Save to favorites"
              }
            >
              {isFavorite ? (
                <BookmarkCheck className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Bookmark className="h-3 w-3" aria-hidden="true" />
              )}
              <span>{isFavorite ? "Saved" : "Save"}</span>
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground"> </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-xs"
            aria-label={
              copied ? "Copied to clipboard" : "Copy prompt to clipboard"
            }
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </CardFooter>
      </Card>

      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        action={authAction}
      />
    </>
  );
};

export default PromptCard;
