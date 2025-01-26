import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Image } from "lucide-react";

export interface PostActionsProps {
  isLiked?: boolean;
  isBookmarked?: boolean;
  likesCount?: number;
  commentsCount?: number;
  onLike?: () => void;
  onComment?: () => void;
  onBookmark?: () => void;
  isLikeLoading?: boolean;
  isBookmarkLoading?: boolean;
  onMediaClick?: () => void;
  isPosting?: boolean;
}

export const PostActions = ({
  isLiked,
  isBookmarked,
  likesCount = 0,
  commentsCount = 0,
  onLike,
  onComment,
  onBookmark,
  isLikeLoading,
  isBookmarkLoading,
  onMediaClick,
  isPosting
}: PostActionsProps) => {
  // If we're in create post mode (isPosting is defined), show different actions
  if (isPosting !== undefined) {
    return (
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={onMediaClick}
          disabled={isPosting}
        >
          <Image className="h-5 w-5" />
          <span>Media</span>
        </Button>
      </div>
    );
  }

  // Otherwise show the regular post actions
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
