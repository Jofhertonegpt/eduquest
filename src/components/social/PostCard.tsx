import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Post } from "@/types/social";
import { PostHeader } from "./post/PostHeader";
import { PostActions } from "./post/PostActions";
import { FileViewer } from "./post/FileViewer";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border rounded-lg space-y-4 bg-card"
      role="article"
      aria-label={`Post by ${post.profiles?.full_name || 'Anonymous'}`}
    >
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

      <p className="whitespace-pre-wrap break-words">{post.content}</p>

      {post.media_urls?.map((url, index) => (
        <div key={`media-${index}`} className="mt-2">
          <FileViewer 
            url={url} 
            fileType={url.split('.').pop()?.toLowerCase() || ''} 
          />
        </div>
      ))}

      {post.file_urls?.map((url, index) => (
        <div key={`file-${index}`} className="mt-2">
          <FileViewer 
            url={url} 
            fileType={url.split('.').pop()?.toLowerCase() || ''} 
          />
        </div>
      ))}

      <PostActions
        isLiked={post.is_liked || false}
        isBookmarked={post.is_bookmarked || false}
        likesCount={post.likes_count}
        commentsCount={post.comments_count}
        onLike={() => onLike(post.id, post.is_liked ? 'unlike' : 'like')}
        onComment={() => onCommentClick(post)}
        onBookmark={() => onBookmark(post.id, post.is_bookmarked ? 'unbookmark' : 'bookmark')}
        isLikeLoading={isLikeLoading}
        isBookmarkLoading={isBookmarkLoading}
      />
    </motion.div>
  );
};