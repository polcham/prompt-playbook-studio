import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface CommentSectionProps {
  promptId: string;
}

const CommentSection = ({ promptId }: CommentSectionProps) => {
  // Fetch comments with user profiles from Supabase
  const { data: comments = [], isLoading: loading } = useQuery({
    queryKey: ["comments", promptId],
    enabled: !!promptId,
    queryFn: async () => {
      console.log("Fetching comments for prompt:", promptId);
      
      // Get comments only - profiles will be null for now
      const { data, error } = await supabase
        .from("comments")
        .select("id, content, created_at, user_id")
        .eq("prompt_id", promptId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
        return [];
      }

      console.log("Comments fetched:", data);
      
      // Map to include null profiles for now
      return (data || []).map((comment) => ({
        ...comment,
        profiles: null,
      }));
    },
  });

  if (loading) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Loading comments...
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Array.isArray(comments) && comments.length > 0 ? (
        comments.map((comment) => {
          const profile = comment.profiles;
          const displayName =
            profile?.username || `User ${comment.user_id.slice(0, 8)}`;
          const avatarUrl = profile?.avatar_url;

          return (
            <div key={comment.id} className="border-b pb-4 last:border-0">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  {avatarUrl && (
                    <AvatarImage src={avatarUrl} alt={displayName} />
                  )}
                  <AvatarFallback className="text-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{displayName}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            </div>
          );
        })
      ) : null}
    </div>
  );
};

export default CommentSection;
