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
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("Not authenticated");

        const postData = {
          school_id: schoolId,
          content: content.trim(),
          created_by: user.id,
          created_at: new Date().toISOString()
        };

        console.log("Attempting to create post with data:", postData);

        const { data, error } = await supabase
          .from("school_posts")
          .insert(postData)
          .select()
          .single();

        if (error) {
          console.error("Supabase error details:", error);
          throw error;
        }
        
        console.log("Post created successfully:", data);
        return data as Post;
      } catch (error: any) {
        console.error("Error in createPostMutation:", error);
        throw error;
      }
    },
    onMutate: async (newContent) => {
      await queryClient.cancelQueries({ queryKey: ["school-posts", schoolId] });
      
      const previousPosts = queryClient.getQueryData(["school-posts", schoolId]);
      
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
    onError: (error: any, variables, context) => {
      console.error("Error creating post:", error);
      queryClient.setQueryData(["school-posts", schoolId], context?.previousPosts);
      
      let errorMessage = "Failed to create post. Please try again.";
      if (error.code === "42501") {
        errorMessage = "You don't have permission to create posts in this school.";
      } else if (error.code === "23502") {
        errorMessage = "Missing required fields.";
      } else if (error.code === "23505") {
        errorMessage = "This post already exists.";
      } else if (error.status === 409) {
        errorMessage = "There was a conflict creating your post. Please try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
    console.log("Submitting post with content:", content);
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