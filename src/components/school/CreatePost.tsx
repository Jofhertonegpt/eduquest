import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type Post = {
  id: string;
  school_id: string;
  content: string;
  created_by: string;
  created_at: string;
};

export const CreatePost = ({ schoolId }: { schoolId: string }) => {
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("school_posts")
        .insert({
          school_id: schoolId,
          content,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Post;
    },
    onMutate: async (newContent) => {
      await queryClient.cancelQueries({ queryKey: ["school-posts", schoolId] });
      
      const previousPosts = queryClient.getQueryData(["school-posts", schoolId]);
      
      // Optimistically add the new post
      queryClient.setQueryData(["school-posts", schoolId], (old: any[]) => {
        const optimisticPost = {
          id: 'temp-' + Date.now(),
          content: newContent,
          created_at: new Date().toISOString(),
          created_by: 'loading',
          school_id: schoolId,
          likes_count: 0,
          comments_count: 0,
          profiles: {
            id: 'loading',
            full_name: 'Posting...',
            avatar_url: null
          }
        };
        return [optimisticPost, ...(old || [])];
      });
      
      return { previousPosts };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["school-posts", schoolId], context?.previousPosts);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setContent("");
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["school-posts", schoolId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createPostMutation.mutate(content);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="min-h-[100px] resize-none"
        disabled={createPostMutation.isPending}
      />
      <Button 
        type="submit" 
        disabled={!content.trim() || createPostMutation.isPending}
        className="w-full sm:w-auto"
      >
        {createPostMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Posting...
          </>
        ) : (
          'Post'
        )}
      </Button>
    </form>
  );
};