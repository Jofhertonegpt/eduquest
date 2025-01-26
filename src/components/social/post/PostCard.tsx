import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { PostActions } from "./PostActions";
import { CommentList } from "../comments/CommentList";
import { supabase } from "@/lib/supabase";
import { PostHeader } from "./PostHeader";
import { PostMedia } from "./PostMedia";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
    comments: any[];
    is_liked?: boolean;
    is_bookmarked?: boolean;
    media_urls?: string[];
    media_metadata?: any[];
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
  const [showComments, setShowComments] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

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

  const handleBookmark = async () => {
    setIsBookmarking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to bookmark posts",
          variant: "destructive",
        });
        return;
      }

      if (post.is_bookmarked) {
        const { error } = await supabase
          .from("social_bookmarks")
          .delete()
          .match({ post_id: post.id, user_id: user.id });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Post removed from bookmarks",
        });
      } else {
        const { error } = await supabase
          .from("social_bookmarks")
          .insert({ post_id: post.id, user_id: user.id });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Post added to bookmarks",
        });
      }
    } catch (error) {
      console.error('Error bookmarking post:', error);
      toast({
        title: "Error",
        description: "Failed to bookmark post",
        variant: "destructive",
      });
    } finally {
      setIsBookmarking(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      onComment();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border rounded-lg space-y-4 bg-card hover:shadow-md transition-shadow"
      role="article"
      aria-label={`Post by ${post.profiles?.full_name || 'Anonymous'}`}
    >
      <PostHeader 
        profile={post.profiles || { full_name: null, avatar_url: null }}
        createdAt={post.created_at}
      />

      <p className="whitespace-pre-wrap break-words">{post.content}</p>

      <PostMedia 
        mediaUrls={post.media_urls || []}
        mediaMetadata={post.media_metadata}
      />

      <PostActions
        isLiked={post.is_liked}
        isBookmarked={post.is_bookmarked}
        likesCount={post.likes_count}
        commentsCount={post.comments?.length || 0}
        onLike={onLike}
        onComment={toggleComments}
        onBookmark={handleBookmark}
        onShare={handleShare}
        isLikeLoading={isLikeLoading}
        isBookmarkLoading={isBookmarking}
      />

      {showComments && (
        <CommentList
          postId={post.id}
          comments={post.comments || []}
          onCommentAdded={() => onComment()}
        />
      )}
    </motion.div>
  );
};