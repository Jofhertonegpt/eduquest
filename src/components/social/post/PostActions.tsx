import { Heart, MessageSquare, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostActionsProps {
  isLiked: boolean;
  isBookmarked: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
  onComment: () => void;
  onBookmark: () => void;
  isLikeLoading?: boolean;
  isBookmarkLoading?: boolean;
}

export const PostActions = ({
  isLiked,
  isBookmarked,
  likesCount,
  commentsCount,
  onLike,
  onComment,
  onBookmark,
  isLikeLoading,
  isBookmarkLoading,
}: PostActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="sm"
        className={`text-muted-foreground ${isLiked ? 'text-red-500' : ''}`}
        onClick={onLike}
        disabled={isLikeLoading}
        aria-label={isLiked ? 'Unlike post' : 'Like post'}
        aria-pressed={isLiked}
      >
        <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
        {likesCount || 0}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        onClick={onComment}
        aria-label="View comments"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        {commentsCount || 0}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`text-muted-foreground ml-auto ${isBookmarked ? 'text-primary' : ''}`}
        onClick={onBookmark}
        disabled={isBookmarkLoading}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
        aria-pressed={isBookmarked}
      >
        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
      </Button>
    </div>
  );
};