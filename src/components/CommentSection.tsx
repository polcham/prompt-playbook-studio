
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
    queryKey: ['comments', promptId],
    queryFn: async () => {
      // First get comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('id, content, created_at, user_id')
        .eq('prompt_id', promptId)
        .order('created_at', { ascending: false });
      
      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        return [];
      }

      if (!commentsData || commentsData.length === 0) {
        return [];
      }

      // Get unique user IDs
      const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
      
      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine comments with profiles
      const profilesMap = new Map(profilesData?.map(profile => [profile.id, profile]) || []);
      
      return commentsData.map(comment => ({
        ...comment,
        profiles: profilesMap.get(comment.user_id) || null
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
      {comments.map((comment) => {
        const profile = comment.profiles;
        const displayName = profile?.username || `User ${comment.user_id.slice(0, 8)}`;
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
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </div>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentSection;
