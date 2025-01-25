import { Post } from "@/types/social";
import { PostCard } from "../PostCard";

interface PostFeedProps {
  posts: Post[];
  onLike: (postId: string, action: 'like' | 'unlike') => void;
  onBookmark: (postId: string, action: 'bookmark' | 'unbookmark') => void;
  onCommentClick: (post: Post) => void;
  onProfileClick: (userId: string) => void;
  isLikeLoading: boolean;
  isBookmarkLoading: boolean;
}

export const PostFeed = ({
  posts,
  onLike,
  onBookmark,
  onCommentClick,
  onProfileClick,
  isLikeLoading,
  isBookmarkLoading,
}: PostFeedProps) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onBookmark={onBookmark}
          onCommentClick={onCommentClick}
          onProfileClick={onProfileClick}
          isLikeLoading={isLikeLoading}
          isBookmarkLoading={isBookmarkLoading}
        />
      ))}
    </div>
  );
};