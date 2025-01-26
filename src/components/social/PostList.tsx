import { useState } from "react";
import { usePostFeed } from "@/hooks/usePostFeed";
import { PostCard } from "./PostCard";
import { PostFilters } from "./post/PostFilters";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Post, PostListType } from "@/types/social";
import { supabase } from "@/lib/supabase";

interface PostListProps {
  type: PostListType;
  userId?: string;
}

export const PostList = ({ type: initialType, userId }: PostListProps) => {
  const [activeFilter, setActiveFilter] = useState<PostListType>(initialType);
  const { data: posts, isLoading } = usePostFeed(activeFilter, userId);

  const handleLike = async (postId: string, action: 'like' | 'unlike') => {
    try {
      if (action === 'like') {
        await supabase.from('social_likes').insert({ post_id: postId });
      } else {
        await supabase.from('social_likes').delete().match({ post_id: postId });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = async (postId: string, action: 'bookmark' | 'unbookmark') => {
    try {
      if (action === 'bookmark') {
        await supabase.from('social_bookmarks').insert({ post_id: postId });
      } else {
        await supabase.from('social_bookmarks').delete().match({ post_id: postId });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to bookmark post",
        variant: "destructive",
      });
    }
  };

  const handleCommentClick = (post: Post) => {
    // Implement comment functionality
    console.log("Comment clicked", post);
  };

  const handleProfileClick = (userId: string) => {
    // Implement profile navigation
    console.log("Profile clicked", userId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
        <p className="text-lg font-medium">No posts yet</p>
        <p className="text-sm">Be the first to post something!</p>
      </div>
    );
  }

  return (
    <div>
      {!userId && (
        <PostFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      )}
      <div className="divide-y">
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onCommentClick={handleCommentClick}
            onProfileClick={handleProfileClick}
          />
        ))}
      </div>
    </div>
  );
};
