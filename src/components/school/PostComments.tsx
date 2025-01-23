import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { User, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  post_id: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

export const PostComments = ({ postId }: { postId: string }) => {
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("post_comments")
        .select(`
          *,
          profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          content,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newContent) => {
      await queryClient.cancelQueries({ queryKey: ["post-comments", postId] });
      
      const previousComments = queryClient.getQueryData(["post-comments", postId]);
      
      // Optimistically add the new comment
      queryClient.setQueryData(["post-comments", postId], (old: any[]) => {
        const optimisticComment = {
          id: 'temp-' + Date.now(),
          content: newContent,
          created_at: new Date().toISOString(),
          post_id: postId,
          profiles: {
            id: 'loading',
            full_name: 'Posting...',
            avatar_url: null
          }
        };
        return [...(old || []), optimisticComment];
      });
      
      return { previousComments };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["post-comments", postId], context?.previousComments);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["school-posts"] });
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createCommentMutation.mutate(comment);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {[1, 2].map((n) => (
          <div key={n} className="flex items-start gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {comments?.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2">
          {comment.profiles.avatar_url ? (
            <img
              src={comment.profiles.avatar_url}
              alt={comment.profiles.full_name || ""}
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <User className="h-6 w-6" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">{comment.profiles.full_name}</p>
            <p className="text-sm break-words whitespace-pre-wrap">{comment.content}</p>
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1"
          disabled={createCommentMutation.isPending}
        />
        <Button 
          type="submit" 
          size="sm" 
          disabled={!comment.trim() || createCommentMutation.isPending}
        >
          {createCommentMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Comment'
          )}
        </Button>
      </form>
    </div>
  );
};