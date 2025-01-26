import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, Smile, Globe } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";

export const CreatePost = () => {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();
  const { userData } = useProfile();

  const handlePost = async () => {
    if (!content.trim()) return;
    
    setIsPosting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("social_posts")
        .insert({
          content: content.trim(),
          user_id: user.id,
        });

      if (error) throw error;

      setContent("");
      toast({
        title: "Success",
        description: "Your post has been published",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish post",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <img
          src={userData?.profile?.avatar_url || "/placeholder.svg"}
          alt={userData?.profile?.full_name || ""}
          className="h-12 w-12 rounded-full"
        />
        <div className="flex-1 space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="min-h-[100px] resize-none border-none text-xl bg-transparent"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-primary">
              <button className="hover:bg-primary/10 p-2 rounded-full transition">
                <ImagePlus className="h-5 w-5" />
              </button>
              <button className="hover:bg-primary/10 p-2 rounded-full transition">
                <Smile className="h-5 w-5" />
              </button>
              <button className="hover:bg-primary/10 p-2 rounded-full transition">
                <Globe className="h-5 w-5" />
              </button>
            </div>
            <Button 
              onClick={handlePost} 
              disabled={!content.trim() || isPosting}
              className="rounded-full px-6"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};