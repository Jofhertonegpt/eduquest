import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMockSchoolPostsBySchoolId, getMockProfileById, mockDelay } from "@/data/mockData";

export const SchoolPosts = ({ schoolId }: { schoolId: string }) => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["school-posts", schoolId],
    queryFn: async () => {
      try {
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

        if (!data?.length) {
          // Use mock data if no real data is available
          await mockDelay();
          const mockPosts = getMockSchoolPostsBySchoolId(schoolId);
          return mockPosts.map(post => ({
            ...post,
            profiles: getMockProfileById(post.created_by)
          }));
        }
        
        return data || [];
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Fallback to mock data on error
        await mockDelay();
        const mockPosts = getMockSchoolPostsBySchoolId(schoolId);
        return mockPosts.map(post => ({
          ...post,
          profiles: getMockProfileById(post.created_by)
        }));
      }
    },
    enabled: !!schoolId,
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading posts...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 p-4 space-y-4 max-w-3xl mx-auto"
    >
      {posts?.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg p-4 space-y-4 border"
        >
          <div className="flex items-center gap-2">
            {post.profiles?.avatar_url ? (
              <img
                src={post.profiles.avatar_url}
                alt={post.profiles.full_name || ''}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {post.profiles?.full_name?.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-medium">{post.profiles?.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p>{post.content}</p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <ThumbsUp className="h-4 w-4 mr-2" />
              {post.likes_count || 0}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              {post.comments_count || 0}
            </Button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};