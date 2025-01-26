import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark } from "lucide-react";

export interface PostActionsProps {
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
  isBookmarkLoading
}: PostActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1"
        onClick={onLike}
        disabled={isLikeLoading}
      >
        <Heart
          className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
        />
        <span>{likesCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1"
        onClick={onComment}
      >
        <MessageCircle className="h-5 w-5" />
        <span>{commentsCount}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1"
        onClick={onBookmark}
        disabled={isBookmarkLoading}
      >
        <Bookmark
          className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
        />
      </Button>
    </div>
  );
};