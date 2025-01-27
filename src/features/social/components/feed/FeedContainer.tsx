import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { FeedItem } from "./FeedItem";
import { FeedSkeleton } from "./FeedSkeleton";
import { CreatePost } from "../post/CreatePost";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Post } from "@/types/social";

export const FeedContainer = () => {
  const { toast } = useToast();
  
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ["social-feed"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("social_posts")
        .select(`
          *,
          profiles:profiles!user_id (
            full_name,
            avatar_url
          ),
          comments:social_comments (
            id,
            content,
            created_at,
            profiles:profiles!user_id (
              full_name,
              avatar_url
            )
          ),
          likes:social_likes (
            user_id
          ),
          bookmarks:social_bookmarks (
            user_id
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Post[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('social_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'social_posts' },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load posts",
      variant: "destructive",
    });
  }

  return (
    <div className="space-y-6">
      <CreatePost onSuccess={() => refetch()} />
      
      {isLoading ? (
        <FeedSkeleton />
      ) : (
        <div className="space-y-4">
          {posts?.map((post) => (
            <FeedItem key={post.id} post={post} onUpdate={() => refetch()} />
          ))}
        </div>
      )}
    </div>
  );
};