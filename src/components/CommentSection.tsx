
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
  avatarUrl: string;
}

interface CommentSectionProps {
  promptId: string;
}

const CommentSection = ({ promptId }: CommentSectionProps) => {
  // Fetch comments from Supabase
  const { data: comments = [], isLoading: loading } = useQuery({
    queryKey: ['comments', promptId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id
        `)
        .eq('prompt_id', promptId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }
      
      // For now, we'll use mock usernames and avatars since we don't have user profiles yet
      return data?.map((comment, index) => ({
        id: comment.id,
        userName: `User ${comment.user_id.slice(0, 8)}`,
        content: comment.content,
        createdAt: formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }),
        avatarUrl: `https://i.pravatar.cc/40?img=${(index % 70) + 1}`,
      })) || [];
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
      {comments.map((comment) => (
        <div key={comment.id} className="border-b pb-4 last:border-0">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src={comment.avatarUrl} 
                alt={comment.userName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium">{comment.userName}</div>
                <div className="text-xs text-muted-foreground">{comment.createdAt}</div>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
