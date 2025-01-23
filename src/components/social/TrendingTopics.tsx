import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TrendingUp } from "lucide-react";

export const TrendingTopics = () => {
  const { data: trendingHashtags, isLoading } = useQuery({
    queryKey: ["trending-hashtags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_posts")
        .select('hashtags')
        .not('hashtags', 'is', null);

      if (error) throw error;

      // Count hashtag occurrences
      const hashtagCounts = data.reduce((acc: Record<string, number>, post) => {
        post.hashtags?.forEach((tag: string) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {});

      // Sort by count and get top 10
      return Object.entries(hashtagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg space-y-4">
        <h2 className="font-semibold">Trending Topics</h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-6 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h2 className="font-semibold flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Trending Topics
      </h2>
      <div className="space-y-2">
        {trendingHashtags?.map(({ tag, count }) => (
          <div
            key={tag}
            className="flex items-center justify-between hover:bg-muted p-2 rounded-lg transition-colors"
          >
            <span className="text-primary">{tag}</span>
            <span className="text-sm text-muted-foreground">{count} posts</span>
          </div>
        ))}
      </div>
    </div>
  );
};