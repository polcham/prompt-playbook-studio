import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Prompt, getPromptsByCategory } from "@/data/prompts";
import { toast } from "sonner";
import {
  Heart,
  MessageSquare,
  Share,
  Bookmark,
  BookmarkPlus,
  LogIn,
  FileText,
  BookmarkCheck,
} from "lucide-react";
import CommentSection from "@/components/CommentSection";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuthPrompt from "@/components/AuthPrompt";
import { extractPlaceholders, formatPlaceholders } from "@/utils/promptUtils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [relatedPrompts, setRelatedPrompts] = useState<Prompt[]>([]);
  const [copied, setCopied] = useState(false);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authAction, setAuthAction] = useState<string>("");

  const isLoggedIn = !!user;

  // Fetch prompt data from Supabase
  const {
    data: prompt,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      if (!id) return undefined;

      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching prompt:", error);
        throw error;
      }

      if (!data) return undefined;

      // Transform the data to match our Prompt interface
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        content: data.content,
        tool: data.tool as
          | "chatgpt"
          | "midjourney"
          | "claude"
          | "dall-e"
          | "other",
        category: data.category,
        tags: Array.isArray(data.tags) ? data.tags : [],
        authorName: data.author_name,
        createdAt: data.created_at,
        likes: 0,
      } as Prompt;
    },
  });

  // Fetch like count
  const { data: likeCount = 0 } = useQuery({
    queryKey: ["likes-count", id],
    queryFn: async () => {
      if (!id) return 0;

      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("prompt_id", id);

      return count || 0;
    },
    enabled: !!id,
  });

  // Check if user has liked this prompt
  const { data: isLiked = false } = useQuery({
    queryKey: ["like", id, user?.id],
    queryFn: async () => {
      if (!user || !id) return false;

      const { data } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", user.id)
        .eq("prompt_id", id)
        .single();

      return !!data;
    },
    enabled: !!user && !!id,
  });

  // Fetch comment count
  const { data: commentCount = 0 } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      if (!id) return 0;

      const { count } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("prompt_id", id);

      return count || 0;
    },
    enabled: !!id,
  });

  // Fetch user's favorite status
  const { data: favoriteData } = useQuery({
    queryKey: ["favorite", id, user?.id],
    queryFn: async () => {
      if (!id || !user) return { isFavorite: false };

      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("prompt_id", id)
        .eq("user_id", user.id)
        .single();

      return { isFavorite: !error && !!data };
    },
    enabled: !!id && !!user,
  });

  useEffect(() => {
    if (prompt) {
      // Extract placeholders from the prompt content
      const extractedPlaceholders = extractPlaceholders(prompt.content);
      setPlaceholders(extractedPlaceholders);

      // Load related prompts
      fetchRelatedPrompts(prompt.category);
    }
  }, [prompt]);

  // Fetch related prompts from Supabase
  const fetchRelatedPrompts = async (category: string) => {
    if (!id || !category) return;

    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("category", category)
      .neq("id", id) // Exclude current prompt
      .eq("is_approved", true)
      .limit(3);

    if (error) {
      console.error("Error fetching related prompts:", error);
      return;
    }

    // Transform the data to match our Prompt interface
    const relatedPromptsData = Array.isArray(data)
      ? data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          content: item.content,
          tool: item.tool as
            | "chatgpt"
            | "midjourney"
            | "claude"
            | "dall-e"
            | "other",
          category: item.category,
          tags: Array.isArray(item.tags) ? item.tags : [],
          authorName: item.author_name,
          createdAt: item.created_at,
          likes: 0,
        }))
      : ([] as Prompt[]);

    setRelatedPrompts(relatedPromptsData);
  };

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share && prompt) {
      navigator
        .share({
          title: prompt.title,
          text: `Check out this ${prompt.tool.toUpperCase()} prompt: ${
            prompt.title
          }`,
          url: window.location.href,
        })
        .then(() => toast.success("Shared successfully!"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user || !id) throw new Error("User not authenticated");

      const { data: existingLike } = await supabase
        .from("likes")
        .select("id")
        .eq("prompt_id", id)
        .eq("user_id", user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase.from("likes").delete().eq("id", existingLike.id);
        return { action: "unlike" };
      } else {
        // Like
        await supabase.from("likes").insert({
          prompt_id: id,
          user_id: user.id,
        });
        return { action: "like" };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["likes-count", id] });
      queryClient.invalidateQueries({ queryKey: ["like", id, user?.id] });
      toast.success(
        data.action === "like"
          ? "Added to liked prompts!"
          : "Removed from liked prompts!"
      );
    },
    onError: (error) => {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
    },
  });

  // Favorite mutation
  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user || !id) throw new Error("User not authenticated");

      const { data: existingFavorite } = await supabase
        .from("favorites")
        .select("id")
        .eq("prompt_id", id)
        .eq("user_id", user.id)
        .single();

      if (existingFavorite) {
        // Remove from favorites
        await supabase.from("favorites").delete().eq("id", existingFavorite.id);
        return { action: "unfavorite" };
      } else {
        // Add to favorites
        await supabase.from("favorites").insert({
          prompt_id: id,
          user_id: user.id,
        });
        return { action: "favorite" };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["favorite", id, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(
        data.action === "favorite" ? "Prompt saved!" : "Removed from saved!"
      );
    },
    onError: (error) => {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !id) throw new Error("User not authenticated");

      await supabase.from("comments").insert({
        prompt_id: id,
        user_id: user.id,
        content: content.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      toast.success("Comment added!");
      setNewComment("");
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    },
  });

  const handleLike = () => {
    if (!isLoggedIn) {
      setAuthAction("like prompts");
      setShowAuthPrompt(true);
      return;
    }
    likeMutation.mutate();
  };

  const handleFavorite = () => {
    if (!isLoggedIn) {
      setAuthAction("save prompts to favorites");
      setShowAuthPrompt(true);
      return;
    }
    favoriteMutation.mutate();
  };

  const handleCommentSubmit = () => {
    if (!isLoggedIn) {
      setAuthAction("comment on prompts");
      setShowAuthPrompt(true);
      return;
    }

    if (newComment.trim()) {
      commentMutation.mutate(newComment);
    }
  };

  const getToolLabel = (tool: string) => {
    const labels: Record<string, string> = {
      chatgpt: "ChatGPT",
      midjourney: "Midjourney",
      claude: "Claude",
      "dall-e": "DALL-E",
      other: "Other",
    };
    return labels[tool] || "AI Tool";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-16 container mx-auto px-4">
          <div className="text-center">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading prompt details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-16 container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Prompt not found</h1>
            <p className="text-muted-foreground mb-8">
              The prompt you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/library">Back to Library</Link>
            </Button>
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
          <div className="mb-8">
            <Link
              to="/library"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to Library
            </Link>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Prompt header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Badge>{getToolLabel(prompt.tool)}</Badge>
                  <Badge variant="outline">{prompt.category}</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {prompt.title}
                </h1>
                <p className="text-muted-foreground">{prompt.description}</p>

                {/* Social actions */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={handleLike}
                    disabled={likeMutation.isPending}
                     className={`flex items-center gap-1 text-sm ${
                       isLiked ? "text-red-500" : "text-muted-foreground"
                     } hover:text-red-500 transition-colors disabled:opacity-50`}
                  >
                     <Heart
                       className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                     />
                     <span>{likeCount}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowComments(!showComments);
                      // Scroll to comments section after a brief delay to ensure it's rendered
                      setTimeout(() => {
                        const commentsSection =
                          document.getElementById("comments-section");
                        if (commentsSection) {
                          commentsSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }, 100);
                    }}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                     <MessageSquare className="h-4 w-4" />
                     <span>{commentCount}</span>
                  </button>

                  <button
                    onClick={handleFavorite}
                    disabled={favoriteMutation.isPending}
                    className={`flex items-center gap-1 text-sm ${
                      favoriteData?.isFavorite
                        ? "text-primary"
                        : "text-muted-foreground"
                    } hover:text-primary transition-colors disabled:opacity-50`}
                  >
                    {favoriteData?.isFavorite ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    <span>{favoriteData?.isFavorite ? "Saved" : "Save"}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto"
                  >
                    <Share className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Prompt content */}
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Prompt Template</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-copy"
                          >
                            <rect
                              width="14"
                              height="14"
                              x="8"
                              y="8"
                              rx="2"
                              ry="2"
                            />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
                    {prompt.content}
                  </div>

                  {placeholders.length > 0 && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-md border">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-primary" />
                        <h4 className="font-medium">Placeholders</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatPlaceholders(placeholders)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* How to use */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  How to use this prompt
                </h3>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-md border">
                    <h4 className="font-medium mb-2">1. Copy the template</h4>
                    <p className="text-sm text-muted-foreground">
                      Click the "Copy" button above to copy the entire prompt
                      template to your clipboard.
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md border">
                    <h4 className="font-medium mb-2">
                      2. Fill in your specifics
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Replace the placeholder text (typically in [BRACKETS])
                      with your specific information.
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md border">
                    <h4 className="font-medium mb-2">
                      3. Paste into your AI tool
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Paste the completed prompt into{" "}
                      {getToolLabel(prompt.tool)} and let the AI work its magic.
                    </p>
                  </div>
                </div>
              </div>

              {/* Comments section */}
              <div id="comments-section" className="mb-8 relative">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>

                <div className={`${!isLoggedIn ? "opacity-50" : ""}`}>
                  <div className="mb-4">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-2"
                      disabled={!isLoggedIn}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleCommentSubmit}
                        disabled={
                          !newComment.trim() ||
                          !isLoggedIn ||
                          commentMutation.isPending
                        }
                      >
                        {commentMutation.isPending ? "Adding..." : "Comment"}
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-[300px]">
                    <CommentSection promptId={prompt.id} />
                  </ScrollArea>
                </div>

                {/* Overlay for non-logged-in users */}
                {!isLoggedIn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
                    <div className="text-center p-6 max-w-md">
                      <LogIn className="h-10 w-10 mx-auto mb-4 text-primary" />
                      <h4 className="text-lg font-medium mb-2">
                        Sign in to join the conversation
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        You need to be signed in to comment on prompts and
                        engage with the community.
                      </p>
                      <Button asChild>
                        <Link to="/login">Sign In</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                {/* <div className="bg-muted/50 p-6 rounded-lg border mb-8">
                  <h3 className="font-semibold mb-4">Prompt Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tool</span>
                      <span className="font-medium">
                        {getToolLabel(prompt.tool)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium capitalize">
                        {prompt.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created by</span>
                      <span className="font-medium">{prompt.authorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {new Date(prompt.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div> */}

                {Array.isArray(relatedPrompts) && relatedPrompts.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Related Prompts</h3>
                    <div className="space-y-3">
                      {relatedPrompts.map((related) => (
                        <Link to={`/prompt/${related.id}`} key={related.id}>
                          <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <h4 className="font-medium mb-1">
                              {related.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {related.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Auth prompt dialog */}
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        action={authAction}
      />
    </div>
  );
};

export default PromptDetail;
