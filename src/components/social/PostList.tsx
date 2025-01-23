import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Post = {
  id: string;
  content: string;
  user_id: string;
  media_urls: string[];
  file_urls: string[];
  created_at: string;
  hashtags: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

export const PostList = ({ type = "feed" }: { type?: "feed" | "trending" }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["social-posts", type],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("social_posts")
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `);

      if (type === "trending") {
        query = query
          .order('likes_count', { ascending: false })
          .order('comments_count', { ascending: false })
          .limit(10);
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Post[];
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("social_likes")
        .insert({ post_id: postId, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const shareMutation = useMutation({
    mutationFn: async (postId: string) => {
      // In a real app, this would create a new post referencing the original
      toast({
        title: "Shared!",
        description: "Post has been shared to your profile.",
      });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (postId: string) => {
      // In a real app, this would save the post to user's bookmarks
      toast({
        title: "Bookmarked!",
        description: "Post has been saved to your bookmarks.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="p-4 border rounded-lg space-y-4 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded mt-1" />
              </div>
            </div>
            <div className="h-24 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {posts?.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-lg space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedPost(post)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(post.content)}>
                    Copy Text
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="whitespace-pre-wrap">{post.content}</p>

            {post.hashtags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.hashtags.map((tag, index) => (
                  <span key={index} className="text-primary text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {post.media_urls?.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {post.media_urls.map((url, index) => {
                  if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    return (
                      <img
                        key={index}
                        src={url}
                        alt={`Media ${index + 1}`}
                        className="rounded-lg object-cover w-full h-48"
                      />
                    );
                  } else if (url.match(/\.(mp4|webm)$/i)) {
                    return (
                      <video
                        key={index}
                        src={url}
                        controls
                        className="rounded-lg w-full h-48"
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {post.file_urls?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.file_urls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-muted p-2 rounded hover:bg-muted/80"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Attachment {index + 1}</span>
                  </a>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => likeMutation.mutate(post.id)}
              >
                <Heart className="h-4 w-4 mr-2" />
                {post.likes_count || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setSelectedPost(post)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {post.comments_count || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => shareMutation.mutate(post.id)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {post.shares_count || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground ml-auto"
                onClick={() => bookmarkMutation.mutate(post.id)}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl">
          {selectedPost && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={selectedPost.profiles?.avatar_url || undefined} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedPost.profiles?.full_name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedPost.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="whitespace-pre-wrap">{selectedPost.content}</p>
              {/* Add comments section here */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};