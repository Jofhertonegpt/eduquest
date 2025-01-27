import { useEffect, useState } from 'react';
import { usePostFeed } from '@/hooks/usePostFeed';
import { PostCard } from '../post/PostCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/social';

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  media_urls: string[];
  likes_count: number;
  comments_count: number;
  profiles?: Profile;
  comments?: Array<{
    id: string;
    content: string;
    created_at: string;
    profiles?: Profile;
  }>;
  likes?: Array<{ user_id: string }>;
  bookmarks?: Array<{ user_id: string }>;
}

export function SocialFeed() {
  const { data: posts, isLoading } = usePostFeed();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const transformedPosts = posts?.map(post => ({
    ...post,
    profiles: {
      full_name: post.profiles?.full_name || 'Anonymous',
      avatar_url: post.profiles?.avatar_url || ''
    },
    comments: (post.comments || []).map(comment => ({
      ...comment,
      profiles: {
        full_name: comment.profiles?.full_name || 'Anonymous',
        avatar_url: comment.profiles?.avatar_url || ''
      }
    })),
    is_liked: post.likes?.some(like => like.user_id === user?.id) || false,
    is_bookmarked: post.bookmarks?.some(bookmark => bookmark.user_id === user?.id) || false
  }));

  return (
    <div className="space-y-6">
      {transformedPosts?.map((post) => (
        <PostCard key={post.id} post={post} currentUser={user} />
      ))}
    </div>
  );
}