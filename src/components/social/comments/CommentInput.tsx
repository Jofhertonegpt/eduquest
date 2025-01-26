import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface CommentInputProps {
  postId: string;
  onCommentAdded?: () => void;
}

export const CommentInput = ({ postId, onCommentAdded }: CommentInputProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("social_comments")
        .insert({
          post_id: postId,
          content: content.trim(),
          user_id: user.id,
        });

      if (error) throw error;

      setContent("");
      if (onCommentAdded) onCommentAdded();
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="min-h-[80px]"
        disabled={isSubmitting}
      />
      <Button 
        type="submit" 
        disabled={!content.trim() || isSubmitting}
        className="w-full sm:w-auto"
      >
        Post Comment
      </Button>
    </form>
  );
};