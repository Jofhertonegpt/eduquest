import { Button } from "@/components/ui/button";
import { Bookmark, Heart, MessageSquare, Share2 } from "lucide-react";

export interface PostActionsProps {
  isLiked?: boolean;
  isBookmarked?: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
  onComment: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onMediaClick?: () => void;
  isLikeLoading?: boolean;
  isBookmarkLoading?: boolean;
  isPosting?: boolean;
}

export const PostActions = ({
  isLiked,
  isBookmarked,
  likesCount,
  commentsCount,
  onLike,
  onComment,
  onBookmark,
  onShare,
  onMediaClick,
  isLikeLoading,
  isBookmarkLoading,
  isPosting
}: PostActionsProps) => {
  if (onMediaClick) {
    // This is the create post version of actions
    return (
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMediaClick}
          disabled={isPosting}
        >
          <Share2 className="h-5 w-5" />
          <span>Media</span>
        </Button>
      </div>
    );
  }

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
        <MessageSquare className="h-5 w-5" />
        <span>{commentsCount}</span>
      </Button>

      {onBookmark && (
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
      )}

      {onShare && (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={onShare}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};