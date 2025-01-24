export interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  media_url?: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  is_liked?: boolean;
  is_bookmarked?: boolean;
  likes_count: number;
  comments_count: number;
  shares_count?: number;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  post_id: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface PostAnalytics {
  views: number;
  shares: number;
  engagement_rate: number;
  reach: number;
}