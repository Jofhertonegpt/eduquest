import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PostComments } from "@/components/school/PostComments";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PostCard } from "./PostCard";
import { PostSkeleton } from "./PostSkeleton";
import type { Post } from "@/types/social";

interface PostPage {
  posts: Post[];
  nextPage: number | null;
}

const POSTS_PER_PAGE = 10;

interface PostListProps {
  userId?: string;
  type?: "feed" | "trending" | "profile" | "likes" | "bookmarks";
}

export const PostList = ({ userId, type = "feed" }: PostListProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery<PostPage>({
    queryKey: ["social-posts", type, userId],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
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
        `)
        .range(pageParam * POSTS_PER_PAGE, (pageParam + 1) * POSTS_PER_PAGE - 1);

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

      const { data: posts, error } = await query;
      if (error) throw error;

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

      const postsWithMeta = posts?.map(post => ({
        ...post,
        is_liked: likedPostIds.has(post.id),
        is_bookmarked: bookmarkedPostIds.has(post.id)
      })) as Post[];

      return {
        posts: postsWithMeta,
        nextPage: posts?.length === POSTS_PER_PAGE ? pageParam + 1 : null
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading posts. Please try again later.
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
        ) : (
          <>
            {data?.pages.map((page, i) => (
              <div key={i} className="space-y-4">
                {page.posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={(postId, action) => likeMutation.mutate({ postId, action })}
                    onBookmark={(postId, action) => bookmarkMutation.mutate({ postId, action })}
                    onCommentClick={setSelectedPost}
                    onProfileClick={(userId) => navigate(`/profile/${userId}`)}
                    isLikeLoading={likeMutation.isPending}
                    isBookmarkLoading={bookmarkMutation.isPending}
                  />
                ))}
              </div>
            ))}
            <div ref={observerTarget} className="h-10" />
            {isFetchingNextPage && <PostSkeleton />}
          </>
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
                onProfileClick={(userId) => navigate(`/profile/${userId}`)}
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