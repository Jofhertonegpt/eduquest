import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

export const PostComments = ({ postId }: { postId: string }) => {
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
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
      return data || [];
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
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["school-posts"] });
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createCommentMutation.mutate(comment);
  };

  if (isLoading) return <div>Loading comments...</div>;

  return (
    <div className="space-y-4 mt-4">
      {comments?.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2">
          {comment.profiles.avatar_url ? (
            <img
              src={comment.profiles.avatar_url}
              alt={comment.profiles.full_name || ""}
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <User className="h-6 w-6" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">{comment.profiles.full_name}</p>
            <p className="text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={!comment.trim()}>
          Comment
        </Button>
      </form>
    </div>
  );
};