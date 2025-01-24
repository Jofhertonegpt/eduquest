import { useState } from "react";
import { Heart, MessageSquare, Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post } from "@/types/social";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border rounded-lg space-y-4"
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
      </div>

      <p className="whitespace-pre-wrap">{post.content}</p>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={`text-muted-foreground ${post.is_liked ? 'text-red-500' : ''}`}
          onClick={() => onLike(post.id, post.is_liked ? 'unlike' : 'like')}
          disabled={isLikeLoading}
          aria-label={post.is_liked ? 'Unlike post' : 'Like post'}
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
        >
          <Bookmark className={`h-4 w-4 ${post.is_bookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </motion.div>
  );
};