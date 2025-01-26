import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PostCard } from "@/components/social/post/PostCard";
import { CreatePost } from "@/components/social/post/CreatePost";
import { toast } from "@/hooks/use-toast";

export const SocialFeed = () => {
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ["social-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_posts")
        .select(`
          *,
          profiles:profiles!user_id (
            full_name,
            avatar_url
          ),
          likes:social_likes(user_id),
          bookmarks:social_bookmarks(user_id),
          comments:social_comments(
            id,
            content,
            created_at,
            profiles:profiles!user_id (
              full_name,
              avatar_url
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      return data.map(post => ({
        ...post,
        is_liked: post.likes.some(like => like.user_id === user?.id),
        is_bookmarked: post.bookmarks.some(bookmark => bookmark.user_id === user?.id)
      }));
    },
  });

  useEffect(() => {
    // Subscribe to changes in posts
    const channel = supabase
      .channel('public:social_posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'social_posts' },
        () => {
          console.log('Posts changed, refreshing feed...');
          refetch();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'social_likes' },
        () => {
          console.log('Likes changed, refreshing feed...');
          refetch();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'social_comments' },
        () => {
          console.log('Comments changed, refreshing feed...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleLike = async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to like posts",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("social_likes")
      .insert({ post_id: postId, user_id: user.id });

    if (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
      return;
    }
  };

  const handleComment = async (postId: string) => {
    // This is now handled by the CommentList component
    console.log("Comment on post:", postId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreatePost onSuccess={() => refetch()} />
      {posts?.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => handleLike(post.id)}
          onComment={() => handleComment(post.id)}
          isLikeLoading={false}
        />
      ))}
    </div>
  );
};