
import { useEffect, useState } from 'react';

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call to fetch comments
    setTimeout(() => {
      const mockComments: Comment[] = [
        {
          id: '1',
          userName: 'Alice Johnson',
          content: 'This prompt works amazingly well with GPT-4! I was able to generate a detailed business plan in minutes.',
          createdAt: '2 days ago',
          avatarUrl: 'https://i.pravatar.cc/40?img=1',
        },
        {
          id: '2',
          userName: 'Mark Wilson',
          content: 'I made a few tweaks to the prompt by adding more specific details about my industry, and it produced even better results.',
          createdAt: '1 week ago',
          avatarUrl: 'https://i.pravatar.cc/40?img=2',
        },
        {
          id: '3',
          userName: 'Sophie Taylor',
          content: 'Has anyone tried this with Claude? Curious if it works as well there.',
          createdAt: '2 weeks ago',
          avatarUrl: 'https://i.pravatar.cc/40?img=3',
        },
      ];
      
      setComments(mockComments);
      setLoading(false);
    }, 500);
  }, [promptId]);

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
