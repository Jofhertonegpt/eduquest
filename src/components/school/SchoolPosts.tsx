import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { CreatePost } from "./CreatePost";
import { PostCard } from "../social/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post } from "@/types/social";

export const SchoolPosts = ({ schoolId }: { schoolId: string }) => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["school-posts", schoolId],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
          .from("school_posts")
          .select(`
            *,
            profiles (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq("school_id", schoolId)
          .order("created_at", { ascending: false });
        
        if (error) throw error;

        return data as Post[];
      } catch (error) {
        console.error("Error in query function:", error);
        throw error;
      }
    },
    enabled: !!schoolId,
  });

  const handleLike = async (postId: string, action: 'like' | 'unlike') => {
    try {
      if (action === 'like') {
        await supabase.from('post_likes').insert({ post_id: postId });
      } else {
        await supabase.from('post_likes').delete().match({ post_id: postId });
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleBookmark = async (postId: string, action: 'bookmark' | 'unbookmark') => {
    // Implement bookmark functionality if needed
  };

  if (error) {
    console.error("Error loading posts:", error);
    return (
      <div className="p-4 text-center text-red-500">
        Error loading posts. Please try again later.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 p-4 space-y-4 max-w-3xl mx-auto"
    >
      <CreatePost schoolId={schoolId} />
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-card rounded-lg p-4 space-y-4 border">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {posts?.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onCommentClick={() => {}}
              onProfileClick={() => {}}
            />
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
};