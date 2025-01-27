import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Bookmark, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import type { Post } from "@/types/social";

interface PostActionsProps {
  post: Post;
  onUpdate: () => void;
  onCommentToggle: () => void;
}

export const PostActions = ({ post, onUpdate, onCommentToggle }: PostActionsProps) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    setIsLiking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (post.likes?.some(like => like.user_id === user.id)) {
        await supabase
          .from("social_likes")
          .delete()
          .match({ post_id: post.id, user_id: user.id });
      } else {
        await supabase
          .from("social_likes")
          .insert({ post_id: post.id, user_id: user.id });
      }
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    setIsBookmarking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (post.bookmarks?.some(bookmark => bookmark.user_id === user.id)) {
        await supabase
          .from("social_bookmarks")
          .delete()
          .match({ post_id: post.id, user_id: user.id });
      } else {
        await supabase
          .from("social_bookmarks")
          .insert({ post_id: post.id, user_id: user.id });
      }
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to bookmark post",
        variant: "destructive",
      });
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Post by ${post.profiles?.full_name || 'Anonymous'}`,
        text: post.content,
      });
    } catch (error) {
      // Fallback to copying URL
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Post link copied to clipboard",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLiking}
        className="flex items-center gap-2"
      >
        <Heart className={`h-5 w-5 ${post.likes?.length ? "fill-red-500 text-red-500" : ""}`} />
        <span>{post.likes?.length || 0}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onCommentToggle}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-5 w-5" />
        <span>{post.comments?.length || 0}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        disabled={isBookmarking}
      >
        <Bookmark className={`h-5 w-5 ${post.bookmarks?.length ? "fill-current" : ""}`} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
      >
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
};