import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PostCard } from "./PostCard";
import { Loader2 } from "lucide-react";

interface PostListProps {
  type: "for-you" | "following";
}

export const PostList = ({ type }: PostListProps) => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", type],
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
          likes:post_likes(
            user_id
          ),
          reposts:post_reposts(
            user_id
          ),
          comments:post_comments(
            id
          )
        `)
        .order("created_at", { ascending: false });

      if (type === "following") {
        const { data: following } = await supabase
          .from("user_follows")
          .select("following_id")
          .eq("follower_id", user.id);
        
        const followingIds = following?.map(f => f.following_id) || [];
        query = query.in("user_id", [user.id, ...followingIds]);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(post => ({
        ...post,
        likes_count: post.likes?.length || 0,
        reposts_count: post.reposts?.length || 0,
        comments_count: post.comments?.length || 0,
        is_liked: post.likes?.some(like => like.user_id === user.id) || false,
        is_reposted: post.reposts?.some(repost => repost.user_id === user.id) || false,
      }));
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

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
        />
      ))}
    </div>
  );
};