export interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  media_urls?: string[];
  file_urls?: string[];
  media_metadata?: any[];
  school_id?: string;
  profiles?: Profile;
  comments?: Comment[];
  likes?: Like[];
  bookmarks?: Bookmark[];
  is_liked?: boolean;
  is_bookmarked?: boolean;
  likes_count: number;
  comments_count: number;
  shares_count?: number;
}

export interface Profile {
  id?: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  profiles?: Profile;
}

export interface Like {
  user_id: string;
}

export interface Bookmark {
  user_id: string;
}

export interface PostAnalytics {
  views: number;
  shares: number;
  engagement_rate: number;
  reach: number;
}

export type PostListType = "for-you" | "following" | "replies" | "media" | "likes" | "school";

export interface PostFormProps {
  schoolId?: string;
  onSuccess?: () => void;
}