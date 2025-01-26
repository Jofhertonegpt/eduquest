import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PostCard } from "./PostCard";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Post, PostListType } from "@/types/social";

interface PostListProps {
  type: PostListType;
  userId?: string;
}

export const PostList = ({ type, userId }: PostListProps) => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", type, userId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("social_posts")
        .select(`
          *,
          profiles:profiles!user_id (
            full_name,
            avatar_url
          ),
          likes:social_likes(user_id),
          comments:social_comments(id),
          bookmarks:social_bookmarks(user_id)
        `)
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      } else if (type === "following") {
        const { data: following } = await supabase
          .from("social_follows")
          .select("following_id")
          .eq("follower_id", user.id);
        
        const followingIds = following?.map(f => f.following_id) || [];
        query = query.in("user_id", [user.id, ...followingIds]);
      } else if (type === "media") {
        query = query.not("media_urls", "eq", "{}");
      } else if (type === "likes") {
        const { data: likedPosts } = await supabase
          .from("social_likes")
          .select("post_id")
          .eq("user_id", userId || user.id);
        
        const likedPostIds = likedPosts?.map(like => like.post_id) || [];
        query = query.in("id", likedPostIds);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(post => ({
        ...post,
        likes_count: post.likes?.length || 0,
        comments_count: post.comments?.length || 0,
        is_liked: post.likes?.some(like => like.user_id === user.id) || false,
        is_bookmarked: post.bookmarks?.some(bookmark => bookmark.user_id === user.id) || false,
      }));
    },
  });

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
  );
};