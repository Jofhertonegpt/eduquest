import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/types/social';

type FeedType = "for-you" | "following" | "media" | "likes";

export const usePostFeed = (type: FeedType = "for-you", userId?: string) => {
  return useQuery({
    queryKey: ['posts', type, userId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('social_posts')
        .select(`
          *,
          profiles:user_id(*),
          likes:social_likes(*),
          comments:social_comments(*),
          bookmarks:social_bookmarks(*)
        `)
        .order('created_at', { ascending: false });

      if (type === "following") {
        const { data: following } = await supabase
          .from('social_follows')
          .select('following_id')
          .eq('follower_id', userId || user.id);
        
        const followingIds = following?.map(f => f.following_id) || [];
        query = query.in("user_id", [user.id, ...followingIds]);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as Post[];
    },
  });
};