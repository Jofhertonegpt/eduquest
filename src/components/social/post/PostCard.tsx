import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { PostActions } from "./PostActions";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
    is_liked?: boolean;
    profiles?: {
      full_name: string | null;
      avatar_url: string | null;
    };
  };
  onLike: () => void;
  onComment: () => void;
  isLikeLoading?: boolean;
}

export const PostCard = ({
  post,
  onLike,
  onComment,
  isLikeLoading
}: PostCardProps) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.profiles?.full_name || 'Anonymous'}`,
          text: post.content,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Post link has been copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border rounded-lg space-y-4 bg-card"
      role="article"
      aria-label={`Post by ${post.profiles?.full_name || 'Anonymous'}`}
    >
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={post.profiles?.avatar_url || undefined} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{post.profiles?.full_name || 'Anonymous'}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className="whitespace-pre-wrap break-words">{post.content}</p>

      <PostActions
        isLiked={post.is_liked}
        likesCount={post.likes_count}
        commentsCount={post.comments_count}
        onLike={onLike}
        onComment={onComment}
        onShare={handleShare}
        isLikeLoading={isLikeLoading}
      />
    </motion.div>
  );
};