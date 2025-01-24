import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PostComments } from "@/components/school/PostComments";
import { PostCard } from "./PostCard";
import { PostSkeleton } from "./PostSkeleton";
import { PostPagination } from "./PostPagination";
import { Post } from "@/types/social";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const POSTS_PER_PAGE = 10;

interface PostListProps {
  userId?: string;
  type?: "feed" | "trending" | "profile" | "likes" | "bookmarks";
}

export const PostList = ({ userId, type = "feed" }: PostListProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["social-posts", type, userId, currentPage],
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

      // Add pagination
      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data: postsData, error, count } = await query.count();
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

      const posts = postsData?.map(post => ({
        ...post,
        is_liked: likedPostIds.has(post.id),
        is_bookmarked: bookmarkedPostIds.has(post.id)
      })) as Post[];

      return {
        posts,
        totalPages: Math.ceil((count || 0) / POSTS_PER_PAGE)
      };
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
          <PostSkeleton key={n} />
        ))}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        {postsData?.posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={(postId, action) => likeMutation.mutate({ postId, action })}
            onBookmark={(postId, action) => bookmarkMutation.mutate({ postId, action })}
            onCommentClick={setSelectedPost}
            onProfileClick={handleProfileClick}
            isLikeLoading={likeMutation.isPending}
            isBookmarkLoading={bookmarkMutation.isPending}
          />
        ))}

        {postsData?.totalPages > 1 && (
          <PostPagination
            currentPage={currentPage}
            totalPages={postsData.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
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
              <PostCard
                post={selectedPost}
                onLike={(postId, action) => likeMutation.mutate({ postId, action })}
                onBookmark={(postId, action) => bookmarkMutation.mutate({ postId, action })}
                onCommentClick={() => {}}
                onProfileClick={handleProfileClick}
                isLikeLoading={likeMutation.isPending}
                isBookmarkLoading={bookmarkMutation.isPending}
              />
              <PostComments postId={selectedPost.id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
};
