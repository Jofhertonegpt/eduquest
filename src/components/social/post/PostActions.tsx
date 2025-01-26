import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  isBookmarkLoading,
}: PostActionsProps) => {
  return (
    <div className="flex items-center gap-4 pt-2">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-1 text-muted-foreground hover:text-primary",
          isLiked && "text-red-500 hover:text-red-600"
        )}
        onClick={onLike}
        disabled={isLikeLoading}
      >
        {isLikeLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
        )}
        {likesCount > 0 && <span>{likesCount}</span>}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="gap-1 text-muted-foreground hover:text-primary"
        onClick={onComment}
      >
        <MessageCircle className="h-5 w-5" />
        {commentsCount > 0 && <span>{commentsCount}</span>}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-1 text-muted-foreground hover:text-primary",
          isBookmarked && "text-primary hover:text-primary/90"
        )}
        onClick={onBookmark}
        disabled={isBookmarkLoading}
      >
        {isBookmarkLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-current")} />
        )}
      </Button>
    </div>
  );
};