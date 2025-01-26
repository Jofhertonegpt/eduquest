import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Post } from "@/types/social";
import { PostHeader } from "./post/PostHeader";
import { PostActions } from "./post/PostActions";
import { PostContent } from "./post/PostContent";
import { PostContainer } from "./post/PostContainer";
import { ShareMenu } from "./post/ShareMenu";

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
    <PostContainer author={post.profiles?.full_name || 'Anonymous'}>
      <div className="flex items-center justify-between">
        <PostHeader
          profileUrl={post.profiles?.avatar_url || undefined}
          fullName={post.profiles?.full_name || 'Anonymous'}
          createdAt={post.created_at}
          onProfileClick={onProfileClick}
          userId={post.user_id}
        />
        <ShareMenu onShare={handleShare} isSharing={isSharing} />
      </div>

      <PostContent post={post} />

      <PostActions
        isLiked={post.is_liked || false}
        isBookmarked={post.is_bookmarked || false}
        likesCount={post.likes_count}
        commentsCount={post.comments_count}
        onLike={() => onLike(post.id, post.is_liked ? 'unlike' : 'like')}
        onComment={() => onCommentClick(post)}
        onBookmark={() => onBookmark(post.id, post.is_bookmarked ? 'unbookmark' : 'bookmark')}
        onShare={handleShare}
        isLikeLoading={isLikeLoading}
        isBookmarkLoading={isBookmarkLoading}
      />
    </PostContainer>
  );
};