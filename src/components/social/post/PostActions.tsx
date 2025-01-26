import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2 } from "lucide-react";

export interface PostActionsProps {
  isLiked?: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  isLikeLoading?: boolean;
}

export const PostActions = ({
  isLiked,
  likesCount,
  commentsCount,
  onLike,
  onComment,
  onShare,
  isLikeLoading
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
        <MessageSquare className="h-5 w-5" />
        <span>{commentsCount}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1"
        onClick={onShare}
      >
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
};