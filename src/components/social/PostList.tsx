import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PostComments } from "@/components/school/PostComments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Post = {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  is_liked?: boolean;
  is_bookmarked?: boolean;
  likes_count: number;
  comments_count: number;
};

export const PostList = ({ userId, type = "feed" }: { userId?: string; type?: "feed" | "trending" | "profile" | "likes" | "bookmarks" }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["social-posts", type, userId],
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

      if (type === "profile" && userId) {
        query = query.eq('user_id', userId);
      } else if (type === "likes" && user) {
        const { data: likedPosts } = await supabase
          .from('social_likes')
          .select('post_id')
          .eq('user_id', user.id);
        
        if (likedPosts) {
          query = query.in('id', likedPosts.map(like => like.post_id));
        }
      } else if (type === "bookmarks" && user) {
        const { data: bookmarkedPosts } = await supabase
          .from('social_bookmarks')
          .select('post_id')
          .eq('user_id', user.id);
        
        if (bookmarkedPosts) {
          query = query.in('id', bookmarkedPosts.map(bookmark => bookmark.post_id));
        }
      }

      if (type === "trending") {
        query = query.order('likes_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: postsData, error } = await query;
      if (error) throw error;

      // Get likes and bookmarks for the current user
      const { data: likes } = await supabase
        .from('social_likes')
        .select('post_id')
        .eq('user_id', user.id);

      const { data: bookmarks } = await supabase
        .from('social_bookmarks')
        .select('post_id')
        .eq('user_id', user.id);

      const likedPostIds = new Set(likes?.map(like => like.post_id) || []);
      const bookmarkedPostIds = new Set(bookmarks?.map(bookmark => bookmark.post_id) || []);

      return postsData?.map(post => ({
        ...post,
        is_liked: likedPostIds.has(post.id),
        is_bookmarked: bookmarkedPostIds.has(post.id)
      })) as Post[];
    },
  });

  const likeMutation = useMutation({
    mutationFn: async ({ postId, action }: { postId: string; action: 'like' | 'unlike' }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (action === 'like') {
        const { error } = await supabase
          .from("social_likes")
          .insert({ post_id: postId, user_id: user.id });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("social_likes")
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      toast({
        title: "Success",
        description: "Post interaction updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post interaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async ({ postId, action }: { postId: string; action: 'bookmark' | 'unbookmark' }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (action === 'bookmark') {
        const { error } = await supabase
          .from("social_bookmarks")
          .insert({ post_id: postId, user_id: user.id });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("social_bookmarks")
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      toast({
        title: "Success",
        description: "Bookmark updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfileClick = async (userId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate(`/profile/${userId}`);
    }
  };

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
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleProfileClick(post.user_id)}
              >
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
            </div>

            <p className="whitespace-pre-wrap">{post.content}</p>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`text-muted-foreground ${post.is_liked ? 'text-red-500' : ''}`}
                onClick={() => likeMutation.mutate({
                  postId: post.id,
                  action: post.is_liked ? 'unlike' : 'like'
                })}
              >
                <Heart className={`h-4 w-4 mr-2 ${post.is_liked ? 'fill-current' : ''}`} />
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
                className={`text-muted-foreground ml-auto ${post.is_bookmarked ? 'text-primary' : ''}`}
                onClick={() => bookmarkMutation.mutate({
                  postId: post.id,
                  action: post.is_bookmarked ? 'unbookmark' : 'bookmark'
                })}
              >
                <Bookmark className={`h-4 w-4 ${post.is_bookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>
              Join the conversation and share your thoughts
            </DialogDescription>
          </DialogHeader>
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
              <PostComments postId={selectedPost.id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};