import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Post, PostListType } from "@/types/social";
import { toast } from "@/hooks/use-toast";

export const usePostFeed = (type: PostListType, userId?: string) => {
  return useQuery({
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
      })) as Post[];
    },
  });
};