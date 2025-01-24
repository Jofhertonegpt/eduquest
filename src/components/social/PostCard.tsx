import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Bookmark, User, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Post } from "@/types/social";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCardProps {
  post: Post;
  onLike: (postId: string, action: 'like' | 'unlike') => void;
  onBookmark: (postId: string, action: 'bookmark' | 'unbookmark') => void;
  onCommentClick: (post: Post) => void;
  onProfileClick: (userId: string) => void;
  isLikeLoading?: boolean;
  isBookmarkLoading?: boolean;
}

export const PostCard = ({
  post,
  onLike,
  onBookmark,
  onCommentClick,
  onProfileClick,
  isLikeLoading,
  isBookmarkLoading
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
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onProfileClick(post.user_id)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter') onProfileClick(post.user_id);
          }}
          aria-label={`View ${post.profiles?.full_name || 'Anonymous'}'s profile`}
        >
          <Avatar>
            <AvatarImage src={post.profiles?.avatar_url || undefined} alt={post.profiles?.full_name || 'Anonymous'} />
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" aria-label="Share post">
              <Share2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleShare} disabled={isSharing}>
              <Share2 className="h-4 w-4 mr-2" />
              Share post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(window.location.href, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in new tab
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="whitespace-pre-wrap break-words">{post.content}</p>

      {post.media_url && (
        <img 
          src={post.media_url} 
          alt="Post attachment" 
          className="rounded-lg max-h-96 object-cover w-full"
          loading="lazy"
        />
      )}

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          className={`text-muted-foreground ${post.is_liked ? 'text-red-500' : ''}`}
          onClick={() => onLike(post.id, post.is_liked ? 'unlike' : 'like')}
          disabled={isLikeLoading}
          aria-label={post.is_liked ? 'Unlike post' : 'Like post'}
          aria-pressed={post.is_liked}
        >
          <Heart className={`h-4 w-4 mr-2 ${post.is_liked ? 'fill-current' : ''}`} />
          {post.likes_count || 0}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => onCommentClick(post)}
          aria-label="View comments"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {post.comments_count || 0}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`text-muted-foreground ml-auto ${post.is_bookmarked ? 'text-primary' : ''}`}
          onClick={() => onBookmark(post.id, post.is_bookmarked ? 'unbookmark' : 'bookmark')}
          disabled={isBookmarkLoading}
          aria-label={post.is_bookmarked ? 'Remove bookmark' : 'Bookmark post'}
          aria-pressed={post.is_bookmarked}
        >
          <Bookmark className={`h-4 w-4 ${post.is_bookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </motion.div>
  );
};