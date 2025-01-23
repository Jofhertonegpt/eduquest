import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ThumbsUp, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getMockSchoolPostsBySchoolId, getMockProfileById } from "@/data/mockData";
import { CreatePost } from "./CreatePost";
import { PostComments } from "./PostComments";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SchoolPost = {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  likes_count: number;
  comments_count: number;
  profiles?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

export const SchoolPosts = ({ schoolId }: { schoolId: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["school-posts", schoolId],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        if (schoolId === "00000000-0000-0000-0000-000000000000") {
          const mockPosts = getMockSchoolPostsBySchoolId(schoolId);
          return mockPosts.map(post => ({
            ...post,
            profiles: getMockProfileById(post.created_by)
          }));
        }

        const { data, error } = await supabase
          .from("school_posts")
          .select(`
            *,
            profiles!school_posts_created_by_fkey (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq("school_id", schoolId)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data as SchoolPost[];
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
    },
    enabled: !!schoolId,
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("post_likes")
        .upsert({ post_id: postId, user_id: user.id })
        .select("id")
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["school-posts", schoolId] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData<SchoolPost[]>(["school-posts", schoolId]);

      // Optimistically update the posts
      queryClient.setQueryData<SchoolPost[]>(["school-posts", schoolId], (old) => 
        old?.map(post => 
          post.id === postId 
            ? { ...post, likes_count: (post.likes_count || 0) + 1 }
            : post
        )
      );

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      // Revert to the previous value if there's an error
      queryClient.setQueryData(["school-posts", schoolId], context?.previousPosts);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Refetch to ensure server state
      queryClient.invalidateQueries({ queryKey: ["school-posts", schoolId] });
    },
  });

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
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card rounded-lg p-4 space-y-4 border"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.profiles?.avatar_url || undefined} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="whitespace-pre-wrap break-words">{post.content}</p>
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => likeMutation.mutate(post.id)}
                  disabled={likeMutation.isPending}
                >
                  {likeMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ThumbsUp className="h-4 w-4 mr-2" />
                  )}
                  {post.likes_count || 0}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {post.comments_count || 0}
                </Button>
              </div>
              <PostComments postId={post.id} />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
};
