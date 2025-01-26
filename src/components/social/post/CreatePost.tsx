import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostContainer } from "./PostContainer";
import { PostActions } from "./PostActions";
import { toast } from "@/hooks/use-toast";

interface CreatePostProps {
  onSuccess?: () => void;
}

export const CreatePost = ({ onSuccess }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsPosting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("social_posts")
        .insert({ content, user_id: user.id });

      if (error) throw error;

      setContent("");
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <PostContainer author="You">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      <div className="flex justify-between items-center">
        <PostActions
          likesCount={0}
          commentsCount={0}
          onLike={() => {}}
          onComment={() => {}}
          onMediaClick={() => {}}
          isPosting={isPosting}
        />
        <Button 
          onClick={handleSubmit}
          disabled={!content.trim() || isPosting}
        >
          Post
        </Button>
      </div>
    </PostContainer>
  );
};